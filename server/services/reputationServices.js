import User from "../models/auth.js";
import ReputationActivity from "../models/reputationActivity.js";

export const updateReputation = async ({
  userId,
  points,
  type,
  reason,
  relatedId = null,
}) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const oldReputation = user.reputation || 0;

    // Reputation cannot go below 0
    const newReputation = Math.max(0, oldReputation + points);

    // Actual points changed
    const actualPoints = newReputation - oldReputation;

    user.reputation = newReputation;

    await user.save();

    // Save reputation activity
    if (actualPoints !== 0) {
      await ReputationActivity.create({
        userId,
        points: actualPoints,
        type,
        reason,
        relatedId,
      });
    }

    return {
      reputation: newReputation,
      pointsChanged: actualPoints,
    };
  } catch (error) {
    console.log("Reputation update error:", error);
    throw error;
  }
};