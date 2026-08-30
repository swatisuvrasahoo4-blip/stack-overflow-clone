"use client";

import { ChevronUp, ChevronDown } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import { voteAnswer } from "./services/answerVoteService";
import { useTranslation } from "react-i18next";

interface AnswerVoteProps {
  questionId: string;
  answerId: string;
  upvotes: string[];
  downvotes: string[];
  currentUserId?: string;
  answerUserId: string;
  onVoteSuccess: (
    answerId: string,
    upvotes: string[],
    downvotes: string[]
  ) => void;
}

interface UpdatedAnswer {
  _id: string;
  upvote?: string[];
  downvote?: string[];
}

interface VoteResponse {
  data: {
    answer: UpdatedAnswer[];
  };
}

export default function AnswerVote({
  questionId,
  answerId,
  upvotes,
  downvotes,
  currentUserId,
  answerUserId,
  onVoteSuccess,
}: AnswerVoteProps) {
  const { t } = useTranslation();

  const hasUpvoted = currentUserId
    ? upvotes.includes(currentUserId)
    : false;

  const hasDownvoted = currentUserId
    ? downvotes.includes(currentUserId)
    : false;

  const score = upvotes.length - downvotes.length;

  const handleVote = async (
    voteType: "upvote" | "downvote"
  ) => {
    if (!currentUserId) {
      toast.error(t("toast.please_login_to_vote"));
      return;
    }

    if (String(currentUserId) === String(answerUserId)) {
      toast.error(
        t("toast.you_cannot_vote_on_your_own_answer")
      );
      return;
    }

    try {
      const response = (await voteAnswer(
        questionId,
        answerId,
        voteType
      )) as VoteResponse;

      const updatedAnswer = response.data.answer.find(
        (ans) =>
          String(ans._id) === String(answerId)
      );

      if (updatedAnswer) {
        onVoteSuccess(
          answerId,
          updatedAnswer.upvote || [],
          updatedAnswer.downvote || []
        );
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ||
            t("toast.failed_to_vote_on_answer")
        );
      } else {
        toast.error(
          t("toast.failed_to_vote_on_answer")
        );
      }
    }
  };

  return (
    <div className="flex sm:flex-col items-center justify-center gap-2 p-4 sm:px-5">
      <button
        type="button"
        onClick={() => handleVote("upvote")}
        className={`rounded-full p-2 transition-colors ${
          hasUpvoted
            ? "bg-orange-100 text-orange-600"
            : "text-gray-500 hover:bg-gray-100"
        }`}
        aria-label="Upvote answer"
      >
        <ChevronUp className="h-6 w-6" />
      </button>

      <span className="min-w-6 text-center text-lg font-semibold text-gray-700">
        {score}
      </span>

      <button
        type="button"
        onClick={() => handleVote("downvote")}
        className={`rounded-full p-2 transition-colors ${
          hasDownvoted
            ? "bg-blue-100 text-blue-600"
            : "text-gray-500 hover:bg-gray-100"
        }`}
        aria-label="Downvote answer"
      >
        <ChevronDown className="h-6 w-6" />
      </button>
    </div>
  );
}