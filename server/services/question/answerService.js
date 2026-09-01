import mongoose from "mongoose";
import question from "../../models/question.js";
import { updateReputation } from "../reputationServices.js";

// Add answer
export const answerQuestionService = async ({
  questionId,
  answerbody,
  useranswered,
  userid,
}) => {
  if (!mongoose.Types.ObjectId.isValid(questionId)) {
    const error = new Error("Question unavailable");
    error.status = 400;
    throw error;
  }

  const questionData = await question.findById(questionId);

  if (!questionData) {
    const error = new Error("Question not found");
    error.status = 404;
    throw error;
  }

  questionData.answer.push({
    answerbody,
    useranswered,
    userid,
  });

  questionData.noofanswer = questionData.answer.length;

  await questionData.save();

  await updateReputation({
    userId: userid,
    points: 5,
    type: "answer_posted",
    reason: "Posted an answer",
    relatedId: questionId,
  });

  return questionData;
};

// Delete answer
export const deleteAnswerService = async ({
  questionId,
  answerId,
}) => {
  if (!mongoose.Types.ObjectId.isValid(questionId)) {
    const error = new Error("Question unavailable");
    error.status = 400;
    throw error;
  }

  if (!mongoose.Types.ObjectId.isValid(answerId)) {
    const error = new Error("Answer unavailable");
    error.status = 400;
    throw error;
  }

  const questionData = await question.findById(questionId);

  if (!questionData) {
    const error = new Error("Question not found");
    error.status = 404;
    throw error;
  }

  const deletedAnswer = questionData.answer.id(answerId);

  if (!deletedAnswer) {
    const error = new Error("Answer not found");
    error.status = 404;
    throw error;
  }

  // Remove accepted-answer reputation
  if (deletedAnswer.isAccepted) {
    await updateReputation({
      userId: deletedAnswer.userid,
      points: -10,
      type: "answer_unaccepted",
      reason: "Accepted answer deleted",
      relatedId: questionId,
    });
  }

  // Remove answer-posted reputation
  await updateReputation({
    userId: deletedAnswer.userid,
    points: -5,
    type: "answer_deleted",
    reason: "Answer deleted by user",
    relatedId: questionId,
  });

  questionData.answer.pull(answerId);
  questionData.noofanswer = questionData.answer.length;

  await questionData.save();

  return questionData;
};

// Accept answer
export const acceptAnswerService = async ({
  questionId,
  answerId,
  userId,
}) => {
  if (
    !mongoose.Types.ObjectId.isValid(questionId) ||
    !mongoose.Types.ObjectId.isValid(answerId)
  ) {
    const error = new Error("Invalid question or answer");
    error.status = 400;
    throw error;
  }

  const questionData = await question.findById(questionId);

  if (!questionData) {
    const error = new Error("Question not found");
    error.status = 404;
    throw error;
  }

  // Only question owner can accept
  if (
    questionData.userid.toString() !==
    userId.toString()
  ) {
    const error = new Error(
      "Only the question owner can accept an answer"
    );
    error.status = 403;
    throw error;
  }

  const alreadyAccepted = questionData.answer.find(
    (item) => item.isAccepted
  );

  if (alreadyAccepted) {
    const error = new Error(
      "An answer has already been accepted for this question"
    );
    error.status = 400;
    throw error;
  }

  const answer = questionData.answer.id(answerId);

  if (!answer) {
    const error = new Error("Answer not found");
    error.status = 404;
    throw error;
  }

  if (
    answer.userid.toString() ===
    userId.toString()
  ) {
    const error = new Error(
      "You cannot accept your own answer"
    );
    error.status = 400;
    throw error;
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

  return questionData;
};

// Vote answer
export const voteAnswerService = async ({
  questionId,
  answerId,
  voteType,
  userId,
}) => {
  if (
    !mongoose.Types.ObjectId.isValid(questionId) ||
    !mongoose.Types.ObjectId.isValid(answerId)
  ) {
    const error = new Error("Invalid question or answer");
    error.status = 400;
    throw error;
  }

  if (!["upvote", "downvote"].includes(voteType)) {
    const error = new Error("Invalid vote type");
    error.status = 400;
    throw error;
  }

  const questionData = await question.findById(questionId);

  if (!questionData) {
    const error = new Error("Question not found");
    error.status = 404;
    throw error;
  }

  const answer = questionData.answer.id(answerId);

  if (!answer) {
    const error = new Error("Answer not found");
    error.status = 404;
    throw error;
  }

  // Prevent voting on own answer
  if (
    answer.userid.toString() ===
    userId.toString()
  ) {
    const error = new Error(
      "You cannot vote on your own answer"
    );
    error.status = 400;
    throw error;
  }

  const hasUpvoted = answer.upvote.some(
    (id) => id.toString() === userId.toString()
  );

  const hasDownvoted = answer.downvote.some(
    (id) => id.toString() === userId.toString()
  );

  if (voteType === "upvote") {
    if (hasUpvoted) {
      answer.upvote.pull(userId);
    } else {
      if (hasDownvoted) {
        answer.downvote.pull(userId);

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
      answer.downvote.pull(userId);

      await updateReputation({
        userId: answer.userid,
        points: 2,
        type: "downvote",
        reason: "Downvote removed from answer",
        relatedId: answer._id,
      });
    } else {
      if (hasUpvoted) {
        answer.upvote.pull(userId);
      }

      answer.downvote.push(userId);

      await updateReputation({
        userId: answer.userid,
        points: -2,
        type: "downvote",
        reason: "Answer received a downvote",
        relatedId: answer._id,
      });
    }
  }

  // Reward once at 5 upvotes
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

  return {
    questionData,
    upvotes: answer.upvote.length,
    downvotes: answer.downvote.length,
  };
};