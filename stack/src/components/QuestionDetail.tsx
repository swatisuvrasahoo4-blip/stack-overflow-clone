"use client";

import {
  Bookmark,
  ChevronDown,
  ChevronUp,
  Clock,
  Flag,
  History,
  Share,
  Trash,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useAuth } from "@/lib/AuthContext";
import { Question } from "@/types/questions";
import {
  submitAnswer,
  acceptAnswer,
  toggleQuestionBookmark,
  getQuestionById,
  getQuestionBookmarks,
  voteQuestion,
} from "./services/questionService";
import axiosInstance from "@/lib/axiosinstance";
import AnswerVote from "./AnswerVote";
import ReportQuestionButton from "./reports/ReportQuestionButton";
import VoteToClose from "./question/close-vote/VoteToClose";
import { useTranslation } from "react-i18next";
import AnswerShareButton from "./answer/AnswerShareButton";

/* =========================
   TYPES
========================= */

interface Answer {
  _id: string;
  answerbody: string;
  userid: string;
  useranswered: string;
  answeredon?: string;
  upvote?: string[];
  downvote?: string[];
  isAccepted?: boolean;
}

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

/* =========================
   COMPONENT
========================= */

const QuestionDetail = ({ questionId }: QuestionDetailProps) => {
  const router = useRouter();

  const [question, setQuestion] = useState<Question | null>(null);
  const [newAnswer, setNewAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);

  const { user } = useAuth() as {
    user: User | null;
  };

  const { t } = useTranslation();

  /* =========================
     MOUNT
  ========================= */

  useEffect(() => {
    setHasMounted(true);
  }, []);

  /* =========================
     ANSWER VOTE SUCCESS
  ========================= */

  const onAnswerVoteSuccess = (
    answerId: string,
    upvotes: string[],
    downvotes: string[]
  ) => {
    setQuestion((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        answer: prev.answer.map((ans) =>
          String(ans._id) === String(answerId)
            ? {
                ...ans,
                upvote: upvotes,
                downvote: downvotes,
              }
            : ans
        ),
      };
    });
  };

  /* =========================
     LOAD QUESTION
  ========================= */

  useEffect(() => {
    const loadQuestion = async () => {
      try {
        setLoading(true);

        const realQuestion = await getQuestionById(String(questionId));

        const questionData: Question =
          realQuestion?.data?.question ||
          realQuestion?.question ||
          realQuestion?.data ||
          realQuestion;

        const userId = user?._id || user?.id;

        let isBookmarked = false;

        if (userId) {
          const savedQuestions = await getQuestionBookmarks(
            String(userId)
          );

          isBookmarked = Array.isArray(savedQuestions)
            ? savedQuestions.some(
                (saved: string | { _id?: string }) => {
                  const savedId =
                    typeof saved === "string"
                      ? saved
                      : saved?._id;

                  return (
                    String(savedId) ===
                    String(questionData?._id)
                  );
                }
              )
            : false;
        }

        setQuestion({
          ...questionData,
          isBookmarked,
          answer: questionData?.answer || [],
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

          if (axiosError.response?.status !== 404) {
            console.error("Failed to fetch question:", error);
          }
        } else {
          console.error("Failed to fetch question:", error);
        }

        setQuestion(null);
      } finally {
        setLoading(false);
      }
    };

    if (questionId) {
      loadQuestion();
    }
  }, [questionId, user?._id, user?.id]);

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500" />
    );
  }

  /* =========================
     QUESTION NOT FOUND
  ========================= */

  if (!question) {
    return (
      <div className="text-center text-gray-500 mt-4">
        No question found.
      </div>
    );
  }

  /* =========================
     CURRENT USER ID
  ========================= */

  const currentUserId = user?._id || user?.id;

  /* =========================
     QUESTION VOTE
  ========================= */

  const handleVote = async (
    vote: "upvote" | "downvote"
  ) => {
    if (!user) {
      toast.info(t("toast.please_login_to_continue"));
      router.push("/auth");
      return;
    }

    const isOwnQuestion =
      String(question.userid) === String(currentUserId);

    if (isOwnQuestion) {
      toast.info(
        t("toast.you_cannot_vote_on_your_own_question")
      );
      return;
    }

    try {
      const response = await voteQuestion(
        questionId,
        vote,
        String(currentUserId)
      );

      setQuestion(response.data);

      toast.success(t("toast.vote_updated"));
    } catch (error: unknown) {
      console.error(error);

      toast.error(
        t("toast.failed_to_vote_question")
      );
    }
  };

  /* =========================
     BOOKMARK
  ========================= */

  const handleBookmark = async () => {
    const userId = user?._id || user?.id;

    if (!userId) {
      toast.info(
        t("toast.please_login_to_save_questions")
      );
      router.push("/auth");
      return;
    }

    const currentQuestionId = question._id;

    if (!currentQuestionId) {
      toast.error(
        t("toast.question_id_not_found")
      );
      return;
    }

    try {
      const result = await toggleQuestionBookmark(
        String(userId),
        String(currentQuestionId)
      );

      const updatedBookmarks = result.questionBookmarks || [];

      const isNowBookmarked = updatedBookmarks.some(
        (id: string) =>
          String(id) === String(currentQuestionId)
      );

      setQuestion((prev) =>
        prev
          ? {
              ...prev,
              isBookmarked: isNowBookmarked,
            }
          : prev
      );

      toast.success(result.message);
    } catch (error: unknown) {
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
          axiosError.response?.data?.message ||
            t("toast.unable_to_update_bookmark")
        );
      } else {
        toast.error(
          t("toast.unable_to_update_bookmark")
        );
      }
    }
  };

  /* =========================
     SUBMIT ANSWER
  ========================= */

  const handleSubmitAnswer = async () => {
    if (!user) {
      toast.info(
        t("toast.please_login_to_continue")
      );
      router.push("/auth");
      return;
    }

    if (!newAnswer.trim()) return;

    setIsSubmitting(true);

    try {
      const result = await submitAnswer(
        String(question._id),
        {
          answerbody: newAnswer,
          useranswered: user.name || "",
          userid: String(currentUserId),
        }
      );

      setQuestion(result.data);

      toast.success(
        t("toast.answer_uploaded_successfully")
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

  /* =========================
     ACCEPT ANSWER
  ========================= */

  const handleAcceptAnswer = async (
    answerId: string
  ) => {
    try {
      await acceptAnswer(
        String(question._id),
        answerId
      );

      toast.success(
        t("toast.answer_accepted_successfully")
      );

      const response = await getQuestionById(
        String(question._id)
      );

      const updatedQuestion: Question =
        response?.data?.question ||
        response?.question ||
        response?.data ||
        response;

      setQuestion(updatedQuestion);
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
          axiosError.response?.data?.message ||
            t("toast.failed_to_accept_answer")
        );
      } else {
        toast.error(
          t("toast.failed_to_accept_answer")
        );
      }
    }
  };

  /* =========================
     DELETE QUESTION
  ========================= */

  const handleDelete = async () => {
    if (!user) {
      toast.info(
        t("toast.please_login_to_continue")
      );
      router.push("/");
      return;
    }

    const confirmed = window.confirm(
      t(
        "window.are_you_sure_you_want_to_delete_this_question"
      )
    );

    if (!confirmed) return;

    toast.success(
      t("toast.question_deleted")
    );

    router.push("/");
  };

  /* =========================
     DELETE ANSWER
  ========================= */

  const handleDeleteAnswer = async (
    id: string
  ) => {
    if (!user) {
      toast.info(
        t("toast.please_login_to_continue")
      );
      router.push("/");
      return;
    }

    const confirmed = window.confirm(
      t(
        "window.are_you_sure_you_want_to_delete_this_answer"
      )
    );

    if (!confirmed) return;

    try {
      await axiosInstance.delete(
        `/answer/delete/${question._id}/${id}`
      );

      const updatedAnswer = question.answer.filter(
        (ans) =>
          String(ans._id) !== String(id)
      );

      setQuestion((prev) =>
        prev
          ? {
              ...prev,
              noofanswer: updatedAnswer.length,
              answer: updatedAnswer,
            }
          : prev
      );

      toast.success(
        t("toast.answer_deleted")
      );
    } catch (error: unknown) {
      console.error(error);

      toast.error(
        t("toast.failed_to_delete_answer")
      );
    }
  };

  /* =========================
     SHARE QUESTION
  ========================= */

  const handleShare = async () => {
    if (!user) {
      toast.info(
        t("toast.please_login_to_continue")
      );
      router.push("/auth");
      return;
    }

    const shareUrl = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title:
            question.questiontitle ||
            "Question",
          text:
            "Check out this question on CodeQuest",
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(
          shareUrl
        );

        toast.success(
          t("toast.question_link_copied")
        );
      }
    } catch (error: unknown) {
      console.log(error);
    }
  };

  /* =========================
     ACCEPTED ANSWER
  ========================= */

  const hasAcceptedAnswer =
    question.answer.some(
      (ans) => ans.isAccepted
    );

  /* =========================
     OWN QUESTION
  ========================= */

  const isOwnQuestion =
    String(question.userid) ===
    String(currentUserId);

  /* =========================
     RETURN
  ========================= */

  return (
    <div className="max-w-5xl">
      {/* Question Header */}

      <div className="mb-6">
        <h1 className="text-xl lg:text-2xl font-semibold mb-4 text-gray-900">
          {question.questiontitle}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />

            <span>
              {t("community.asked")}{" "}
              {question.askedon
                ? new Date(
                    question.askedon
                  ).toLocaleDateString()
                : "Unknown date"}
            </span>
          </div>
        </div>
      </div>

      {/* Question Content */}

      <Card className="mb-8">
        <CardContent className="p-0">
          <div className="flex flex-col sm:flex-row">
            {/* Voting Section */}

            <div className="flex sm:flex-col items-center sm:items-center p-4 sm:p-6 border-b sm:border-b-0 sm:border-r border-gray-200">
              <Button
                variant="ghost"
                size="sm"
                className={`p-2 ${
                  question.upvote?.some(
                    (id) =>
                      String(id) ===
                      String(currentUserId)
                  )
                    ? "text-orange-500 bg-orange-50"
                    : "text-gray-600 hover:text-orange-500"
                }`}
                onClick={() =>
                  handleVote("upvote")
                }
              >
                <ChevronUp className="w-6 h-6" />
              </Button>

              <span>
                {(question.upvote?.length || 0) -
                  (question.downvote?.length || 0)}
              </span>

              <Button
                variant="ghost"
                size="sm"
                className={`p-2 ${
                  question.downvote?.some(
                    (id) =>
                      String(id) ===
                      String(currentUserId)
                  )
                    ? "text-orange-500 bg-orange-50"
                    : "text-gray-600 hover:text-orange-500"
                }`}
                onClick={() =>
                  handleVote("downvote")
                }
              >
                <ChevronDown className="w-6 h-6" />
              </Button>

              <div className="flex sm:flex-col gap-2 sm:gap-4 mt-4 sm:mt-6">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`p-2 ${
                    question.isBookmarked
                      ? "text-yellow-500"
                      : "text-gray-600 hover:text-yellow-500"
                  }`}
                  onClick={handleBookmark}
                >
                  <Bookmark
                    className="w-5 h-5"
                    fill={
                      question.isBookmarked
                        ? "currentColor"
                        : "none"
                    }
                  />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 text-gray-600 hover:text-gray-800"
                >
                  <History className="w-5 h-5" />
                </Button>
              </div>

              {user && (
  <VoteToClose
    question={question}
    user={user}
    onQuestionUpdate={setQuestion}
  />
)}
            </div>

            {/* Question Body */}

            <div className="flex-1 p-4 sm:p-6">
              <div className="prose max-w-none mb-6">
                <div
                  className="text-gray-800 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html:
                      question.questionbody || "",
                  }}
                />
              </div>

              {/* Tags */}

              <div className="flex flex-wrap gap-2 mb-6">
                {(question.questiontags || []).map(
                  (tag) => (
                    <Link
                      key={tag}
                      href={`/tags/${tag}`}
                    >
                      <Badge
                        variant="secondary"
                        className="bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer"
                      >
                        {tag}
                      </Badge>
                    </Link>
                  )
                )}
              </div>

              {/* Question Actions */}

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex gap-2">
                  <Button
                    onClick={handleShare}
                    variant="ghost"
                    size="sm"
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <Share className="w-4 h-4 mr-1" />

                    {t("community.share")}
                  </Button>

                  <ReportQuestionButton
                    questionId={question._id}
                    reputation={Number(
                      user?.reputation ?? 0
                    )}
                  />

                  {hasMounted &&
                    isOwnQuestion && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleDelete}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash className="w-4 h-4 mr-1" />

                        {t("community.delete")}
                      </Button>
                    )}
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600">
                    {t("community.asked")}{" "}
                    {question.askedon &&
                    !isNaN(
                      new Date(
                        question.askedon
                      ).getTime()
                    )
                      ? new Date(
                          question.askedon
                        )
                          .toISOString()
                          .split("T")[0]
                      : "Date unavailable"}
                  </span>

                  <Link
                    href={`/users/${question.userid}`}
                    className="flex items-center gap-2 hover:bg-blue-50 p-2 rounded"
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-sm">
                        {question.userposted
                          ?.charAt(0)
                          .toUpperCase() ||
                          "U"}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <div className="text-blue-600 hover:text-blue-800 font-medium">
                        {question.userposted}
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Answers */}

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-6 text-gray-900">
          {question.answer.length}{" "}
          {question.answer.length > 1
            ? t("community.answers")
            : t("community.answer")}
        </h2>

        <div className="space-y-6">
          {question.answer.map((ans) => (
            <Card
              key={ans._id}
              id={`answer-${ans._id}`}
            >
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row">
                  <AnswerVote
                    questionId={question._id}
                    answerId={ans._id}
                    upvotes={ans.upvote || []}
                    downvotes={ans.downvote || []}
                    currentUserId={currentUserId}
                    answerUserId={ans.userid}
                    onVoteSuccess={
                      onAnswerVoteSuccess
                    }
                  />

                  {/* Answer Content */}

                  <div className="flex-1 p-4 sm:p-6">
                    <div className="prose max-w-none mb-6">
                      <div
                        className="text-gray-800 leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html:
                            ans.answerbody || "",
                        }}
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex gap-2">
                        <AnswerShareButton
                          questionId={String(
                            question._id
                          )}
                          answerId={String(
                            ans._id
                          )}
                          questionTitle={
                            question.questiontitle
                          }
                        />

                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-600 hover:text-gray-800"
                        >
                          <Flag className="w-4 h-4 mr-1" />

                          {t("community.flag")}
                        </Button>

                        {hasMounted &&
                          String(ans.userid) ===
                            String(currentUserId) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleDeleteAnswer(
                                  ans._id
                                )
                              }
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash className="w-4 h-4 mr-1" />

                              {t(
                                "community.delete"
                              )}
                            </Button>
                          )}

                        {String(question.userid) ===
                          String(currentUserId) &&
                          String(ans.userid) !==
                            String(currentUserId) &&
                          !hasAcceptedAnswer && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleAcceptAnswer(
                                  ans._id
                                )
                              }
                              className="text-green-600 bg-amber-50 border-green-600 hover:bg-green-50 hover:text-black"
                            >
                              {t(
                                "community.acceptAnswer"
                              )}
                            </Button>
                          )}

                        {ans.isAccepted && (
                          <span className="text-green-600 font-semibold text-sm">
                            ✓{" "}
                            {t(
                              "community.acceptedAnswer"
                            )}
                          </span>
                        )}
                      </div>

                      {/* Answer User */}

                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-600">
                          {t(
                            "community.answered"
                          )}{" "}
                          {ans.answeredon
                            ? new Date(
                                ans.answeredon
                              ).toLocaleDateString()
                            : "Unknown date"}
                        </span>

                        <Link
                          href={`/users/${ans.userid}`}
                          className="flex items-center gap-2 hover:bg-blue-50 p-2 rounded"
                        >
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="text-sm">
                              {ans.useranswered
                                ?.charAt(0)
                                .toUpperCase() ||
                                "U"}
                            </AvatarFallback>
                          </Avatar>

                          <div>
                            <div className="text-blue-600 hover:text-blue-800 font-medium">
                              {ans.useranswered}
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Submit Answer */}

      {!question.isClosed && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">
              {t("community.yourAnswer")}
            </h3>

            <Textarea
              placeholder="Write your answer here... You can use Markdown formatting."
              value={newAnswer}
              onChange={(e) =>
                setNewAnswer(e.target.value)
              }
              className="min-h-32 mb-4 resize-none"
            />

            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <Button
                onClick={handleSubmitAnswer}
                disabled={
                  !newAnswer.trim() ||
                  isSubmitting
                }
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isSubmitting
                  ? t("community.posting")
                  : t(
                      "community.postYourAnswer"
                    )}
              </Button>

              <p className="text-sm text-gray-600">
                By posting your answer, you agree
                to the{" "}
                <Link
                  href="#"
                  className="text-blue-600 hover:underline"
                >
                  privacy policy
                </Link>{" "}
                and{" "}
                <Link
                  href="#"
                  className="text-blue-600 hover:underline"
                >
                  terms of service
                </Link>
                .
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QuestionDetail;