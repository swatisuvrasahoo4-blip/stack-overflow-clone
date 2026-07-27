import Post from "../models/post.js";

// Create a new post
export const createPost = async (req, res) => {
  try {
    const {
      authorId,
      authorName,
      content,
      postType,
      image,
      codeSnippet,
      hashtags,
    } = req.body;

    if (!content || content.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Post content is required.",
      });
    }

    const newPost = new Post({
      authorId,
      authorName,
      content,
      postType,
      image,
      codeSnippet,
      hashtags,
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
      message: "Internal Server Error",
    });
  }
};