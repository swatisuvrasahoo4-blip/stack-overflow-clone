"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "@/lib/axiosinstance";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

import { Card, CardContent } from "@/components/ui/card";

import AnswerList from "./AnswerList";
import SubmitAnswer from "./SubmitAnswer";

import {
  submitAnswer,
  acceptAnswer,
  getQuestionById,
} from "@/components/services/questionService";

import type { Question } from "@/types/questions";

interface User {
  _id?: string;
  id?: string;
  name?: string;
  reputation?: number;
  profilePhoto?: string;
}

interface AnswerSectionProps {
  question: Question;
  currentUserId?: string;
  user: User | null;
  hasMounted: boolean;
  onQuestionUpdate: (
    question: Question
  ) => void;
}

const AnswerSection = ({
  question,
  currentUserId,
  user,
  hasMounted,
  onQuestionUpdate,
}: AnswerSectionProps) => {
  const router = useRouter();
  const { t } = useTranslation();

  const [newAnswer, setNewAnswer] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const onAnswerVoteSuccess = (
    answerId: string,
    upvotes: string[],
    downvotes: string[]
  ) => {
    const updatedQuestion: Question = {
      ...question,
      answer: question.answer.map(
        (answer) =>
          String(answer._id) ===
          String(answerId)
            ? {
                ...answer,
                upvote: upvotes,
                downvote: downvotes,
              }
            : answer
      ),
    };

    onQuestionUpdate(updatedQuestion);
  };

  const handleSubmitAnswer = async () => {
    if (!user) {
      toast.info(
        t("toast.please_login_to_continue")
      );

      router.push("/auth");
      return;
    }

    if (!newAnswer.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result =
        await submitAnswer(
          String(question._id),
          {
            answerbody: newAnswer,
            useranswered:
              user.name || "",
            userid:
              String(currentUserId),
          }
        );

      onQuestionUpdate(result.data);

      toast.success(
        t(
          "toast.answer_uploaded_successfully"
        )
      );
    } catch (error: unknown) {
      console.error(error);

      toast.error(
        t("toast.failed_to_answer")
      );
    } finally {
      setNewAnswer("");
      setIsSubmitting(false);
    }
  };

  const handleAcceptAnswer = async (
    answerId: string
  ) => {
    try {
      await acceptAnswer(
        String(question._id),
        answerId
      );

      toast.success(
        t(
          "toast.answer_accepted_successfully"
        )
      );

      const response =
        await getQuestionById(
          String(question._id)
        );

      const updatedQuestion: Question =
        response?.data?.question ||
        response?.question ||
        response?.data ||
        response;

      onQuestionUpdate(
        updatedQuestion
      );
    } catch (error: unknown) {
      console.error(error);

      if (
        error &&
        typeof error === "object" &&
        "response" in error
      ) {
        const axiosError = error as {
          response?: {
            data?: {
              message?: string;
            };
          };
        };

        toast.error(
          axiosError.response?.data
            ?.message ||
            t(
              "toast.failed_to_accept_answer"
            )
        );
      } else {
        toast.error(
          t(
            "toast.failed_to_accept_answer"
          )
        );
      }
    }
  };

  const handleDeleteAnswer = async (
    answerId: string
  ) => {
    if (!user) {
      toast.info(
        t("toast.please_login_to_continue")
      );

      router.push("/");
      return;
    }

    const confirmed =
      window.confirm(
        t(
          "window.are_you_sure_you_want_to_delete_this_answer"
        )
      );

    if (!confirmed) {
      return;
    }

    try {
      await axiosInstance.delete(
        `/answer/delete/${question._id}/${answerId}`
      );

      const updatedAnswer =
        question.answer.filter(
          (answer) =>
            String(answer._id) !==
            String(answerId)
        );

      onQuestionUpdate({
        ...question,
        noofanswer:
          updatedAnswer.length,
        answer: updatedAnswer,
      });

      toast.success(
        t("toast.answer_deleted")
      );
    } catch (error: unknown) {
      console.error(error);

      toast.error(
        t(
          "toast.failed_to_delete_answer"
        )
      );
    }
  };

  return (
    <>
      <AnswerList
        answers={question.answer}
        questionId={String(
          question._id
        )}
        questionTitle={
          question.questiontitle
        }
        currentUserId={
          currentUserId
        }
        hasMounted={hasMounted}
        isQuestionOwner={
          String(question.userid) ===
          String(currentUserId)
        }
        onAnswerVoteSuccess={
          onAnswerVoteSuccess
        }
        onDeleteAnswer={
          handleDeleteAnswer
        }
        onAcceptAnswer={
          handleAcceptAnswer
        }
      />

      {!question.isClosed && (
        <Card>
          <CardContent className="p-6">
            <SubmitAnswer
              value={newAnswer}
              isSubmitting={
                isSubmitting
              }
              onChange={
                setNewAnswer
              }
              onSubmit={
                handleSubmitAnswer
              }
            />
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default AnswerSection;