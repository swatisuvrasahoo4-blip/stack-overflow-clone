interface PostActionsProps {
  post: any;
  user: any;
  onDelete: (postId: string) => void;
  setSelectedPostId: any;
  setShowDeleteModal: any;
  onEdit: (post: any) => void;
}

export default function PostActions({
  post,
  user,
  onDelete,
  onEdit,
   setSelectedPostId,
  setShowDeleteModal,
}: PostActionsProps) {
  return (
    <>
      {String(user?.id || user?._id || user?.userId) ===
        String(post.authorId) && (

<div className="flex gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(post);
            }}
            className="text-blue-600 text-sm hover:underline"
          >
            Edit
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedPostId(post._id);
              setShowDeleteModal(true);
            }}
            className="text-red-600 text-sm hover:underline"
          >
            Delete
          </button>
        </div>
      )}
    </>
  );
}