import mongoose from "mongoose";

const languageOtpSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    otp: {
      type: String,
      required: true,
    },

    language: {
      type: String,
      enum: ["en", "es", "hi", "pt", "zh", "fr"],
      required: true,
    },

    verificationType: {
      type: String,
      enum: ["email", "mobile"],
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const LanguageOtp =
  mongoose.models.LanguageOtp ||
  mongoose.model("LanguageOtp", languageOtpSchema);

export default LanguageOtp;