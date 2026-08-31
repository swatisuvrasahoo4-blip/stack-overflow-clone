import type {
  Dispatch,
  SetStateAction,
} from "react";

import type {
  Post,
  User,
} from "@/types/community";

import { updatePost } from "@/components/services/communityService";

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

interface UsePostEditActionsProps {
  setPosts: Dispatch<
    SetStateAction<Post[]>
  >;

  user: User | null;

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
}

const usePostEditActions = ({
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
}: UsePostEditActionsProps) => {
  const { t } = useTranslation();

  // Open edit modal
  const handleEdit = (
    post: Post
  ): void => {
    if (
      (user?.reputation ?? 0) < 100
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
      post.content ?? ""
    );

    setEditHashtags(
      Array.isArray(post.hashtags)
        ? post.hashtags.join(", ")
        : post.hashtags ?? ""
    );

    setEditTagInput("");

    setEditImage(null);

    setEditProjectTitle(
      post.projectTitle ?? ""
    );

    setEditProjectLink(
      post.projectLink ?? ""
    );

    setEditAchievementTitle(
      post.achievementTitle ?? ""
    );

    setEditAchievementDescription(
      post.achievementDescription ??
        ""
    );

    setEditCodeSnippet(
      post.codeSnippet ?? ""
    );
  };

  // Reset edit state
  const resetEditState = (): void => {
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
  };

  // Save edited post
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

        resetEditState();
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

  return {
    handleEdit,
    handleSaveEdit,
  };
};

export default usePostEditActions;