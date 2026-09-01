"use client";

import { useState } from "react";

import { toast } from "react-toastify";

import axiosInstance from "@/lib/axiosinstance";

import { useRouter } from "next/router";

import { useTranslation } from "react-i18next";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

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

  const { t } = useTranslation([
    "answers",
    "community",
  ]);

  const [
    newAnswer,
    setNewAnswer,
  ] = useState("");

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

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

  const handleSubmitAnswer =
    async () => {
      if (!user) {
        toast.info(
          t(
            "messages.please_login_to_continue",
            {
              ns: "community",
            }
          )
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
              userid: String(
                currentUserId
              ),
            }
          );

        onQuestionUpdate(result.data);

        toast.success(
          t(
            "messages.answer_uploaded_successfully",
            {
              ns: "answers",
            }
          )
        );
      } catch (error: unknown) {
        console.error(error);

        toast.error(
          t(
            "messages.failed_to_answer",
            {
              ns: "answers",
            }
          )
        );
      } finally {
        setNewAnswer("");
        setIsSubmitting(false);
      }
    };

  const handleAcceptAnswer =
    async (
      answerId: string
    ) => {
      try {
        await acceptAnswer(
          String(question._id),
          answerId
        );

        toast.success(
          t(
            "messages.answer_accepted_successfully",
            {
              ns: "answers",
            }
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

        toast.error(
          t(
            "messages.failed_to_accept_answer",
            {
              ns: "answers",
            }
          )
        );
      }
    };

  const handleDeleteAnswer =
    async (
      answerId: string
    ) => {
      if (!user) {
        toast.info(
          t(
            "messages.please_login_to_continue",
            {
              ns: "community",
            }
          )
        );

        router.push("/");

        return;
      }

      const confirmed =
        window.confirm(
          t(
            "messages.confirm_delete_answer",
            {
              ns: "answers",
            }
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
          t(
            "messages.answer_deleted",
            {
              ns: "answers",
            }
          )
        );
      } catch (error: unknown) {
        console.error(error);

        toast.error(
          t(
            "messages.failed_to_delete_answer",
            {
              ns: "answers",
            }
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