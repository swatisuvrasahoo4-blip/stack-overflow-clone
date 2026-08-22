import transporter from "../config/email.js";

export const sendNewDeviceOtp = async (email, otp, deviceInfo = {}, ipAddress = "Unknown") => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "New Device Login Verification - Code Quest",
   html: `
  <h2>New Device Login Verification</h2>

  <p>We detected a login attempt from a new device.</p>

  <p><strong>Browser:</strong> ${deviceInfo.browser || "Unknown"}</p>
  <p><strong>Operating System:</strong> ${deviceInfo.operatingSystem || "Unknown"}</p>
  <p><strong>Device Type:</strong> ${deviceInfo.deviceType || "Unknown"}</p>
  <p><strong>IP Address:</strong> ${ipAddress}</p>
  <p><strong>Login Time:</strong> ${new Date().toLocaleString()}</p>

  <hr>

  <p>Your verification OTP is:</p>

  <h1>${otp}</h1>

  <p>This OTP is valid for <strong>5 minutes</strong>.</p>

  <p>If you did not attempt this login, please secure your account immediately.</p>
`,
  });
};