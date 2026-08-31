import type {
  Dispatch,
  SetStateAction,
} from "react";

import type {
  Post,
  User,
} from "@/types/community";

import {
  addComment,
  addReply,
  deleteComment,
} from "@/components/services/communityService";

import { useTranslation } from "react-i18next";

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

interface UsePostCommentActionsProps {
  setPosts: Dispatch<
    SetStateAction<Post[]>
  >;

  user: User | null;

  commentText: string;

  setCommentText: Dispatch<
    SetStateAction<string>
  >;

  setActiveCommentPost: Dispatch<
    SetStateAction<string | null>
  >;

  replyText: string;

  setReplyText: Dispatch<
    SetStateAction<string>
  >;

  setActiveReplyComment: Dispatch<
    SetStateAction<string | null>
  >;
}

const usePostCommentActions = ({
  setPosts,
  user,
  commentText,
  setCommentText,
  setActiveCommentPost,
  replyText,
  setReplyText,
  setActiveReplyComment,
}: UsePostCommentActionsProps) => {
  const { t } = useTranslation();

  // Add comment
  const handleComment = async (
    postId: string
  ): Promise<void> => {
    if (!commentText.trim()) {
      return;
    }

    try {
      const response =
        await addComment(
          postId,
          {
            text: commentText,
            userName:
              user?.name ||
              user?.username ||
              user?.email ||
              "",
          }
        );

      const updatedPost =
        response?.data;

      if (updatedPost) {
        setPosts(
          (previousPosts) =>
            previousPosts.map(
              (post) =>
                post._id === postId
                  ? updatedPost
                  : post
            )
        );
      }

      setCommentText("");

      setActiveCommentPost(null);
    } catch (error: unknown) {
      console.error(
        "Add comment error:",
        error
      );
    }
  };

  // Add reply
  const handleReply = async (
    postId: string,
    commentId: string
  ): Promise<void> => {
    const reputation = Number(
      user?.reputation ?? 0
    );

    if (reputation < 50) {
      alert(
        t(
          `alert.you_need_atleast_50_reputation_points_to_reply_your_current_reputation_is ${reputation}`
        )
      );

      return;
    }

    if (!replyText.trim()) {
      return;
    }

    try {
      const response =
        await addReply(
          postId,
          commentId,
          {
            text: replyText,
            userName:
              user?.name ||
              user?.username ||
              user?.email ||
              "",
          }
        );

      const updatedPost =
        response?.data;

      if (updatedPost) {
        setPosts(
          (previousPosts) =>
            previousPosts.map(
              (post) =>
                post._id === postId
                  ? updatedPost
                  : post
            )
        );
      }

      setReplyText("");

      setActiveReplyComment(null);
    } catch (error: unknown) {
      console.error(
        "Add reply error:",
        error
      );
    }
  };

  // Delete comment
  const handleDeleteComment =
    async (
      postId: string,
      commentId: string
    ): Promise<void> => {
      try {
        const response =
          await deleteComment(
            postId,
            commentId
          );

        const updatedPost =
          response?.data;

        if (!updatedPost) {
          console.error(
            "Updated post missing from delete comment response:",
            response
          );

          return;
        }

        setPosts(
          (previousPosts) =>
            previousPosts.map(
              (post) =>
                post._id === postId
                  ? updatedPost
                  : post
            )
        );
      } catch (error: unknown) {
        const apiError =
          error as ApiError;

        console.error(
          "Delete comment error:",
          error
        );

        alert(
          apiError.response?.data
            ?.message ||
            t(
              "alert.unable_to_delete_comment"
            )
        );
      }
    };

  return {
    handleComment,
    handleReply,
    handleDeleteComment,
  };
};

export default usePostCommentActions;