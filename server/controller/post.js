import Post from "../models/post.js";

// Create a new post
export const createPost = async (req, res) => {
  try {
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
    } = req.body;
    
    if (!content || content.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Post content is required.",
      });
    }

    const image = req.file
      ? `/uploads/posts/${req.file.filename}`
      : "";

    const newPost = new Post({
      authorId,
      authorName,
      content,
      postType,
      image,
      codeSnippet,
      hashtags,
      projectTitle,
      projectLink,
      achievementTitle,
      achievementDescription,
    });

    const savedPost = await newPost.save();

    res.status(201).json({
      success: true,
      message: "Post created successfully.",
      data: savedPost,
    });
  } catch (error) {
    console.error("Create Post Error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
// Edit an existing post
export const editPost = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      content,
      postType,
      image,
      codeSnippet,
      hashtags,
      projectTitle,
      projectLink,
      achievementTitle,
      achievementDescription,
    } = req.body;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    if (post.authorId.toString() !== req.userid.toString()) {
      return res.status(403).json({
        message: "You can only edit your own post",
      });
    }

    if (!content || content.trim() === "") {
      return res.status(400).json({
        message: "Post content is required",
      });
    }

    post.content = content;
    post.postType = postType || post.postType;
    post.image = image !== undefined ? image : post.image;
    post.codeSnippet =
      codeSnippet !== undefined ? codeSnippet : post.codeSnippet;
    post.hashtags = hashtags !== undefined ? hashtags : post.hashtags;
    post.projectTitle = projectTitle !== undefined ? projectTitle : post.projectTitle;
    post.projectLink = projectLink !== undefined ? projectLink : post.projectLink;
    post.achievementTitle = achievementTitle !== undefined ? achievementTitle : post.achievementTitle;
    post.achievementDescription = achievementDescription !== undefined ? achievementDescription : post.achievementDescription;
    post.isEdited = true;

    const updatedPost = await post.save();

    res.status(200).json({
      success: true,
      message: "Post updated successfully",
      data: updatedPost,
    });
  } catch (error) {
    console.log("Edit Post Error:", error);

    res.status(500).json({
      message: "Something went wrong while editing the post",
    });
  }
};
// Get all community posts
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (error) {
    console.error("Get Posts Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
// Like / Unlike post
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userid;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
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
    }

    await post.save();

    return res.status(200).json({
      success: true,
      message: alreadyLiked
        ? "Like removed successfully"
        : "Post liked successfully",
      likes: post.likes.length,
      data: post,
    });
  } catch (error) {
    console.error("Like Post Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
// Add comment to a post
export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, userName } = req.body;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    post.comments.push({
      userId: req.userid,
      userName,
      text,
    });

    await post.save();

    res.status(200).json({
      success: true,
      message: "Comment added successfully",
      data: post,
    });
  } catch (error) {
    console.error("Add Comment Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
// Reply to a comment
export const replyToComment = async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const { text, userName } = req.body;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const comment = post.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    comment.replies.push({
      userId: req.userid,
      userName,
      text,
    });

    await post.save();

    res.status(200).json({
      success: true,
      message: "Reply added successfully",
      data: post,
    });
  } catch (error) {
    console.error("Reply Comment Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
// delete a post
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    if (post.authorId.toString() !== req.userid.toString()) {
      return res.status(403).json({
        message: "You can only delete your own post",
      });
    }

    await Post.findByIdAndDelete(id);

    res.status(200).json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong while deleting the post",
    });
  }
};
// delete comment
export const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const comment = post.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    if (String(comment.userId) !== String(req.userid)) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own comment",
      });
    }

    post.comments.pull(commentId);

    await post.save();

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
      data: post,
    });
  } catch (error) {
    console.error("Delete Comment Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
//delete reply
export const deleteReply = async (req, res) => {
  try {
    const { postId, commentId, replyId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const comment = post.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    const reply = comment.replies.id(replyId);

    if (!reply) {
      return res.status(404).json({
        message: "Reply not found",
      });
    }

    if (String(reply.userId) !== String(req.userid)) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    comment.replies.pull(replyId);

    await post.save();

    res.status(200).json({
      message: "Reply deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error("Get Post Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch post",
      error: error.message,
    });
  }
};