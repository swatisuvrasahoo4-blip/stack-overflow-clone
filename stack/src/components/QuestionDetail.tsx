"use client";

import React, { useEffect, useState } from "react";

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

  /*
   * Question actions are handled by the
   * useQuestionActions custom hook.
   *
   * question! is used here because the actions
   * are only triggered after the question has
   * successfully loaded.
   */
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

  /*
   * Mount
   */

  useEffect(() => {
    setHasMounted(true);
  }, []);

  /*
   * Load Question
   */

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

          isBookmarked =
            Array.isArray(savedQuestions)
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
      loadQuestion();
    }
  }, [
    questionId,
    user?._id,
    user?.id,
  ]);

  /*
   * Loading
   */

  if (loading) {
    return (
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500" />
    );
  }

  /*
   * Question Not Found
   */

  if (!question) {
    return (
      <div className="text-center text-gray-500 mt-4">
        No question found.
      </div>
    );
  }

  /*
   * Own Question
   */

  const isOwnQuestion =
    String(question.userid) ===
    String(currentUserId);

  /*
   * Render
   */

  return (
    <div className="max-w-5xl">
      {/* Question Header */}

      <QuestionHeader
        title={question.questiontitle}
        askedOn={question.askedon}
      />

      {/* Question Content */}

      <Card className="mb-8">
        <CardContent className="p-0">
          <div className="flex flex-col sm:flex-row">
            {/* Question Sidebar */}

            <QuestionSidebar
              upvotes={question.upvote || []}
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

            {/* Question Body */}

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

      {/* Answer Section */}

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