import axiosInstance from "@/lib/axiosinstance";

export const getPosts = async () => {
  const res = await axiosInstance.get("/post");
  return res.data.data;
};
export const toggleLikePost = async (postId: string) => {
  const res = await axiosInstance.put(`/post/like/${postId}`);
  return res.data.data;
};
export const deletePost = async (postId: string) => {
  const res = await axiosInstance.delete(`/post/${postId}`);
  return res.data;
};

export const updatePost = async (
  postId: string,
  postData: any
) => {
  const res = await axiosInstance.put(
    `/post/${postId}`,
    postData
  );

  return res.data.data;
};

export const createPost = async (postData: any) => {
  const res = await axiosInstance.post("/post/create", postData);
  return res.data;
};
export const addComment = async (
  postId: string,
  commentData: any
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
  replyData: any
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
  const res = await axiosInstance.post("/bookmark/toggle", {
    userId,
    postId,
  });

  return res.data;
};
export const getBookmarkedPosts = async (userId: string) => {
  const res = await axiosInstance.get(`/bookmark/${userId}`);
  return res.data.bookmarks;
};