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
      default: null,
    },

    postAuthorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
     default: null,
    },
    questionId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "question",
  default: null,
},

questionAuthorId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "user",
  default: null,
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
    adminReputationDeducted: {
  type: Boolean,
  default: false,
},
  },
  {
    timestamps: true,
  }
);

// One report per user per community post
reportSchema.index(
  { reporterId: 1, postId: 1 },
  {
    unique: true,
    partialFilterExpression: { postId: { $type: "objectId" } },
  }
);

// One report per user per question
reportSchema.index(
  { reporterId: 1, questionId: 1 },
  {
    unique: true,
    partialFilterExpression: { questionId: { $type: "objectId" } },
  }
);

const Report = mongoose.model("Report", reportSchema);

export default Report;