import mongoose from "mongoose";
import question from "../models/question.js";
import { updateReputation } from "../services/reputationServices.js";


export const Askanswer = async (req, res) => {
  const { id: _id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({ message: "question unavailable" });
  }
  const { noofanswer, answerbody, useranswered, userid } = req.body;
  updatenoofanswer(_id, noofanswer);

  try {
    const updatequestion = await question.findByIdAndUpdate(_id, {
      $addToSet: { answer: [{ answerbody, useranswered, userid }] },
    });
    
    res.status(200).json({ data: updatequestion });
  } catch (error) {
    console.log(error);
    res.status(500).json("something went wrong..");
    return;
  }
};
const updatenoofanswer = async (_id, noofanswer) => {
  try {
    await question.findByIdAndUpdate(_id, { $set: { noofanswer: noofanswer } });
  } catch (error) {
    console.log(error);
  }
};
export const deleteanswer = async (req, res) => {
 const { questionId, answerId } = req.params;
const _id = questionId;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({ message: "question unavailable" });
  }
  if (!mongoose.Types.ObjectId.isValid(answerId)) {
    return res.status(400).json({ message: "answer unavailable" });
  }
  try {
    const questionData = await question.findById(_id);

if (!questionData) {
  return res.status(404).json({
    message: "Question not found",
  });
}

const deletedAnswer = questionData.answer.find(
  (ans) => String(ans._id) === String(answerId)
);

if (!deletedAnswer) {
  return res.status(404).json({
    message: "Answer not found",
  });
}
    const updatequestion = await question.updateOne(
      { _id },
      {
        $pull: { answer: { _id: answerId } },
      }
    );


    
    if (deletedAnswer.isAccepted) {
  await updateReputation({
    userId: deletedAnswer.userid,
    points: -10,
    type: "answer_unaccepted",
    reason: "Accepted answer deleted",
    relatedId: _id,
  });
}
await updateReputation({
  userId: deletedAnswer.userid,
  points: -5,
  type: "answer_deleted",
  reason: "Answer deleted by user",
  relatedId: _id,
});

    res.status(200).json({ data: updatequestion });
  } catch (error) {
    console.log(error);
    res.status(500).json("something went wrong..");
    return;
  }
};

export const acceptAnswer = async (req, res) => {
  try {
    const { questionId, answerId } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(questionId) ||
      !mongoose.Types.ObjectId.isValid(answerId)
    ) {
      return res.status(400).json({
        message: "Invalid question or answer",
      });
    }

    const questionData = await question.findById(questionId);

    if (!questionData) {
      return res.status(404).json({
        message: "Question not found",
      });
    }

    if (questionData.userid.toString() !== req.userid.toString()) {
  return res.status(403).json({
    message: "Only the question owner can accept an answer",
  });
}
const alreadyAccepted = questionData.answer.find(
  (item) => item.isAccepted
);

if (alreadyAccepted) {
  return res.status(400).json({
    message: "An answer has already been accepted for this question",
  });
}
    const answer = questionData.answer.id(answerId);

    if (!answer) {
      return res.status(404).json({
        message: "Answer not found",
      });
    }
if (answer.userid.toString() === req.userid.toString()) {
  return res.status(400).json({
    message: "You cannot accept your own answer",
  });
}
    answer.isAccepted = true;

    await questionData.save();

    await updateReputation({
  userId: answer.userid,
  points: 10,
  type: "answer_accepted",
  reason: "Answer marked as accepted",
  relatedId: questionId,
});

    return res.status(200).json({
      message: "Answer accepted successfully",
      data: questionData,
    });
  } catch (error) {
    console.log("ACCEPT ANSWER ERROR:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const voteAnswer = async (req, res) => {
  try {
    const { questionId, answerId } = req.params;
    const { voteType } = req.body;
    const userId = req.userid;

    if (
      !mongoose.Types.ObjectId.isValid(questionId) ||
      !mongoose.Types.ObjectId.isValid(answerId)
    ) {
      return res.status(400).json({
        message: "Invalid question or answer",
      });
    }

    if (!["upvote", "downvote"].includes(voteType)) {
      return res.status(400).json({
        message: "Invalid vote type",
      });
    }

    const questionData = await question.findById(questionId);

    if (!questionData) {
      return res.status(404).json({
        message: "Question not found",
      });
    }

    const answer = questionData.answer.id(answerId);

    if (!answer) {
      return res.status(404).json({
        message: "Answer not found",
      });
    }

    // Prevent voting on your own answer
    if (answer.userid.toString() === userId.toString()) {
      return res.status(400).json({
        message: "You cannot vote on your own answer",
      });
    }

    const hasUpvoted = answer.upvote.includes(userId);
    const hasDownvoted = answer.downvote.includes(userId);

    if (voteType === "upvote") {
      if (hasUpvoted) {
        // Clicking upvote again removes it
        answer.upvote.pull(userId);
      } else {
        // Remove previous downvote if present
       if (hasDownvoted) {
  answer.downvote.pull(userId);

  // Restore reputation because the previous downvote was removed
  await updateReputation({
    userId: answer.userid,
    points: 2,
    type: "downvote",
    reason: "Downvote removed from answer",
    relatedId: answer._id,
  });
}

        answer.upvote.push(userId);
      }
    }

    if (voteType === "downvote") {
  if (hasDownvoted) {
    // Clicking downvote again removes it
    answer.downvote.pull(userId);

    // Restore the 2 reputation points
    await updateReputation({
      userId: answer.userid,
      points: 2,
      type: "downvote",
      reason: "Downvote removed from answer",
      relatedId: answer._id,
    });
  } else {
    // Remove previous upvote if present
    if (hasUpvoted) {
      answer.upvote.pull(userId);
    }

    answer.downvote.push(userId);

    // -2 reputation for receiving a downvote
    await updateReputation({
      userId: answer.userid,
      points: -2,
      type: "downvote",
      reason: "Answer received a downvote",
      relatedId: answer._id,
    });
  }
}

    // +5 reputation when answer reaches 5 upvotes
if (
  answer.upvote.length >= 5 &&
  !answer.fiveUpvotesRewarded
) {
  await updateReputation({
    userId: answer.userid,
    points: 5,
    type: "answer_upvotes",
    reason: "Answer received 5 upvotes",
    relatedId: answer._id,
  });

  answer.fiveUpvotesRewarded = true;
}

    await questionData.save();

    return res.status(200).json({
      message: "Answer vote updated successfully",
      upvotes: answer.upvote.length,
      downvotes: answer.downvote.length,
      data: questionData,
    });
  } catch (error) {
    console.log("ANSWER VOTE ERROR:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};