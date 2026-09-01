import { useTranslation } from "react-i18next";

import type {
  Post,
  User,
} from "@/types/community";

interface PostActionsProps {
  post: Post;
  user: User | null;

  setSelectedPostId: (
    id: string | null
  ) => void;

  setShowDeleteModal: (
    show: boolean
  ) => void;

  onEdit: (
    post: Post
  ) => void;
}

const PostActions = ({
  post,
  user,
  onEdit,
  setSelectedPostId,
  setShowDeleteModal,
}: PostActionsProps) => {
  const { t } =
    useTranslation("community");

  const currentUserId =
    user?.id ||
    user?._id ||
    user?.userId;

  const postAuthorId =
    post.authorId ||
    post.userId ||
    post.userid;

  const isPostOwner =
    String(currentUserId) ===
    String(postAuthorId);

  if (!isPostOwner) {
    return null;
  }

  return (
    <div className="flex gap-3">
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onEdit(post);
        }}
        className="text-sm text-blue-600 hover:underline"
      >
        {t("actions.edit")}
      </button>

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();

          setSelectedPostId(
            post._id
          );

          setShowDeleteModal(
            true
          );
        }}
        className="text-sm text-red-600 hover:underline"
      >
        {t("actions.delete")}
      </button>
    </div>
  );
};

export default PostActions;