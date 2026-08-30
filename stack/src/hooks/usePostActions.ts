import type { Dispatch, SetStateAction } from "react";

import type { Post, User } from "@/types/community";

import {
  toggleLikePost,
  toggleBookmarkPost,
  addComment,
  updatePost,
  deletePost,
  addReply,
  deleteComment,
} from "@/components/services/communityService";

import { shareCommunityPost } from "@/utils/communityUtils";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

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
  posts: Post[];

  setPosts: Dispatch<SetStateAction<Post[]>>;

  user: User | null;

  updateUser: (updatedUser: Partial<User>) => void;

  commentText: string;

  setCommentText: Dispatch<SetStateAction<string>>;

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

  editTagInput: string;

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

export default function usePostActions({
  posts,
  setPosts,
  user,
  updateUser,
  commentText,
  setCommentText,
  setActiveCommentPost,
  setEditingPost,
  editContent,
  setEditContent,
  editingPost,
  replyText,
  setReplyText,
  setActiveReplyComment,
  editHashtags,
  setEditHashtags,
  editTagInput,
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
}: UsePostActionsProps) {
  const router = useRouter();
  const { t } = useTranslation();

  const handleLike = async (
    postId: string
  ): Promise<void> => {
    if (!user) {
      toast.info(
        t("toast.please_login_to_continue")
      );

      router.push("/auth");
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
        t("toast.please_login_to_continue")
      );

      router.push("/auth");

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
        bookmarks: result.bookmarks,
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

      alert(
        apiError.response?.data
          ?.message ||
          t(
            "alert.unable_to_update_bookmark_please_try_again"
          )
      );

      return null;
    }
  };

  const handleComment = async (
    postId: string
  ): Promise<void> => {
    if (!commentText.trim()) {
      return;
    }

    try {
      const response =
        await addComment(postId, {
          text: commentText,
          userName:
            user?.name ||
            user?.username ||
            user?.email ||
            "",
        });

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
        "Add Comment Error:",
        error
      );
    }
  };

  const handleShare = async (
    postId: string
  ): Promise<void> => {
    if (!user) {
      toast.info(
        t("toast.please_login_to_continue")
      );

      router.push("/auth");

      return;
    }

    try {
      await shareCommunityPost(
        postId,
        t
      );
    } catch (error: unknown) {
      console.error(
        "Share Error:",
        error
      );
    }
  };

  const handleEdit = (
    post: Post
  ): void => {
    if (
      (user?.reputation || 0) < 100
    ) {
      alert(
        t(
          "alert.you_need_atleast_100_reputation_points_to_edit_community_posts"
        )
      );

      return;
    }

    setEditingPost(post);

    setEditContent(
      post.content || ""
    );

    setEditHashtags(
      Array.isArray(post.hashtags)
        ? post.hashtags.join(", ")
        : post.hashtags || ""
    );

    setEditTagInput("");

    setEditImage(null);

    setEditProjectTitle(
      post.projectTitle || ""
    );

    setEditProjectLink(
      post.projectLink || ""
    );

    setEditAchievementTitle(
      post.achievementTitle || ""
    );

    setEditAchievementDescription(
      post.achievementDescription ||
        ""
    );

    setEditCodeSnippet(
      post.codeSnippet || ""
    );
  };

  const handleSaveEdit =
    async (): Promise<void> => {
      if (!editingPost) {
        return;
      }

      if (!editContent.trim()) {
        alert(
          t(
            "alert.post_content_cannot_be_empty"
          )
        );

        return;
      }

      try {
        const formData =
          new FormData();

        formData.append(
          "content",
          editContent
        );

        formData.append(
  "postType",
  editingPost.postType ?? ""
);

        formData.append(
          "hashtags",
          editHashtags
        );

        formData.append(
          "codeSnippet",
          editCodeSnippet
        );

        formData.append(
          "projectTitle",
          editProjectTitle
        );

        formData.append(
          "projectLink",
          editProjectLink
        );

        formData.append(
          "achievementTitle",
          editAchievementTitle
        );

        formData.append(
          "achievementDescription",
          editAchievementDescription
        );

        if (editImage) {
          formData.append(
            "image",
            editImage
          );
        }

        const updatedPost =
          await updatePost(
            editingPost._id,
            formData
          );

        setPosts(
          (previousPosts) =>
            previousPosts.map(
              (post) =>
                post._id ===
                updatedPost._id
                  ? updatedPost
                  : post
            )
        );

        setEditingPost(null);

        setEditContent("");

        setEditHashtags("");

        setEditTagInput("");

        setEditImage(null);

        setEditProjectTitle("");

        setEditProjectLink("");

        setEditAchievementTitle("");

        setEditAchievementDescription(
          ""
        );

        setEditCodeSnippet("");
      } catch (error: unknown) {
        const apiError =
          error as ApiError;

        console.error(
          "Edit Post Error:",
          error
        );

        if (
          apiError.response?.status ===
          401
        ) {
          alert(
            t(
              "alert.your_session_has_expired_please_log_in_again"
            )
          );

          return;
        }

        if (
          apiError.response?.status ===
          403
        ) {
          alert(
            apiError.response?.data
              ?.message ||
              t(
                "alert.you_can_only_edit_your_own_post"
              )
          );

          return;
        }

        alert(
          apiError.response?.data
            ?.message ||
            t(
              "alert.something_went_wrong_while_updating_the_post"
            )
        );
      }
    };

  const handleDelete = async (
    postId: string
  ): Promise<void> => {
    try {
      await deletePost(postId);

      setPosts((previousPosts) =>
        previousPosts.filter(
          (post) =>
            post._id !== postId
        )
      );

      alert(
        t(
          "alert.post_deleted_successfully"
        )
      );
    } catch (error: unknown) {
      const apiError =
        error as ApiError;

      console.error(error);

      alert(
        apiError.response?.data
          ?.message ||
          t(
            "alert.unable_to_delete_the_post"
          )
      );
    }
  };

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
        "Add Reply Error:",
        error
      );
    }
  };

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
}