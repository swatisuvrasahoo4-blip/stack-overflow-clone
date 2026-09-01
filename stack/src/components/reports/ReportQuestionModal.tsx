import {
  useEffect,
  useState,
} from "react";

import { useTranslation } from "react-i18next";

interface ReportQuestionModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    reason: string,
    details: string
  ) => void | Promise<void>;
}

const reasons = [
  "spam",
  "harassment_or_hate",
  "violence",
  "nudity_or_sexual_content",
  "misinformation",
  "copyright",
  "other",
];

const ReportQuestionModal = ({
  open,
  onClose,
  onSubmit,
}: ReportQuestionModalProps) => {
  const { t } =
    useTranslation("reports");

  const [
    reason,
    setReason,
  ] = useState("");

  const [
    details,
    setDetails,
  ] = useState("");

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [open]);

  const handleClose = () => {
    setReason("");
    setDetails("");
    onClose();
  };

  const handleSubmit =
    async () => {
      await onSubmit(
        reason,
        details
      );

      setReason("");
      setDetails("");
    };

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 px-4"
      onClick={handleClose}
    >
      <div
        className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-lg bg-white p-6 shadow-xl"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <h2 className="text-lg font-semibold">
          {t(
            "question.title"
          )}
        </h2>

        <p className="mt-1 text-sm text-gray-600">
          {t(
            "question.select_reason"
          )}
        </p>

        <div className="mt-4 space-y-3">
          {reasons.map(
            (item) => (
              <label
                key={item}
                className="flex cursor-pointer items-center gap-3 rounded-md border p-3 hover:bg-gray-50"
              >
                <input
                  type="radio"
                  name="questionReportReason"
                  value={item}
                  checked={
                    reason === item
                  }
                  onChange={(
                    event
                  ) =>
                    setReason(
                      event.target
                        .value
                    )
                  }
                />

                <span className="text-sm text-gray-700">
                  {t(
                    `reasons.${item}`
                  )}
                </span>
              </label>
            )
          )}
        </div>

        {reason ===
          "other" && (
          <textarea
            value={details}
            onChange={(
              event
            ) =>
              setDetails(
                event.target
                  .value
              )
            }
            placeholder={t(
              "question.explain_issue"
            )}
            className="mt-4 min-h-24 w-full rounded-md border p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-md border px-4 py-2 text-sm hover:bg-gray-100"
          >
            {t(
              "actions.cancel"
            )}
          </button>

          <button
            type="button"
            disabled={
              !reason ||
              (reason ===
                "other" &&
                !details.trim())
            }
            onClick={() =>
              void handleSubmit()
            }
            className="rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t(
              "actions.submit_report"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportQuestionModal;