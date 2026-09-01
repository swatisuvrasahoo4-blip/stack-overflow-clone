"use client";

import {
  Bookmark,
  History,
} from "lucide-react";

import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";

interface QuestionActionsProps {
  isBookmarked: boolean;
  onBookmark: () => void;
}

const QuestionActions = ({
  isBookmarked,
  onBookmark,
}: QuestionActionsProps) => {
  const { t } =
    useTranslation("questions");

  return (
    <div className="mt-4 flex gap-2 sm:mt-6 sm:flex-col sm:gap-4">
      <Button
        variant="ghost"
        size="sm"
        className={`p-2 ${
          isBookmarked
            ? "text-yellow-500"
            : "text-gray-600 hover:text-yellow-500"
        }`}
        onClick={onBookmark}
        aria-label={
          isBookmarked
            ? t(
                "accessibility.remove_bookmark"
              )
            : t(
                "accessibility.bookmark_question"
              )
        }
      >
        <Bookmark
          className="h-5 w-5"
          fill={
            isBookmarked
              ? "currentColor"
              : "none"
          }
        />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="p-2 text-gray-600 hover:text-gray-800"
        aria-label={t(
          "accessibility.question_history"
        )}
      >
        <History className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default QuestionActions;