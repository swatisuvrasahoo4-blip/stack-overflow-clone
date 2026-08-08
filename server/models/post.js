import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },

    userName: {
      type: String,
      required: true,
    },

    comment: {
      type: String,
      required: true,
      trim: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const postSchema = new mongoose.Schema(
  {
    authorId: {
      type: String,
      required: true,
    },

    authorName: {
      type: String,
      required: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    postType: {
      type: String,
      enum: [
        "Technical Update",
        "Project Showcase",
        "Learning Achievement",
        "Code Snippet",
      ],
      default: "Technical Update",
    },

    image: {
      type: String,
      default: "",
    },

    codeSnippet: {
      type: String,
      default: "",
    },
    projectTitle: {
      type: String,
      default: "",
    },
    projectLink: {
      type: String,
      default: "",
    },
    achievementTitle: {
      type: String,
      default: "",
    },
    achievementDescription: {
      type: String,
      default: "",
    },

    hashtags: {
      type: [String],
      default: [],
    },
    mentions: [
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    username: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
    },
  },
],

    likes: {
      type: [String],
      default: [],
    },

    comments: [
  {
    userId: String,
    userName: String,
    text: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },

    replies: [
      {
        userId: String,
        userName: String,
        text: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
],

    shareCount: {
      type: Number,
      default: 0,
    },

    isEdited: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Post", postSchema);