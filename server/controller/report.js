import Report from "../models/report.js";
import Post from "../models/post.js";
import question from "../models/question.js";
import User from "../models/auth.js";
import reputationActivity from "../models/reputationActivity.js";

export const createReport = async (req, res) => {
  try {
    const reporterId = req.userid;
    const { postId, questionId, reason, details = "" } = req.body;

    const reporter = await User.findById(reporterId).select("reputation");

if (!reporter) {
  return res.status(404).json({
    success: false,
    message: "User not found.",
  });
}

if ((reporter.reputation || 0) < 500) {
  return res.status(403).json({
    success: false,
    message: "You need at least 500 reputation points to report inappropriate content.",
  });
}

    if ((!postId && !questionId) || !reason) {
      return res.status(400).json({
        success: false,
        message: "Content and reason are required.",
      });
    }

    let content;
let authorId;

if (postId) {
  content = await Post.findById(postId);

  if (!content) {
    return res.status(404).json({
      success: false,
      message: "Post not found.",
    });
  }

  authorId = content.authorId;
} else {
  content = await question.findById(questionId);

  if (!content) {
    return res.status(404).json({
      success: false,
      message: "Question not found.",
    });
  }

  authorId = content.userid;
}

if (authorId && authorId.toString() === reporterId.toString()) {
  return res.status(400).json({
    success: false,
    message: `You cannot report your own ${postId ? "post" : "question"}.`,
  });
}
    const existingReport = await Report.findOne({
  reporterId,
  ...(postId ? { postId } : { questionId }),
});

    if (existingReport) {
      return res.status(409).json({
        success: false,
        message: `You have already reported this ${postId ? "post" : "question"}.`,
      });
    }

   const report = await Report.create({
  reporterId,

  ...(postId
    ? {
        postId,
        postAuthorId: authorId,
      }
    : {
        questionId,
        questionAuthorId: authorId,
      }),

  reason,
  details: details.trim(),
});

    return res.status(201).json({
      success: true,
      message: "Post reported successfully.",
      report,
    });
  } catch (error) {
    console.error("Create report error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You have already reported this post.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to report post.",
    });
  }
};

export const getReports = async (req, res) => {
  try {
    const reports = await Report.find()
  .populate("reporterId", "name username profilePhoto")
  .populate(
    "postAuthorId",
    "name username profilePhoto isSuspended"
  )
  .populate(
    "questionAuthorId",
    "name username profilePhoto isSuspended"
  )
  .populate("postId", "content postType image createdAt")
  .populate(
    "questionId",
    "questiontitle questionbody questiontags askedon"
  )
  .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      reports,
    });
  } catch (error) {
    console.error("Get reports error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch reports.",
    });
  }
};

export const checkReportStatus = async (req, res) => {
  try {
    const { contentId, type } = req.params;

    let query = {
      reporterId: req.userid,
    };

    if (type === "post") {
      query.postId = contentId;
    } else if (type === "question") {
      query.questionId = contentId;
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid report type.",
      });
    }

    const report = await Report.findOne(query);

    return res.status(200).json({
      success: true,
      alreadyReported: !!report,
    });
  } catch (error) {
    console.error("Check report status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to check report status.",
    });
  }
};

export const updateReportStatus = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "reviewed",
      "dismissed",
      "action_taken",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid report status.",
      });
    }

     const existingReport = await Report.findById(reportId);

if (!existingReport) {
  return res.status(404).json({
    success: false,
    message: "Report not found.",
  });
}

    const report = await Report.findByIdAndUpdate(
      reportId,
      {
        status,
        reviewedBy: req.userid,
        reviewedAt: new Date(),
      },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found.",
      });
    }

    if (
  status === "action_taken" &&
  !existingReport.adminReputationDeducted
) {
  const authorId =
    existingReport.questionAuthorId ||
    existingReport.postAuthorId;

  if (authorId) {
    const user = await User.findById(authorId);

    if (user) {
      const deduction = Math.min(10, user.reputation);

      user.reputation = Math.max(0, user.reputation - 10);

      await user.save();

      if (deduction > 0) {
        await reputationActivity.create({
          userId: authorId,
          points: -deduction,
          type: "admin_content_removed",
          reason: "Content removed by admin for guideline violation",
        });
      }

      report.adminReputationDeducted = true;
      await report.save();
    }
  }
}

if (status === "action_taken") {
  if (existingReport.questionId) {
    await question.findByIdAndDelete(existingReport.questionId);
  }

  if (existingReport.postId) {
    await Post.findByIdAndDelete(existingReport.postId);
  }
}

    return res.status(200).json({
      success: true,
      message: "Report status updated successfully.",
      report,
    });
  } catch (error) {
    console.error("Update report status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update report status.",
    });
  }
};