import mongoose from "mongoose";
import user from "../models/auth.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../config/cloudinary.js";
import { updateReputation } from "../services/reputationServices.js";
import { getDeviceInfo } from "../services/deviceService.js";
import { getIpLocation } from "../services/ipLocationService.js";
import {
  generateSessionToken,
  hashSessionToken,
} from "../services/loginSessionService.js";
import LoginSession from "../models/loginSession.js";
import TrustedDevice from "../models/trustedDevice.js";
import { createLoginOtp } from "../services/loginOtpService.js";
import { isTrustedDevice } from "../services/trustedDeviceService.js";

export const Signup = async (req, res) => {
  const { name, username, email, mobile, password } = req.body;
  try {
    if (!name || !username || !email || !mobile || !password) {
  return res.status(400).json({
    message: "All fields are required",
  });
}

const mobilePattern = /^[0-9]{10}$/;

if (!mobilePattern.test(mobile)) {
  return res.status(400).json({
    message: "Mobile number must contain exactly 10 digits",
  });
}

if (
  password.length < 8 ||
  !/[A-Za-z]/.test(password) ||
  !/[0-9]/.test(password)
) {
  return res.status(400).json({
    message: "Password must contain at least 8 characters, including at least 1 letter and 1 number",
  });
}

const cleanUsername = username.trim().toLowerCase();

const usernamePattern = /^[a-z0-9_]{3,20}$/;

if (!usernamePattern.test(cleanUsername)) {
  return res.status(400).json({
    message:
      "Username must be 3 to 20 characters and contain only letters, numbers, and underscores",
  });
}

    const exisitinguser = await user.findOne({ email });
    if (exisitinguser) {
      return res.status(404).json({ message: "User already exist" });
    }
    
    const existingUsername = await user.findOne({
  username: cleanUsername,
});

   if (existingUsername) {
  return res.status(409).json({
    message: "Username is already taken",
  });
}    

    const hashpassword = await bcrypt.hash(password, 12);
    const newuser = await user.create({
      name,
      username: cleanUsername,
      email,
      mobile,
      password: hashpassword,
    });
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("Missing JWT_SECRET environment variable");
    }
    const token = jwt.sign(
      { email: newuser.email, id: newuser._id },
      jwtSecret,
      { expiresIn: "7d" }
    );
    res.status(200).json({ data: newuser, token });
  } catch (error) {
    res.status(500).json("something went wrong..");
    return;
  }
};

export const checkUsername = async (req, res) => {
  try {
    const username = req.query.username?.trim().toLowerCase();

    if (!username) {
      return res.status(400).json({
        available: false,
        message: "Username is required",
      });
    }

    const usernamePattern = /^[a-z0-9_]{3,20}$/;

    if (!usernamePattern.test(username)) {
      return res.status(400).json({
        available: false,
        message:
          "Use 3–20 letters, numbers, or underscores only",
      });
    }

    const existingUser = await user.findOne({ username });

    if (existingUser) {
      const suggestions = [
        `${username}_01`,
        `${username}_dev`,
        `${username}2026`,
        `${username}${Math.floor(Math.random() * 1000)}`,
        `${username}_${new Date().getFullYear()}`,
      ];

      return res.status(200).json({
        available: false,
        message: "Username is already taken",
        suggestions,
      });
    }

    return res.status(200).json({
      available: true,
      message: "Username is available",
    });
  } catch (error) {
    return res.status(500).json({
      available: false,
      message: "Failed to check username",
    });
  }
};

export const Login = async (req, res) => {
  const { email, password, deviceId } = req.body;
  if (!deviceId) {
  return res.status(400).json({
    success: false,
    message: "Device ID is required",
  });
}

  try {
    const exisitinguser = await user.findOne({ email });

    if (!exisitinguser) {
      return res.status(404).json({
        message: "User does not exist",
      });
    }

    const ispasswordcrct = await bcrypt.compare(
      password,
      exisitinguser.password
    );

    if (!ispasswordcrct) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }
const trustedDevice = await isTrustedDevice(
  exisitinguser._id,
  deviceId
);

if (!trustedDevice) {
  const userAgent = req.headers["user-agent"] || "";
  const deviceInfo = getDeviceInfo(userAgent);

  await createLoginOtp({
    userId: exisitinguser._id,
    email: exisitinguser.email,
    deviceId,
    deviceInfo,
    ipAddress: req.ip,
  });

  return res.status(200).json({
    success: true,
    requiresDeviceVerification: true,
    message: "OTP sent to your email",
    userId: exisitinguser._id,
    deviceId,
  });
}

    const sessionToken = generateSessionToken();
    const sessionTokenHash = hashSessionToken(sessionToken);

    const userAgent = req.headers["user-agent"] || "";
    const deviceInfo = getDeviceInfo(userAgent);

    console.log("req.ip:", req.ip);
console.log("x-forwarded-for:", req.headers["x-forwarded-for"]);
console.log("x-real-ip:", req.headers["x-real-ip"]);


    const ipAddress = req.ip;
const location = await getIpLocation(ipAddress);

    const inactivityDays = Number(process.env.SESSION_INACTIVITY_DAYS) || 3;

const expiresAt = new Date();
expiresAt.setDate(expiresAt.getDate() + inactivityDays);


    await LoginSession.create({
      userId: exisitinguser._id,
      sessionTokenHash,
      deviceId,
      browser: deviceInfo.browser,
      operatingSystem: deviceInfo.operatingSystem,
      deviceType: deviceInfo.deviceType,
      ipAddress,
      location,
      loginAt: new Date(),
      lastActivityAt: new Date(),
      expiresAt,
      isTrustedDevice: trustedDevice,
    });

    const token = jwt.sign(
      {
        email: exisitinguser.email,
        id: exisitinguser._id,
        sessionToken: sessionTokenHash,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      data: exisitinguser,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json("something went wrong..");
  }
};
export const getallusers = async (req, res) => {
  try {
    const alluser = await user.find();
    res.status(200).json({ data: alluser });
  } catch (error) {
    res.status(500).json("something went wrong..");
    return;
  }
};
export const updateprofile = async (req, res) => {
  const { id: _id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({ message: "User unavailable" });
  }

  if (String(req.userid) !== String(_id)) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  const { name, about, tags } = req.body;
  let tagsArray = [];

  if (tags) {
    try {
      tagsArray = typeof tags === "string" ? JSON.parse(tags) : tags;
    } catch {
      tagsArray = Array.isArray(tags) ? tags : [];
    }
  }

  const updateData = {
    name,
    about,
    tags: tagsArray,
  };

  if (req.body.removeProfilePhoto === "true") {
  updateData.profilePhoto = "";
}

if (req.file) {
  const result = await cloudinary.uploader.upload(
    `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
    {
      folder: "codequest/users",
    }
  );

  updateData.profilePhoto = result.secure_url;
}

  try {
    const updateprofile = await user.findByIdAndUpdate(
      _id,
      { $set: updateData },
      { new: true }
    );
    const isProfileComplete =
  updateprofile.name?.trim() &&
  updateprofile.about?.trim() &&
  updateprofile.tags?.length > 0;

if (
  isProfileComplete &&
  !updateprofile.profileCompletionRewarded
) {
  await updateReputation({
    userId: updateprofile._id,
    points: 10,
    type: "profile_completed",
    reason: "Completed all mandatory profile details",
    relatedId: updateprofile._id,
  });

  updateprofile.profileCompletionRewarded = true;
  await updateprofile.save();
}
    res.status(200).json({ data: updateprofile });
  } catch (error) {
    console.log(error);
    res.status(500).json("something went wrong..");
  }
};

export const getMySessions = async (req, res) => {
  try {
    const inactivityDays =
      Number(process.env.SESSION_INACTIVITY_DAYS) || 3;

    const inactiveSince = new Date();
    inactiveSince.setDate(
      inactiveSince.getDate() - inactivityDays
    );

    const now = new Date();

    const sessions = await LoginSession.find({
      userId: req.userid,
      isRevoked: false,
      expiresAt: { $gt: now },
      lastActivityAt: { $gt: inactiveSince },
    }).sort({ lastActivityAt: -1 });

    const sessionsWithCurrent = sessions.map((session) => ({
      ...session.toObject(),
      isCurrent: session.sessionTokenHash === req.sessionToken,
    }));

    res.status(200).json({
      data: sessionsWithCurrent,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to fetch login sessions",
    });
  }
};
export const revokeSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await LoginSession.findOne({
      _id: sessionId,
      userId: req.userid,
      isRevoked: false,
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    if (session.sessionTokenHash === req.sessionToken) {
      return res.status(400).json({
        success: false,
        message: "You cannot revoke your current session",
      });
    }

    session.isRevoked = true;
    await session.save();

    await TrustedDevice.findOneAndUpdate(
  {
    userId: req.userid,
    deviceId: session.deviceId,
  },
  {
    isRevoked: true,
  }
);

    res.status(200).json({
      success: true,
      message: "Session revoked successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to revoke session",
    });
  }
};

export const logoutSession = async (req, res) => {
  try {
    await LoginSession.findOneAndUpdate(
      {
        userId: req.userid,
        sessionTokenHash: req.sessionToken,
        isRevoked: false,
      },
      {
        isRevoked: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Session logged out successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to logout session",
    });
  }
};