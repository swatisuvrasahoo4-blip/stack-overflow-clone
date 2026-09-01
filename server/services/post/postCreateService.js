import Post from "../../models/post.js";
import auth from "../../models/auth.js";

import { extractHashtags } from "../../utils/extractHashtags.js";
import { uploadPostImage } from "../../utils/postImageUpload.js";
import { getMentionedUsers } from "../../utils/postMentions.js";
import { createMentionNotifications } from "../../utils/postNotifications.js";

// Create a new post
export const createPostService = async (req) => {
  const {
    authorId,
    authorName,
    content,
    postType,
    codeSnippet,
    hashtags,
    projectTitle,
    projectLink,
    achievementTitle,
    achievementDescription,
    isFeatured,
    mentions,
  } = req.body;

  if (!content || content.trim() === "") {
    const error = new Error("Post content is required.");
    error.status = 400;
    throw error;
  }

  const normalizedHashtags =
    extractHashtags(content, hashtags);

  // Check featured post permission
  if (
    isFeatured === true ||
    isFeatured === "true"
  ) {
    const user =
      await auth.findById(authorId);

    if (
      !user ||
      user.subscription !== "Gold" ||
      user.subscriptionStatus !== "Active"
    ) {
      const error = new Error(
        "Featured posts are available only for Gold members."
      );

      error.status = 403;
      throw error;
    }
  }

  // Upload image
  const image = req.file
    ? await uploadPostImage(req.file)
    : "";

  // Handle mentions
  const normalizedMentions =
    await getMentionedUsers(mentions);

  // Create post
  const newPost = new Post({
    authorId,
    authorName,
    content,
    postType,
    isFeatured:
      isFeatured === true ||
      isFeatured === "true",
    image,
    codeSnippet,
    hashtags: normalizedHashtags,
    mentions: normalizedMentions,
    projectTitle,
    projectLink,
    achievementTitle,
    achievementDescription,
  });

  const savedPost =
    await newPost.save();

  // Create mention notifications
  await createMentionNotifications({
    mentions: normalizedMentions,
    authorId,
    postId: savedPost._id,
  });

  return {
    success: true,
    message: "Post created successfully.",
    data: savedPost,
  };
};