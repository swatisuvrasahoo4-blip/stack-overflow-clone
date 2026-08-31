"use client";

import { useTranslation } from "react-i18next";

interface CloseVoteModalProps {
  isOpen: boolean;
  reason: string;
  loading: boolean;
  onReasonChange: (reason: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}

const reasons = [
  "duplicate_question",
  "off_topic",
  "unclear",
  "needs_more_details",
  "other",
];

const CloseVoteModal = ({
  isOpen,
  reason,
  loading,
  onReasonChange,
  onClose,
  onSubmit,
}: CloseVoteModalProps) => {
  const { t } = useTranslation();

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-[90%] max-w-md rounded-lg bg-white p-6 shadow-xl">
        {/* Modal heading */}

        <h2 className="text-xl font-semibold text-gray-900">
          {t("votetoclose.vote_to_close_question")}
        </h2>

        <p className="mt-2 text-sm text-gray-600">
          {t("votetoclose.select_the_reason")}
        </p>

        {/* Close reasons */}

        <div className="mt-5 space-y-3">
          {reasons.map((item) => (
            <label
              key={item}
              className="flex cursor-pointer items-center gap-3 rounded-md border p-3 hover:bg-gray-50"
            >
              <input
                type="radio"
                name="closeReason"
                value={item}
                checked={reason === item}
                onChange={() =>
                  onReasonChange(item)
                }
              />

              <span className="text-sm text-gray-700">
                {t(`votetoclose.${item}`)}
              </span>
            </label>
          ))}
        </div>

        {/* Modal actions */}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-md border px-4 py-2 text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t("votetoclose.cancel")}
          </button>

          <button
            type="button"
            onClick={onSubmit}
            disabled={!reason || loading}
            className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? t("votetoclose.submitting")
              : t("votetoclose.submit_vote")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CloseVoteModal;