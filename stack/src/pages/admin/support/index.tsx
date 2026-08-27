"use client";

import { useEffect, useState } from "react";
import { getSupportRequests, resolveSupportRequest } from "@/components/services/supportService";
import { Headphones } from "lucide-react";
import { useTranslation } from "react-i18next";

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

export default function AdminSupportPage() {
  const {t} = useTranslation();
  const [requests, setRequests] = useState<SupportRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRequests = async () => {
      try {
        const data = await getSupportRequests();

        setRequests(data.supportRequests || []);
      } catch (error) {
        console.error("Failed to load support requests:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRequests();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-gray-500">
        {t("support.loading_support_requests")}
      </div>
    );
  }

  const handleResolve = async (id: string) => {
  try {
    await resolveSupportRequest(id);

    setRequests((prev) =>
      prev.map((request) =>
        request._id === id
          ? { ...request, status: "resolved" }
          : request
      )
    );
  } catch (error) {
    alert(t("alert.failed_to_resolve_support_request"));
  }
};

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-full bg-orange-100 p-3">
            <Headphones className="h-6 w-6 text-orange-600" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {t("support.support_requests")}
            </h1>

            <p className="text-sm text-gray-500">
              {t("support.manage_priority_customer_support_requests")}
            </p>
          </div>
        </div>

        {requests.length === 0 ? (
          <div className="rounded-xl border bg-white p-8 text-center text-gray-500">
            {t("support.no_support_requests_yet")}
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div
                key={request._id}
                className="rounded-xl border bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="font-semibold text-gray-900">
                      {request.subject}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      {request.userId?.name || "User"}
                      {request.userId?.email &&
                        ` • ${request.userId.email}`}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        request.plan === "Gold"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {t(`subscription.${request.plan.toLowerCase()}`)}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        request.priority === "highest"
                          ? "bg-red-100 text-red-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {request.priority === "highest"
                        ? t("support.highest_priority")
                        : t("support.priority")}
                    </span>
                  </div>
                </div>

                <p className="mt-4 text-sm text-gray-700">
                  {request.message}
                </p>

                <div className="mt-4 flex items-center justify-between border-t pt-3 text-xs text-gray-500">
                  <div className="flex items-center gap-3">
  <span
    className={
      request.status === "resolved"
        ? "font-medium text-green-600"
        : "font-medium text-orange-600"
    }
  >
    {t("support.status")}: {t(`support.${request.status}`)}
  </span>

  {request.status !== "resolved" && (
    <button
      onClick={() => handleResolve(request._id)}
      className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700"
    >
      {t("support.resolve")}
    </button>
  )}
</div>
                  <span>
                    {new Date(request.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}