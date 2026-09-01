"use client";

import {
  useEffect,
  useState,
} from "react";

import { Headphones } from "lucide-react";

import { useTranslation } from "react-i18next";

import {
  getSupportRequests,
  resolveSupportRequest,
} from "@/components/services/supportService";

interface SupportRequest {
  _id: string;

  subject: string;
  message: string;
  plan: string;
  priority: string;
  status: string;
  createdAt: string;

  userId?: {
    _id: string;
    name?: string;
    email?: string;
  };
}

const AdminSupportPage = () => {
  const { t } = useTranslation([
    "support",
    "subscription",
  ]);

  const [
    requests,
    setRequests,
  ] = useState<SupportRequest[]>(
    []
  );

  const [
    loading,
    setLoading,
  ] = useState(true);

  useEffect(() => {
    const loadRequests =
      async (): Promise<void> => {
        try {
          const data =
            await getSupportRequests();

          setRequests(
            data.supportRequests ||
              []
          );
        } catch (error: unknown) {
          console.error(
            "Failed to load support requests:",
            error
          );
        } finally {
          setLoading(false);
        }
      };

    void loadRequests();
  }, []);

  // Resolve support request

  const handleResolve = async (
    id: string
  ): Promise<void> => {
    try {
      await resolveSupportRequest(
        id
      );

      setRequests(
        (previousRequests) =>
          previousRequests.map(
            (request) =>
              request._id === id
                ? {
                    ...request,
                    status:
                      "resolved",
                  }
                : request
          )
      );
    } catch (error: unknown) {
      console.error(
        "Failed to resolve support request:",
        error
      );

      alert(
        t(
          "admin.messages.failed_to_resolve_support_request",
          {
            ns: "support",
          }
        )
      );
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-gray-500">
        {t(
          "admin.status.loading_support_requests",
          {
            ns: "support",
          }
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-full bg-orange-100 p-3">
            <Headphones className="h-6 w-6 text-orange-600" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {t(
                "admin.title.support_requests",
                {
                  ns: "support",
                }
              )}
            </h1>

            <p className="text-sm text-gray-500">
              {t(
                "admin.messages.manage_priority_customer_support_requests",
                {
                  ns: "support",
                }
              )}
            </p>
          </div>
        </div>

        {requests.length === 0 ? (
          <div className="rounded-xl border bg-white p-8 text-center text-gray-500">
            {t(
              "admin.messages.no_support_requests_yet",
              {
                ns: "support",
              }
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map(
              (request) => (
                <div
                  key={request._id}
                  className="rounded-xl border bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="font-semibold text-gray-900">
                        {
                          request.subject
                        }
                      </h2>

                      <p className="mt-1 text-sm text-gray-500">
                        {request
                          .userId
                          ?.name ||
                          t(
                            "admin.labels.user",
                            {
                              ns: "support",
                            }
                          )}

                        {request
                          .userId
                          ?.email &&
                          ` • ${request.userId.email}`}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          request.plan ===
                          "Gold"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-slate-200 text-slate-700"
                        }`}
                      >
                        {t(
                          `plans.names.${request.plan.toLowerCase()}`,
                          {
                            ns: "subscription",
                          }
                        )}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          request.priority ===
                          "highest"
                            ? "bg-red-100 text-red-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {request.priority ===
                        "highest"
                          ? t(
                              "admin.priority.highest_priority",
                              {
                                ns: "support",
                              }
                            )
                          : t(
                              "admin.priority.priority",
                              {
                                ns: "support",
                              }
                            )}
                      </span>
                    </div>
                  </div>

                  <p className="mt-4 text-sm text-gray-700">
                    {request.message}
                  </p>

                  <div className="mt-4 flex flex-col gap-3 border-t pt-3 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={
                          request.status ===
                          "resolved"
                            ? "font-medium text-green-600"
                            : "font-medium text-orange-600"
                        }
                      >
                        {t(
                          "admin.labels.status",
                          {
                            ns: "support",
                          }
                        )}
                        :{" "}
                        {t(
                          `admin.status.${request.status}`,
                          {
                            ns: "support",
                          }
                        )}
                      </span>

                      {request.status !==
                        "resolved" && (
                        <button
                          type="button"
                          onClick={() =>
                            void handleResolve(
                              request._id
                            )
                          }
                          className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700"
                        >
                          {t(
                            "admin.actions.resolve",
                            {
                              ns: "support",
                            }
                          )}
                        </button>
                      )}
                    </div>

                    <span>
                      {new Date(
                        request.createdAt
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSupportPage;