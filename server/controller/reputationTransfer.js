import User from "../models/auth.js";
import ReputationTransfer from "../models/reputationTransfer.js";
import ReputationActivity from "../models/reputationActivity.js";

export const transferReputation = async (req, res) => {
  try {
    const senderId = req.userid;
    const { receiverId, points, reason } = req.body;

    const transferPoints = Number(points);

    // Required fields
    if (!receiverId || !points || !reason?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Receiver, points and reason are required.",
      });
    }

    // Points must be a whole positive number
    if (
      !Number.isInteger(transferPoints) ||
      transferPoints < 1 ||
      transferPoints > 50
    ) {
      return res.status(400).json({
        success: false,
        message: "You can transfer between 1 and 50 points per transaction.",
      });
    }

    // Cannot transfer to yourself
    if (String(senderId) === String(receiverId)) {
      return res.status(400).json({
        success: false,
        message: "You cannot transfer reputation to yourself.",
      });
    }

    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!sender) {
      return res.status(404).json({
        success: false,
        message: "Sender not found.",
      });
    }

    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: "Receiver not found.",
      });
    }

    // Sender must have MORE THAN 50 reputation
    if (sender.reputation <= 50) {
      return res.status(403).json({
        success: false,
        message:
          "You need more than 50 reputation points to transfer reputation.",
      });
    }

    // Sender must have enough reputation
    if (sender.reputation < transferPoints) {
      return res.status(400).json({
        success: false,
        message: "You do not have enough reputation points.",
      });
    }

    // Start of today
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    // Calculate how many points sender already transferred today
    const todayTransfers = await ReputationTransfer.find({
      sender: senderId,
      createdAt: { $gte: startOfToday },
    });

    const transferredToday = todayTransfers.reduce(
      (total, transfer) => total + transfer.points,
      0
    );

    // Maximum 100 reputation per day
    if (transferredToday + transferPoints > 100) {
      return res.status(400).json({
        success: false,
        message: `Daily transfer limit is 100 points. You have already transferred ${transferredToday} points today.`,
      });
    }

    // Update reputation
    sender.reputation -= transferPoints;
    receiver.reputation += transferPoints;

    await sender.save();
    await receiver.save();

    // Record transfer
    const transfer = await ReputationTransfer.create({
      sender: senderId,
      receiver: receiverId,
      points: transferPoints,
      reason: reason.trim(),
    });

    // Sender reputation activity
    await ReputationActivity.create({
      userId: senderId,
      points: -transferPoints,
      type: "reputation_sent",
      reason: `Transferred reputation to ${receiver.userName || receiver.name}`,
      transferReason: reason.trim(),
      relatedId: transfer._id,
    });

    // Receiver reputation activity
    await ReputationActivity.create({
      userId: receiverId,
      points: transferPoints,
      type: "reputation_received",
      reason: `Received reputation from ${sender.userName || sender.name}`,
      transferReason: reason.trim(),
      relatedId: transfer._id,
    });

    return res.status(200).json({
      success: true,
      message: `${transferPoints} reputation points transferred successfully.`,
      data: {
        transfer,
        remainingReputation: sender.reputation,
        transferredToday: transferredToday + transferPoints,
      },
    });
  } catch (error) {
    console.error("Transfer reputation error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to transfer reputation.",
    });
  }
};