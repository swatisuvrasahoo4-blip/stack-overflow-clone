"use client";

import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

import type { Question } from "@/types/questions";

interface SavedQuestionsListProps {
  questions: Question[];
}

const SavedQuestionsList = ({
  questions,
}: SavedQuestionsListProps) => {
  const router = useRouter();

  const { t } =
    useTranslation("questions");

  if (questions.length === 0) {
    return (
      <div className="text-gray-600">
        {t(
          "messages.no_saved_questions"
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {questions.map(
        (question) => (
          <div
            key={question._id}
            className="cursor-pointer rounded-lg border bg-white p-4 shadow-sm transition-all duration-200 hover:scale-[1.01]"
            onClick={() => {
              void router.push(
                `/questions/${question._id}`
              );
            }}
          >
            <Link
              href={`/questions/${question._id}`}
              className="text-lg font-semibold text-blue-600 hover:text-blue-800"
              onClick={(
                event
              ) =>
                event.stopPropagation()
              }
            >
              {question.questiontitle ||
                t(
                  "messages.no_title"
                )}
            </Link>

            <p className="mt-2 text-sm text-gray-700">
              {question.questionbody?.slice(
                0,
                200
              )}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {(
                question.questiontags ??
                []
              ).map(
                (
                  tag: string
                ) => (
                  <span
                    key={tag}
                    className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800"
                  >
                    {tag}
                  </span>
                )
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default SavedQuestionsList;