interface PostActionsProps {
  post: any;
  user: any;
  onDelete: (postId: string) => void;
  setSelectedPostId: any;
  setShowDeleteModal: any;
}

export default function PostActions({
  post,
  user,
  onDelete,
   setSelectedPostId,
  setShowDeleteModal,
}: PostActionsProps) {
  return (
    <>
      {String(user?.id || user?._id || user?.userId) ===
        String(post.authorId) && (
        <button
  onClick={() => {
    setSelectedPostId(post._id);
    setShowDeleteModal(true);
  }}
  className="text-red-600 text-sm hover:underline"
>
  Delete
</button>
      )}
    </>
  );
}