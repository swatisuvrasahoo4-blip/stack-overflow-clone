import follow from "../models/follow.js"
import auth from "../models/auth.js";
import Notification from "../models/notification.js"
import { normalizeObjectId } from "../utils/objectId.js";

export const followUser = async (req, res) => {
  try {
    const followerId = req.userid;
    const followingId = req.params.userId;

    if (followerId === followingId) {
      return res.status(400).json({
        message: "You cannot follow yourself.",
      });
    }

    const userToFollow = await auth.findById(followingId);

    if (!userToFollow) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    const existingFollow = await follow.findOne({
      follower: followerId,
      following: followingId,
    });

    if (existingFollow) {
      return res.status(400).json({
        message: "You are already following this user.",
      });
    }

    const newFollow = await follow.create({
      follower: followerId,
      following: followingId,
    });
   
    await Notification.create({
  recipientId: normalizeObjectId(followingId),
  senderId: normalizeObjectId(followerId),
  type: "follow",
  message: "started following you.",
});

    return res.status(201).json({
      message: "User followed successfully.",
      data: newFollow,
    });

  } catch (error) {
    console.log("Follow User Error:", error);

    return res.status(500).json({
      message: "Something went wrong while following the user.",
    });
  }
};
export const unfollowUser = async (req, res) => {
  try {
    const followerId = req.userid;
    const followingId = req.params.userId;
    const deletedFollow = await follow.findOneAndDelete({
      follower: followerId,
      following: followingId,
    });

    if (!deletedFollow) {
      return res.status(404).json({
        message: "Follow relationship not found.",
      });
    }

    return res.status(200).json({
      message: "User unfollowed successfully.",
    });
  } catch (error) {
    console.log("Unfollow User Error:", error);

    return res.status(500).json({
      message: "Something went wrong while unfollowing the user.",
    });
  }
};

export const getFollowStatus = async (req, res) => {
  try {
    const followerId = req.userid;
    const followingId = req.params.userId;

    const existingFollow = await follow.findOne({
      follower: followerId,
      following: followingId,
    });
    
    return res.status(200).json({
      isFollowing: Boolean(existingFollow),
    });
  } catch (error) {
    console.log("Get Follow Status Error:", error);

    return res.status(500).json({
      message: "Something went wrong while checking follow status.",
    });
  }
};
export const getFollowCounts = async (req, res) => {
  try {
    const userId = req.params.userId;

    const followers = await follow.countDocuments({
      following: userId,
    });

    const following = await follow.countDocuments({
      follower: userId,
    });

    return res.status(200).json({
      followers,
      following,
    });
  } catch (error) {
    console.log("Get Follow Counts Error:", error);

    return res.status(500).json({
      message: "Something went wrong while getting follow counts.",
    });
  }
};
export const getFollowers = async (req, res) => {
  try {
    const userId = req.params.userId;

    const followers = await follow
      .find({
        following: userId,
      })
      .populate("follower", "name username email");

    return res.status(200).json({
      followers,
    });
  } catch (error) {
    console.log("Get Followers Error:", error);

    return res.status(500).json({
      message: "Something went wrong while getting followers.",
    });
  }
};
export const getFollowing = async (req, res) => {
  try {
    const userId = req.params.userId;

    const following = await follow
      .find({ follower: userId })
      .populate("following", "name email");

    return res.status(200).json({
      following,
    });
  } catch (error) {
    console.log("Get Following Error:", error);

    return res.status(500).json({
      message: "Something went wrong while getting following users.",
    });
  }
};