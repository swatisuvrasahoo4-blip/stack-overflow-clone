"use client";

import { Flag, Trash } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useTranslation } from "react-i18next";

import AnswerVote from "../AnswerVote";
import AnswerShareButton from "./AnswerShareButton";

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

interface AnswerItemProps {
  answer: Answer;
  questionId: string;
  questionTitle: string;
  currentUserId?: string;
  hasMounted: boolean;
  isQuestionOwner: boolean;
  hasAcceptedAnswer: boolean;

  onAnswerVoteSuccess: (
    answerId: string,
    upvotes: string[],
    downvotes: string[]
  ) => void;

  onDeleteAnswer: (answerId: string) => void;
  onAcceptAnswer: (answerId: string) => void;
}

const AnswerItem = ({
  answer,
  questionId,
  questionTitle,
  currentUserId,
  hasMounted,
  isQuestionOwner,
  hasAcceptedAnswer,
  onAnswerVoteSuccess,
  onDeleteAnswer,
  onAcceptAnswer,
}: AnswerItemProps) => {
  const { t } = useTranslation(["answers", "community"]);

  return (
    <Card id={`answer-${answer._id}`}>
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          <AnswerVote
            questionId={questionId}
            answerId={answer._id}
            upvotes={answer.upvote || []}
            downvotes={answer.downvote || []}
            currentUserId={currentUserId}
            answerUserId={answer.userid}
            onVoteSuccess={onAnswerVoteSuccess}
          />

          <div className="flex-1 p-4 sm:p-6">
            <div className="prose max-w-none mb-6">
              <div
                className="text-gray-800 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: answer.answerbody || "",
                }}
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex gap-2">
                <AnswerShareButton
                  questionId={questionId}
                  answerId={answer._id}
                  questionTitle={questionTitle}
                />

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-gray-800"
                >
                  <Flag className="w-4 h-4 mr-1" />

                  {t("actions.flag", {
                    ns: "community",
                  })}
                </Button>

                {hasMounted &&
                  String(answer.userid) === String(currentUserId) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteAnswer(answer._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash className="w-4 h-4 mr-1" />

                      {t("actions.delete", {
                        ns: "community",
                      })}
                    </Button>
                  )}

                {isQuestionOwner &&
                  String(answer.userid) !== String(currentUserId) &&
                  !hasAcceptedAnswer && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onAcceptAnswer(answer._id)}
                      className="text-green-600 bg-amber-50 border-green-600 hover:bg-green-50 hover:text-black"
                    >
                      {t("actions.accept", {
                        ns: "answers",
                      })}
                    </Button>
                  )}

                {answer.isAccepted && (
                  <span className="text-green-600 font-semibold text-sm">
                    ✓{" "}
                    {t("status.accepted", {
                      ns: "answers",
                    })}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-600">
                  {t("labels.answered", {
                    ns: "answers",
                  })}{" "}
                  {answer.answeredon
                    ? new Date(answer.answeredon).toLocaleDateString()
                    : t("messages.unknown_date", {
                        ns: "answers",
                      })}
                </span>

                <Link
                  href={`/users/${answer.userid}`}
                  className="flex items-center gap-2 hover:bg-blue-50 p-2 rounded"
                >
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="text-sm">
                      {answer.useranswered?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <div className="text-blue-600 hover:text-blue-800 font-medium">
                      {answer.useranswered}
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnswerItem;