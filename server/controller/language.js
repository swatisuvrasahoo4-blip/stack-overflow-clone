import LanguageOtp from "../models/languageOtp.js";
import user from "../models/auth.js";
import { sendLanguageOtp as sendLanguageOtpEmail } from "../services/languageOtpService.js";
import sendSmsOtp from "../services/smsService.js";

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendLanguageOtp = async (req, res) => {
  try {
    const { language } = req.body;
    const userId = req.userid;

    const supportedLanguages = ["en", "es", "hi", "pt", "zh", "fr"];

    if (!supportedLanguages.includes(language)) {
      return res.status(400).json({
        message: "Unsupported language",
      });
    }

    const currentUser = await user.findById(userId);

    if (!currentUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const verificationType =
      language === "fr" ? "email" : "mobile";

    if (verificationType === "email" && !currentUser.email) {
      return res.status(400).json({
        message: "Registered email not found",
      });
    }

    if (verificationType === "mobile" && !currentUser.mobile) {
      return res.status(400).json({
        message: "Registered mobile number not found",
      });
    }

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await LanguageOtp.deleteMany({
      userId: currentUser._id,
    });

    const savedOtp = await LanguageOtp.create({
  userId: currentUser._id,
  otp,
  language,
  verificationType,
  expiresAt,
});


   if (verificationType === "email") {
  await sendLanguageOtpEmail(currentUser.email, otp);
}

if (verificationType === "mobile") {
  console.log("SENDING SMS OTP:", {
    mobile: currentUser.mobile,
    otp,
  });

  await sendSmsOtp(currentUser.mobile, otp);
}

    return res.status(200).json({
      message: "OTP generated successfully",
      verificationType,
      expiresAt,
    });
  } catch (error) {
    console.error("Send language OTP error:", error);

    return res.status(500).json({
      message: "Failed to generate OTP",
    });
  }
};

export const verifyLanguageOtp = async (req, res) => {
  try {
    const { otp, language } = req.body;
    const userId = req.userid;

    if (!otp || !language) {
      return res.status(400).json({
        message: "OTP and language are required",
      });
    }

    const otpRecord = await LanguageOtp.findOne({
      userId,
      otp,
      language,
    });

    if (!otpRecord) {
      return res.status(400).json({
        message: "OTP not found. Please request a new OTP.",
      });
    }

    // Check expiry
    if (new Date() > otpRecord.expiresAt) {
      await LanguageOtp.deleteOne({ _id: otpRecord._id });

      return res.status(400).json({
        message: "OTP expired. Please request a new OTP.",
      });
    }

    // Check OTP
    if (otpRecord.otp !== otp.toString()) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

   // OTP is correct

const currentUser = await user.findById(userId);

if (!currentUser) {
  return res.status(404).json({
    message: "User not found",
  });
}

// Save selected language
const languageNames = {
    en: "English",
    es: "Spanish",
    hi: "Hindi",
    pt: "Portuguese",
    zh: "Chinese",
    fr: "French",
};

currentUser.preferredLanguage = languageNames[language];
await currentUser.save();

// Delete OTP after successful verification
await LanguageOtp.deleteOne({ _id: otpRecord._id });

return res.status(200).json({
  success: true,
  message: "OTP verified successfully",
  language,
});
 } catch (error) {
    console.error("Verify language OTP error:", error);

    return res.status(500).json({
        message: "Failed to verify OTP",
    });
}
};