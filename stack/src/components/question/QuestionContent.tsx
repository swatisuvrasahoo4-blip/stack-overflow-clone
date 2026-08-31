"use client";

import { Flag, Share, Trash } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useTranslation } from "react-i18next";
import ReportQuestionButton from "../reports/ReportQuestionButton";

interface QuestionContentProps {
  questionBody: string;
  questionTags: string[];
  askedOn?: string;
  userPosted?: string;
  userId: string;
  questionId: string;
  reputation: number;
  isOwnQuestion: boolean;
  hasMounted: boolean;
  onShare: () => void;
  onDelete: () => void;
}

const QuestionContent = ({
  questionBody,
  questionTags,
  askedOn,
  userPosted,
  userId,
  questionId,
  reputation,
  isOwnQuestion,
  hasMounted,
  onShare,
  onDelete,
}: QuestionContentProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex-1 p-4 sm:p-6">
      {/* Question Body */}

      <div className="prose max-w-none mb-6">
        <div
          className="text-gray-800 leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: questionBody || "",
          }}
        />
      </div>

      {/* Tags */}

      <div className="flex flex-wrap gap-2 mb-6">
        {questionTags.map((tag) => (
          <Link
            key={tag}
            href={`/tags/${tag}`}
          >
            <Badge
              variant="secondary"
              className="bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer"
            >
              {tag}
            </Badge>
          </Link>
        ))}
      </div>

      {/* Question Actions */}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex gap-2">
          <Button
            onClick={onShare}
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-gray-800"
          >
            <Share className="w-4 h-4 mr-1" />
            {t("community.share")}
          </Button>

          <ReportQuestionButton
            questionId={questionId}
            reputation={reputation}
          />

          {hasMounted && isOwnQuestion && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="text-red-600 hover:text-red-800"
            >
              <Trash className="w-4 h-4 mr-1" />
              {t("community.delete")}
            </Button>
          )}
        </div>

        {/* Question User */}

        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-600">
            {t("community.asked")}{" "}
            {askedOn &&
            !isNaN(new Date(askedOn).getTime())
              ? new Date(askedOn)
                  .toISOString()
                  .split("T")[0]
              : "Date unavailable"}
          </span>

          <Link
            href={`/users/${userId}`}
            className="flex items-center gap-2 hover:bg-blue-50 p-2 rounded"
          >
            <Avatar className="w-8 h-8">
              <AvatarFallback className="text-sm">
                {userPosted
                  ?.charAt(0)
                  .toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>

            <div>
              <div className="text-blue-600 hover:text-blue-800 font-medium">
                {userPosted}
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default QuestionContent;