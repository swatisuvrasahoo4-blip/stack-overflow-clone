import axiosInstance from "@/lib/axiosinstance";

// Get notifications
export const getNotifications = async () => {
  const response = await axiosInstance.get("/notification");

  return response.data;
};

// Mark notification as read
export const markNotificationAsRead = async (
  notificationId: string
) => {
  const response = await axiosInstance.patch(
    `/notification/${notificationId}/read`
  );

  return response.data;
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async () => {
  const response = await axiosInstance.patch(
    "/notification/read-all"
  );

  return response.data;
};

// Delete notification
export const deleteNotification = async (
  notificationId: string
) => {
  const response = await axiosInstance.delete(
    `/notification/${notificationId}`
  );

  return response.data;
};