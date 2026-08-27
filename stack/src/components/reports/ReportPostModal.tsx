import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

interface ReportPostModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (reason: string, details: string) => void;
}

export default function ReportPostModal({
  open,
  onClose,
  onSubmit,
}: ReportPostModalProps) {
  const {t} = useTranslation();
    const [reason, setReason] = useState("");
const [details, setDetails] = useState("");

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
       className="w-full max-w-md max-h-[85vh] overflow-y-auto rounded-lg bg-white p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="text-lg font-semibold">{t("report.report_post")}</h2>

        <p className="mt-1 text-sm text-gray-600">
          {t("report.select_the_reason_for_reporting_this_post")}
        </p>
<div className="mt-4 space-y-3">
  {[
     "spam",
    "harassment_or_hate",
    "violence",
    "nudity_or_sexual_content",
    "misinformation",
    "copyright",
    "other",
  ].map((item) => (
    <label
      key={item}
      className="flex cursor-pointer items-center gap-3 rounded-md border p-3 hover:bg-gray-50"
    >
      <input
        type="radio"
        name="reportReason"
        value={item}
        checked={reason === item}
        onChange={(event) => setReason(event.target.value)}
      />

      <span className="text-sm text-gray-700">{t(`report.${item}`)}</span>
    </label>
  ))}
</div>

{reason === "Other" && (
  <textarea
    value={details}
    onChange={(event) => setDetails(event.target.value)}
    placeholder={t("report.explain_the_issue")}
    className="mt-4 min-h-24 w-full rounded-md border p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
  />
)}

<div className="mt-6 flex justify-end gap-3">
  <button
    type="button"
    onClick={onClose}
    className="rounded-md border px-4 py-2 text-sm hover:bg-gray-100"
  >
    {t("report.cancel")}
  </button>

  <button
    type="button"
    disabled={!reason || (reason === "Other" && !details.trim())}
    onClick={() => onSubmit(reason, details)}
    className="rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
  >
    {t("report.submit_report")}
  </button>
</div>
      </div>
    </div>
  );
}