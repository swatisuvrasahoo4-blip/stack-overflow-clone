import transporter from "../config/email.js";

export const sendLanguageOtp = async (email, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Language Change Verification - Code Quest",
    html: `
      <h2>Language Change Verification</h2>

      <p>Your OTP for changing your preferred language is:</p>

      <h1>${otp}</h1>

      <p>This OTP is valid for <strong>5 minutes</strong>.</p>

      <p>If you did not request this change, please ignore this email.</p>
    `,
  });
};