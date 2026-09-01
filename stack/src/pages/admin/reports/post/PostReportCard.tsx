import Link from "next/link";
import { useTranslation } from "react-i18next";

type ReportStatus =
  | "pending"
  | "reviewed"
  | "dismissed"
  | "action_taken";

interface ReportUser {
  _id: string;
  name?: string;
  username?: string;
  profilePhoto?: string;
  isSuspended?: boolean;
}

interface ReportPost {
  _id: string;
  content?: string;
  image?: string;
}

interface ReportItem {
  _id: string;
  reason: string;
  status: ReportStatus;
  createdAt: string;
  details?: string;
  postId?: ReportPost | null;
  reporterId?: ReportUser | null;
  postAuthorId?: ReportUser | null;
  violationCount: number;
  isRepeatOffender?: boolean;
}

interface PostReportCardProps {
  report: ReportItem;
  updatingId: string | null;
  handleStatusChange: (
    reportId: string,
    status: ReportStatus
  ) => Promise<void>;
  handleSuspend: (
    userId: string
  ) => void;
  handleUnsuspend: (
    userId: string
  ) => void;
}

const PostReportCard = ({
  report,
  updatingId,
  handleStatusChange,
  handleSuspend,
  handleUnsuspend,
}: PostReportCardProps) => {
  const { t } =
    useTranslation("reports");

  if (!report) {
    return null;
  }

  return (
    <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="p-6">
        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                {report.reason}
              </span>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                  report.status ===
                  "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : report.status ===
                        "reviewed"
                      ? "bg-blue-100 text-blue-700"
                      : report.status ===
                          "dismissed"
                        ? "bg-gray-200 text-gray-700"
                        : "bg-green-100 text-green-700"
                }`}
              >
                {t(
                  `admin.stats.${report.status}`
                )}
              </span>

              {report.postAuthorId
                ?.isSuspended && (
                <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">
                  {t(
                    "admin.post.user_suspended"
                  )}
                </span>
              )}
            </div>

            <p className="text-xs text-gray-500">
              {new Date(
                report.createdAt
              ).toLocaleString()}
            </p>
          </div>

          <div className="rounded-xl border border-gray-100 bg-gray-50 p-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
              {t(
                "admin.post.reported_post"
              )}
            </p>

            <p className="text-base font-medium leading-7 text-gray-900">
              {report.postId
                ?.content ||
                t(
                  "admin.post.reported_post_unavailable"
                )}
            </p>

            {report.postId
              ?.image && (
              <img
                src={
                  report.postId.image
                }
                alt={t(
                  "admin.accessibility.reported_post"
                )}
                className="mt-4 max-h-72 w-full rounded-lg object-cover"
              />
            )}
          </div>

          {report.details && (
            <div className="rounded-lg border border-orange-100 bg-orange-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-orange-700">
                {t(
                  "admin.common.additional_details"
                )}
              </p>

              <p className="mt-1 text-sm text-gray-700">
                {report.details}
              </p>
            </div>
          )}

          <div className="grid gap-4 rounded-xl border border-gray-100 p-4 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-xs font-medium uppercase text-gray-400">
                {t(
                  "admin.common.reporter"
                )}
              </p>

              {report.reporterId && (
                <Link
                  href={`/users/${report.reporterId._id}`}
                  className="flex items-center gap-3 rounded-lg p-2 transition hover:bg-gray-100"
                >
                  {report.reporterId
                    .profilePhoto ? (
                    <img
                      src={
                        report
                          .reporterId
                          .profilePhoto
                      }
                      alt={t(
                        "admin.accessibility.reporter"
                      )}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-600 font-semibold text-white">
                      {(
                        report
                          .reporterId
                          .name ||
                        report
                          .reporterId
                          .username ||
                        "U"
                      )[0].toUpperCase()}
                    </div>
                  )}

                  <span className="font-medium text-blue-600 hover:underline">
                    {report.reporterId
                      .name ||
                      report.reporterId
                        .username ||
                      t(
                        "admin.common.unknown_user"
                      )}
                  </span>
                </Link>
              )}
            </div>

            <div>
              <p className="mb-2 text-xs font-medium uppercase text-gray-400">
                {t(
                  "admin.post.post_author"
                )}
              </p>

              {report.postAuthorId && (
                <>
                  <Link
                    href={`/users/${report.postAuthorId._id}`}
                    className="flex items-center gap-3 rounded-lg p-2 transition hover:bg-gray-100"
                  >
                    {report
                      .postAuthorId
                      .profilePhoto ? (
                      <img
                        src={
                          report
                            .postAuthorId
                            .profilePhoto
                        }
                        alt={t(
                          "admin.accessibility.post_author"
                        )}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-600 font-semibold text-white">
                        {(
                          report
                            .postAuthorId
                            .name ||
                          report
                            .postAuthorId
                            .username ||
                          "U"
                        )[0].toUpperCase()}
                      </div>
                    )}

                    <span className="font-medium text-blue-600 hover:underline">
                      {report
                        .postAuthorId
                        .name ||
                        report
                          .postAuthorId
                          .username ||
                        t(
                          "admin.common.unknown_user"
                        )}
                    </span>
                  </Link>

                  {report.violationCount >
                    0 && (
                    <div className="ml-2 mt-2 flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          report.isRepeatOffender
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {report.isRepeatOffender
                          ? t(
                              "admin.violations.repeat_offender"
                            )
                          : t(
                              "admin.violations.previous_violation"
                            )}
                      </span>

                      <span className="text-xs text-gray-500">
                        {report.violationCount ===
                        1
                          ? t(
                              "admin.violations.confirmed_violation",
                              {
                                count:
                                  report.violationCount,
                              }
                            )
                          : t(
                              "admin.violations.confirmed_violations",
                              {
                                count:
                                  report.violationCount,
                              }
                            )}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
        <button
          type="button"
          disabled={
            updatingId ===
              report._id ||
            report.status ===
              "reviewed"
          }
          onClick={() =>
            void handleStatusChange(
              report._id,
              "reviewed"
            )
          }
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {report.status ===
          "reviewed"
            ? t(
                "admin.stats.reviewed"
              )
            : t(
                "admin.actions.mark_reviewed"
              )}
        </button>

        <button
          type="button"
          disabled={
            updatingId ===
              report._id ||
            report.status ===
              "dismissed"
          }
          onClick={() =>
            void handleStatusChange(
              report._id,
              "dismissed"
            )
          }
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {report.status ===
          "dismissed"
            ? t(
                "admin.stats.dismissed"
              )
            : t(
                "admin.actions.dismiss"
              )}
        </button>

        <button
          type="button"
          disabled={
            updatingId ===
              report._id ||
            report.status ===
              "action_taken"
          }
          onClick={() =>
            void handleStatusChange(
              report._id,
              "action_taken"
            )
          }
          className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {t(
            "admin.stats.action_taken"
          )}
        </button>

        {report.postAuthorId &&
          (report.postAuthorId
            .isSuspended ? (
            <button
              type="button"
              onClick={() =>
                handleUnsuspend(
                  report
                    .postAuthorId!._id
                )
              }
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
            >
              {t(
                "admin.actions.unsuspend_user"
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={() =>
                handleSuspend(
                  report
                    .postAuthorId!._id
                )
              }
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              {t(
                "admin.actions.suspend_user"
              )}
            </button>
          ))}
      </div>
    </article>
  );
};

export default PostReportCard;