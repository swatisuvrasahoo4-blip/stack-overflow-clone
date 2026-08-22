import user from "../models/auth.js";
import jwt from "jsonwebtoken";
import LoginSession from "../models/loginSession.js";
import { getDeviceInfo } from "../services/deviceService.js";
import {
  generateSessionToken,
  hashSessionToken,
} from "../services/loginSessionService.js";
import { verifyLoginOtp } from "../services/loginOtpService.js";
import { trustDevice } from "../services/trustedDeviceService.js";

export const verifyLoginDeviceOtp = async (req, res) => {
  try {
    console.log("VERIFY LOGIN DEVICE API HIT");
    console.log("Body:", req.body);
    console.log("CREATING TRUSTED SESSION");
console.log("isTrustedDevice:", true);

    const { userId, deviceId, otp } = req.body;

    if (!userId || !deviceId || !otp) {
      return res.status(400).json({
        success: false,
        message: "User ID, device ID and OTP are required",
      });
    }

    const result = await verifyLoginOtp({
      userId,
      deviceId,
      otp,
    });

    if (!result.success) {
      return res.status(400).json(result);
    }

    const existingUser = await user.findById(userId);

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User does not exist",
      });
    }

    const sessionToken = generateSessionToken();
    const sessionTokenHash = hashSessionToken(sessionToken);

    const userAgent = req.headers["user-agent"] || "";
    const deviceInfo = getDeviceInfo(userAgent);
    await trustDevice({
  userId: existingUser._id,
  deviceId,
  browser: deviceInfo.browser,
  operatingSystem: deviceInfo.operatingSystem,
  deviceType: deviceInfo.deviceType,
});

    const inactivityDays =
      Number(process.env.SESSION_INACTIVITY_DAYS) || 3;

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + inactivityDays);

    await LoginSession.create({
      userId: existingUser._id,
      sessionTokenHash,
      deviceId,
      browser: deviceInfo.browser,
      operatingSystem: deviceInfo.operatingSystem,
      deviceType: deviceInfo.deviceType,
      ipAddress: req.ip,
      loginAt: new Date(),
      lastActivityAt: new Date(),
      expiresAt,
      isTrustedDevice: true,
    });

    const token = jwt.sign(
      {
        email: existingUser.email,
        id: existingUser._id,
        sessionToken: sessionTokenHash,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      data: existingUser,
      token,
      message: "Device verified and login successful",
    });
  } catch (error) {
    console.log("Login OTP verification error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to verify device",
    });
  }
};