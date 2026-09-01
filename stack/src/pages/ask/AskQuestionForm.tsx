import type {
  KeyboardEvent,
} from "react";

import { useTranslation } from "react-i18next";

interface AskQuestionFormProps {
  title: string;
  setTitle: (value: string) => void;
  body: string;
  setBody: (value: string) => void;
  tags: string[];
  tagInput: string;
  setTagInput: (value: string) => void;
  addTag: (value: string) => void;
  removeTag: (tag: string) => void;
  handleKeyDown: (
    event: KeyboardEvent<HTMLInputElement>
  ) => void;
  onReview: () => void;
  onCancel: () => void;
}

const AskQuestionForm = ({
  title,
  setTitle,
  body,
  setBody,
  tags,
  tagInput,
  setTagInput,
  addTag,
  removeTag,
  handleKeyDown,
  onReview,
  onCancel,
}: AskQuestionFormProps) => {
  const { t } =
    useTranslation("questions");

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm sm:p-5">
        <h2 className="mb-2 text-xl font-medium">
          {t("ask_question.title")}
        </h2>

        <p className="mb-3 text-sm text-gray-600">
          {t(
            "ask_question.summarize_your_problem_in_a_single_sentence"
          )}
        </p>

        <input
          type="text"
          value={title}
          onChange={(event) =>
            setTitle(
              event.target.value
            )
          }
          placeholder={t(
            "ask_question.be_specific_and_imagine_asking_the_question_to_another_person"
          )}
          className="w-full rounded border border-gray-300 px-3 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm sm:p-5">
        <h2 className="mb-2 text-xl font-medium">
          {t(
            "ask_question.what_are_the_details_of_your_problem"
          )}
        </h2>

        <p className="mb-3 text-sm text-gray-600">
          {t(
            "ask_question.explain_what_you_are_trying_to_do_and_include_any_errors_or_output"
          )}
        </p>

        <textarea
          value={body}
          onChange={(event) =>
            setBody(
              event.target.value
            )
          }
          placeholder={t(
            "ask_question.include_code_expected_behaviour_and_steps_to_reproduce_the_issue"
          )}
          className="min-h-[180px] w-full rounded border border-gray-300 px-3 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm sm:p-5">
        <h2 className="mb-2 text-xl font-medium">
          {t("ask_question.tags")}
        </h2>

        <p className="mb-3 text-sm text-gray-600">
          {t(
            "ask_question.add_up_to_5_tags_to_describe_what_your_question_is_about"
          )}
        </p>

        <div className="mb-3 flex flex-wrap gap-2">
          {(tags ?? []).map((tag) => (
            <span
              key={tag}
              className="inline-flex w-fit items-center rounded bg-blue-100 px-2 py-1 text-sm text-blue-800"
            >
              {tag}

              <button
                type="button"
                onClick={() =>
                  removeTag(tag)
                }
                className="ml-2 text-blue-600"
                aria-label={t(
                  "ask_question.accessibility.remove_tag",
                  {
                    tag,
                  }
                )}
              >
                ×
              </button>
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(event) =>
              setTagInput(
                event.target.value
              )
            }
            onKeyDown={
              handleKeyDown
            }
            placeholder={t(
              "ask_question.type_a_tag_press_enter_e_g_javascript"
            )}
            className="w-full flex-1 rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          <button
            type="button"
            onClick={() => {
              addTag(tagInput);
              setTagInput("");
            }}
            aria-label={t(
              "ask_question.accessibility.add_tag"
            )}
            className="inline-flex h-10 w-10 items-center justify-center rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onReview}
          className="w-full rounded bg-blue-600 px-5 py-3 text-white hover:bg-blue-700 sm:w-auto"
        >
          {t(
            "ask_question.review_your_question"
          )}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="w-full rounded border border-gray-300 px-5 py-3 text-gray-700 hover:bg-gray-100 sm:w-auto"
        >
          {t(
            "ask_question.cancel"
          )}
        </button>
      </div>
    </div>
  );
};

export default AskQuestionForm;