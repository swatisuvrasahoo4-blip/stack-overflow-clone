"use client";

import { useState } from "react";
import { toast } from "react-toastify";

import VoteToCloseButton from "./VoteToCloseButton";
import CloseVoteModal from "./CloseVoteModal";
import { voteToCloseQuestion } from "../../services/closeVoteService";
import { useTranslation } from "react-i18next";

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
  const {t} = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOpenModal = () => {
  const alreadyVoted = question?.closeVotes?.some(
    (vote: any) => String(vote.userId) === String(user?._id)
  );

  if (alreadyVoted) {
    alert(t("alert.you_have_already_voted_to_close_this_question"));
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
          t("toast.failed_to_vote_to_close_question")
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