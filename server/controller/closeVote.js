import Question from "../models/question.js";
import User from "../models/auth.js";

export const voteToCloseQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const { reason } = req.body;
    const userId = req.userid;

    // Check reason
    if (!reason || !reason.trim()) {
      return res.status(400).json({
        message: "please_select_a_reason_for_closing_this_question",
      });
    }

    // Find logged-in user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "user_not_found",
      });
    }

    // Reputation privilege check
    if (user.reputation < 250) {
      return res.status(403).json({
        message:
          "you_need_at_least_250_reputation_to_vote_to_close_questions",
      });
    }

    // Find question
    const question = await Question.findById(questionId);

    if (!question) {
      return res.status(404).json({
        message: "question_not_found",
      });
    }

    // Already closed
    if (question.isClosed) {
      return res.status(400).json({
        message: "this_question_is_already_closed",
      });
    }

    // Prevent duplicate vote
    const alreadyVoted = question.closeVotes.some(
      (vote) => vote.userId.toString() === userId.toString()
    );

    if (alreadyVoted) {
      return res.status(400).json({
        message: "you_have_already_voted_to_close_this_question",
      });
    }

    // Add close vote
    question.closeVotes.push({
      userId: userId,
      reason: reason.trim(),
    });

    // Close after 3 votes
    if (question.closeVotes.length >= 3) {
      question.isClosed = true;
      question.closedAt = new Date();
    }

    await question.save();

    return res.status(200).json({
      message: question.isClosed
        ? "question_has_been_closed"
        : "your_close_vote_has_been_recorded",
      closeVoteCount: question.closeVotes.length,
      isClosed: question.isClosed,
    });
  } catch (error) {
    console.error("Vote to close error:", error);

    return res.status(500).json({
      message: "failed_to_vote_to_close_question",
    });
  }
};