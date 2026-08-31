import { useState } from "react";
import { useTranslation } from "react-i18next";

import AdminReportsPage from "./reports/reports";
import AdminSupportPage from "./support";
import LoginActivityPage from "./login-activity";

type AdminTab =
  | "reports"
  | "support"
  | "loginActivity";

const AdminDashboard = () => {
  const { t } = useTranslation();

  const [
    activeTab,
    setActiveTab,
  ] = useState<AdminTab>(
    "reports"
  );

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        {/* Dashboard header */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            {t(
              "admin.adminDashboard"
            )}
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            {t(
              "admin.manageReportsSupportLoginActivity"
            )}
          </p>
        </div>

        {/* Admin navigation */}
        <div className="mb-6 flex flex-wrap justify-center gap-10 border-b border-gray-200 pb-3">
          <button
            type="button"
            onClick={() =>
              setActiveTab("reports")
            }
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              activeTab === "reports"
                ? "bg-blue-600 text-white"
                : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            {t(
              "admin.reports"
            )}
          </button>

          <button
            type="button"
            onClick={() =>
              setActiveTab("support")
            }
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              activeTab === "support"
                ? "bg-blue-600 text-white"
                : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            {t(
              "admin.support"
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
              "admin.loginActivity"
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