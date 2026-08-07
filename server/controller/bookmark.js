import userModel from "../models/auth.js";

export const toggleBookmark = async (req, res) => {
  const { userId, postId } = req.body;

  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const alreadyBookmarked = user.bookmarks.includes(postId);

    const unlimitedPlans = ["Silver", "Gold"];

if (
  !alreadyBookmarked &&
  !unlimitedPlans.includes(user.subscription) &&
  user.bookmarks.length + user.questionBookmarks.length >= 10
) {
  return res.status(403).json({
    message: "Bookmark limit reached. Upgrade to Silver or Gold for unlimited bookmarks.",
  });
}

    if (alreadyBookmarked) {
      user.bookmarks = user.bookmarks.filter(
        (bookmarkId) => bookmarkId.toString() !== postId
      );
    } else {
      user.bookmarks.push(postId);
    }

    await user.save();

    return res.status(200).json({
      message: alreadyBookmarked
        ? "Bookmark removed"
        : "Post bookmarked",
      bookmarks: user.bookmarks,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to update bookmark",
      error: error.message,
    });
  }
};
export const getBookmarkedPosts = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await userModel
      .findById(userId)
      .populate("bookmarks");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      bookmarks: user.bookmarks,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to fetch bookmarks",
      error: error.message,
    });
  }
};