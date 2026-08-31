import axiosInstance from "@/lib/axiosinstance";

// Send forgot password request
export const forgotPassword = async (
  email: string,
  username: string
) => {
  const response = await axiosInstance.post(
    "/forgot-password",
    {
      email,
      username,
    }
  );

  return response.data;
};