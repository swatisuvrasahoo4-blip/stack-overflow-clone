"use client";

import { useTranslation } from "react-i18next";

interface VoteToCloseButtonProps {
  reputation: number;
  isClosed: boolean;
  onClick: () => void;
}

const VoteToCloseButton = ({
  reputation,
  isClosed,
  onClick,
}: VoteToCloseButtonProps) => {
  const { t } =
    useTranslation("questions");

  const handleClick = () => {
    if (reputation < 250) {
      alert(
        t(
          "messages.close_vote_reputation_required"
        )
      );

      return;
    }

    onClick();
  };

  if (isClosed) {
    return (
      <button
        type="button"
        disabled
        className="cursor-not-allowed rounded-md bg-red-100 px-4 py-2 text-red-600"
      >
        {t("status.question_closed")}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="w-28 break-words rounded border border-red-400 px-2 py-1 text-red-500 transition hover:bg-red-50"
    >
      {t("actions.vote_to_close")}
    </button>
  );
};

export default VoteToCloseButton;