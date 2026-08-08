import mongoose from "mongoose";

const questionschema = mongoose.Schema(
  {
    questiontitle: { type: String, required: true },
    questionbody: { type: String, required: true },
    questiontags: { type: [String], required: true },
    noofanswer: { type: Number, default: 0 },
    upvote: { type: [String], default: [] },
    downvote: { type: [String], default: [] },
    views: { type: Number, default: 0 },
    userposted: { type: String },
    userid: { type: String },
    askedon: { type: Date, default: Date.now },
    answer: [
      {
        answerbody: String,
        useranswered: String,
        userid: String,
        upvote: {
  type: [String],
  default: [],
},
downvote: {
  type: [String],
  default: [],
},
fiveUpvotesRewarded: {
  type: Boolean,
  default: false,
},
        isAccepted: {
          type: Boolean,
          default: false,
    },
        answeredon: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);
export default mongoose.model("question", questionschema);