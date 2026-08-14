"use client";

import { useState } from "react";
import { toast } from "react-toastify";

import VoteToCloseButton from "./VoteToCloseButton";
import CloseVoteModal from "./CloseVoteModal";
import { voteToCloseQuestion } from "../../services/closeVoteService";

interface VoteToCloseProps {
  question: any;
  user: any;
  onQuestionUpdate: (question: any) => void;
}

const VoteToClose = ({
  question,
  user,
  onQuestionUpdate,
}: VoteToCloseProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOpenModal = () => {
  const alreadyVoted = question?.closeVotes?.some(
    (vote: any) => String(vote.userId) === String(user?._id)
  );

  if (alreadyVoted) {
    alert("You have already voted to close this question.");
    return;
  }

  setIsOpen(true);
};

  const handleSubmit = async () => {
    if (!reason) return;

    try {
      setLoading(true);

      const data = await voteToCloseQuestion(
        question._id,
        reason
      );

      toast.success(data.message);

      onQuestionUpdate({
        ...question,
        isClosed: data.isClosed,
      });

      setReason("");
      setIsOpen(false);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Failed to vote to close question"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!user || !question) return null;

  return (
    <>
      <VoteToCloseButton
        reputation={user.reputation || 0}
        isClosed={question.isClosed || false}
        onClick={handleOpenModal}
      />

      <CloseVoteModal
        isOpen={isOpen}
        reason={reason}
        loading={loading}
        onReasonChange={setReason}
        onClose={() => {
          setIsOpen(false);
          setReason("");
        }}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default VoteToClose;