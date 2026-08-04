import axiosinstance from "@/lib/axiosinstance";

export const forgotPassword = async (
  email: string,
  username: string
) => {
  const response = await axiosinstance.post("/forgot-password", {
    email,
    username,
  });

  return response.data;
};