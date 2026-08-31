import axiosInstance from "@/lib/axiosinstance";

interface CommentData {
  text: string;
  userName: string;
}

interface ReplyData {
  text: string;
  userName: string;
}

// Fetch posts
export const getPosts = async (
  feed: "trending" | "following",
  cursor: string | null = null,
  limit = 10,
  followingIds: string[] = []
) => {
  const params = new URLSearchParams({
    feed,
    limit: String(limit),
  });

  if (cursor) {
    params.set("cursor", cursor);
  }

  if (feed === "following") {
    params.set("followingIds", followingIds.join(","));
  }

  const response = await axiosInstance.get(
    `/post?${params.toString()}`
  );

  return response.data;
};

// Search posts
export const searchPosts = async (
  query: string,
  type: string = "All",
  cursor: string | null = null,
  limit = 10
) => {
  const params = new URLSearchParams({
    q: query,
    limit: String(limit),
  });

  if (type && type !== "All") {
    params.set("type", type);
  }

  if (cursor) {
    params.set("cursor", cursor);
  }

  const response = await axiosInstance.get(
    `/post/search?${params.toString()}`
  );

  return response.data;
};

// Like or unlike post
export const toggleLikePost = async (
  postId: string
) => {
  const response = await axiosInstance.put(
    `/post/like/${postId}`
  );

  return response.data.data;
};

// Delete post
export const deletePost = async (
  postId: string
) => {
  const response = await axiosInstance.delete(
    `/post/${postId}`
  );

  return response.data;
};

// Update post
export const updatePost = async (
  postId: string,
  postData: FormData
) => {
  const response = await axiosInstance.put(
    `/post/${postId}`,
    postData
  );

  return response.data.data;
};

// Create post
export const createPost = async (
  postData: FormData
) => {
  const response = await axiosInstance.post(
    "/post/create",
    postData
  );

  return response.data;
};

// Add comment
export const addComment = async (
  postId: string,
  commentData: CommentData
) => {
  const response = await axiosInstance.post(
    `/post/comment/${postId}`,
    commentData
  );

  return response.data;
};

// Add reply
export const addReply = async (
  postId: string,
  commentId: string,
  replyData: ReplyData
) => {
  const response = await axiosInstance.post(
    `/post/reply/${postId}/${commentId}`,
    replyData
  );

  return response.data;
};

// Delete comment
export const deleteComment = async (
  postId: string,
  commentId: string
) => {
  const response = await axiosInstance.delete(
    `/post/${postId}/comment/${commentId}`
  );

  return response.data;
};

// Delete reply
export const deleteReply = async (
  postId: string,
  commentId: string,
  replyId: string
) => {
  const response = await axiosInstance.delete(
    `/post/${postId}/comment/${commentId}/reply/${replyId}`
  );

  return response.data;
};

// Toggle post bookmark
export const toggleBookmarkPost = async (
  userId: string,
  postId: string
) => {
  const response = await axiosInstance.post(
    "/bookmark/toggle",
    {
      userId,
      postId,
    }
  );

  return response.data;
};

// Fetch bookmarked posts
export const getBookmarkedPosts = async (
  userId: string
) => {
  const response = await axiosInstance.get(
    `/bookmark/${userId}`
  );

  return response.data.bookmarks;
};