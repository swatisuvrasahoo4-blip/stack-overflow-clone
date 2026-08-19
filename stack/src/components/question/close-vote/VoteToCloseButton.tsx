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
  const {t} = useTranslation();
  if (isClosed) {
    return (
      <button
        disabled
        className="px-4 py-2 rounded-md bg-red-100 text-red-600 cursor-not-allowed"
      >
        Question Closed
      </button>
    );
  }
  return (
    <button
      onClick={() => {
  if (reputation < 250) {
    alert("You need at least 250 reputation points to vote to close questions.");
    return;
  }

  onClick();
}}
      className="px-2 py-1 rounded border border-red-400 text-red-500 hover:bg-red-50 transition w-28 wrap-break-words"
    >
      {t("community.voteToClose")}
    </button>
  );
};

export default VoteToCloseButton;