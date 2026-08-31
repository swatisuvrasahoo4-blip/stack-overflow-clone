import Mainlayout from "@/layout/Mainlayout";

import {
  useState,
} from "react";

import type {
  KeyboardEvent,
} from "react";

import { useRouter } from "next/router";

import axiosInstance from "@/lib/axiosinstance";

import { toast } from "react-toastify";

import { useTranslation } from "react-i18next";

import AskQuestionForm from "./AskQuestionForm";
import AskQuestionPreview from "./AskQuestionPreview";

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

  const [
    title,
    setTitle,
  ] = useState("");

  const [
    body,
    setBody,
  ] = useState("");

  const [
    tags,
    setTags,
  ] = useState<string[]>([]);

  const [
    tagInput,
    setTagInput,
  ] = useState("");

  const [
    showPreview,
    setShowPreview,
  ] = useState(false);

  // Add tag
  const addTag = (
    value: string
  ): void => {
    const tag =
      value.trim();

    if (!tag) {
      return;
    }

    if (
      tags.includes(tag)
    ) {
      return;
    }

    if (
      tags.length >= 5
    ) {
      return;
    }

    setTags(
      (previousTags) => [
        ...previousTags,
        tag,
      ]
    );
  };

  // Remove tag
  const removeTag = (
    tag: string
  ): void => {
    setTags(
      (previousTags) =>
        previousTags.filter(
          (currentTag) =>
            currentTag !== tag
        )
    );
  };

  // Handle tag keyboard input
  const handleKeyDown = (
    event: KeyboardEvent<HTMLInputElement>
  ): void => {
    if (
      event.key === "Enter"
    ) {
      event.preventDefault();

      if (
        tagInput.includes(",")
      ) {
        tagInput
          .split(",")
          .map(
            (value) =>
              value.trim()
          )
          .filter(Boolean)
          .forEach(
            (value) =>
              addTag(value)
          );

        setTagInput("");

        return;
      }

      addTag(tagInput);

      setTagInput("");
    }

    if (
      event.key === ","
    ) {
      event.preventDefault();

      addTag(
        tagInput.replace(
          /,/g,
          ""
        )
      );

      setTagInput("");
    }
  };

  // Post question
  const handlePost =
    async (): Promise<void> => {
      try {
        const response =
          await axiosInstance.post<AskQuestionResponse>(
            "/question/ask",
            {
              postquestiondata: {
                questiontitle:
                  title,
                questionbody:
                  body,
                questiontags:
                  tags,
                noofanswer: 0,
                answer: [],
                userposted:
                  "You",
                askedon:
                  new Date(),
                upvote: [],
                downvote: [],
              },
            }
          );

        const createdQuestion =
          response.data?.data;

        if (
          !createdQuestion?._id
        ) {
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
          apiError.response
            ?.data?.message ||
            t(
              "alert.something_went_wrong"
            ) ||
            "Something went wrong."
        );
      }
    };

  // Cancel question
  const handleCancel = (): void => {
    void router.push("/");
  };

  return (
    <Mainlayout>
      <div className="mx-auto w-full max-w-3xl p-3 sm:p-6">
        {/* Page header */}
        <div className="mb-4">
          <h1 className="text-2xl font-semibold">
            {t(
              "askquestion.ask_a_public_question"
            )}
          </h1>

          <p className="mt-1 text-sm text-gray-600">
            {t(
              "askquestion.other_users_will_be_able_to_see_and_answer_your_question"
            )}
          </p>
        </div>

        {/* Question form or preview */}
        {!showPreview ? (
          <AskQuestionForm
            title={title}
            setTitle={setTitle}
            body={body}
            setBody={setBody}
            tags={tags}
            tagInput={tagInput}
            setTagInput={
              setTagInput
            }
            addTag={addTag}
            removeTag={
              removeTag
            }
            handleKeyDown={
              handleKeyDown
            }
            onReview={() =>
              setShowPreview(
                true
              )
            }
            onCancel={
              handleCancel
            }
          />
        ) : (
          <AskQuestionPreview
            title={title}
            body={body}
            tags={tags}
            onPost={
              handlePost
            }
            onEdit={() =>
              setShowPreview(
                false
              )
            }
          />
        )}
      </div>
    </Mainlayout>
  );
};

export default AskQuestionPage;