import transporter from "../config/email.js";

export const sendNewDeviceOtp = async (email, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "New Device Login Verification - Code Quest",
    html: `
      <h2>New Device Login</h2>

      <p>We detected a login attempt from a new device.</p>

      <p>Your verification OTP is:</p>

      <h1>${otp}</h1>

      <p>This OTP is valid for <strong>5 minutes</strong>.</p>

      <p>If you did not attempt to log in, please secure your account immediately.</p>
    `,
  });
};