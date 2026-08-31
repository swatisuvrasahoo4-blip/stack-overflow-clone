"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface QuestionVoteProps {
  upvotes: string[];
  downvotes: string[];
  currentUserId?: string;
  onVote: (vote: "upvote" | "downvote") => void;
}

const QuestionVote = ({
  upvotes,
  downvotes,
  currentUserId,
  onVote,
}: QuestionVoteProps) => {
  const { t } = useTranslation();

  const hasUpvoted = currentUserId
    ? upvotes.some(
        (id) => String(id) === String(currentUserId)
      )
    : false;

  const hasDownvoted = currentUserId
    ? downvotes.some(
        (id) => String(id) === String(currentUserId)
      )
    : false;

  const score = upvotes.length - downvotes.length;

  return (
    <div className="flex sm:flex-col items-center sm:items-center p-4 sm:p-6 border-b sm:border-b-0 sm:border-r border-gray-200">
      <Button
        variant="ghost"
        size="sm"
        className={`p-2 ${
          hasUpvoted
            ? "text-orange-500 bg-orange-50"
            : "text-gray-600 hover:text-orange-500"
        }`}
        onClick={() => onVote("upvote")}
        aria-label={t("community.upvote")}
      >
        <ChevronUp className="w-6 h-6" />
      </Button>

      <span>
        {score}
      </span>

      <Button
        variant="ghost"
        size="sm"
        className={`p-2 ${
          hasDownvoted
            ? "text-orange-500 bg-orange-50"
            : "text-gray-600 hover:text-orange-500"
        }`}
        onClick={() => onVote("downvote")}
        aria-label={t("community.downvote")}
      >
        <ChevronDown className="w-6 h-6" />
      </Button>
    </div>
  );
};

export default QuestionVote;