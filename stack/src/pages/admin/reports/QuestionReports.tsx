interface QuestionReportsProps {
  reports: any[];
  updatingId: string | null;
  onStatusChange: (
    reportId: string,
    status: "pending" | "reviewed" | "dismissed" | "action_taken"
  ) => Promise<any>;
}

export default function QuestionReports({
  reports,
  updatingId,
  onStatusChange,
}: QuestionReportsProps) {
  const questionReports = (reports || []).filter(
  (report) => report.questionId
);
const reportStats = {
  pending: questionReports.filter(
    (report) => report.status === "pending"
  ).length,

  reviewed: questionReports.filter(
    (report) => report.status === "reviewed"
  ).length,

  dismissed: questionReports.filter(
    (report) => report.status === "dismissed"
  ).length,

  actionTaken: questionReports.filter(
    (report) => report.status === "action_taken"
  ).length,
};


  return (
    <div className="space-y-6">

  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <p className="text-sm text-gray-500">Pending</p>
      <p className="mt-2 text-3xl font-semibold text-yellow-600">
        {reportStats.pending}
      </p>
    </div>

    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <p className="text-sm text-gray-500">Reviewed</p>
      <p className="mt-2 text-3xl font-semibold text-blue-600">
        {reportStats.reviewed}
      </p>
    </div>

    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <p className="text-sm text-gray-500">Dismissed</p>
      <p className="mt-2 text-3xl font-semibold text-gray-700">
        {reportStats.dismissed}
      </p>
    </div>

    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <p className="text-sm text-gray-500">Action Taken</p>
      <p className="mt-2 text-3xl font-semibold text-red-600">
        {reportStats.actionTaken}
      </p>
    </div>
  </div>
    <div className="rounded-xl border border-gray-200 bg-white p-6">
     {questionReports.length === 0 ? (
  <p className="text-gray-600">
    No question reports found.
  </p>
) : (
  <div className="space-y-4">
    {questionReports.map((report) => (
      <div
        key={report._id}
        className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
      >
        <div className="mb-5 flex flex-wrap items-center gap-2">
  <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
    {report.reason}
  </span>

  <span
    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
      report.status === "pending"
        ? "bg-yellow-100 text-yellow-700"
        : report.status === "reviewed"
        ? "bg-blue-100 text-blue-700"
        : report.status === "dismissed"
        ? "bg-gray-100 text-gray-700"
        : "bg-green-100 text-green-700"
    }`}
  >
    {report.status?.replace("_", " ")}
  </span>
  <span className="ml-auto text-xs text-gray-400">
  {new Date(report.createdAt).toLocaleString()}
</span>
</div>
       <div className="rounded-xl border border-gray-100 bg-gray-50 p-5">
  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
    Reported Question
  </p>

  <p className="text-base font-medium leading-7 text-gray-900">
    {report.questionId?.questiontitle || "Reported question unavailable."}
  </p>

  {report.questionId?.questionbody && (
    <p className="mt-2 text-sm text-gray-600">
      {report.questionId.questionbody}
    </p>
  )}
</div>


       {report.details && (
  <div className="mt-4 rounded-lg border border-orange-100 bg-orange-50 p-4">
    <p className="text-xs font-semibold uppercase tracking-wide text-orange-700">
      Additional Details
    </p>

    <p className="mt-1 text-sm text-gray-700">
      {report.details}
    </p>

  </div>
)}
<div className="mt-5 grid gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4 sm:grid-cols-2">

  <div>
    <p className="mb-2 text-xs font-medium uppercase text-gray-400">
      Reporter
    </p>

    <div className="flex items-center gap-3">
  {report.reporterId?.profilePhoto ? (
    <img
      src={report.reporterId.profilePhoto}
      alt="Reporter"
      className="h-10 w-10 rounded-full object-cover"
    />
  ) : (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-600 text-white">
      {(report.reporterId?.name ||
        report.reporterId?.username ||
        "U")[0].toUpperCase()}
    </div>
  )}

  <span className="font-medium text-blue-600">
    {report.reporterId?.name ||
      report.reporterId?.username ||
      "Unknown User"}
  </span>
</div>
  </div>

  <div>
    <p className="mb-2 text-xs font-medium uppercase text-gray-400">
      Question Author
    </p>

    <div className="flex items-center gap-3">
  {report.questionAuthorId?.profilePhoto ? (
    <img
      src={report.questionAuthorId.profilePhoto}
      alt="Question Author"
      className="h-10 w-10 rounded-full object-cover"
    />
  ) : (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-600 text-white">
      {(report.questionAuthorId?.name ||
        report.questionAuthorId?.username ||
        "U")[0].toUpperCase()}
    </div>
  )}

  <span className="font-medium text-blue-600">
    {report.questionAuthorId?.name ||
      report.questionAuthorId?.username ||
      "Unknown User"}
  </span>
</div>
  </div>
<div className="mt-5 flex flex-wrap gap-3 border-t border-gray-200 pt-4">

  {/* Mark Reviewed */}
  <button
    type="button"
    disabled={
      updatingId === report._id ||
      report.status === "reviewed"
    }
    onClick={() => onStatusChange(report._id, "reviewed")}
    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white
               hover:bg-blue-700
               disabled:cursor-not-allowed disabled:opacity-40"
  >
    {report.status === "reviewed" ? "Reviewed" : "Mark Reviewed"}
  </button>

  {/* Dismiss */}
  <button
    type="button"
    disabled={
      updatingId === report._id ||
      report.status === "dismissed"
    }
    onClick={() => onStatusChange(report._id, "dismissed")}
    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700
               hover:bg-gray-50
               disabled:cursor-not-allowed disabled:opacity-40"
  >
    {report.status === "dismissed" ? "Dismissed" : "Dismiss"}
  </button>

  {/* Action Taken */}
  <button
    type="button"
    disabled={
      updatingId === report._id ||
      report.status === "action_taken"
    }
    onClick={() => onStatusChange(report._id, "action_taken")}
    className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white
               hover:bg-orange-700
               disabled:cursor-not-allowed disabled:opacity-40"
  >
    {report.status === "action_taken"
      ? "Action Taken"
      : "Action Taken"}
  </button>

</div>
</div>
      </div>
    ))}
  </div>
)}

    </div>
    </div>
  );
}