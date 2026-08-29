import mongoose from "mongoose";

const userschema = mongoose.Schema({
  name: { type: String, required: true },
  username: {
    type: String,
    sparse: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  profilePhoto: { type: String },
  email: { type: String, required: true },
  mobile: {
  type: String,
  default: "",
},

preferredLanguage: {
  type: String,
  enum: [
    "English",
    "Spanish",
    "Hindi",
    "Portuguese",
    "Chinese",
    "French",
  ],
  default: "English",
},
  password: { type: String, required: true },
  reputation: {
  type: Number,
  default: 0,
  min: 0,
},
profileCompletionRewarded: {
  type: Boolean,
  default: false,
},
  lastForgotPasswordRequest: {
  type: Date,
  default: null,
},
isTemporaryPassword: {
    type: Boolean,
    default: false,
},
  role: {
  type: String,
  enum: ["user", "admin"],
  default: "user",
},
isSuspended: {
  type: Boolean,
  default: false,
},
suspensionReason: {
  type: String,
  default: "",
},
  about: { type: String },
  tags: { type: [String] },
  joinDate: { type: Date, default: Date.now },
  bookmarks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  questionBookmarks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "question",
    },
  ],
  subscription: {
  type: String,
  default: "Free",
},

subscriptionBadges: {
  Free: { type: Number, default: 0 },
  Bronze: { type: Number, default: 0 },
  Silver: { type: Number, default: 0 },
  Gold: { type: Number, default: 0 },
},

subscriptionStatus: {
  type: String,
  default: "Active",
},

renewalDate: {
  type: Date,
  default: null,
},
});
export default mongoose.model("user", userschema);