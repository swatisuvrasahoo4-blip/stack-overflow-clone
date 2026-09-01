import Post from "../../models/post.js";
import auth from "../../models/auth.js";

import { createPostNotification } from "../../utils/postNotifications.js";

// Like or unlike post
export const likePostService = async (req) => {
  const { id } = req.params;
  const userId = req.userid;

  const post = await Post.findById(id);

  if (!post) {
    const error = new Error("Post not found");
    error.status = 404;
    throw error;
  }

  if (!post.likes) {
    post.likes = [];
  }

  const alreadyLiked = post.likes.some(
    (likedUserId) =>
      likedUserId.toString() === userId.toString()
  );

  if (alreadyLiked) {
    post.likes = post.likes.filter(
      (likedUserId) =>
        likedUserId.toString() !== userId.toString()
    );
  } else {
    post.likes.push(userId);

    // Notify post owner
    if (
      post.authorId &&
      post.authorId.toString() !== userId.toString()
    ) {
      await createPostNotification({
        recipientId: post.authorId,
        senderId: userId,
        postId: post._id,
        type: "like",
        message: "liked your post.",
      });
    }
  }

  await post.save();

  return {
    success: true,
    message: alreadyLiked
      ? "Like removed successfully"
      : "Post liked successfully",
    likes: post.likes.length,
    data: post,
  };
};

// Add comment to post
export const addCommentService = async (req) => {
  const { id } = req.params;
  const { text, userName } = req.body;

  const user = await auth.findById(req.userid);

  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  if ((user.reputation || 0) < 50) {
    const error = new Error(
      "You need at least 50 reputation points to comment."
    );
    error.status = 403;
    throw error;
  }

  const post = await Post.findById(id);

  if (!post) {
    const error = new Error("Post not found");
    error.status = 404;
    throw error;
  }

  post.comments.push({
    userId: req.userid,
    userName,
    text,
  });

  // Notify post owner
  if (
    post.authorId.toString() !== req.userid.toString()
  ) {
    await createPostNotification({
      recipientId: post.authorId,
      senderId: req.userid,
      postId: post._id,
      type: "comment",
      message: "commented on your post.",
    });
  }

  await post.save();

  return {
    success: true,
    message: "Comment added successfully",
    data: post,
  };
};

// Reply to a comment
export const replyToCommentService = async (req) => {
  const { id, commentId } = req.params;
  const { text, userName } = req.body;

  const user = await auth.findById(req.userid);

  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  if ((user.reputation || 0) < 50) {
    const error = new Error(
      "You need at least 50 reputation points to reply to comments."
    );
    error.status = 403;
    throw error;
  }

  const post = await Post.findById(id);

  if (!post) {
    const error = new Error("Post not found");
    error.status = 404;
    throw error;
  }

  const comment = post.comments.id(commentId);

  if (!comment) {
    const error = new Error("Comment not found");
    error.status = 404;
    throw error;
  }

  comment.replies.push({
    userId: req.userid,
    userName,
    text,
  });

  await post.save();

  // Notify comment owner
  if (
    comment.userId.toString() !== req.userid.toString()
  ) {
    await createPostNotification({
      recipientId: comment.userId,
      senderId: req.userid,
      postId: post._id,
      type: "reply",
      message: "replied to your comment.",
    });
  }

  return {
    success: true,
    message: "Reply added successfully",
    data: post,
  };
};

// Delete comment
export const deleteCommentService = async (req) => {
  const { postId, commentId } = req.params;

  const post = await Post.findById(postId);

  if (!post) {
    const error = new Error("Post not found");
    error.status = 404;
    throw error;
  }

  const comment = post.comments.id(commentId);

  if (!comment) {
    const error = new Error("Comment not found");
    error.status = 404;
    throw error;
  }

  if (String(comment.userId) !== String(req.userid)) {
    const error = new Error(
      "You can only delete your own comment"
    );
    error.status = 403;
    throw error;
  }

  post.comments.pull(commentId);

  await post.save();

  return {
    success: true,
    message: "Comment deleted successfully",
    data: post,
  };
};

// Delete reply
export const deleteReplyService = async (req) => {
  const {
    postId,
    commentId,
    replyId,
  } = req.params;

  const post = await Post.findById(postId);

  if (!post) {
    const error = new Error("Post not found");
    error.status = 404;
    throw error;
  }

  const comment = post.comments.id(commentId);

  if (!comment) {
    const error = new Error("Comment not found");
    error.status = 404;
    throw error;
  }

  const reply = comment.replies.id(replyId);

  if (!reply) {
    const error = new Error("Reply not found");
    error.status = 404;
    throw error;
  }

  if (String(reply.userId) !== String(req.userid)) {
    const error = new Error("Unauthorized");
    error.status = 403;
    throw error;
  }

  comment.replies.pull(replyId);

  await post.save();

  return {
    message: "Reply deleted successfully",
  };
};