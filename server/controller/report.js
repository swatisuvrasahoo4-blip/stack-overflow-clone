import Report from "../models/report.js";
import Post from "../models/post.js";

export const createReport = async (req, res) => {
  try {
    const reporterId = req.userid;
    const { postId, reason, details = "" } = req.body;

    if (!postId || !reason) {
      return res.status(400).json({
        success: false,
        message: "Post and reason are required.",
      });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    if (post.authorId.toString() === reporterId.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot report your own post.",
      });
    }

    const existingReport = await Report.findOne({
      reporterId,
      postId,
    });

    if (existingReport) {
      return res.status(409).json({
        success: false,
        message: "You have already reported this post.",
      });
    }

    const report = await Report.create({
      reporterId,
      postId,
      postAuthorId: post.authorId,
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
      .populate("postAuthorId", "name username profilePhoto")
      .populate("postId", "content postType image createdAt")
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
};export const checkReportStatus = async (req, res) => {
  try {
    const { postId } = req.params;

    const report = await Report.findOne({
      reporterId: req.userid,
      postId,
    });

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
