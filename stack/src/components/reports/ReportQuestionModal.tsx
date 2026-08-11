import { useState,useEffect } from "react";

interface ReportQuestionModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (reason: string, details: string) => void;
}

export default function ReportQuestionModal({
  open,
  onClose,
  onSubmit,
}: ReportQuestionModalProps) {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  useEffect(() => {
  if (open) {
    document.body.style.overflow = "hidden";
  }

  return () => {
    document.body.style.overflow = "";
  };
}, [open]);

  if (!open) return null;

  const reasons = [
    "Spam",
    "Harassment or Hate",
    "Violence",
    "Nudity or Sexual Content",
    "Misinformation",
    "Copyright",
    "Other",
  ];

  return (
    <div
  className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 px-4"
  onClick={onClose}
>
      <div
  className="w-full max-w-md max-h-[85vh] overflow-y-auto rounded-lg bg-white p-6 shadow-xl"
  onClick={(event) => event.stopPropagation()}
>
        <h2 className="text-lg font-semibold">Report Question</h2>

        <p className="mt-1 text-sm text-gray-600">
          Select the reason for reporting this question.
        </p>

        <div className="mt-4 space-y-3">
          {reasons.map((item) => (
            <label
              key={item}
              className="flex cursor-pointer items-center gap-3 rounded-md border p-3 hover:bg-gray-50"
            >
              <input
                type="radio"
                name="questionReportReason"
                value={item}
                checked={reason === item}
                onChange={(event) => setReason(event.target.value)}
              />

              <span className="text-sm text-gray-700">{item}</span>
            </label>
          ))}
        </div>

        {reason === "Other" && (
          <textarea
            value={details}
            onChange={(event) => setDetails(event.target.value)}
            placeholder="Explain the issue..."
            className="mt-4 min-h-24 w-full rounded-md border p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border px-4 py-2 text-sm hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={!reason || (reason === "Other" && !details.trim())}
            onClick={() => onSubmit(reason, details)}
            className="rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Submit Report
          </button>
        </div>
      </div>
    </div>
  );
}