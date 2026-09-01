"use client";

import type {
  Dispatch,
  SetStateAction,
} from "react";

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

  setQuestion: Dispatch<
    SetStateAction<Question | null>
  >;
}

const useQuestionActions = ({
  question,
  user,
  currentUserId,
  setQuestion,
}: UseQuestionActionsProps) => {
  const router = useRouter();

  const { t } =
    useTranslation("questions");

  const handleVote = async (
    vote: "upvote" | "downvote"
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

    const isOwnQuestion =
      String(question.userid) ===
      String(currentUserId);

    if (isOwnQuestion) {
      toast.info(
        t(
          "messages.cannot_vote_on_own_question"
        )
      );

      return;
    }

    try {
      const response =
        await voteQuestion(
          String(question._id),
          vote,
          String(currentUserId)
        );

      setQuestion(response.data);

      toast.success(
        t(
          "messages.vote_updated"
        )
      );
    } catch (error: unknown) {
      console.error(
        "Vote question error:",
        error
      );

      toast.error(
        t(
          "messages.failed_to_vote_question"
        )
      );
    }
  };

  const handleBookmark =
    async (): Promise<void> => {
      const userId =
        user?._id || user?.id;

      if (!userId) {
        toast.info(
          t(
            "messages.please_login_to_save_questions"
          )
        );

        void router.push("/auth");
        return;
      }

      const currentQuestionId =
        question._id;

      if (!currentQuestionId) {
        toast.error(
          t(
            "messages.question_id_not_found"
          )
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
              String(
                currentQuestionId
              )
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

        toast.success(
          isNowBookmarked
            ? t(
                "messages.question_bookmarked"
              )
            : t(
                "messages.question_bookmark_removed"
              )
        );
      } catch (error: unknown) {
        console.error(
          "Question bookmark error:",
          error
        );

        toast.error(
          t(
            "messages.unable_to_update_bookmark"
          )
        );
      }
    };

  const handleDelete = (): void => {
    if (!user) {
      toast.info(
        t(
          "messages.please_login_to_continue"
        )
      );

      void router.push("/");
      return;
    }

    const confirmed =
      window.confirm(
        t(
          "messages.confirm_delete_question"
        )
      );

    if (!confirmed) {
      return;
    }

    toast.success(
      t(
        "messages.question_deleted"
      )
    );

    void router.push("/");
  };

  const handleShare =
    async (): Promise<void> => {
      if (!user) {
        toast.info(
          t(
            "messages.please_login_to_continue"
          )
        );

        void router.push("/auth");
        return;
      }

      const shareUrl =
        window.location.href;

      try {
        if (navigator.share) {
          await navigator.share({
            title:
              question.questiontitle ||
              t(
                "share.default_title"
              ),

            text: t(
              "share.text"
            ),

            url: shareUrl,
          });
        } else {
          await navigator.clipboard.writeText(
            shareUrl
          );

          toast.success(
            t(
              "messages.question_link_copied"
            )
          );
        }
      } catch (error: unknown) {
        console.error(
          "Share question error:",
          error
        );
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