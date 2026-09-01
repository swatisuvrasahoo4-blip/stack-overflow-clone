import type {
  Dispatch,
  SetStateAction,
} from "react";

import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

import { Badge } from "@/components/ui/badge";

import type { User } from "@/types/community";
import type { NormalizedQuestion } from "@/hooks/useQuestionsFeed";

interface QuestionListProps {
  items: NormalizedQuestion[];
  user: User | null;

  setSelectedQuestion: Dispatch<
    SetStateAction<
      NormalizedQuestion | null
    >
  >;

  setEditTitle: Dispatch<
    SetStateAction<string>
  >;

  setEditContent: Dispatch<
    SetStateAction<string>
  >;

  setEditTags: Dispatch<
    SetStateAction<string[]>
  >;

  setShowEditModal: Dispatch<
    SetStateAction<boolean>
  >;

  setSelectedQuestionId: Dispatch<
    SetStateAction<string | null>
  >;

  setShowDeleteModal: Dispatch<
    SetStateAction<boolean>
  >;
}

const QuestionList = ({
  items,
  user,
  setSelectedQuestion,
  setEditTitle,
  setEditContent,
  setEditTags,
  setShowEditModal,
  setSelectedQuestionId,
  setShowDeleteModal,
}: QuestionListProps) => {
  const router = useRouter();

  const { t } = useTranslation([
    "questions",
    "answers",
    "community",
  ]);

  const handleOpenQuestion = (
    questionId: string
  ): void => {
    sessionStorage.setItem(
      "questionSelectedId",
      questionId
    );

    void router.push(
      `/questions/${questionId}`
    );
  };

  const handleOpenEdit = (
    question: NormalizedQuestion
  ): void => {
    setSelectedQuestion(
      question
    );

    setEditTitle(
      question.title
    );

    setEditContent(
      question.content
    );

    setEditTags(
      question.tags
    );

    setShowEditModal(
      true
    );
  };

  const handleOpenDelete = (
    questionId: string
  ): void => {
    setSelectedQuestionId(
      questionId
    );

    setShowDeleteModal(
      true
    );
  };

  return (
    <div className="space-y-4">
      {items.map(
        (question) => (
          <div
            key={question.id}
            id={`question-${question.id}`}
            onClick={() =>
              handleOpenQuestion(
                question.id
              )
            }
            className="cursor-pointer rounded-lg border bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
          >
            {/* Question header */}

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
              <Link
                href={`/questions/${question.id}`}
                onClick={(
                  event
                ) => {
                  event.stopPropagation();

                  sessionStorage.setItem(
                    "questionSelectedId",
                    question.id
                  );
                }}
                className="text-blue-600 hover:underline"
              >
                {
                  question.title
                }
              </Link>

              <div className="text-sm text-gray-600">
                {
                  question.answers
                }{" "}
                {question.answers ===
                1
                  ? t(
                      "labels.answer",
                      {
                        ns: "answers",
                      }
                    )
                  : t(
                      "labels.answers",
                      {
                        ns: "answers",
                      }
                    )}{" "}
                ·{" "}
                {
                  question.views
                }{" "}
                {t(
                  "labels.views",
                  {
                    ns: "questions",
                  }
                )}
              </div>
            </div>

            {/* Question content */}

            <p className="mt-2 line-clamp-2 text-gray-700">
              {
                question.content
              }
            </p>

            {/* Owner actions */}

            {question.authorId ===
              user?._id && (
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={(
                    event
                  ) => {
                    event.stopPropagation();

                    handleOpenEdit(
                      question
                    );
                  }}
                  className="text-sm text-blue-600 transition hover:underline"
                >
                  {t(
                    "actions.edit",
                    {
                      ns: "community",
                    }
                  )}
                </button>

                <button
                  type="button"
                  onClick={(
                    event
                  ) => {
                    event.stopPropagation();

                    handleOpenDelete(
                      question.id
                    );
                  }}
                  className="text-sm text-red-600 transition hover:underline"
                >
                  {t(
                    "actions.delete",
                    {
                      ns: "community",
                    }
                  )}
                </button>
              </div>
            )}

            {/* Question tags */}

            <div className="mt-3 flex flex-wrap gap-2">
              {question.tags.map(
                (tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-blue-100 text-blue-800"
                  >
                    {tag}
                  </Badge>
                )
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default QuestionList;