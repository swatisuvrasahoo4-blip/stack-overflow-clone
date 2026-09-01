import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

import type {
  TagPagination,
  TagQuestion,
} from "@/components/services/tagService";

interface TagQuestionListProps {
  questions: TagQuestion[];
  pagination: TagPagination;
  loadingMore: boolean;
  onLoadMore: () => void | Promise<void>;
}

const TagQuestionList = ({
  questions,
  pagination,
  loadingMore,
  onLoadMore,
}: TagQuestionListProps) => {
  const router = useRouter();
  const { t } = useTranslation("tag");

  if (questions.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          {t("labels.questions")}
        </h2>

        <span className="text-sm text-gray-500">
          {pagination.totalQuestions}{" "}
          {pagination.totalQuestions === 1
            ? t("labels.question")
            : t("labels.questions_lowercase")}
        </span>
      </div>

      <div className="space-y-4">
        {questions.map((question) => (
          <button
            key={question._id}
            type="button"
            onClick={() =>
              void router.push(
                `/questions/${question._id}`
              )
            }
            className="block w-full rounded-lg border bg-white p-4 text-left shadow-sm transition hover:shadow-md"
          >
            <h3 className="font-medium text-blue-600 hover:underline">
              {question.questiontitle}
            </h3>

            <p className="mt-2 line-clamp-2 text-sm text-gray-700">
              {question.questionbody}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {question.questiontags.map(
                (questionTag) => (
                  <span
                    key={questionTag}
                    className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800"
                  >
                    {questionTag}
                  </span>
                )
              )}
            </div>
          </button>
        ))}
      </div>

      {pagination.hasNextPage && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => void onLoadMore()}
            disabled={loadingMore}
            className="rounded-lg border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loadingMore
              ? t("status.loading")
              : t("actions.load_more")}
          </button>
        </div>
      )}

      {!pagination.hasNextPage &&
        pagination.totalQuestions >
          pagination.limit && (
          <p className="mt-6 text-center text-sm text-gray-400">
            {t("messages.no_more_questions")}
          </p>
        )}
    </div>
  );
};

export default TagQuestionList;