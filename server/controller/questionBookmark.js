import userModel from "../models/auth.js";
import mongoose from "mongoose";
import questionModel from "../models/question.js"

export const toggleQuestionBookmark = async (req, res) => {
  
  const { userId, questionId } = req.body;

  try {
    const user = await userModel.findById(userId);
    const existingQuestion = await questionModel.findById(questionId);

if (!existingQuestion) {
  return res.status(404).json({
    message: "Question not found in MongoDB",
  });
}
    

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const alreadyBookmarked = user.questionBookmarks.some(
      (id) => id.toString() === questionId
    );

    if (alreadyBookmarked) {
      user.questionBookmarks = user.questionBookmarks.filter(
        (id) => id.toString() !== questionId
      );
    } else {
      user.questionBookmarks.push(questionId);
    }

    await user.save();

    return res.status(200).json({
      message: alreadyBookmarked
        ? "Question removed from saves"
        : "Question saved successfully",
      questionBookmarks: user.questionBookmarks,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to update question bookmark",
      error: error.message,
    });
  }
};
export const getQuestionBookmarks = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await userModel
      .findById(userId)
      .populate("questionBookmarks");
      

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      questionBookmarks: user.questionBookmarks,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Unable to fetch saved questions",
      error: error.message,
    });
  }
};