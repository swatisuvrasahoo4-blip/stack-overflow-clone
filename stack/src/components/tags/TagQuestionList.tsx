import { useRouter } from "next/router";

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

  if (questions.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      {/* Questions heading */}
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          Questions
        </h2>

        <span className="text-sm text-gray-500">
          {pagination.totalQuestions}{" "}
          {pagination.totalQuestions === 1
            ? "question"
            : "questions"}
        </span>
      </div>

      {/* Questions list */}
      <div className="space-y-4">
        {questions.map(
          (question) => (
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
                {
                  question.questiontitle
                }
              </h3>

              <p className="mt-2 line-clamp-2 text-sm text-gray-700">
                {
                  question.questionbody
                }
              </p>

              {/* Question tags */}
              <div className="mt-3 flex flex-wrap gap-2">
                {question.questiontags.map(
                  (questionTag) => (
                    <span
                      key={
                        questionTag
                      }
                      className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800"
                    >
                      {questionTag}
                    </span>
                  )
                )}
              </div>
            </button>
          )
        )}
      </div>

      {/* Load more */}
      {pagination.hasNextPage && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() =>
              void onLoadMore()
            }
            disabled={loadingMore}
            className="rounded-lg border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loadingMore
              ? "Loading..."
              : "Load more"}
          </button>
        </div>
      )}

      {/* End of questions */}
      {!pagination.hasNextPage &&
        pagination.totalQuestions >
          pagination.limit && (
          <p className="mt-6 text-center text-sm text-gray-400">
            No more questions.
          </p>
        )}
    </div>
  );
};

export default TagQuestionList;