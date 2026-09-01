import {
  answerQuestionService,
  deleteAnswerService,
  acceptAnswerService,
  voteAnswerService,
} from "../services/question/answerService.js";

// Get error status
const getErrorStatus = (error) => {
  if (
    error &&
    typeof error === "object" &&
    "status" in error &&
    typeof error.status === "number"
  ) {
    return error.status;
  }

  return 500;
};

// Get error message
const getErrorMessage = (error, fallbackMessage) => {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallbackMessage;
};

// Add answer
export const Askanswer = async (req, res) => {
  try {
    const {
      answerbody,
      useranswered,
      userid,
    } = req.body;

    const questionData =
      await answerQuestionService({
        questionId: req.params.id,
        answerbody,
        useranswered,
        userid,
      });

    return res.status(200).json({
      data: questionData,
    });
  } catch (error) {
    console.error("Ask answer error:", error);

    return res
      .status(getErrorStatus(error))
      .json({
        message: getErrorMessage(
          error,
          "something went wrong.."
        ),
      });
  }
};

// Delete answer
export const deleteanswer = async (req, res) => {
  try {
    const {
      questionId,
      answerId,
    } = req.params;

    const questionData =
      await deleteAnswerService({
        questionId,
        answerId,
      });

    return res.status(200).json({
      data: questionData,
    });
  } catch (error) {
    console.error("Delete answer error:", error);

    return res
      .status(getErrorStatus(error))
      .json({
        message: getErrorMessage(
          error,
          "something went wrong.."
        ),
      });
  }
};

// Accept answer
export const acceptAnswer = async (req, res) => {
  try {
    const {
      questionId,
      answerId,
    } = req.params;

    const questionData =
      await acceptAnswerService({
        questionId,
        answerId,
        userId: req.userid,
      });

    return res.status(200).json({
      message: "Answer accepted successfully",
      data: questionData,
    });
  } catch (error) {
    console.error("Accept answer error:", error);

    return res
      .status(getErrorStatus(error))
      .json({
        message: getErrorMessage(
          error,
          "Something went wrong"
        ),
      });
  }
};

// Vote answer
export const voteAnswer = async (req, res) => {
  try {
    const {
      questionId,
      answerId,
    } = req.params;

    const {
      voteType,
    } = req.body;

    const result =
      await voteAnswerService({
        questionId,
        answerId,
        voteType,
        userId: req.userid,
      });

    return res.status(200).json({
      message:
        "Answer vote updated successfully",
      upvotes: result.upvotes,
      downvotes: result.downvotes,
      data: result.questionData,
    });
  } catch (error) {
    console.error("Answer vote error:", error);

    return res
      .status(getErrorStatus(error))
      .json({
        message: getErrorMessage(
          error,
          "Something went wrong"
        ),
      });
  }
};