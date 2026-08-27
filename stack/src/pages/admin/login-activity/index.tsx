import { useEffect, useState } from "react";
import { getLoginActivity } from "@/components/services/loginActivityService";
import { useTranslation } from "react-i18next";

interface LoginActivity {
  _id: string;
  user: {
    _id: string;
    name?: string;
    username?: string;
    email?: string;
  } | null;
  browser: string;
  operatingSystem: string;
  deviceType: string;
  ipAddress: string;
  loginAt: string;
  lastActivityAt: string;
  expiresAt: string;
  isRevoked: boolean;
  isTrustedDevice: boolean;
}

const LoginActivityPage = () => {
  const {t} = useTranslation();
  const [activities, setActivities] = useState<LoginActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
  "all" | "active" | "revoked"
>("all");
const [deviceFilter, setDeviceFilter] = useState("all");

  useEffect(() => {
    const fetchLoginActivity = async () => {
      try {
        const response = await getLoginActivity();

        setActivities(response.data || []);
      } catch (error) {
        console.error("Failed to fetch login activity:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLoginActivity();
  }, []);

  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-8 text-center text-gray-500">
        {t("logactivity.loading_login_activity")}
      </div>
    );
  }

  const totalSessions = activities.length;

const activeSessions = activities.filter(
  (activity) => !activity.isRevoked
).length;

const revokedSessions = activities.filter(
  (activity) => activity.isRevoked
).length;

const filteredActivities = activities.filter((activity) => {
  const searchValue = search.toLowerCase().trim();

  const matchesSearch =
    !searchValue ||
    activity.user?.name?.toLowerCase().includes(searchValue) ||
    activity.user?.username?.toLowerCase().includes(searchValue) ||
    activity.user?.email?.toLowerCase().includes(searchValue) ||
    activity.ipAddress?.toLowerCase().includes(searchValue);

  const matchesStatus =
    statusFilter === "all" ||
    (statusFilter === "active" && !activity.isRevoked) ||
    (statusFilter === "revoked" && activity.isRevoked);

  const matchesDevice =
    deviceFilter === "all" ||
    activity.deviceType?.toLowerCase() === deviceFilter;

  return matchesSearch && matchesStatus && matchesDevice;
});

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          {t("admin.loginActivity")}
        </h2>

        <p className="mt-1 text-sm text-gray-600">
          {t("logactivity.monitor_user_login_sessions_and_device_activity")}
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
  <div className="rounded-xl border bg-white p-5 shadow-sm">
    <p className="text-sm font-medium text-gray-500">
      {t("logactivity.total_sessions")}
    </p>

    <p className="mt-2 text-3xl font-bold text-gray-900">
      {totalSessions}
    </p>
  </div>

  <div className="rounded-xl border bg-white p-5 shadow-sm">
    <p className="text-sm font-medium text-gray-500">
      {t("logactivity.active_sessions")}
    </p>

    <p className="mt-2 text-3xl font-bold text-green-600">
      {activeSessions}
    </p>
  </div>
  

  <div className="rounded-xl border bg-white p-5 shadow-sm">
    <p className="text-sm font-medium text-gray-500">
      {t("logactivity.revoked_sessions")}
    </p>

    <p className="mt-2 text-3xl font-bold text-red-600">
      {revokedSessions}
    </p>
  </div>
</div>
<div className="flex flex-col gap-3 rounded-xl border bg-white p-4 shadow-sm sm:flex-row">
  <input
    type="text"
    value={search}
    onChange={(event) => setSearch(event.target.value)}
    placeholder={t("logactivity.search_by_name_username_email_or_ip_address")}
    className="flex-1 rounded-lg border text-black border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
  />

  <select
    value={statusFilter}
    onChange={(event) =>
      setStatusFilter(
        event.target.value as "all" | "active" | "revoked"
      )
    }
    className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-500"
  >
    <option value="all">{t("logactivity.all_status")}</option>
    <option value="active">{t("logactivity.active")}</option>
    <option value="revoked">{t("logactivity.revoked")}</option>
  </select>
  <select
  value={deviceFilter}
  onChange={(event) => setDeviceFilter(event.target.value)}
  className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-500"
>
  <option value="all">{t("logactivity.all_devices")}</option>
  <option value="desktop">{t("logactivity.desktop")}</option>
  <option value="mobile">{t("logactivity.mobile")}</option>
  <option value="tablet">{t("logactivity.tablet")}</option>
  <option value="unknown">{t("logactivity.unknown")}</option>
</select>
</div>

      <div className="rounded-xl border bg-white">
        {filteredActivities.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {t("logactivity.no_login_activity_found")}
          </div>
        ) : (
          <div className="divide-y">
            {filteredActivities.map((activity) => (
              <div key={activity._id} className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {activity.user?.name || "Unknown User"}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {activity.user?.email || "No email"}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      activity.isRevoked
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {activity.isRevoked ? t("logactivity.revoked") : t("logactivity.active")}
                  </span>
                </div>

                <div className="mt-4 grid gap-3 text-sm text-gray-600 sm:grid-cols-2 lg:grid-cols-4">
                  <p>
                    <span className="font-medium text-gray-900">
                      {t("logactivity.device")}:
                    </span>{" "}
                    {activity.deviceType}
                  </p>

                  <p>
                    <span className="font-medium text-gray-900">
                      {t("logactivity.browser")}:
                    </span>{" "}
                    {activity.browser}
                  </p>

                  <p>
                    <span className="font-medium text-gray-900">
                      {t("logactivity.os")}:
                    </span>{" "}
                    {activity.operatingSystem}
                  </p>

                  <p>
                    <span className="font-medium text-gray-900">
                      {t("logactivity.ip")}:
                    </span>{" "}
                    {activity.ipAddress}
                  </p>
                  <p>
  <span className="font-medium text-gray-900">
    {t("logactivity.trusted")}:
  </span>{" "}
  {activity.isTrustedDevice ? t("logactivity.yes") : t("logactivity.no")}
</p>

<p>
  <span className="font-medium text-gray-900">
    {t("logactivity.expires")}:
  </span>{" "}
  {new Date(activity.expiresAt).toLocaleString()}
</p>
                </div>

                <div className="mt-3 text-xs text-gray-500">
                  {t("logactivity.login")}: {new Date(activity.loginAt).toLocaleString()}
                  {" · "}
                  {t("logactivity.last_active")}:{" "}
                  {new Date(activity.lastActivityAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginActivityPage;