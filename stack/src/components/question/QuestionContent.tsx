"use client";

import {
  Share,
  Trash,
} from "lucide-react";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";

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
  const { t } = useTranslation([
    "questions",
    "community",
  ]);

  return (
    <div className="min-w-0 flex-1 p-4 sm:p-5">
      {/* Question Body */}

      <div className="prose mb-6 max-w-none">
        <div
          className="leading-relaxed text-gray-800"
          dangerouslySetInnerHTML={{
            __html: questionBody || "",
          }}
        />
      </div>

      {/* Tags */}

      <div className="mb-6 flex flex-wrap gap-2">
        {questionTags.map((tag) => (
          <Link
            key={tag}
            href={`/tags/${tag}`}
          >
            <Badge
              variant="secondary"
              className="cursor-pointer bg-blue-100 text-blue-800 hover:bg-blue-200"
            >
              {tag}
            </Badge>
          </Link>
        ))}
      </div>

      {/* Question Actions */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-start">
        <div className="flex gap-2">
          <Button
            onClick={onShare}
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-gray-800"
          >
            <Share className="mr-1 h-4 w-4" />

            {t("actions.share", {
              ns: "community",
            })}
          </Button>

          <ReportQuestionButton
            questionId={questionId}
            reputation={reputation}
          />

          {hasMounted &&
            isOwnQuestion && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onDelete}
                className="text-red-600 hover:text-red-800"
              >
                <Trash className="mr-1 h-4 w-4" />

                {t("actions.delete", {
                  ns: "community",
                })}
              </Button>
            )}
        </div>

        {/* Question User */}

        <div className="flex items-center gap-2 text-sm sm:ml-auto">
          <span className="text-gray-600">
            {t("labels.asked", {
              ns: "questions",
            })}{" "}
            {askedOn &&
            !isNaN(
              new Date(
                askedOn
              ).getTime()
            )
              ? new Date(askedOn)
                  .toISOString()
                  .split("T")[0]
              : t(
                  "messages.date_unavailable",
                  {
                    ns: "questions",
                  }
                )}
          </span>

          <Link
            href={`/users/${userId}`}
            className="flex items-center gap-2 rounded p-2 hover:bg-blue-50"
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-sm">
                {userPosted
                  ?.charAt(0)
                  .toUpperCase() ||
                  "U"}
              </AvatarFallback>
            </Avatar>

            <div>
              <div className="font-medium text-blue-600 hover:text-blue-800">
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