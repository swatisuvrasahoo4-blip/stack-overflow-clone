import ReputationActivity from "../models/reputationActivity.js";
import User from "../models/auth.js";

export const getMyReputationActivity = async (req, res) => {
  try {
    const userId = req.userid;

    const user = await User.findById(userId).select("reputation");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const activities = await ReputationActivity.find({
      userId: userId,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      reputation: user.reputation || 0,
      activities: activities,
    });
  } catch (error) {
    console.error("Get Reputation Activity Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch reputation activity",
    });
  }
};

export const getUserReputationActivity = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select("reputation");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const activities = await ReputationActivity.find({
      userId: userId,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      reputation: user.reputation || 0,
      activities: activities,
    });
  } catch (error) {
    console.error("Get User Reputation Activity Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch user reputation activity",
    });
  }
};