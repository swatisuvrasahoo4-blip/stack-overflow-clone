import { useState } from "react";

import { ArrowLeft } from "lucide-react";

import { useRouter } from "next/router";

import { useTranslation } from "react-i18next";

import AdminReportsPage from "./reports/reports";

import AdminSupportPage from "./support";

import LoginActivityPage from "./login-activity";

type AdminTab =
  | "reports"
  | "support"
  | "loginActivity";

const AdminDashboard = () => {
  const router = useRouter();

  const { t } = useTranslation([
    "reports",
    "support",
    "login_activity",
  ]);

  const [
    activeTab,
    setActiveTab,
  ] = useState<AdminTab>(
    "reports"
  );

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-6xl">

        {/* Back button */}
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-5 flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4" />

          <span className="hidden sm:inline">
            {t(
              "admin.dashboard.back",
              {
                ns: "reports",
              }
            )}
          </span>
        </button>

        {/* Dashboard header */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            {t(
              "admin.dashboard.title",
              {
                ns: "reports",
              }
            )}
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            {t(
              "admin.dashboard.description",
              {
                ns: "reports",
              }
            )}
          </p>
        </div>

        {/* Admin navigation */}
        <div className="mb-6 flex flex-wrap justify-center gap-10 border-b border-gray-200 pb-3">
          <button
            type="button"
            onClick={() =>
              setActiveTab(
                "reports"
              )
            }
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              activeTab ===
              "reports"
                ? "bg-blue-600 text-white"
                : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            {t(
              "admin.dashboard.reports",
              {
                ns: "reports",
              }
            )}
          </button>

          <button
            type="button"
            onClick={() =>
              setActiveTab(
                "support"
              )
            }
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              activeTab ===
              "support"
                ? "bg-blue-600 text-white"
                : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            {t(
              "admin.title.support_requests",
              {
                ns: "support",
              }
            )}
          </button>

          <button
            type="button"
            onClick={() =>
              setActiveTab(
                "loginActivity"
              )
            }
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              activeTab ===
              "loginActivity"
                ? "bg-blue-600 text-white"
                : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            {t(
              "title",
              {
                ns: "login_activity",
              }
            )}
          </button>
        </div>

        {/* Selected section */}
        <div>
          {activeTab ===
            "reports" && (
            <AdminReportsPage />
          )}

          {activeTab ===
            "support" && (
            <AdminSupportPage />
          )}

          {activeTab ===
            "loginActivity" && (
            <LoginActivityPage />
          )}
        </div>
      </div>
    </main>
  );
};

export default AdminDashboard;