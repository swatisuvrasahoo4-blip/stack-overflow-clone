interface CommentSectionProps {
  post: any;
  user: any;

  expandedComments: any[];
  setExpandedComments: any;

  activeReplyComment: any;
  setActiveReplyComment: any;

  replyText: string;
  setReplyText: any;

  handleReply: any;

  setSelectedComment: any;
  setShowDeleteCommentModal: any;

  setSelectedReply: any;
  setShowDeleteReplyModal: any;
}

export default function CommentSection({
  post,
  user,
  expandedComments,
  setExpandedComments,
  activeReplyComment,
  setActiveReplyComment,
  replyText,
  setReplyText,
  handleReply,
  setSelectedComment,
  setShowDeleteCommentModal,
  setSelectedReply,
  setShowDeleteReplyModal,
}: CommentSectionProps) {
  return (
    <>
    {post.comments?.length > 0 && (
  <div className="mt-4 space-y-3">
    {(
      expandedComments.includes(post._id)
        ? post.comments
        : post.comments.slice(0, 2)
    ).map((comment: any) => (
      <div
        key={comment._id}
        className="border rounded-lg p-3 bg-gray-50"
      >
        <p className="font-semibold text-sm">
          {comment.userName}
        </p>
        <p className="text-gray-700 mt-1">
          {comment.text}
        </p>

        <p className="text-xs text-gray-500 mt-1">
          {new Date(comment.createdAt).toLocaleString()}
        </p>

       <div className="flex items-center gap-3 mt-2">
  <button
    onClick={(e) =>{
      e.stopPropagation();
      setActiveReplyComment(
        activeReplyComment === comment._id
          ? null
          : comment._id
      )
    }}
    className="text-blue-600 text-xs hover:underline"
  >
    Reply
  </button>

  {String(user?.id || user?._id || user?.userId) ===
    String(comment.userId) && (
    <button
      onClick={(e) => {
        e.stopPropagation();
  setSelectedComment({
    postId: post._id,
    commentId: comment._id,
  });

  setShowDeleteCommentModal(true);
}}
      className="text-red-600 text-xs hover:underline"
    >
      Delete
    </button>
  )}
</div>

{activeReplyComment === comment._id && (
  <div className="mt-3">
    <textarea
      value={replyText}
      onChange={(e) => setReplyText(e.target.value)}
      placeholder="Write a reply..."
      className="w-full border rounded-lg p-2 text-sm"
    />

    <button
      onClick={(e) =>{
        e.stopPropagation();
        handleReply(post._id, comment._id)
      }}
      className="mt-2 bg-blue-600 text-white px-3 py-1 rounded-lg text-sm"
    >
      Post Reply
    </button>
  </div>
)}

        {comment.replies?.length > 0 && (
          <div className="ml-6 mt-3 space-y-2">
            {comment.replies.map((reply: any) => (
              <div
                key={reply._id}
                className="bg-white border rounded-lg p-3"
              >
                <p className="font-semibold text-sm">
                  {reply.userName}
                </p>

                <p className="text-gray-700 text-sm mt-1">
                  {reply.text}
                </p>
                {String(user?.id || user?._id || user?.userId) ===
  String(reply.userId) && (
  <button
    onClick={(e) => {
      e.stopPropagation();
  setSelectedReply({
    postId: post._id,
    commentId: comment._id,
    replyId: reply._id,
  });

  setShowDeleteReplyModal(true);
}}
    className="mt-1 text-xs text-red-600 hover:underline"
  >
    Delete
  </button>
)}

                <p className="text-xs text-gray-500 mt-1">
                  {new Date(reply.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    ))}

    {post.comments.length > 2 && (
      <button
        onClick={() => {
          if (expandedComments.includes(post._id)) {
            setExpandedComments(
              expandedComments.filter(
                (id) => id !== post._id
              )
            );
          } else {
            setExpandedComments([
              ...expandedComments,
              post._id,
            ]);
          }
        }}
        className="text-blue-600 text-sm hover:underline"
      >
        {expandedComments.includes(post._id)
          ? "Show less"
          : `View all ${post.comments.length} comments`}
      </button>
    )}
  </div>
)}
    </>
  );
}

