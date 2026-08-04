import User from "../models/auth.js";
import Report from "../models/report.js";

export const suspendUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason = "Repeated policy violations." } = req.body;

    const targetUser = await User.findById(userId);

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (targetUser.role === "admin") {
      return res.status(400).json({
        success: false,
        message: "An admin account cannot be suspended.",
      });
    }

    targetUser.isSuspended = true;
    targetUser.suspensionReason = reason.trim();
    await targetUser.save();

    await Report.updateMany(
      {
        postAuthorId: userId,
        status: { $in: ["pending", "reviewed"] },
      },
      {
        status: "action_taken",
        reviewedBy: req.userid,
        reviewedAt: new Date(),
      }
    );

    return res.status(200).json({
      success: true,
      message: "User suspended successfully.",
      user: {
        _id: targetUser._id,
        name: targetUser.name,
        username: targetUser.username,
        isSuspended: targetUser.isSuspended,
        suspensionReason: targetUser.suspensionReason,
      },
    });
  } catch (error) {
    console.error("Suspend user error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to suspend user.",
    });
  }
};

export const unsuspendUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const targetUser = await User.findById(userId);

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    targetUser.isSuspended = false;
    targetUser.suspensionReason = "";
    await targetUser.save();

    return res.status(200).json({
      success: true,
      message: "User suspension removed.",
      user: {
        _id: targetUser._id,
        name: targetUser.name,
        username: targetUser.username,
        isSuspended: targetUser.isSuspended,
        suspensionReason: targetUser.suspensionReason,
      },
    });
  } catch (error) {
    console.error("Unsuspend user error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to unsuspend user.",
    });
  }
};