import React, {
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";

import PostActions from "./PostActions";
import CommentSection from "./CommentSection";
import type { Post, User } from "@/types/community";

import {
  Bookmark,
  ThumbsUp,
  Star,
  Send,
} from "lucide-react";

import MentionAvatar from "../mentions/MentionAvatar";
import { getImageUrl } from "@/lib/getImageUrl";
import Link from "next/link";

import ReportPostButton from "../reports/ReportPostButton";
import ReportPostModal from "../reports/ReportPostModal";

import {
  createReport,
  checkReportStatus,
} from "../services/reportService";

import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

interface SelectedComment {
  postId: string;
  commentId: string;
}

interface SelectedReply {
  postId: string;
  commentId: string;
  replyId: string;
}

interface PostCardProps {
  post: Post;
  user: User | null;

  handleLike: (
    postId: string
  ) => Promise<void>;

  handleBookmark: (
    post: Post
  ) => Promise<boolean | null>;

  handleComment: (
    postId: string
  ) => Promise<void>;

  handleReply: (
    postId: string,
    commentId: string
  ) => Promise<void>;

  handleDelete: (
    postId: string
  ) => Promise<void>;

  handleEdit: (
    post: Post
  ) => void;

  handleShare: (
    postId: string
  ) => Promise<void>;

  activeCommentPost: string | null;

  setActiveCommentPost: Dispatch<
    SetStateAction<string | null>
  >;

  commentText: string;

  setCommentText: Dispatch<
    SetStateAction<string>
  >;

  activeReplyComment: string | null;

  setActiveReplyComment: Dispatch<
    SetStateAction<string | null>
  >;

  replyText: string;

  setReplyText: Dispatch<
    SetStateAction<string>
  >;

  expandedComments: string[];

  setExpandedComments: Dispatch<
    SetStateAction<string[]>
  >;

  setSelectedPostId: Dispatch<
    SetStateAction<string | null>
  >;

  setShowDeleteModal: Dispatch<
    SetStateAction<boolean>
  >;

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

  isBookmarked?: boolean;

  editingPost?: Post | null;

  setEditingPost?: Dispatch<
    SetStateAction<Post | null>
  >;

  editContent?: string;

  setEditContent?: Dispatch<
    SetStateAction<string>
  >;

  handleSaveEdit?: () => Promise<void>;

  selectedPostId?: string | null;

  showDeleteModal?: boolean;

  selectedComment?: SelectedComment | null;

  showDeleteCommentModal?: boolean;
}

export default function PostCard({
  post,
  user,
  handleLike,
  handleEdit,
  handleShare,
  handleBookmark,
  handleComment,
  handleReply,
  handleDelete,
  activeCommentPost,
  setActiveCommentPost,
  commentText,
  setCommentText,
  expandedComments,
  setExpandedComments,
  activeReplyComment,
  setActiveReplyComment,
  replyText,
  setReplyText,
  setSelectedComment,
  setShowDeleteCommentModal,
  setSelectedReply,
  setShowDeleteReplyModal,
  setSelectedPostId,
  setShowDeleteModal,
  isBookmarked: initialBookmarked,
}: PostCardProps) {
  const { t } = useTranslation();
  const router = useRouter();

  const [isBookmarked, setIsBookmarked] =
    useState<boolean>(
      initialBookmarked ??
        post.isBookmarked ??
        user?.bookmarks?.some(
          (bookmarkId: string) =>
            String(bookmarkId) ===
            String(post._id)
        ) ??
        false
    );

  useEffect(() => {
    const bookmarked =
      user?.bookmarks?.some(
        (bookmarkId: string) =>
          String(bookmarkId) ===
          String(post._id)
      ) ?? false;

    setIsBookmarked(bookmarked);
  }, [user?.bookmarks, post._id]);

  const [showReportModal, setShowReportModal] =
    useState(false);

  const [isLiked, setIsLiked] =
    useState<boolean>(
      post.likes?.some(
        (likeUserId: string) =>
          String(likeUserId) ===
          String(
            user?.id ||
              user?._id ||
              user?.userId
          )
      ) ?? false
    );

  useEffect(() => {
    const liked =
      post.likes?.some(
        (likeUserId: string) =>
          String(likeUserId) ===
          String(
            user?.id ||
              user?._id ||
              user?.userId
          )
      ) ?? false;

    setIsLiked(liked);
  }, [
    post.likes,
    user?.id,
    user?._id,
    user?.userId,
  ]);

  const handleReportClick =
    async () => {
      if (!user) {
        toast.info(
          t(
            "toast.please_login_to_continue"
          )
        );

        void router.push("/auth");
        return;
      }

      const reputation =
        Number(
          user.reputation ?? 0
        );

      if (reputation < 500) {
        alert(
          t(
            `alert.you_need_atleast_least_500_reputation_points_to_report_inappropriate_content_your_current_reputation_is,${reputation}`
          )
        );

        return;
      }

      try {
        const response =
          await checkReportStatus(
            post._id
          );

        if (
          response.alreadyReported
        ) {
          alert(
            t(
              "alert.you_have_already_reported_this_post"
            )
          );

          return;
        }

        setShowReportModal(
          true
        );
      } catch (
        error: unknown
      ) {
        console.error(
          "Failed to check report status:",
          error
        );

        alert(
          t(
            "alert.failed_to_check_report_status"
          )
        );
      }
    };

  const handleLikeClick = (
    postId: string
  ) => {
    setIsLiked(
      (previous) => !previous
    );

    void handleLike(postId);
  };

  const hashtags: string[] =
    Array.isArray(
      post.hashtags
    )
      ? post.hashtags
          .flatMap(
            (tag: string) =>
              tag
                .split(
                  /[,\s]+/
                )
                .map(
                  (
                    value: string
                  ) =>
                    value.trim()
                )
          )
          .filter(Boolean)
      : typeof post.hashtags ===
        "string"
      ? post.hashtags
          .split(/[,\s]+/)
          .map(
            (
              tag: string
            ) =>
              tag.trim()
          )
          .filter(Boolean)
      : [];

  const currentUserId =
    user?.id ||
    user?._id ||
    user?.userId;

  return (
    <>
      <div
        className={`mb-4 rounded-lg border p-5 ${
          post.isFeatured
            ? "border-yellow-300 bg-yellow-50 shadow-sm"
            : "bg-white"
        }`}
      >
        <div className="flex items-start justify-between">
          <div>
            <Link
              href={`/users/${post.authorId}`}
              className="text-lg font-semibold hover:text-blue-600 hover:underline"
              onClick={(
                event
              ) =>
                event.stopPropagation()
              }
            >
              {post.authorName}
            </Link>

            <div className="flex items-center gap-2">
              <p className="text-xs font-medium text-blue-600">
                {
                  post.postType
                }
              </p>

              {post.isFeatured && (
                <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-800">
                  <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                  Featured
                </span>
              )}
            </div>

            <p className="text-xs text-gray-500">
              {new Date(
                post.createdAt
              ).toLocaleString()}

              {post.isEdited && (
                <span className="ml-2 italic text-gray-400">
                  {t(
                    "community.edited"
                  )}
                </span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {String(
              currentUserId
            ) !==
              String(
                post.authorId
              ) && (
              <ReportPostButton
                onClick={
                  handleReportClick
                }
              />
            )}

            <PostActions
              post={post}
              user={user}
              onDelete={
                handleDelete
              }
              onEdit={
                handleEdit
              }
              setSelectedPostId={
                setSelectedPostId
              }
              setShowDeleteModal={
                setShowDeleteModal
              }
            />
          </div>
        </div>

        <p className="mt-4">
          {post.content}
        </p>

        {post.postType ===
          "Project Showcase" &&
          post.projectTitle && (
            <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
              <h4 className="font-semibold text-blue-900">
                {
                  post.projectTitle
                }
              </h4>

              {post.projectLink && (
                <a
                  href={
                    post.projectLink
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(
                    event
                  ) =>
                    event.stopPropagation()
                  }
                  className="mt-2 inline-block rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
                >
                  View Project →
                </a>
              )}
            </div>
          )}

        {post.postType ===
          "Learning Achievement" &&
          post.achievementTitle && (
            <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4">
              <h4 className="font-semibold text-green-900">
                🏆{" "}
                {
                  post.achievementTitle
                }
              </h4>

              {post.achievementDescription && (
                <p className="mt-2 text-sm text-green-800">
                  {
                    post.achievementDescription
                  }
                </p>
              )}
            </div>
          )}

        {post.image && (
          <img
            src={getImageUrl(
              post.image
            )}
            alt="Post"
            className="mt-4 max-h-96 w-full rounded-lg object-cover"
          />
        )}

        {post.codeSnippet && (
          <pre className="mt-4 overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-green-400">
            <code>
              {
                post.codeSnippet
              }
            </code>
          </pre>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          {hashtags.map(
            (
              tag,
              index
            ) => (
              <span
                key={`${tag}-${index}`}
                className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-700"
              >
                #
                {tag.replace(
                  /^#/,
                  ""
                )}
              </span>
            )
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm text-gray-600 [&>button]:w-[calc(50%-0.25rem)] md:[&>button]:w-auto">
          <button
            type="button"
            className={`inline-flex cursor-pointer items-center gap-1 ${
              isLiked
                ? "text-blue-600"
                : ""
            }`}
            onClick={(
              event
            ) => {
              event.stopPropagation();

              handleLikeClick(
                post._id
              );
            }}
          >
            <ThumbsUp
              className="h-4 w-4"
              fill={
                isLiked
                  ? "currentColor"
                  : "none"
              }
            />

            {post.likes?.length ??
              0}{" "}
            {t(
              "community.like"
            )}
          </button>

          <button
            type="button"
            className="cursor-pointer"
            onClick={(
              event
            ) => {
              event.stopPropagation();

              if (!user) {
                toast.info(
                  t(
                    "toast.please_login_to_continue"
                  )
                );

                void router.push(
                  "/auth"
                );

                return;
              }

              setActiveCommentPost(
                activeCommentPost ===
                  post._id
                  ? null
                  : post._id
              );
            }}
          >
            💬{" "}
            {post.comments
              ?.length ?? 0}{" "}
            {t(
              "community.comment"
            )}
          </button>

          <button
            type="button"
            onClick={(
              event
            ) => {
              event.stopPropagation();

              void handleBookmark(
                post
              ).then(
                (
                  nextState
                ) => {
                  if (
                    nextState !==
                    null
                  ) {
                    setIsBookmarked(
                      nextState
                    );
                  }
                }
              );
            }}
            className={`inline-flex cursor-pointer items-center gap-1 ${
              isBookmarked
                ? "text-blue-600"
                : ""
            }`}
          >
            <Bookmark
              className="h-4 w-4"
              fill={
                isBookmarked
                  ? "currentColor"
                  : "none"
              }
            />

            {t(
              "community.bookmark"
            )}
          </button>

          <button
            type="button"
            className="inline-flex cursor-pointer items-center gap-1"
            onClick={(
              event
            ) => {
              event.stopPropagation();

              void handleShare(
                post._id
              );
            }}
          >
            <Send className="h-4 w-4" />

            {t(
              "community.share"
            )}
          </button>

          <MentionAvatar
            mentions={
              post.mentions ??
              []
            }
          />
        </div>

        {activeCommentPost ===
          post._id && (
          <div className="mt-4">
            <textarea
              onClick={(
                event
              ) =>
                event.stopPropagation()
              }
              value={
                commentText
              }
              onChange={(
                event
              ) => {
                setCommentText(
                  event.target
                    .value
                );
              }}
              placeholder="Write a comment..."
              className="w-full rounded-lg border p-2"
            />

            <button
              type="button"
              onClick={(
                event
              ) => {
                event.stopPropagation();

                if (!user) {
                  toast.info(
                    t(
                      "toast.please_login_to_continue"
                    )
                  );

                  void router.push(
                    "/auth"
                  );

                  return;
                }

                const reputation =
                  Number(
                    user.reputation ??
                      0
                  );

                if (
                  reputation < 50
                ) {
                  alert(
                    t(
                      `alert.you_need_atleast_50_reputation_points_to_comment_your_current_reputation_is, ${reputation}.`
                    )
                  );

                  return;
                }

                void handleComment(
                  post._id
                );
              }}
              className="mt-2 rounded-lg bg-blue-600 px-4 py-2 text-white"
            >
              {t(
                "community.comment"
              )}
            </button>
          </div>
        )}

        <CommentSection
          post={post}
          user={user}
          expandedComments={
            expandedComments
          }
          setExpandedComments={
            setExpandedComments
          }
          activeReplyComment={
            activeReplyComment
          }
          setActiveReplyComment={
            setActiveReplyComment
          }
          replyText={
            replyText
          }
          setReplyText={
            setReplyText
          }
          handleReply={
            handleReply
          }
          setSelectedComment={
            setSelectedComment
          }
          setShowDeleteCommentModal={
            setShowDeleteCommentModal
          }
          setSelectedReply={
            setSelectedReply
          }
          setShowDeleteReplyModal={
            setShowDeleteReplyModal
          }
        />
      </div>

      <ReportPostModal
        open={
          showReportModal
        }
        onClose={() =>
          setShowReportModal(
            false
          )
        }
        onSubmit={async (
          reason: string,
          details: string
        ) => {
          try {
            await createReport({
              postId:
                post._id,
              reason,
              details,
            });

            alert(
              t(
                "alert.post_reported_successfully"
              )
            );

            setShowReportModal(
              false
            );
          } catch (
            error: unknown
          ) {
            const message =
              error instanceof
              Error
                ? error.message
                : t(
                    "alert.failed_to_report_post"
                  );

            alert(message);
          }
        }}
      />
    </>
  );
}