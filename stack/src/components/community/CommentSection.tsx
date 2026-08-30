import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { Dispatch, SetStateAction } from "react";

interface Reply {
  _id: string;
  userName: string;
  text: string;
  userId: string;
  createdAt: string;
}

interface Comment {
  _id: string;
  userName: string;
  text: string;
  userId: string;
  createdAt: string;
  replies?: Reply[];
}

interface Post {
  _id: string;
  comments?: Comment[];
}

interface SelectedComment {
  postId: string;
  commentId: string;
}

interface SelectedReply {
  postId: string;
  commentId: string;
  replyId: string;
}

interface CommentSectionProps {
  post: Post;
  user: {
    id?: string;
    _id?: string;
    userId?: string;
  } | null;

  expandedComments: string[];
  setExpandedComments: Dispatch<
    SetStateAction<string[]>
  >;

  activeReplyComment: string | null;
  setActiveReplyComment: Dispatch<
    SetStateAction<string | null>
  >;

  replyText: string;
  setReplyText: Dispatch<
    SetStateAction<string>
  >;

  handleReply: (
    postId: string,
    commentId: string
  ) => void | Promise<void>;

  setSelectedComment: Dispatch<
    SetStateAction<SelectedComment | null>
  >;

  setShowDeleteCommentModal: Dispatch<
    SetStateAction<boolean>
  >;

  setSelectedReply: Dispatch<
    SetStateAction<SelectedReply | null>
  >;

  setShowDeleteReplyModal: Dispatch<
    SetStateAction<boolean>
  >;
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
  const { t } = useTranslation();
  const router = useRouter();

  const comments = post.comments ?? [];

  const currentUserId =
    user?.id ||
    user?._id ||
    user?.userId;

  return (
    <>
      {comments.length > 0 && (
        <div className="mt-4 space-y-3">
          {(
            expandedComments.includes(
              post._id
            )
              ? comments
              : comments.slice(0, 2)
          ).map((comment) => (
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
                {new Date(
                  comment.createdAt
                ).toLocaleString()}
              </p>

              <div className="flex items-center gap-3 mt-2">
                {/* REPLY BUTTON */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();

                    if (!user) {
                      toast.info(
                        t(
                          "toast.please_login_to_continue"
                        )
                      );

                      router.push("/auth");
                      return;
                    }

                    setActiveReplyComment(
                      activeReplyComment ===
                        comment._id
                        ? null
                        : comment._id
                    );
                  }}
                  className="text-blue-600 text-xs hover:underline"
                >
                  {t("community.reply")}
                </button>

                {/* DELETE COMMENT */}
                {String(currentUserId) ===
                  String(comment.userId) && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();

                      setSelectedComment({
                        postId: post._id,
                        commentId:
                          comment._id,
                      });

                      setShowDeleteCommentModal(
                        true
                      );
                    }}
                    className="text-red-600 text-xs hover:underline"
                  >
                    {t("community.delete")}
                  </button>
                )}
              </div>

              {/* REPLY INPUT */}
              {activeReplyComment ===
                comment._id && (
                <div className="mt-3">
                  <textarea
                    value={replyText}
                    onClick={(e) =>
                      e.stopPropagation()
                    }
                    onChange={(e) =>
                      setReplyText(
                        e.target.value
                      )
                    }
                    placeholder="Write a reply..."
                    className="w-full border rounded-lg p-2 text-sm"
                  />

                  <button
                    onClick={(e) => {
                      e.stopPropagation();

                      handleReply(
                        post._id,
                        comment._id
                      );
                    }}
                    className="mt-2 bg-blue-600 text-white px-3 py-1 rounded-lg text-sm"
                  >
                    {t(
                      "community.postReply"
                    )}
                  </button>
                </div>
              )}

              {/* REPLIES */}
              {comment.replies &&
                comment.replies.length > 0 && (
                  <div className="ml-6 mt-3 space-y-2">
                    {comment.replies.map(
                      (reply) => (
                        <div
                          key={reply._id}
                          className="bg-white border rounded-lg p-3"
                        >
                          <p className="font-semibold text-sm">
                            {
                              reply.userName
                            }
                          </p>

                          <p className="text-gray-700 text-sm mt-1">
                            {reply.text}
                          </p>

                          {String(
                            currentUserId
                          ) ===
                            String(
                              reply.userId
                            ) && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();

                                setSelectedReply(
                                  {
                                    postId:
                                      post._id,
                                    commentId:
                                      comment._id,
                                    replyId:
                                      reply._id,
                                  }
                                );

                                setShowDeleteReplyModal(
                                  true
                                );
                              }}
                              className="mt-1 text-xs text-red-600 hover:underline"
                            >
                              {t(
                                "community.delete"
                              )}
                            </button>
                          )}

                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(
                              reply.createdAt
                            ).toLocaleString()}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                )}
            </div>
          ))}

          {/* VIEW ALL / SHOW LESS */}
          {comments.length > 2 && (
            <button
              onClick={(e) => {
                e.stopPropagation();

                if (
                  expandedComments.includes(
                    post._id
                  )
                ) {
                  setExpandedComments(
                    expandedComments.filter(
                      (id) =>
                        id !== post._id
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
              {expandedComments.includes(
                post._id
              )
                ? t("community.showLess")
                : `${t(
                    "community.viewAll"
                  )} ${
                    comments.length - 2
                  } ${t(
                    "community.comment"
                  )}`}
            </button>
          )}
        </div>
      )}
    </>
  );
}
