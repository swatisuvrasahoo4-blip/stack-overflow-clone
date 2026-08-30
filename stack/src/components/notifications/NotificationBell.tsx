import { Bell, Trash2 } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import axios from "axios";

import {
  deleteNotification,
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/components/services/notificationService";

interface NotificationUser {
  _id?: string;
  name?: string;
  username?: string;
  avatar?: string;
  profilePhoto?: string;
}

interface NotificationPost {
  _id?: string;
  content?: string;
}

interface NotificationItem {
  _id: string;
  type: "like" | "comment" | "reply" | "mention" | "follow";
  message: string;
  isRead: boolean;
  createdAt: string;
  senderId?: NotificationUser;
  postId?: NotificationPost | string | null;
}

export default function NotificationBell() {
  const router = useRouter();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  
useEffect(() => {
    setMounted(true);
  }, []);
  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.isRead).length,
    [notifications]
  );

  const fetchNotifications = async () => {
    try {
      setLoading(true);

      const response = await getNotifications();

      setNotifications(response.notifications || []);
    } catch (error: unknown) {
  if (
    !axios.isAxiosError(error) ||
    error.response?.status !== 401
  ) {
    console.error(
      "Failed to fetch notifications:",
      error
    );
  }
}finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  if (!user) {
    setNotifications([]);
    return;
  }

  fetchNotifications();
}, [user]);

  const handleNotificationClick = async (
    notification: NotificationItem
  ) => {
    try {
      if (!notification.isRead) {
        await markNotificationAsRead(notification._id);

        setNotifications((previousNotifications) =>
          previousNotifications.map((item) =>
            item._id === notification._id
              ? { ...item, isRead: true }
              : item
          )
        );
      }

      setOpen(false);

      if (
        notification.type === "follow" &&
        notification.senderId?._id
      ) {
        await router.push(`/users/${notification.senderId._id}`);
        return;
      }

      const postId =
        typeof notification.postId === "string"
          ? notification.postId
          : notification.postId?._id;

      if (postId) {
        await router.push(`/community/${postId}`);
      }
    } catch (error) {
      console.error("Failed to open notification:", error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsAsRead();

      setNotifications((previousNotifications) =>
        previousNotifications.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );
    } catch (error) {
      console.error("Failed to mark notifications as read:", error);
    }
  };

  const handleDelete = async (
    event: React.MouseEvent<HTMLButtonElement>,
    notificationId: string
  ) => {
    event.stopPropagation();

    try {
      await deleteNotification(notificationId);

      setNotifications((previousNotifications) =>
        previousNotifications.filter(
          (notification) => notification._id !== notificationId
        )
      );
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  if(!setMounted){
    return null;
  }
  
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((previousOpen) => !previousOpen)}
        className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-xs font-semibold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-lg border bg-white shadow-xl sm:w-96">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <h3 className="font-semibold">Notifications</h3>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-xs font-medium text-blue-600 hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <p className="px-4 py-6 text-center text-sm text-gray-500">
                Loading notifications...
              </p>
            ) : notifications.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-gray-500">
                No notifications yet.
              </p>
            ) : (
              notifications.map((notification) => {
                const senderName =
                  notification.senderId?.name ||
                  notification.senderId?.username ||
                  "Someone";

                return (
                  <div
                    role="button"
                    key={notification._id}
                    onClick={() =>
                      handleNotificationClick(notification)
                    }
                    className={`flex w-full items-start gap-3 border-b px-4 py-3 text-left hover:bg-gray-50 ${
                      notification.isRead ? "bg-white" : "bg-blue-50"
                    }`}
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
                      {senderName.charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-800">
                        <span className="font-semibold">{senderName}</span>{" "}
                        {notification.message}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={(event) =>
                        handleDelete(event, notification._id)
                      }
                      className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-red-600"
                      aria-label="Delete notification"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}