"use client";

import { Bookmark, History } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuestionActionsProps {
  isBookmarked: boolean;
  onBookmark: () => void;
}

const QuestionActions = ({
  isBookmarked,
  onBookmark,
}: QuestionActionsProps) => {
  return (
    <div className="flex sm:flex-col gap-2 sm:gap-4 mt-4 sm:mt-6">
      <Button
        variant="ghost"
        size="sm"
        className={`p-2 ${
          isBookmarked
            ? "text-yellow-500"
            : "text-gray-600 hover:text-yellow-500"
        }`}
        onClick={onBookmark}
      >
        <Bookmark
          className="w-5 h-5"
          fill={isBookmarked ? "currentColor" : "none"}
        />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="p-2 text-gray-600 hover:text-gray-800"
      >
        <History className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default QuestionActions;