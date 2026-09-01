import Post from "../../models/post.js";
import auth from "../../models/auth.js";

import { extractHashtags } from "../../utils/extractHashtags.js";
import { uploadPostImage } from "../../utils/postImageUpload.js";

// Edit an existing post
export const editPostService = async (req) => {
  const { id } = req.params;

  const {
    content,
    postType,
    codeSnippet,
    hashtags,
    projectTitle,
    projectLink,
    achievementTitle,
    achievementDescription,
  } = req.body;

  const post = await Post.findById(id);

  if (!post) {
    const error = new Error("Post not found");
    error.status = 404;
    throw error;
  }

  const user = await auth.findById(req.userid);

  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  // Check ownership
  const isOwner =
    post.authorId.toString() ===
    req.userid.toString();

  if (!isOwner) {
    const error = new Error(
      "You can only edit your own post"
    );

    error.status = 403;
    throw error;
  }

  // Check reputation
  if ((user.reputation || 0) < 100) {
    const error = new Error(
      "You need at least 100 reputation points to edit community posts"
    );

    error.status = 403;
    throw error;
  }

  // Validate content
  if (!content || content.trim() === "") {
    const error = new Error(
      "Post content is required"
    );

    error.status = 400;
    throw error;
  }

  // Keep old image unless a new image is uploaded
  let image = post.image;

  if (req.file) {
    image = await uploadPostImage(
      req.file
    );
  }

  // Normalize hashtags
  const normalizedHashtags =
    extractHashtags(
      content,
      hashtags
    );

  // Update post
  post.content = content;
  post.postType =
    postType || post.postType;
  post.image = image;

  post.codeSnippet =
    codeSnippet !== undefined
      ? codeSnippet
      : post.codeSnippet;

  post.hashtags =
    normalizedHashtags;

  post.projectTitle =
    projectTitle !== undefined
      ? projectTitle
      : post.projectTitle;

  post.projectLink =
    projectLink !== undefined
      ? projectLink
      : post.projectLink;

  post.achievementTitle =
    achievementTitle !== undefined
      ? achievementTitle
      : post.achievementTitle;

  post.achievementDescription =
    achievementDescription !== undefined
      ? achievementDescription
      : post.achievementDescription;

  post.isEdited = true;

  const updatedPost =
    await post.save();

  return {
    success: true,
    message:
      "Post updated successfully",
    data: updatedPost,
  };
};