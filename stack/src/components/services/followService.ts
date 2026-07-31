import axiosInstance from "@/lib/axiosinstance";

export const followUser = async (userId: string) => {
  const res = await axiosInstance.post(`/follow/${userId}`);
  return res.data.data;
};
export const unfollowUser = async (userId: string) => {
  const res = await axiosInstance.delete(`/follow/${userId}`);
  return res.data;
};
export const getFollowStatus = async (userId: string) => {
  const res = await axiosInstance.get(`/follow/${userId}`);
  return res.data.isFollowing;
};
export const getFollowCounts = async (userId: string) => {
  const res = await axiosInstance.get(`/follow/count/${userId}`);
  return res.data;
};
export const getFollowers = async (userId: string) => {
  const res = await axiosInstance.get(`/follow/followers/${userId}`);
  return res.data.followers;
};
export const getFollowing = async (userId: string) => {
  const res = await axiosInstance.get(`/follow/following/${userId}`);
  return res.data.following;
};