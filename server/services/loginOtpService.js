import LoginOtp from "../models/loginOtp.js";
import { generateOtp, hashOtp } from "../utils/otp.js";
import { sendNewDeviceOtp } from "./loginSecurityEmailService.js";

export const createLoginOtp = async ({
  userId,
  email,
  deviceId,
  deviceInfo,
  ipAddress,
}) => {
  const otp = generateOtp();
  const otpHash = hashOtp(otp);

  await LoginOtp.deleteMany({
    userId,
    deviceId,
  });

  await LoginOtp.create({
    userId,
    email,
    deviceId,
    otpHash,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
  });

  await sendNewDeviceOtp(email, otp, deviceInfo, ipAddress);
};

export const verifyLoginOtp = async ({
  userId,
  deviceId,
  otp,
}) => {
  const loginOtp = await LoginOtp.findOne({
    userId,
    deviceId,
  });

  if (!loginOtp) {
    return {
      success: false,
      message: "OTP not found or expired",
    };
  }

  if (loginOtp.expiresAt < new Date()) {
    await LoginOtp.deleteOne({ _id: loginOtp._id });

    return {
      success: false,
      message: "OTP expired",
    };
  }

  if (loginOtp.attempts >= 5) {
    await LoginOtp.deleteOne({ _id: loginOtp._id });

    return {
      success: false,
      message: "Too many invalid attempts",
    };
  }

  const otpHash = hashOtp(otp);

  if (otpHash !== loginOtp.otpHash) {
    loginOtp.attempts += 1;
    await loginOtp.save();

    return {
      success: false,
      message: "Invalid OTP",
    };
  }

  await LoginOtp.deleteOne({ _id: loginOtp._id });

  return {
    success: true,
  };
};