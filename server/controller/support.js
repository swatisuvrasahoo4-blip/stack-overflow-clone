import Support from "../models/support.js";
import User from "../models/auth.js";

export const createSupportRequest = async (req, res) => {
  try {
    const { subject, message } = req.body;

    if (!subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Subject and message are required.",
      });
    }

    const user = await User.findById(req.userid);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const plan = user.subscription || "Free";
    if (plan === "Free" || plan === "Bronze") {
  return res.status(403).json({
    success: false,
    message:
      "Priority Support is available only for Silver and Gold plans. Please upgrade your plan.",
  });
}

    let priority = "normal";

    if (plan === "Silver") {
      priority = "high";
    } else if (plan === "Gold") {
      priority = "highest";
    }

    const supportRequest = await Support.create({
      userId: user._id,
      subject,
      message,
      plan,
      priority,
    });

    return res.status(201).json({
      success: true,
      message: "Support request submitted successfully.",
      supportRequest,
    });
  } catch (error) {
    console.error("Create support request error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
};

export const getSupportRequests = async (req, res) => {
  try {
    const supportRequests = await Support.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    const priorityOrder = {
      highest: 1,
      high: 2,
      normal: 3,
    };

    supportRequests.sort(
      (a, b) =>
        priorityOrder[a.priority] - priorityOrder[b.priority]
    );

    return res.status(200).json({
      success: true,
      supportRequests,
    });
  } catch (error) {
    console.error("Get support requests error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
};

export const resolveSupportRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const supportRequest = await Support.findById(id);

    if (!supportRequest) {
      return res.status(404).json({
        success: false,
        message: "Support request not found.",
      });
    }

    supportRequest.status = "resolved";
    await supportRequest.save();

    return res.status(200).json({
      success: true,
      message: "Support request resolved successfully.",
      supportRequest,
    });
  } catch (error) {
    console.error("Resolve support request error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
};