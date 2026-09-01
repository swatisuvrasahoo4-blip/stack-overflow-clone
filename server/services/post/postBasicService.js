import Post from "../../models/post.js";

// Delete a post
export const deletePostService = async (req) => {
  const { id } = req.params;

  const post = await Post.findById(id);

  if (!post) {
    const error = new Error("Post not found");
    error.status = 404;
    throw error;
  }

  // Check ownership
  if (
    post.authorId.toString() !==
    req.userid.toString()
  ) {
    const error = new Error(
      "You can only delete your own post"
    );

    error.status = 403;
    throw error;
  }

  await Post.findByIdAndDelete(id);

  return {
    message: "Post deleted successfully",
  };
};

// Get a single post
export const getPostByIdService = async (req) => {
  const post = await Post.findById(
    req.params.id
  );

  if (!post) {
    const error = new Error("Post not found");
    error.status = 404;
    throw error;
  }

  return {
    success: true,
    data: post,
  };
};