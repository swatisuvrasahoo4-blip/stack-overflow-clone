"use client";

import {
  Dispatch,
  SetStateAction,
} from "react";

import {
  Bookmark,
  Send,
  ThumbsUp,
} from "lucide-react";

import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import MentionAvatar from "../../mentions/MentionAvatar";

import type {
  Post,
  User,
} from "@/types/community";

interface PostInteractionsProps {
  post: Post;
  user: User | null;
  isLiked: boolean;
  isBookmarked: boolean;

  setIsLiked: Dispatch<
    SetStateAction<boolean>
  >;

  setIsBookmarked: Dispatch<
    SetStateAction<boolean>
  >;

  handleLike: (
    postId: string
  ) => Promise<void>;

  handleBookmark: (
    post: Post
  ) => Promise<boolean | null>;

  handleShare: (
    postId: string
  ) => Promise<void>;

  activeCommentPost:
    | string
    | null;

  setActiveCommentPost: Dispatch<
    SetStateAction<string | null>
  >;
}

const PostInteractions = ({
  post,
  user,
  isLiked,
  isBookmarked,
  setIsLiked,
  setIsBookmarked,
  handleLike,
  handleBookmark,
  handleShare,
  activeCommentPost,
  setActiveCommentPost,
}: PostInteractionsProps) => {
  const { t } =
    useTranslation("community");

  const router =
    useRouter();

  const handleLikeClick = () => {
    setIsLiked(
      (previous) => !previous
    );

    void handleLike(post._id);
  };

  const handleCommentClick = () => {
    if (!user) {
      toast.info(
        t(
          "messages.please_login_to_continue"
        )
      );

      void router.push("/auth");

      return;
    }

    setActiveCommentPost(
      activeCommentPost === post._id
        ? null
        : post._id
    );
  };

  const handleBookmarkClick = () => {
    void handleBookmark(post).then(
      (nextState) => {
        if (nextState !== null) {
          setIsBookmarked(
            nextState
          );
        }
      }
    );
  };

  const handleShareClick = () => {
    void handleShare(post._id);
  };

  const commentCount =
    post.comments?.length ?? 0;

  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm text-gray-600 [&>button]:w-[calc(50%-0.25rem)] md:[&>button]:w-auto">
      {/* Like */}

      <button
        type="button"
        className={`inline-flex cursor-pointer items-center gap-1 ${
          isLiked
            ? "text-blue-600"
            : ""
        }`}
        onClick={(event) => {
          event.stopPropagation();
          handleLikeClick();
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

        {post.likes?.length ?? 0}{" "}
        {t("actions.like")}
      </button>

      {/* Comment */}

      <button
        type="button"
        className="cursor-pointer"
        onClick={(event) => {
          event.stopPropagation();
          handleCommentClick();
        }}
      >
        💬 {commentCount}{" "}
        {commentCount === 1
          ? t("labels.comment")
          : t("labels.comments")}
      </button>

      {/* Bookmark */}

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          handleBookmarkClick();
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

        {t("actions.bookmark")}
      </button>

      {/* Share */}

      <button
        type="button"
        className="inline-flex cursor-pointer items-center gap-1"
        onClick={(event) => {
          event.stopPropagation();
          handleShareClick();
        }}
      >
        <Send className="h-4 w-4" />

        {t("actions.share")}
      </button>

      {/* User mentions */}

      <MentionAvatar
        mentions={
          post.mentions ?? []
        }
      />
    </div>
  );
};

export default PostInteractions;