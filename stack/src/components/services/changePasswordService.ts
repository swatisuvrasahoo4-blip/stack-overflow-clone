import axiosInstance from "@/lib/axiosinstance";

// Change user password
export const changePassword = async (
  currentPassword: string,
  newPassword: string,
  confirmPassword: string
) => {
  const response = await axiosInstance.put(
    "/change-password",
    {
      currentPassword,
      newPassword,
      confirmPassword,
    }
  );

  return response.data;
};