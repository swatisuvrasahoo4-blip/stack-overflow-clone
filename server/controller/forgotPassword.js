import bcrypt from "bcrypt";
import User from "../models/auth.js";
import { generatePassword } from "../utils/passwordGenerator.js";

export const forgotPassword = async (req, res) => {
    try {
        const { email, username } = req.body;

        if (!email || !username) {
            return res.status(400).json({
                success: false,
                message: "Email and usernamr are required.",
            });
        }

        const user = await User.findOne({
            email: email.toLowerCase().trim(),
            username: username.trim(),
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Invalid email or username.",
            });
        }

        const today = new Date();

        if (user.lastForgotPasswordRequest) {
            const lastRequest = new Date(user.lastForgotPasswordRequest);

            const isSameDay =
                lastRequest.getDate() === today.getDate() &&
                lastRequest.getMonth() === today.getMonth() &&
                lastRequest.getFullYear() === today.getFullYear();

            if (isSameDay) {
                return res.status(400).json({
                    success: false,
                    message: "You can use this option only one time per day.",
                });
            }
        }

        const newPassword = generatePassword();

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        user.lastForgotPasswordRequest = new Date();

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password reset successfully.",
            password: newPassword,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error.",
        });
    }
};