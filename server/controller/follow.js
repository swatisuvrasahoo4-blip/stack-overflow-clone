import follow from "../models/follow.js"
import auth from "../middleware/auth.js";

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

    const follow = await follow.create({
      follower: followerId,
      following: followingId,
    });

    return res.status(201).json({
      message: "User followed successfully.",
      data: follow,
    });
  } catch (error) {
    console.log("Follow User Error:", error);

    return res.status(500).json({
      message: "Something went wrong while following the user.",
    });
  }
};
