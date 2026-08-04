import axiosinstance from "@/lib/axiosinstance";

export const changePassword = async (
  currentPassword: string,
  newPassword: string,
  confirmPassword: string
) => {
  const response = await axiosinstance.put("/change-password", {
    currentPassword,
    newPassword,
    confirmPassword,
  });

  return response.data;
};