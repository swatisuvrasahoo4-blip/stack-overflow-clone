"use client";

import QuestionVote from "./QuestionVote";
import QuestionActions from "./QuestionActions";
import VoteToClose from "./close-vote/VoteToClose";

import type { Question } from "@/types/questions";

interface User {
  _id?: string;
  id?: string;
  name?: string;
  reputation?: number;
  profilePhoto?: string;
}

interface QuestionSidebarProps {
  upvotes: string[];
  downvotes: string[];
  currentUserId?: string;
  isBookmarked: boolean;
  onVote: (
    vote: "upvote" | "downvote"
  ) => void;
  onBookmark: () => void;
  question: Question;
  user: User | null;
  onQuestionUpdate: (
    question: Question
  ) => void;
}

const QuestionSidebar = ({
  upvotes,
  downvotes,
  currentUserId,
  isBookmarked,
  onVote,
  onBookmark,
  question,
  user,
  onQuestionUpdate,
}: QuestionSidebarProps) => {
  return (
    <div className="flex flex-col items-center">
      <QuestionVote
        upvotes={upvotes}
        downvotes={downvotes}
        currentUserId={currentUserId}
        onVote={onVote}
      />

      <QuestionActions
        isBookmarked={isBookmarked}
        onBookmark={onBookmark}
      />

      {user && (
        <VoteToClose
          question={question}
          user={user}
          onQuestionUpdate={
            onQuestionUpdate
          }
        />
      )}
    </div>
  );
};

export default QuestionSidebar;