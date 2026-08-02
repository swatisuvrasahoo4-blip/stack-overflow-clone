import axiosInstance from "@/lib/axiosinstance";

export const getNotifications = async () => {
  const response = await axiosInstance.get("/notification");
  return response.data;
};

export const markNotificationAsRead = async (
  notificationId: string
) => {
  const response = await axiosInstance.patch(
    `/notification/${notificationId}/read`
  );

  return response.data;
};

export const markAllNotificationsAsRead = async () => {
  const response = await axiosInstance.patch(
    "/notification/read-all"
  );

  return response.data;
};

export const deleteNotification = async (
  notificationId: string
) => {
  const response = await axiosInstance.delete(
    `/notification/${notificationId}`
  );

  return response.data;
};