import mongoose from "mongoose";
import question from "../../models/question.js";
import auth from "../../models/auth.js";

// Create question
export const createQuestionService = async ({
  postquestiondata,
  userId,
}) => {
  const user = await auth.findById(userId);

  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  const newQuestion = new question({
    ...postquestiondata,
    userid: userId,
    userposted: user.name,
  });

  await newQuestion.save();

  return newQuestion;
};

// Edit question
export const editQuestionService = async ({
  questionId,
  questiontitle,
  questionbody,
  questiontags,
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

  const updatedQuestion =
    await question.findByIdAndUpdate(
      questionId,
      {
        questiontitle,
        questionbody,
        questiontags,
      },
      {
        new: true,
      }
    );

  if (!updatedQuestion) {
    const error = new Error(
      "Question not found"
    );
    error.status = 404;
    throw error;
  }

  return updatedQuestion;
};

// Delete question
export const deleteQuestionService = async ({
  questionId,
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

  const questionData =
    await question.findById(
      questionId
    );

  if (!questionData) {
    const error = new Error(
      "Question not found"
    );
    error.status = 404;
    throw error;
  }

  if (
    String(questionData.userid) !==
    String(userId)
  ) {
    const error = new Error(
      "You can only delete your own question"
    );
    error.status = 403;
    throw error;
  }

  await question.findByIdAndDelete(
    questionId
  );

  return questionData;
};