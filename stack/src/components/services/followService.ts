import axiosInstance from "@/lib/axiosinstance";

export const followUser = async (userId: string) => {
  const res = await axiosInstance.post(`/follow/${userId}`);
  return res.data.data;
};