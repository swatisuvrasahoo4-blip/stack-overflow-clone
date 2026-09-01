import Notification from "../models/notification.js";
import { normalizeObjectId } from "./objectId.js";

// Create a single post notification
export const createPostNotification = async ({
  recipientId,
  senderId,
  postId,
  type,
  message,
}) => {
  return Notification.create({
    recipientId: normalizeObjectId(recipientId),
    senderId: normalizeObjectId(senderId),
    postId,
    type,
    message,
  });
};

// Create mention notifications
export const createMentionNotifications = async ({
  mentions,
  authorId,
  postId,
}) => {
  const notifications = mentions
    .filter(
      (mentionedUser) =>
        mentionedUser.userId.toString() !==
        authorId.toString()
    )
    .map((mentionedUser) => ({
      recipientId: normalizeObjectId(
        mentionedUser.userId
      ),
      senderId: normalizeObjectId(authorId),
      postId,
      type: "mention",
      message: "mentioned you in a post.",
    }));

  if (notifications.length === 0) {
    return;
  }

  await Notification.insertMany(
    notifications
  );
};