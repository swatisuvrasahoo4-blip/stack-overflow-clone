import Link from "next/link";
import { useState } from "react";

interface PostReportsProps {
  reports: any[];
  reportStats: {
    pending: number;
    reviewed: number;
    dismissed: number;
    actionTaken: number;
  };
  handleStatusUpdate: (
  reportId: string,
  status: "pending" | "reviewed" | "dismissed" | "action_taken"
) => Promise<any>;
  handleSuspend: (userId: string) => void;
  handleUnsuspend: (userId: string) => void;
}

const PostReports = ({
  reports,
  reportStats,
  handleStatusUpdate,
  handleSuspend,
  handleUnsuspend,
}: PostReportsProps) => {
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const handleStatusChange = async (
  reportId: string,
  status: "pending" | "reviewed" | "dismissed" | "action_taken"
) => {
  try {
    setUpdatingId(reportId);
    await handleStatusUpdate(reportId, status);
  } finally {
    setUpdatingId(null);
  }
};
  return (
  <>
  <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <p className="text-sm text-gray-500">Pending</p>
      <h2 className="mt-2 text-3xl font-bold text-yellow-600">
        {reportStats?.pending ?? 0}
      </h2>
    </div>

    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <p className="text-sm text-gray-500">Reviewed</p>
      <h2 className="mt-2 text-3xl font-bold text-blue-600">
        {reportStats?.reviewed ?? 0}
      </h2>
    </div>

    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <p className="text-sm text-gray-500">Dismissed</p>
      <h2 className="mt-2 text-3xl font-bold text-gray-700">
        {reportStats?.dismissed ?? 0}
      </h2>
    </div>

    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <p className="text-sm text-gray-500">Action Taken</p>
      <h2 className="mt-2 text-3xl font-bold text-red-600">
        {reportStats?.actionTaken ?? 0}
      </h2>
    </div>
  </div>
       {! reports || reports.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          <p className="text-base font-medium text-gray-700">
            No reports found
          </p>

          <p className="mt-1 text-sm text-gray-500">
            New reported posts will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {reports
  .filter((report) => report.postId)
  .map((report) => (
            <article
              key={report._id}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
            >
              <div className="p-6">
                <div className="flex flex-col gap-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
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
                                ? "bg-gray-200 text-gray-700"
                                : "bg-green-100 text-green-700"
                        }`}
                      >
                        {report.status.replace("_", " ")}
                      </span>

                      {report.postAuthorId?.isSuspended && (
                        <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">
                          User Suspended
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-gray-500">
                      {new Date(report.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="rounded-xl border border-gray-100 bg-gray-50 p-5">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Reported post
                    </p>

                    <p className="text-base font-medium leading-7 text-gray-900">
                      {report.postId?.content ||
                        "Reported post unavailable."}
                    </p>
                    

                    {report.postId?.image && (
                      <img
                        src={report.postId.image}
                        alt="Reported post"
                        className="mt-4 max-h-72 w-full rounded-lg object-cover"
                      />
                    )}
                  </div>

                  {report.details && (
                    <div className="rounded-lg border border-orange-100 bg-orange-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-orange-700">
                        Additional details
                      </p>

                      <p className="mt-1 text-sm text-gray-700">
                        {report.details}
                      </p>
                    </div>
                  )}

                  <div className="grid gap-4 rounded-xl border border-gray-100 p-4 sm:grid-cols-2">
                   <div className="grid gap-4 rounded-xl border border-gray-100 p-4 sm:grid-cols-2">
  {/* Reporter */}
  <div>
    <p className="mb-2 text-xs font-medium uppercase text-gray-400">
      Reporter
    </p>

    {report.reporterId && (
      <Link
        href={`/users/${report.reporterId._id}`}
        className="flex items-center gap-3 rounded-lg p-2 transition hover:bg-gray-100"
      >
        {report.reporterId.profilePhoto ? (
          <img
            src={report.reporterId.profilePhoto}
            alt="Reporter"
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-600 font-semibold text-white">
            {(report.reporterId.name ||
              report.reporterId.username ||
              "U")[0].toUpperCase()}
          </div>
        )}

        <span className="font-medium text-blue-600 hover:underline">
          {report.reporterId.name ||
            report.reporterId.username}
        </span>
      </Link>
    )}
  </div>

  {/* Post Author */}
  <div>
    <p className="mb-2 text-xs font-medium uppercase text-gray-400">
      Post Author
    </p>

    {report.postAuthorId && (
      <Link
        href={`/users/${report.postAuthorId._id}`}
        className="flex items-center gap-3 rounded-lg p-2 transition hover:bg-gray-100"
      >
        {report.postAuthorId.profilePhoto ? (
          <img
            src={report.postAuthorId.profilePhoto}
            alt="Author"
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-600 font-semibold text-white">
            {(report.postAuthorId.name ||
              report.postAuthorId.username ||
              "U")[0].toUpperCase()}
          </div>
        )}

        <span className="font-medium text-blue-600 hover:underline">
          {report.postAuthorId.name ||
            report.postAuthorId.username}
        </span>
      </Link>
    )}
  </div>
</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
                {/* Mark Reviewed */}
<button
  type="button"
  disabled={
    updatingId === report._id ||
    report.status === "reviewed"
  }
  onClick={() => handleStatusChange(report._id, "reviewed")}
  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
>
  {report.status === "reviewed"
    ? "Reviewed"
    : "Mark Reviewed"}
</button>

{/* Dismiss */}
<button
  type="button"
  disabled={
    updatingId === report._id ||
    report.status === "dismissed"
  }
  onClick={() => handleStatusChange(report._id, "dismissed")}
  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
>
  {report.status === "dismissed"
    ? "Dismissed"
    : "Dismiss"}
</button>

{/* Action Taken */}
<button
  type="button"
  disabled={
    updatingId === report._id ||
    report.status === "action_taken"
  }
  onClick={() => handleStatusChange(report._id, "action_taken")}
  className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-40"
>
  Action Taken
</button>

                {report.postAuthorId &&
                  (report.postAuthorId.isSuspended ? (
                    <button
                      type="button"
                      onClick={() =>
                        handleUnsuspend(report.postAuthorId!._id)
                      }
                      className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                    >
                      Unsuspend User
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        handleSuspend(report.postAuthorId!._id)
                      }
                      className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                    >
                      Suspend User
                    </button>
                  ))}
              </div>
            </article>
          ))}
        </div>
      )}
</>
  );
};

export default PostReports;