import axiosInstance from "@/lib/axiosinstance";

// Follow user
export const followUser = async (userId: string) => {
  const response = await axiosInstance.post(`/follow/${userId}`);

  return response.data.data;
};

// Unfollow user
export const unfollowUser = async (userId: string) => {
  const response = await axiosInstance.delete(`/follow/${userId}`);

  return response.data;
};

// Get follow status
export const getFollowStatus = async (userId: string) => {
  const response = await axiosInstance.get(`/follow/${userId}`);

  return response.data.isFollowing;
};

// Get follower and following counts
export const getFollowCounts = async (userId: string) => {
  const response = await axiosInstance.get(`/follow/count/${userId}`);

  return response.data;
};

// Get followers
export const getFollowers = async (userId: string) => {
  const response = await axiosInstance.get(
    `/follow/followers/${userId}`
  );

  return response.data.followers;
};

// Get following users
export const getFollowing = async (userId: string) => {
  const response = await axiosInstance.get(
    `/follow/following/${userId}`
  );

  return response.data.following;
};