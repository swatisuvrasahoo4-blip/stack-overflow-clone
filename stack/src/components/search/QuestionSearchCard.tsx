import { useRouter } from "next/router";
import type { Question } from "@/types/questions";
import { useTranslation } from "react-i18next";

interface QuestionSearchCardProps {
  question: Question;
}

const QuestionSearchCard = ({
  question,
}: QuestionSearchCardProps) => {
  const router = useRouter();
  const { t } = useTranslation();

  const questionId = question._id;

  const handleClick = (): void => {
    if (!questionId) {
      return;
    }

    void router.push(
      `/questions/${questionId}`
    );
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer rounded-lg border bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <h2 className="font-medium text-blue-600 hover:underline">
          {question.questiontitle ||
            t("search.no_title")}
        </h2>

        <div className="flex-shrink-0 text-sm text-gray-600">
          {question.noofanswer ??
            question.answer?.length ??
            0}{" "}
          {t("search.answers")} ·{" "}
          {question.views ?? 0}{" "}
          {t("search.views")}
        </div>
      </div>

      <p className="mt-2 line-clamp-2 text-sm text-gray-700">
        {question.questionbody ?? ""}
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {(question.questiontags ?? []).map(
          (tag) => (
            <span
              key={tag}
              className="rounded bg-blue-100 px-2 py-1 text-sm text-blue-800"
            >
              {tag}
            </span>
          )
        )}
      </div>
    </div>
  );
};

export default QuestionSearchCard;