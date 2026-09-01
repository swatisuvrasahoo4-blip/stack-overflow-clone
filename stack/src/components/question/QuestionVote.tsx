"use client";

import {
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface QuestionVoteProps {
  upvotes: string[];
  downvotes: string[];
  currentUserId?: string;
  onVote: (
    vote: "upvote" | "downvote"
  ) => void;
}

const QuestionVote = ({
  upvotes,
  downvotes,
  currentUserId,
  onVote,
}: QuestionVoteProps) => {
  const { t } =
    useTranslation("questions");

  const hasUpvoted =
    currentUserId
      ? upvotes.some(
          (id) =>
            String(id) ===
            String(currentUserId)
        )
      : false;

  const hasDownvoted =
    currentUserId
      ? downvotes.some(
          (id) =>
            String(id) ===
            String(currentUserId)
        )
      : false;

  const score =
    upvotes.length -
    downvotes.length;

  return (
    <div className="flex items-center border-b border-gray-200 p-4 sm:flex-col sm:items-center sm:border-b-0 sm:border-r sm:p-6">
      <Button
        variant="ghost"
        size="sm"
        className={`p-2 ${
          hasUpvoted
            ? "bg-orange-50 text-orange-500"
            : "text-gray-600 hover:text-orange-500"
        }`}
        onClick={() =>
          onVote("upvote")
        }
        aria-label={t(
          "accessibility.upvote_question"
        )}
      >
        <ChevronUp className="h-6 w-6" />
      </Button>

      <span>{score}</span>

      <Button
        variant="ghost"
        size="sm"
        className={`p-2 ${
          hasDownvoted
            ? "bg-orange-50 text-orange-500"
            : "text-gray-600 hover:text-orange-500"
        }`}
        onClick={() =>
          onVote("downvote")
        }
        aria-label={t(
          "accessibility.downvote_question"
        )}
      >
        <ChevronDown className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default QuestionVote;