"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import VoteToCloseButton from "./VoteToCloseButton";
import CloseVoteModal from "./CloseVoteModal";
import { voteToCloseQuestion } from "../../services/closeVoteService";
import { useTranslation } from "react-i18next";
import { Question as BaseQuestion } from "@/types/questions";

// Extra fields used only in VoteToClose
interface CloseVote {
  userId: string;
  reason: string;
  votedAt?: string | Date;
}

// Extend the shared Question type
interface VoteCloseQuestion extends BaseQuestion {
  closeVotes?: CloseVote[];
  closedAt?: string | Date | null;
}

interface User {
  _id?: string;
  id?: string;
  reputation?: number;
}

interface VoteToCloseProps {
  question: VoteCloseQuestion;
  user: User;
  onQuestionUpdate: (question: VoteCloseQuestion) => void;
}

const VoteToClose = ({
  question,
  user,
  onQuestionUpdate,
}: VoteToCloseProps) => {
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOpenModal = () => {
    const isOwnQuestion =
      String(question.userid) === String(user._id || user.id);

    if (isOwnQuestion) {
      toast.info(
        t("toast.you_cannot_vote_to_close_your_own_question")
      );
      return;
    }

    const alreadyVoted = question.closeVotes?.some(
      (vote) =>
        String(vote.userId) === String(user._id || user.id)
    );

    if (alreadyVoted) {
      toast.info(
        t("alert.you_have_already_voted_to_close_this_question")
      );
      return;
    }

    setIsOpen(true);
  };

  const handleSubmit = async () => {
    if (!reason) return;

    try {
      setLoading(true);

      const data = await voteToCloseQuestion(question._id, reason);

      toast.success(t(`message.${data.message}`));

      onQuestionUpdate({
        ...question,
        isClosed: data.isClosed,
      });

      setReason("");
      setIsOpen(false);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;

        toast.error(
          message
            ? t(`message.${message}`)
            : t("message.failed_to_vote_to_close_question")
        );
      } else {
        toast.error(
          t("message.failed_to_vote_to_close_question")
        );
      }
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