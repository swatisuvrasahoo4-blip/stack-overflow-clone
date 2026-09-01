import {
  createPostService,
} from "../services/post/postCreateService.js";

import {
  editPostService,
} from "../services/post/postEditService.js";

import {
  getAllPostsService,
  searchPostsService,
} from "../services/post/postQueryService.js";

import {
  likePostService,
  addCommentService,
  replyToCommentService,
  deleteCommentService,
  deleteReplyService,
} from "../services/post/postInteractionService.js";

import {
  deletePostService,
  getPostByIdService,
} from "../services/post/postBasicService.js";

// Get error status
const getErrorStatus = (error) => {
  if (
    error &&
    typeof error === "object" &&
    "status" in error &&
    typeof error.status === "number"
  ) {
    return error.status;
  }

  return 500;
};

// Get error message
const getErrorMessage = (
  error,
  fallbackMessage
) => {
  if (
    error instanceof Error &&
    error.message
  ) {
    return error.message;
  }

  return fallbackMessage;
};

// Create post
export const createPost = async (req, res) => {
  try {
    const result =
      await createPostService(req);

    return res.status(201).json(result);
  } catch (error) {
    console.error(
      "Create Post Error:",
      error
    );

    return res
      .status(getErrorStatus(error))
      .json({
        success: false,
        message: getErrorMessage(
          error,
          "Internal Server Error"
        ),
      });
  }
};

// Edit post
export const editPost = async (req, res) => {
  try {
    const result =
      await editPostService(req);

    return res.status(200).json(result);
  } catch (error) {
    console.error(
      "Edit Post Error:",
      error
    );

    return res
      .status(getErrorStatus(error))
      .json({
        message: getErrorMessage(
          error,
          "Something went wrong while editing the post"
        ),
      });
  }
};

// Get all community posts
export const getAllPosts = async (req, res) => {
  try {
    const result =
      await getAllPostsService(req);

    return res.status(200).json(result);
  } catch (error) {
    console.error(
      "Get Posts Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Like or unlike post
export const likePost = async (req, res) => {
  try {
    const result =
      await likePostService(req);

    return res.status(200).json(result);
  } catch (error) {
    console.error(
      "Like Post Error:",
      error
    );

    return res
      .status(getErrorStatus(error))
      .json({
        success: false,
        message: getErrorMessage(
          error,
          "Internal Server Error"
        ),
      });
  }
};

// Add comment
export const addComment = async (req, res) => {
  try {
    const result =
      await addCommentService(req);

    return res.status(200).json(result);
  } catch (error) {
    console.error(
      "Add Comment Error:",
      error
    );

    return res
      .status(getErrorStatus(error))
      .json({
        success: false,
        message: getErrorMessage(
          error,
          "Internal Server Error"
        ),
      });
  }
};

// Reply to comment
export const replyToComment = async (req, res) => {
  try {
    const result =
      await replyToCommentService(req);

    return res.status(200).json(result);
  } catch (error) {
    console.error(
      "Reply Comment Error:",
      error
    );

    return res
      .status(getErrorStatus(error))
      .json({
        success: false,
        message: getErrorMessage(
          error,
          "Internal Server Error"
        ),
      });
  }
};

// Delete post
export const deletePost = async (req, res) => {
  try {
    const result =
      await deletePostService(req);

    return res.status(200).json(result);
  } catch (error) {
    console.error(
      "Delete Post Error:",
      error
    );

    return res
      .status(getErrorStatus(error))
      .json({
        message: getErrorMessage(
          error,
          "Something went wrong while deleting the post"
        ),
      });
  }
};

// Delete comment
export const deleteComment = async (req, res) => {
  try {
    const result =
      await deleteCommentService(req);

    return res.status(200).json(result);
  } catch (error) {
    console.error(
      "Delete Comment Error:",
      error
    );

    return res
      .status(getErrorStatus(error))
      .json({
        success: false,
        message: getErrorMessage(
          error,
          "Internal Server Error"
        ),
      });
  }
};

// Delete reply
export const deleteReply = async (req, res) => {
  try {
    const result =
      await deleteReplyService(req);

    return res.status(200).json(result);
  } catch (error) {
    console.error(
      "Delete Reply Error:",
      error
    );

    return res
      .status(getErrorStatus(error))
      .json({
        message: getErrorMessage(
          error,
          "Server Error"
        ),
      });
  }
};

// Get single post
export const getPostById = async (req, res) => {
  try {
    const result =
      await getPostByIdService(req);

    return res.status(200).json(result);
  } catch (error) {
    console.error(
      "Get Post Error:",
      error
    );

    return res
      .status(getErrorStatus(error))
      .json({
        success: false,
        message: getErrorMessage(
          error,
          "Unable to fetch post"
        ),
      });
  }
};

// Search community posts
export const searchPosts = async (req, res) => {
  try {
    const result =
      await searchPostsService(req);

    return res.status(200).json(result);
  } catch (error) {
    console.error(
      "Post Search Error:",
      error
    );

    return res
      .status(getErrorStatus(error))
      .json({
        success: false,
        message: getErrorMessage(
          error,
          "Something went wrong while searching posts"
        ),
      });
  }
};