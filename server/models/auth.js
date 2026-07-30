import mongoose from "mongoose";

const userschema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
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
});
export default mongoose.model("user", userschema);