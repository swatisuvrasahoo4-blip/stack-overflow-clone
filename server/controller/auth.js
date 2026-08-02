import mongoose from "mongoose";
import user from "../models/auth.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export const Signup = async (req, res) => {
  const { name, username, email, password } = req.body;
  try {
    if (!name || !username || !email || !password) {
  return res.status(400).json({
    message: "All fields are required",
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
      password: hashpassword,
    });
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("Missing JWT_SECRET environment variable");
    }
    const token = jwt.sign(
      { email: newuser.email, id: newuser._id },
      jwtSecret,
      { expiresIn: "3d" }
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
  const { email, password } = req.body;
  try {
    const exisitinguser = await user.findOne({ email });
    if (!exisitinguser) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const ispasswordcrct = await bcrypt.compare(
      password,
      exisitinguser.password
    );
    if (!ispasswordcrct) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const token = jwt.sign(
      { email: exisitinguser.email, id: exisitinguser._id },
      process.env.JWT_SECRET,
      { expiresIn: "3d" }
    );
    res.status(200).json({ data: exisitinguser, token });
  } catch (error) {
    res.status(500).json("something went wrong..");
    return;
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

  if (req.file && req.file.filename) {
    updateData.profilePhoto = `/uploads/users/${req.file.filename}`;
  }

  try {
    const updateprofile = await user.findByIdAndUpdate(
      _id,
      { $set: updateData },
      { new: true }
    );
    res.status(200).json({ data: updateprofile });
  } catch (error) {
    console.log(error);
    res.status(500).json("something went wrong..");
  }
};