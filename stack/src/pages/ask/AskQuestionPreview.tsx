import { useTranslation } from "react-i18next";

interface AskQuestionPreviewProps {
  title: string;
  body: string;
  tags: string[];
  onPost: () => void | Promise<void>;
  onEdit: () => void;
}

const AskQuestionPreview = ({
  title,
  body,
  tags,
  onPost,
  onEdit,
}: AskQuestionPreviewProps) => {
  const { t } =
    useTranslation("questions");

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm sm:p-5">
      {/* Preview heading */}
      <h3 className="mb-3 text-lg font-medium">
        {t("ask_question.preview")}
      </h3>

      {/* Question content */}
      <div className="mb-3">
        <h4 className="font-semibold">
          {title ||
            t(
              "ask_question.no_title"
            )}
        </h4>

        <p className="mt-2 whitespace-pre-wrap text-gray-700">
          {body ||
            t(
              "ask_question.no_details_provided"
            )}
        </p>
      </div>

      {/* Question tags */}
      <div className="mb-4">
        {(tags ?? []).map((tag) => (
          <span
            key={tag}
            className="mr-2 inline-flex items-center rounded bg-blue-100 px-2 py-1 text-sm text-blue-800"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Preview actions */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() =>
            void onPost()
          }
          className="w-full rounded bg-green-600 px-4 py-2 text-white sm:w-auto"
        >
          {t(
            "ask_question.post_question"
          )}
        </button>

        <button
          type="button"
          onClick={onEdit}
          className="w-full rounded border px-4 py-2 sm:w-auto"
        >
          {t(
            "ask_question.edit"
          )}
        </button>
      </div>
    </div>
  );
};

export default AskQuestionPreview;