"use client";

import { useState } from "react";

import axios from "axios";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import type { Question as BaseQuestion } from "@/types/questions";

import { voteToCloseQuestion } from "../../services/closeVoteService";
import CloseVoteModal from "./CloseVoteModal";
import VoteToCloseButton from "./VoteToCloseButton";

interface CloseVote {
  userId: string;
  reason: string;
  votedAt?: string | Date;
}

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
    const currentUserId = user._id || user.id;

    const isOwnQuestion =
      String(question.userid) === String(currentUserId);

    if (isOwnQuestion) {
      toast.info(
        t(
          "toast.you_cannot_vote_to_close_your_own_question"
        )
      );

      return;
    }

    const alreadyVoted = question.closeVotes?.some(
      (vote) =>
        String(vote.userId) === String(currentUserId)
    );

    if (alreadyVoted) {
      toast.info(
        t(
          "alert.you_have_already_voted_to_close_this_question"
        )
      );

      return;
    }

    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setReason("");
  };

  const handleSubmit = async (): Promise<void> => {
    if (!reason) {
      return;
    }

    try {
      setLoading(true);

      const data = await voteToCloseQuestion(
        question._id,
        reason
      );

      toast.success(
        t(`message.${data.message}`)
      );

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
            : t(
                "message.failed_to_vote_to_close_question"
              )
        );
      } else {
        toast.error(
          t(
            "message.failed_to_vote_to_close_question"
          )
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user || !question) {
    return null;
  }

  return (
    <>
      {/* Vote to close button */}

      <VoteToCloseButton
        reputation={user.reputation || 0}
        isClosed={question.isClosed || false}
        onClick={handleOpenModal}
      />

      {/* Close vote modal */}

      <CloseVoteModal
        isOpen={isOpen}
        reason={reason}
        loading={loading}
        onReasonChange={setReason}
        onClose={handleCloseModal}
        onSubmit={() => void handleSubmit()}
      />
    </>
  );
};

export default VoteToClose;