import axiosInstance from "@/lib/axiosinstance";

export const getLoginActivity = async () => {
  const response = await axiosInstance.get("/admin/login-activity");

  return response.data;
};