import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    reporterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },

    postAuthorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    reason: {
      type: String,
      enum: [
        "Spam",
        "Harassment or Hate",
        "Violence",
        "Nudity or Sexual Content",
        "Misinformation",
        "Copyright",
        "Other",
      ],
      required: true,
    },

    details: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: ["pending", "reviewed", "dismissed", "action_taken"],
      default: "pending",
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },

    reviewedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

reportSchema.index(
  {
    reporterId: 1,
    postId: 1,
  },
  {
    unique: true,
  }
);

const Report = mongoose.model("Report", reportSchema);

export default Report;