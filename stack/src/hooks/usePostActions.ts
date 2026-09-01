import type {
  Dispatch,
  SetStateAction,
} from "react";

import type {
  Post,
  User,
} from "@/types/community";

import {
  toggleLikePost,
  toggleBookmarkPost,
  deletePost,
} from "@/components/services/communityService";

import { shareCommunityPost } from "@/utils/communityUtils";

import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import usePostEditActions from "@/hooks/usePostEditActions";
import usePostCommentActions from "@/hooks/usePostCommentActions";

interface ApiError {
  response?: {
    status?: number;
    data?: {
      message?: string;
    };
  };
  message?: string;
}

interface UsePostActionsProps {
  setPosts: Dispatch<
    SetStateAction<Post[]>
  >;

  user: User | null;

  updateUser: (
    updatedUser: Partial<User>
  ) => void;

  commentText: string;

  setCommentText: Dispatch<
    SetStateAction<string>
  >;

  setActiveCommentPost: Dispatch<
    SetStateAction<string | null>
  >;

  editingPost: Post | null;

  setEditingPost: Dispatch<
    SetStateAction<Post | null>
  >;

  editContent: string;

  setEditContent: Dispatch<
    SetStateAction<string>
  >;

  editHashtags: string;

  setEditHashtags: Dispatch<
    SetStateAction<string>
  >;

  setEditTagInput: Dispatch<
    SetStateAction<string>
  >;

  editImage: File | null;

  setEditImage: Dispatch<
    SetStateAction<File | null>
  >;

  editProjectTitle: string;

  setEditProjectTitle: Dispatch<
    SetStateAction<string>
  >;

  editProjectLink: string;

  setEditProjectLink: Dispatch<
    SetStateAction<string>
  >;

  editAchievementTitle: string;

  setEditAchievementTitle: Dispatch<
    SetStateAction<string>
  >;

  editAchievementDescription: string;

  setEditAchievementDescription: Dispatch<
    SetStateAction<string>
  >;

  editCodeSnippet: string;

  setEditCodeSnippet: Dispatch<
    SetStateAction<string>
  >;

  replyText: string;

  setReplyText: Dispatch<
    SetStateAction<string>
  >;

  setActiveReplyComment: Dispatch<
    SetStateAction<string | null>
  >;
}

const usePostActions = ({
  setPosts,
  user,
  updateUser,
  commentText,
  setCommentText,
  setActiveCommentPost,
  editingPost,
  setEditingPost,
  editContent,
  setEditContent,
  editHashtags,
  setEditHashtags,
  setEditTagInput,
  editImage,
  setEditImage,
  editProjectTitle,
  setEditProjectTitle,
  editProjectLink,
  setEditProjectLink,
  editAchievementTitle,
  setEditAchievementTitle,
  editAchievementDescription,
  setEditAchievementDescription,
  editCodeSnippet,
  setEditCodeSnippet,
  replyText,
  setReplyText,
  setActiveReplyComment,
}: UsePostActionsProps) => {
  const router = useRouter();

  const { t } =
    useTranslation("community");

  const {
    handleEdit,
    handleSaveEdit,
  } = usePostEditActions({
    setPosts,
    user,
    editingPost,
    setEditingPost,
    editContent,
    setEditContent,
    editHashtags,
    setEditHashtags,
    setEditTagInput,
    editImage,
    setEditImage,
    editProjectTitle,
    setEditProjectTitle,
    editProjectLink,
    setEditProjectLink,
    editAchievementTitle,
    setEditAchievementTitle,
    editAchievementDescription,
    setEditAchievementDescription,
    editCodeSnippet,
    setEditCodeSnippet,
  });

  const {
    handleComment,
    handleReply,
    handleDeleteComment,
  } = usePostCommentActions({
    setPosts,
    user,
    commentText,
    setCommentText,
    setActiveCommentPost,
    replyText,
    setReplyText,
    setActiveReplyComment,
  });

  const handleLike = async (
    postId: string
  ): Promise<void> => {
    if (!user) {
      toast.info(
        t(
          "messages.please_login_to_continue"
        )
      );

      void router.push("/auth");
      return;
    }

    try {
      const updatedPost =
        await toggleLikePost(postId);

      setPosts((previousPosts) =>
        previousPosts.map((post) =>
          post._id === postId
            ? updatedPost
            : post
        )
      );
    } catch (error: unknown) {
      console.error(
        "Like post error:",
        error
      );
    }
  };

  const handleBookmark = async (
    post: Post
  ): Promise<boolean | null> => {
    if (!user) {
      toast.info(
        t(
          "messages.please_login_to_continue"
        )
      );

      void router.push("/auth");
      return null;
    }

    const userId =
      user._id ||
      user.id ||
      user.userId;

    if (!userId) {
      return null;
    }

    try {
      const result =
        await toggleBookmarkPost(
          userId,
          post._id
        );

      updateUser({
        bookmarks:
          result.bookmarks,
      });

      if (
        result.message ===
        "Post bookmarked"
      ) {
        return true;
      }

      if (
        result.message ===
        "Bookmark removed"
      ) {
        return false;
      }

      return null;
    } catch (error: unknown) {
      const apiError =
        error as ApiError;

      console.error(
        "Bookmark post error:",
        apiError.response?.data
          ?.message || error
      );

      alert(
        t(
          "messages.unable_to_update_bookmark"
        )
      );

      return null;
    }
  };

  const handleShare = async (
    postId: string
  ): Promise<void> => {
    if (!user) {
      toast.info(
        t(
          "messages.please_login_to_continue"
        )
      );

      void router.push("/auth");
      return;
    }

    try {
      await shareCommunityPost(
        postId,
        t
      );
    } catch (error: unknown) {
      console.error(
        "Share error:",
        error
      );
    }
  };

  const handleDelete = async (
    postId: string
  ): Promise<void> => {
    try {
      await deletePost(postId);

      setPosts(
        (previousPosts) =>
          previousPosts.filter(
            (post) =>
              post._id !== postId
          )
      );

      alert(
        t(
          "messages.post_deleted_successfully"
        )
      );
    } catch (error: unknown) {
      const apiError =
        error as ApiError;

      console.error(
        "Delete post error:",
        apiError.response?.data
          ?.message || error
      );

      alert(
        t(
          "messages.unable_to_delete_post"
        )
      );
    }
  };

  return {
    handleLike,
    handleBookmark,
    handleComment,
    handleShare,
    handleEdit,
    handleSaveEdit,
    handleDelete,
    handleReply,
    handleDeleteComment,
  };
};

export default usePostActions;