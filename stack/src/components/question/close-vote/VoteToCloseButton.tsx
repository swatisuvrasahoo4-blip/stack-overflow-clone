"use client";

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

  if (reputation < 250) {
    return null;
  }

  return (
    <button
      onClick={onClick}
      className="px-2 py-1 rounded border border-red-400 text-red-500 hover:bg-red-50 transition whitespace-nowrap"
    >
      Vote to Close
    </button>
  );
};

export default VoteToCloseButton;