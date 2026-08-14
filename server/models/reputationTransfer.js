import mongoose from "mongoose";

const reputationTransferSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    points: {
      type: Number,
      required: true,
      min: 1,
      max: 50,
    },

    reason: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const ReputationTransfer = mongoose.model(
  "ReputationTransfer",
  reputationTransferSchema
);

export default ReputationTransfer;