"use client";

import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import {
  toggleQuestionBookmark,
  voteQuestion,
} from "@/components/services/questionService";

import type { Question } from "@/types/questions";

interface User {
  _id?: string;
  id?: string;
  name?: string;
  reputation?: number;
  profilePhoto?: string;
}

interface UseQuestionActionsProps {
  question: Question;
  user: User | null;
  currentUserId?: string;
  setQuestion: React.Dispatch<
    React.SetStateAction<Question | null>
  >;
}

const useQuestionActions = ({
  question,
  user,
  currentUserId,
  setQuestion,
}: UseQuestionActionsProps) => {
  const router = useRouter();
  const { t } = useTranslation();

  const handleVote = async (
    vote: "upvote" | "downvote"
  ) => {
    if (!user) {
      toast.info(
        t("toast.please_login_to_continue")
      );

      router.push("/auth");
      return;
    }

    const isOwnQuestion =
      String(question.userid) ===
      String(currentUserId);

    if (isOwnQuestion) {
      toast.info(
        t(
          "toast.you_cannot_vote_on_your_own_question"
        )
      );

      return;
    }

    try {
      const response = await voteQuestion(
        String(question._id),
        vote,
        String(currentUserId)
      );

      setQuestion(response.data);

      toast.success(
        t("toast.vote_updated")
      );
    } catch (error: unknown) {
      console.error(error);

      toast.error(
        t("toast.failed_to_vote_question")
      );
    }
  };

  const handleBookmark = async () => {
    const userId =
      user?._id || user?.id;

    if (!userId) {
      toast.info(
        t(
          "toast.please_login_to_save_questions"
        )
      );

      router.push("/auth");
      return;
    }

    const currentQuestionId =
      question._id;

    if (!currentQuestionId) {
      toast.error(
        t("toast.question_id_not_found")
      );

      return;
    }

    try {
      const result =
        await toggleQuestionBookmark(
          String(userId),
          String(currentQuestionId)
        );

      const updatedBookmarks =
        result.questionBookmarks || [];

      const isNowBookmarked =
        updatedBookmarks.some(
          (id: string) =>
            String(id) ===
            String(currentQuestionId)
        );

      setQuestion((prev) =>
        prev
          ? {
              ...prev,
              isBookmarked:
                isNowBookmarked,
            }
          : prev
      );

      toast.success(result.message);
    } catch (error: unknown) {
      if (
        error &&
        typeof error === "object" &&
        "response" in error
      ) {
        const axiosError = error as {
          response?: {
            data?: {
              message?: string;
            };
          };
        };

        toast.error(
          axiosError.response?.data
            ?.message ||
            t(
              "toast.unable_to_update_bookmark"
            )
        );
      } else {
        toast.error(
          t(
            "toast.unable_to_update_bookmark"
          )
        );
      }
    }
  };

  const handleDelete = () => {
    if (!user) {
      toast.info(
        t("toast.please_login_to_continue")
      );

      router.push("/");
      return;
    }

    const confirmed =
      window.confirm(
        t(
          "window.are_you_sure_you_want_to_delete_this_question"
        )
      );

    if (!confirmed) {
      return;
    }

    toast.success(
      t("toast.question_deleted")
    );

    router.push("/");
  };

  const handleShare = async () => {
    if (!user) {
      toast.info(
        t("toast.please_login_to_continue")
      );

      router.push("/auth");
      return;
    }

    const shareUrl =
      window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title:
            question.questiontitle ||
            "Question",
          text:
            "Check out this question on CodeQuest",
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(
          shareUrl
        );

        toast.success(
          t(
            "toast.question_link_copied"
          )
        );
      }
    } catch (error: unknown) {
      console.log(error);
    }
  };

  return {
    handleVote,
    handleBookmark,
    handleDelete,
    handleShare,
  };
};

export default useQuestionActions;