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
        message: "Please select a reason for closing this question",
      });
    }

    // Find logged-in user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Reputation privilege check
    if (user.reputation < 250) {
      return res.status(403).json({
        message: "You need at least 250 reputation to vote to close questions",
      });
    }

    // Find question
    const question = await Question.findById(questionId);

    if (!question) {
      return res.status(404).json({
        message: "Question not found",
      });
    }

    // Already closed
    if (question.isClosed) {
      return res.status(400).json({
        message: "This question is already closed",
      });
    }

    // Prevent duplicate vote
    const alreadyVoted = question.closeVotes.some(
      (vote) => vote.userId.toString() === userId.toString()
    );

    if (alreadyVoted) {
      return res.status(400).json({
        message: "You have already voted to close this question",
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
        ? "Question has been closed"
        : "Your close vote has been recorded",
      closeVoteCount: question.closeVotes.length,
      isClosed: question.isClosed,
    });
  } catch (error) {
    console.error("Vote to close error:", error);

    return res.status(500).json({
      message: "Failed to vote to close question",
    });
  }
};