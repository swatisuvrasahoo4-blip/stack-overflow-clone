import {
  type Dispatch,
  type SetStateAction,
} from "react";

import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

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

const CommentSection = ({
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
}: CommentSectionProps) => {
  const { t } = useTranslation("community");

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
          {(expandedComments.includes(post._id)
            ? comments
            : comments.slice(0, 2)
          ).map((comment) => (
            <div
              key={comment._id}
              className="rounded-lg border bg-gray-50 p-3"
            >
              {/* Comment content */}

              <p className="text-sm font-semibold">
                {comment.userName}
              </p>

              <p className="mt-1 text-gray-700">
                {comment.text}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                {new Date(
                  comment.createdAt
                ).toLocaleString()}
              </p>

              {/* Comment actions */}

              <div className="mt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();

                    if (!user) {
                      toast.info(
                        t(
                          "messages.please_login_to_continue"
                        )
                      );

                      void router.push("/auth");

                      return;
                    }

                    setActiveReplyComment(
                      activeReplyComment ===
                        comment._id
                        ? null
                        : comment._id
                    );
                  }}
                  className="text-xs text-blue-600 hover:underline"
                >
                  {t("actions.reply")}
                </button>

                {String(currentUserId) ===
                  String(comment.userId) && (
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();

                      setSelectedComment({
                        postId: post._id,
                        commentId:
                          comment._id,
                      });

                      setShowDeleteCommentModal(
                        true
                      );
                    }}
                    className="text-xs text-red-600 hover:underline"
                  >
                    {t("actions.delete")}
                  </button>
                )}
              </div>

              {/* Reply input */}

              {activeReplyComment ===
                comment._id && (
                <div className="mt-3">
                  <textarea
                    value={replyText}
                    onClick={(event) =>
                      event.stopPropagation()
                    }
                    onChange={(event) =>
                      setReplyText(
                        event.target.value
                      )
                    }
                    placeholder={t(
                      "placeholders.write_reply"
                    )}
                    className="w-full rounded-lg border p-2 text-sm"
                  />

                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();

                      void handleReply(
                        post._id,
                        comment._id
                      );
                    }}
                    className="mt-2 rounded-lg bg-blue-600 px-3 py-1 text-sm text-white"
                  >
                    {t("actions.post_reply")}
                  </button>
                </div>
              )}

              {/* Replies */}

              {comment.replies &&
                comment.replies.length >
                  0 && (
                  <div className="ml-6 mt-3 space-y-2">
                    {comment.replies.map(
                      (reply) => (
                        <div
                          key={reply._id}
                          className="rounded-lg border bg-white p-3"
                        >
                          <p className="text-sm font-semibold">
                            {reply.userName}
                          </p>

                          <p className="mt-1 text-sm text-gray-700">
                            {reply.text}
                          </p>

                          {/* Reply actions */}

                          {String(
                            currentUserId
                          ) ===
                            String(
                              reply.userId
                            ) && (
                            <button
                              type="button"
                              onClick={(
                                event
                              ) => {
                                event.stopPropagation();

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
                                "actions.delete"
                              )}
                            </button>
                          )}

                          <p className="mt-1 text-xs text-gray-500">
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

          {/* Comment visibility */}

          {comments.length > 2 && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();

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

                  return;
                }

                setExpandedComments([
                  ...expandedComments,
                  post._id,
                ]);
              }}
              className="text-sm text-blue-600 hover:underline"
            >
              {expandedComments.includes(
                post._id
              )
                ? t("actions.show_less")
                : `${t(
                    "actions.view_all"
                  )} ${
                    comments.length - 2
                  } ${
                    comments.length - 2 ===
                    1
                      ? t(
                          "labels.comment"
                        )
                      : t(
                          "labels.comments"
                        )
                  }`}
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default CommentSection;