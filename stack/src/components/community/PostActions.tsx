import { useTranslation } from "react-i18next";
import type { Post, User } from "@/types/community";

interface PostActionsProps {
  post: Post;
  user: User | null;
  onDelete: (postId: string) => void;
  setSelectedPostId: (id: string | null) => void;
  setShowDeleteModal: (show: boolean) => void;
  onEdit: (post: Post) => void;
}

export default function PostActions({
  post,
  user,
  onDelete,
  onEdit,
  setSelectedPostId,
  setShowDeleteModal,
}: PostActionsProps) {
  const { t } = useTranslation();

  const currentUserId =
    user?.id || user?._id || user?.userId;

  const postAuthorId =
    post.authorId || post.userId || post.userid;

  return (
    <>
      {String(currentUserId) === String(postAuthorId) && (
        <div className="flex gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(post);
            }}
            className="text-blue-600 text-sm hover:underline"
          >
            {t("community.edit")}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedPostId(post._id);
              setShowDeleteModal(true);
            }}
            className="text-red-600 text-sm hover:underline"
          >
            {t("community.delete")}
          </button>
        </div>
      )}
    </>
  );
}