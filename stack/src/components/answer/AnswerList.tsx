"use client";

import { useTranslation } from "react-i18next";
import AnswerItem from "./AnswerItem";

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

interface AnswerListProps {
  answers: Answer[];
  questionId: string;
  questionTitle: string;
  currentUserId?: string;
  hasMounted: boolean;
  isQuestionOwner: boolean;

  onAnswerVoteSuccess: (
    answerId: string,
    upvotes: string[],
    downvotes: string[]
  ) => void;

  onDeleteAnswer: (answerId: string) => void;
  onAcceptAnswer: (answerId: string) => void;
}

const AnswerList = ({
  answers,
  questionId,
  questionTitle,
  currentUserId,
  hasMounted,
  isQuestionOwner,
  onAnswerVoteSuccess,
  onDeleteAnswer,
  onAcceptAnswer,
}: AnswerListProps) => {
  const { t } = useTranslation("answers");

  const hasAcceptedAnswer = answers.some(
    (answer) => answer.isAccepted
  );

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-6 text-gray-900">
        {answers.length}{" "}
        {answers.length === 1
          ? t("labels.answer")
          : t("labels.answers")}
      </h2>

      <div className="space-y-6">
        {answers.map((answer) => (
          <AnswerItem
            key={answer._id}
            answer={answer}
            questionId={questionId}
            questionTitle={questionTitle}
            currentUserId={currentUserId}
            hasMounted={hasMounted}
            isQuestionOwner={isQuestionOwner}
            hasAcceptedAnswer={hasAcceptedAnswer}
            onAnswerVoteSuccess={onAnswerVoteSuccess}
            onDeleteAnswer={onDeleteAnswer}
            onAcceptAnswer={onAcceptAnswer}
          />
        ))}
      </div>
    </div>
  );
};

export default AnswerList;