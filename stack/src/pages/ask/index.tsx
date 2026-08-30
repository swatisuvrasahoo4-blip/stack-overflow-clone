import Mainlayout from "@/layout/Mainlayout";
import React, { useState } from "react";
import { useRouter } from "next/router";
import axiosInstance from "@/lib/axiosinstance";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
  message?: string;
}

interface CreatedQuestion {
  _id: string;
}

interface AskQuestionResponse {
  data?: CreatedQuestion;
}

const AskQuestionPage = () => {
  const router = useRouter();
  const { t } = useTranslation();

  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [tagsArr, setTagsArr] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>("");
  const [showPreview, setShowPreview] =
    useState<boolean>(false);

  const addTag = (value: string): void => {
    const tag = value.trim();

    if (!tag) return;

    if (tagsArr.includes(tag)) return;

    if (tagsArr.length >= 5) return;

    setTagsArr((previousTags) => [
      ...previousTags,
      tag,
    ]);
  };

  const removeTag = (tag: string): void => {
    setTagsArr((previousTags) =>
      previousTags.filter(
        (currentTag) => currentTag !== tag
      )
    );
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (event.key === "Enter") {
      event.preventDefault();

      if (tagInput.includes(",")) {
        tagInput
          .split(",")
          .map((value) => value.trim())
          .filter(Boolean)
          .forEach((value) => addTag(value));

        setTagInput("");
        return;
      }

      addTag(tagInput);
      setTagInput("");
    }

    if (event.key === ",") {
      event.preventDefault();

      addTag(
        tagInput.replace(/,/g, "")
      );

      setTagInput("");
    }
  };

  const handlePost =
    async (): Promise<void> => {
      try {
        const response =
          await axiosInstance.post<AskQuestionResponse>(
            "/question/ask",
            {
              postquestiondata: {
                questiontitle: title,
                questionbody: body,
                questiontags: tagsArr,
                noofanswer: 0,
                answer: [],
                userposted: "You",
                askedon: new Date(),
                upvote: [],
                downvote: [],
              },
            }
          );

        const createdQuestion =
          response.data?.data;

        if (!createdQuestion?._id) {
          toast.error(
            t(
              "alert.something_went_wrong"
            ) ||
              "Something went wrong."
          );

          return;
        }

        await router.push(
          `/questions/${createdQuestion._id}`
        );
      } catch (error: unknown) {
        const apiError =
          error as ApiError;

        toast.error(
          apiError.response?.data
            ?.message ||
            "Something went wrong."
        );
      }
    };

  return (
    <Mainlayout>
      <div className="p-3 w-full max-w-3xl mx-auto sm:p-6">
        <div className="mb-4">
          <h1 className="text-2xl font-semibold">
            {t(
              "askquestion.ask_a_public_question"
            )}
          </h1>

          <p className="text-gray-600 text-sm mt-1">
            {t(
              "askquestion.other_users_will_be_able_to_see_and_answer_your_question"
            )}
          </p>
        </div>

        <div className="space-y-6">
          {/* TITLE */}

          <section className="rounded-lg border border-gray-200 bg-white sm:p-5 p-3 shadow-sm">
            <h2 className="text-xl font-medium mb-2">
              {t("askquestion.title")}
            </h2>

            <p className="text-sm text-gray-600 mb-3">
              {t(
                "askquestion.summarize_your_problem_in_a_single_sentence"
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
                "askquestion.be_specific_and_imagine_asking_the_question_to_another_person"
              )}
              className="w-full border border-gray-300 px-3 py-3 rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </section>

          {/* QUESTION BODY */}

          <section className="rounded-lg border border-gray-200 bg-white sm:p-5 p-3 shadow-sm">
            <h2 className="text-xl font-medium mb-2">
              {t(
                "askquestion.what_are_the_details_of_your_problem"
              )}
            </h2>

            <p className="text-sm text-gray-600 mb-3">
              {t(
                "askquestion.explain_what_you_are_trying_to_do_and_include_any_errors_or_output"
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
                "askquestion.include_code_expected_behaviour_and_steps_to_reproduce_the_issue"
              )}
              className="w-full min-h-180px border border-gray-300 px-3 py-3 rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </section>

          {/* TAGS */}

          <section className="rounded-lg border border-gray-200 bg-white sm:p-5 p-3 shadow-sm">
            <h2 className="text-xl font-medium mb-2">
              {t("askquestion.tags")}
            </h2>

            <p className="text-sm text-gray-600 mb-3">
              {t(
                "askquestion.add_up_to_5_tags_to_describe_what_your_question_is about"
              )}
            </p>

            <div className="flex flex-wrap gap-2 mb-3">
              {tagsArr.map(
                (tag: string) => (
                  <span
                    key={tag}
                    className="inline-flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm w-fit"
                  >
                    {tag}

                    <button
                      type="button"
                      onClick={() =>
                        removeTag(tag)
                      }
                      className="ml-2 text-blue-600"
                    >
                      ×
                    </button>
                  </span>
                )
              )}
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
                  "askquestion.type_a_tag_press_enter_e_g_javascript"
                )}
                className="flex-1 w-full sm:flex-1 border border-gray-300 px-3 py-2 rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <button
                type="button"
                onClick={() => {
                  addTag(tagInput);
                  setTagInput("");
                }}
                aria-label="Add tag"
                className="inline-flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
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

          {/* BUTTONS */}

          {!showPreview ? (
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() =>
                  setShowPreview(true)
                }
                className="w-full sm:w-auto bg-blue-600 text-white px-5 py-3 rounded hover:bg-blue-700"
              >
                {t(
                  "askquestion.review_your_question"
                )}
              </button>

              <button
                type="button"
                onClick={() =>
                  router.push("/")
                }
                className="w-full sm:w-auto px-5 py-3 rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                {t(
                  "askquestion.cancel"
                )}
              </button>
            </div>
          ) : (
            /* PREVIEW */

            <div className="rounded-lg border border-gray-200 bg-white sm:p-5 p-3 shadow-sm">
              <h3 className="text-lg font-medium mb-3">
                {t(
                  "askquestion.preview"
                )}
              </h3>

              <div className="mb-3">
                <h4 className="font-semibold">
                  {title ||
                    t(
                      "askquestion.no_title"
                    )}
                </h4>

                <p className="text-gray-700 mt-2 whitespace-pre-wrap">
                  {body ||
                    t(
                      "askquestion.no_details_provided"
                    )}
                </p>
              </div>

              <div className="mb-4">
                {tagsArr.map(
                  (tag: string) => (
                    <span
                      key={tag}
                      className="inline-flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm mr-2"
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handlePost}
                  className="w-full sm:w-auto bg-green-600 text-white px-4 py-2 rounded"
                >
                  {t(
                    "askquestion.post_question"
                  )}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setShowPreview(false)
                  }
                  className="w-full sm:w-auto px-4 py-2 rounded border"
                >
                  {t(
                    "askquestion.edit"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Mainlayout>
  );
};

export default AskQuestionPage;