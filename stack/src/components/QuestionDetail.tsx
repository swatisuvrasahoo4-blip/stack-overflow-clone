"use client";

import React, { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

import { Card, CardContent } from "./ui/card";

import { useAuth } from "@/lib/AuthContext";

import { Question } from "@/types/questions";

import QuestionHeader from "./question/QuestionHeader";
import QuestionContent from "./question/QuestionContent";
import QuestionSidebar from "./question/QuestionSidebar";

import useQuestionActions from "@/hooks/useQuestionActions";

import AnswerSection from "./answer/AnswerSection";

import {
  getQuestionById,
  getQuestionBookmarks,
} from "./services/questionService";

interface User {
  _id?: string;
  id?: string;
  name?: string;
  reputation?: number;
  profilePhoto?: string;
}

interface QuestionDetailProps {
  questionId: string;
}

const QuestionDetail = ({
  questionId,
}: QuestionDetailProps) => {
  const { t } =
    useTranslation("questions");

  const [question, setQuestion] =
    useState<Question | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [hasMounted, setHasMounted] =
    useState(false);

  const { user } = useAuth() as {
    user: User | null;
  };

  const currentUserId =
    user?._id || user?.id;

  const {
    handleVote,
    handleBookmark,
    handleDelete,
    handleShare,
  } = useQuestionActions({
    question: question!,
    user,
    currentUserId,
    setQuestion,
  });

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const loadQuestion = async () => {
      try {
        setLoading(true);

        const realQuestion =
          await getQuestionById(
            String(questionId)
          );

        const questionData: Question =
          realQuestion?.data?.question ||
          realQuestion?.question ||
          realQuestion?.data ||
          realQuestion;

        const userId =
          user?._id || user?.id;

        let isBookmarked = false;

        if (userId) {
          const savedQuestions =
            await getQuestionBookmarks(
              String(userId)
            );

          isBookmarked = Array.isArray(
            savedQuestions
          )
            ? savedQuestions.some(
                (
                  saved:
                    | string
                    | { _id?: string }
                ) => {
                  const savedId =
                    typeof saved ===
                    "string"
                      ? saved
                      : saved?._id;

                  return (
                    String(savedId) ===
                    String(
                      questionData?._id
                    )
                  );
                }
              )
            : false;
        }

        setQuestion({
          ...questionData,
          isBookmarked,
          answer:
            questionData?.answer || [],
        });
      } catch (error: unknown) {
        if (
          error &&
          typeof error === "object" &&
          "response" in error
        ) {
          const axiosError = error as {
            response?: {
              status?: number;
            };
          };

          if (
            axiosError.response?.status !==
            404
          ) {
            console.error(
              "Failed to fetch question:",
              error
            );
          }
        } else {
          console.error(
            "Failed to fetch question:",
            error
          );
        }

        setQuestion(null);
      } finally {
        setLoading(false);
      }
    };

    if (questionId) {
      void loadQuestion();
    }
  }, [
    questionId,
    user?._id,
    user?.id,
  ]);

  if (loading) {
    return (
      <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-blue-500" />
    );
  }

  if (!question) {
    return (
      <div className="mt-4 text-center text-gray-500">
        {t(
          "messages.no_question_found"
        )}
      </div>
    );
  }

  const isOwnQuestion =
    String(question.userid) ===
    String(currentUserId);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <QuestionHeader
        title={question.questiontitle}
        askedOn={question.askedon}
      />

      <Card className="mb-8">
        <CardContent className="p-0">
          <div className="flex flex-col sm:flex-row">
            <QuestionSidebar
              upvotes={
                question.upvote || []
              }
              downvotes={
                question.downvote || []
              }
              currentUserId={
                currentUserId
              }
              isBookmarked={
                question.isBookmarked ??
                false
              }
              onVote={handleVote}
              onBookmark={
                handleBookmark
              }
              question={question}
              user={user}
              onQuestionUpdate={
                setQuestion
              }
            />

            <QuestionContent
              questionBody={
                question.questionbody ||
                ""
              }
              questionTags={
                question.questiontags ||
                []
              }
              askedOn={
                question.askedon
              }
              userPosted={
                question.userposted
              }
              userId={String(
                question.userid
              )}
              questionId={String(
                question._id
              )}
              reputation={Number(
                user?.reputation ?? 0
              )}
              isOwnQuestion={
                isOwnQuestion
              }
              hasMounted={
                hasMounted
              }
              onShare={handleShare}
              onDelete={handleDelete}
            />
          </div>
        </CardContent>
      </Card>

      <AnswerSection
        question={question}
        currentUserId={
          currentUserId
        }
        user={user}
        hasMounted={hasMounted}
        onQuestionUpdate={
          setQuestion
        }
      />
    </div>
  );
};

export default QuestionDetail;