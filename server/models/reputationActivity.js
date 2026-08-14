import mongoose from "mongoose";

const reputationActivitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    points: {
      type: Number,
      required: true,
    },

    type: {
      type: String,
      required: true,
      enum: [
        "answer_posted",
        "answer_accepted",
        "answer_upvotes",
        "answer_unaccepted",
        "question_upvotes",
        "profile_completed",
        "downvote",
        "answer_deleted",
        "admin_content_removed",
        "reputation_sent",
        "reputation_received",
      ],
    },

    reason: {
      type: String,
      required: true,
    },

    transferReason: {
  type: String,
  default: null,
  trim: true,
},

    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "ReputationActivity",
  reputationActivitySchema
);