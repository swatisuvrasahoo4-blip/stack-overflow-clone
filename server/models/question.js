import mongoose from "mongoose";

const questionschema = mongoose.Schema(
  {
    questiontitle: { type: String, required: true },
    questionbody: { type: String, required: true },
    questiontags: { type: [String], required: true },
    noofanswer: { type: Number, default: 0 },
    upvote: { type: [String], default: [] },
    downvote: { type: [String], default: [] },
    tenUpvotesRewarded: {
  type: Boolean,
  default: false,
},
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
  isClosed: {
  type: Boolean,
  default: false,
},

closeVotes: [
  {
    userId: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    votedAt: {
      type: Date,
      default: Date.now,
    },
  },
],

closedAt: {
  type: Date,
  default: null,
},
  },
  { timestamps: true }
);
export default mongoose.model("question", questionschema);