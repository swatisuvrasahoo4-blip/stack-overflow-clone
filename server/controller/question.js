import {
  getAllQuestionsService,
  getQuestionByIdService,
  searchQuestionsService,
} from "../services/question/questionQueryService.js";

import {
  createQuestionService,
  editQuestionService,
  deleteQuestionService,
} from "../services/question/questionMutationService.js";

import {
  voteQuestionService,
} from "../services/question/questionVoteService.js";

// Get error status
const getErrorStatus = (error) => {
  if (
    error instanceof Error &&
    "status" in error
  ) {
    return error.status;
  }

  return 500;
};

// Get error message
const getErrorMessage = (error) => {
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
};

// Ask question
export const Askquestion = async (
  req,
  res
) => {
  try {
    const questionData =
      await createQuestionService({
        postquestiondata:
          req.body.postquestiondata,
        userId: req.userid,
      });

    return res.status(200).json({
      data: questionData,
    });
  } catch (error) {
    console.error(
      "Ask question error:",
      error
    );

    return res
      .status(getErrorStatus(error))
      .json({
        message:
          getErrorMessage(error),
      });
  }
};

// Get all questions
export const getallquestion = async (
  req,
  res
) => {
  try {
    const result =
      await getAllQuestionsService({
        limit: req.query.limit,
        cursor: req.query.cursor,
      });

    return res
      .status(200)
      .json(result);
  } catch (error) {
    console.error(
      "Get all questions error:",
      error
    );

    return res
      .status(getErrorStatus(error))
      .json({
        message:
          getErrorMessage(error),
      });
  }
};

// Get question by ID
export const getQuestionById = async (
  req,
  res
) => {
  try {
    const questionData =
      await getQuestionByIdService(
        req.params.id,
        req.userid
      );

    return res.status(200).json({
      data: questionData,
    });
  } catch (error) {
    console.error(
      "Get question error:",
      error
    );

    return res
      .status(getErrorStatus(error))
      .json({
        message:
          getErrorMessage(error),
      });
  }
};

// Edit question
export const editQuestion = async (
  req,
  res
) => {
  try {
    const {
      questiontitle,
      questionbody,
      questiontags,
    } = req.body;

    const updatedQuestion =
      await editQuestionService({
        questionId: req.params.id,
        questiontitle,
        questionbody,
        questiontags,
      });

    return res.status(200).json({
      message:
        "Question updated successfully",
      question: updatedQuestion,
    });
  } catch (error) {
    console.error(
      "Edit question error:",
      error
    );

    return res
      .status(getErrorStatus(error))
      .json({
        message:
          getErrorMessage(error),
      });
  }
};

// Delete question
export const deleteQuestion = async (
  req,
  res
) => {
  try {
    await deleteQuestionService({
      questionId: req.params.id,
      userId: req.userid,
    });

    return res.status(200).json({
      message:
        "Question deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete question error:",
      error
    );

    return res
      .status(getErrorStatus(error))
      .json({
        message:
          getErrorMessage(error),
      });
  }
};

// Vote question
export const votequestion = async (
  req,
  res
) => {
  try {
    const questionData =
      await voteQuestionService({
        questionId: req.params.id,
        value: req.body.value,
        userId: req.body.userid,
      });

    return res.status(200).json({
      data: questionData,
    });
  } catch (error) {
    console.error(
      "Question vote error:",
      error
    );

    return res
      .status(getErrorStatus(error))
      .json({
        message:
          getErrorMessage(error),
      });
  }
};

// Search questions
export const searchQuestions = async (
  req,
  res
) => {
  try {
    const result =
      await searchQuestionsService({
        search: req.query.q,
        cursor: req.query.cursor,
        limit: req.query.limit,
      });

    return res
      .status(200)
      .json(result);
  } catch (error) {
    console.error(
      "Question search error:",
      error
    );

    return res
      .status(getErrorStatus(error))
      .json({
        message:
          getErrorMessage(error),
      });
  }
};