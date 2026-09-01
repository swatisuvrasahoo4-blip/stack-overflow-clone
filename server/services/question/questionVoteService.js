import mongoose from "mongoose";
import question from "../../models/question.js";
import { updateReputation } from "../reputationServices.js";

// Vote on question
export const voteQuestionService = async ({
  questionId,
  value,
  userId,
}) => {
  if (
    !mongoose.Types.ObjectId.isValid(
      questionId
    )
  ) {
    const error = new Error(
      "Question unavailable"
    );
    error.status = 400;
    throw error;
  }

  if (
    value !== "upvote" &&
    value !== "downvote"
  ) {
    const error = new Error(
      "Invalid vote type"
    );
    error.status = 400;
    throw error;
  }

  const questionDoc =
    await question.findById(
      questionId
    );

  if (!questionDoc) {
    const error = new Error(
      "Question not found"
    );
    error.status = 404;
    throw error;
  }

  const hasUpvoted =
    questionDoc.upvote.some(
      (id) =>
        String(id) ===
        String(userId)
    );

  const hasDownvoted =
    questionDoc.downvote.some(
      (id) =>
        String(id) ===
        String(userId)
    );

  if (value === "upvote") {
    if (hasDownvoted) {
      questionDoc.downvote =
        questionDoc.downvote.filter(
          (id) =>
            String(id) !==
            String(userId)
        );

      await updateReputation({
        userId: questionDoc.userid,
        points: 2,
        type: "downvote",
        reason:
          "Question downvote removed",
        relatedId: questionDoc._id,
      });
    }

    if (hasUpvoted) {
      questionDoc.upvote =
        questionDoc.upvote.filter(
          (id) =>
            String(id) !==
            String(userId)
        );
    } else {
      questionDoc.upvote.push(
        userId
      );
    }
  }

  if (value === "downvote") {
    if (hasUpvoted) {
      questionDoc.upvote =
        questionDoc.upvote.filter(
          (id) =>
            String(id) !==
            String(userId)
        );
    }

    if (hasDownvoted) {
      questionDoc.downvote =
        questionDoc.downvote.filter(
          (id) =>
            String(id) !==
            String(userId)
        );

      await updateReputation({
        userId: questionDoc.userid,
        points: 2,
        type: "downvote",
        reason:
          "Question downvote removed",
        relatedId: questionDoc._id,
      });
    } else {
      questionDoc.downvote.push(
        userId
      );

      await updateReputation({
        userId: questionDoc.userid,
        points: -2,
        type: "downvote",
        reason:
          "Question received a downvote",
        relatedId: questionDoc._id,
      });
    }
  }

  // Reward once at 10 upvotes
  if (
    questionDoc.upvote.length >= 10 &&
    !questionDoc.tenUpvotesRewarded
  ) {
    await updateReputation({
      userId: questionDoc.userid,
      points: 2,
      type: "question_upvotes",
      reason:
        "Question received 10 upvotes",
      relatedId: questionDoc._id,
    });

    questionDoc.tenUpvotesRewarded =
      true;
  }

  await questionDoc.save();

  return questionDoc;
};