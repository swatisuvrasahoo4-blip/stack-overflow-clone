import Post from "../models/post.js";
import { extractHashtags } from "../utils/extractHashtags.js";
import auth from "../models/auth.js";
import Notification from "../models/notification.js";
import { normalizeObjectId } from "../utils/objectId.js";
import cloudinary from "../config/cloudinary.js";

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
      isFeatured,
      mentions,
    } = req.body;

    if (!content || content.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Post content is required.",
      });
    }

    const normalizedHashtags = extractHashtags(content, hashtags);

    // Check Featured Post permission
    if (isFeatured === true || isFeatured === "true") {
      const user = await auth.findById(authorId);

      if (
        !user ||
        user.subscription !== "Gold" ||
        user.subscriptionStatus !== "Active"
      ) {
        return res.status(403).json({
          success: false,
          message: "Featured posts are available only for Gold members.",
        });
      }
    }

    // Upload image
    let image = "";

    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "codequest/posts",
            resource_type: "image",
          },
          (error, result) => {
            if (error) {
              reject(error);
              return;
            }

            resolve(result);
          }
        );

        uploadStream.end(req.file.buffer);
      });

      image = uploadResult.secure_url;
    }

    // Handle mentions
    let mentionUsernames = [];

    if (Array.isArray(mentions)) {
      mentionUsernames = mentions;
    } else if (typeof mentions === "string") {
      mentionUsernames = mentions.split(",");
    }

    mentionUsernames = [
      ...new Set(
        mentionUsernames
          .map((username) =>
            username.trim().replace(/^@/, "").toLowerCase()
          )
          .filter(Boolean)
      ),
    ];

    const mentionedUsers = await auth.find({
      username: { $in: mentionUsernames },
    });

    const normalizedMentions = mentionedUsers.map((person) => ({
      userId: person._id,
      username: person.username,
      name: person.name,
    }));

    // Create post
    const newPost = new Post({
      authorId,
      authorName,
      content,
      postType,
      isFeatured: isFeatured === true || isFeatured === "true",
      image,
      codeSnippet,
      hashtags: normalizedHashtags,
      mentions: normalizedMentions,
      projectTitle,
      projectLink,
      achievementTitle,
      achievementDescription,
    });

    const savedPost = await newPost.save();

    // Mention notifications
    const mentionNotifications = normalizedMentions
      .filter(
        (mentionedUser) =>
          mentionedUser.userId.toString() !== authorId.toString()
      )
      .map((mentionedUser) => ({
        recipientId: normalizeObjectId(mentionedUser.userId),
        senderId: normalizeObjectId(authorId),
        postId: savedPost._id,
        type: "mention",
        message: "mentioned you in a post.",
      }));

    if (mentionNotifications.length > 0) {
      await Notification.insertMany(mentionNotifications);
    }

    return res.status(201).json({
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
    console.log("EDIT BODY:", req.body);
console.log("EDIT FILE:", req.file);
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
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const user = await auth.findById(req.userid);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Check ownership
    const isOwner =
      post.authorId.toString() === req.userid.toString();

    if (!isOwner) {
      return res.status(403).json({
        message: "You can only edit your own post",
      });
    }

    // Check reputation
    if ((user.reputation || 0) < 100) {
      return res.status(403).json({
        message:
          "You need at least 100 reputation points to edit community posts",
      });
    }

    // Content validation
    if (!content || content.trim() === "") {
      return res.status(400).json({
        message: "Post content is required",
      });
    }

    // Handle image
    // Keep the old image if no new image is selected.
    // Replace it only when a new image is uploaded.
    let image = post.image;

    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "codequest/posts",
            resource_type: "image",
          },
          (error, result) => {
            if (error) {
              reject(error);
              return;
            }

            resolve(result);
          }
        );

        uploadStream.end(req.file.buffer);
      });

      image = uploadResult.secure_url;
    }

    // Normalize hashtags
    const normalizedHashtags = extractHashtags(
      content,
      hashtags
    );

    // Update post
    post.content = content;
    post.postType = postType || post.postType;
    post.image = image;

    post.codeSnippet =
      codeSnippet !== undefined
        ? codeSnippet
        : post.codeSnippet;

    post.hashtags = normalizedHashtags;

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

    const updatedPost = await post.save();

    return res.status(200).json({
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

// Get all community posts (cursor-based pagination)
export const getAllPosts = async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 10, 50);
    const { feed = "trending", type, followingIds, cursor } = req.query;

    const query = {};

    if (type) {
      query.postType = type;
    }

    // Following feed: filter server-side instead of on the frontend
    if (feed === "following") {
      const ids = (followingIds || "")
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean);

      if (ids.length === 0) {
        return res.status(200).json({
          success: true,
          data: [],
          pagination: { hasMore: false, nextCursor: null },
        });
      }

      query.authorId = { $in: ids };
    }

    // Decode the cursor from the previous page, if any
    let decodedCursor = null;
    if (cursor) {
      decodedCursor = JSON.parse(
        Buffer.from(cursor, "base64").toString("utf-8")
      );
    }

    // Sort chronologically for now (trending score comes in a later step)
    const sort = { createdAt: -1, _id: -1 };

    if (decodedCursor) {
      query.$or = [
        { createdAt: { $lt: new Date(decodedCursor.createdAt) } },
        {
          createdAt: new Date(decodedCursor.createdAt),
          _id: { $lt: decodedCursor._id },
        },
      ];
    }

    // Fetch one extra doc so we can tell if there's a next page
    const posts = await Post.find(query).sort(sort).limit(limit + 1);

    const hasMore = posts.length > limit;
    const pageItems = hasMore ? posts.slice(0, limit) : posts;

    let nextCursor = null;
    if (hasMore) {
      const last = pageItems[pageItems.length - 1];
      nextCursor = Buffer.from(
        JSON.stringify({ createdAt: last.createdAt, _id: last._id })
      ).toString("base64");
    }

    res.status(200).json({
      success: true,
      data: pageItems,
      pagination: { hasMore, nextCursor },
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

      if (
        post.authorId &&
        post.authorId.toString() !== userId.toString()
      ) {
        const createdNotification =
          await Notification.create({
            recipientId: normalizeObjectId(post.authorId),
            senderId: normalizeObjectId(userId),
            postId: post._id,
            type: "like",
            message: "liked your post.",
          });

        console.log(
          "Like notification created:",
          createdNotification._id.toString()
        );
      }
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

    const user = await auth.findById(req.userid);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if ((user.reputation || 0) < 50) {
      return res.status(403).json({
        success: false,
        message:
          "You need at least 50 reputation points to comment.",
      });
    }

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

    if (
      post.authorId.toString() !== req.userid.toString()
    ) {
      await Notification.create({
        recipientId: normalizeObjectId(post.authorId),
        senderId: normalizeObjectId(req.userid),
        postId: post._id,
        type: "comment",
        message: "commented on your post.",
      });
    }

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

    const user = await auth.findById(req.userid);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if ((user.reputation || 0) < 50) {
      return res.status(403).json({
        success: false,
        message:
          "You need at least 50 reputation points to reply to comments.",
      });
    }

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

    if (
      comment.userId.toString() !== req.userid.toString()
    ) {
      await Notification.create({
        recipientId: normalizeObjectId(comment.userId),
        senderId: normalizeObjectId(req.userid),
        postId: post._id,
        type: "reply",
        message: "replied to your comment.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Reply added successfully",
      data: post,
    });
  } catch (error) {
    console.error("Reply Comment Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Delete a post
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    if (
      post.authorId.toString() !== req.userid.toString()
    ) {
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

// Delete comment
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

// Delete reply
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

// Get single post
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

// Search community posts
export const searchPosts = async (req, res) => {
  try {
    const { q, type } = req.query;

    if (!q || !String(q).trim()) {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }

    const searchQuery = String(q).trim();

    const query = {
      $or: [
        {
          content: {
            $regex: searchQuery,
            $options: "i",
          },
        },
        {
          hashtags: {
            $regex: searchQuery,
            $options: "i",
          },
        },
      ],
    };

    // Apply post type filter only when provided
    if (type && type !== "All") {
      query.postType = type;
    }

    const posts = await Post.find(query)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (error) {
    console.error("Post Search Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while searching posts",
    });
  }
};