import axiosInstance from "@/lib/axiosinstance";

type UpdatePostData = {
  content?: string;
  postType?: string;
  hashtags?: string | string[];
  codeSnippet?: string;
  projectTitle?: string;
  projectLink?: string;
  achievementTitle?: string;
  achievementDescription?: string;
  image?: File;
};

interface CommentData {
  text: string;
  userName: string;
}

interface ReplyData {
  text: string;
  userName: string;
}

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
    params.set(
      "followingIds",
      followingIds.join(",")
    );
  }

  const res = await axiosInstance.get(
    `/post?${params.toString()}`
  );

  return res.data;
};

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

  const res = await axiosInstance.get(
    `/post/search?${params.toString()}`
  );

  return res.data;
};

export const toggleLikePost = async (
  postId: string
) => {
  const res = await axiosInstance.put(
    `/post/like/${postId}`
  );

  return res.data.data;
};

export const deletePost = async (
  postId: string
) => {
  const res = await axiosInstance.delete(
    `/post/${postId}`
  );

  return res.data;
};

export const updatePost = async (
  postId: string,
  postData: FormData
) => {
  const res = await axiosInstance.put(
    `/post/${postId}`,
    postData
  );

  return res.data.data;
};

export const createPost = async (
  postData: FormData
) => {
  const res = await axiosInstance.post(
    "/post/create",
    postData
  );

  return res.data;
};

export const addComment = async (
  postId: string,
  commentData: CommentData
) => {
  const res = await axiosInstance.post(
    `/post/comment/${postId}`,
    commentData
  );

  return res.data;
};

export const addReply = async (
  postId: string,
  commentId: string,
  replyData: ReplyData
) => {
  const res = await axiosInstance.post(
    `/post/reply/${postId}/${commentId}`,
    replyData
  );

  return res.data;
};

export const deleteComment = async (
  postId: string,
  commentId: string
) => {
  const res = await axiosInstance.delete(
    `/post/${postId}/comment/${commentId}`
  );

  return res.data;
};

export const deleteReply = async (
  postId: string,
  commentId: string,
  replyId: string
) => {
  const res = await axiosInstance.delete(
    `/post/${postId}/comment/${commentId}/reply/${replyId}`
  );

  return res.data;
};

export const toggleBookmarkPost = async (
  userId: string,
  postId: string
) => {
  const res = await axiosInstance.post(
    "/bookmark/toggle",
    {
      userId,
      postId,
    }
  );

  console.log(
    "BOOKMARK API RESPONSE:",
    res.data
  );

  return res.data;
};

export const getBookmarkedPosts = async (
  userId: string
) => {
  const res = await axiosInstance.get(
    `/bookmark/${userId}`
  );

  return res.data.bookmarks;
};
