import mongoose from "mongoose";

const trustedDeviceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },

    deviceId: {
      type: String,
      required: true,
    },

    browser: {
      type: String,
      default: "Unknown",
    },

    operatingSystem: {
      type: String,
      default: "Unknown",
    },

    deviceType: {
      type: String,
      default: "unknown",
    },

    trustedAt: {
      type: Date,
      default: Date.now,
    },

    isRevoked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

trustedDeviceSchema.index(
  { userId: 1, deviceId: 1 },
  { unique: true }
);

export default mongoose.model("TrustedDevice", trustedDeviceSchema);