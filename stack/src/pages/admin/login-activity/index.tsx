import {
  useEffect,
  useState,
} from "react";

import { useTranslation } from "react-i18next";

import { getLoginActivity } from "@/components/services/loginActivityService";

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

type StatusFilter =
  | "all"
  | "active"
  | "revoked";

const LoginActivityPage = () => {
  const { t } =
    useTranslation("login_activity");

  const [
    activities,
    setActivities,
  ] = useState<LoginActivity[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState<StatusFilter>("all");

  const [
    deviceFilter,
    setDeviceFilter,
  ] = useState("all");

  useEffect(() => {
    const fetchLoginActivity =
      async (): Promise<void> => {
        try {
          const response =
            await getLoginActivity();

          setActivities(
            response.data || []
          );
        } catch (error: unknown) {
          console.error(
            "Failed to fetch login activity:",
            error
          );
        } finally {
          setLoading(false);
        }
      };

    void fetchLoginActivity();
  }, []);

  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-8 text-center text-gray-500">
        {t(
          "loading_login_activity"
        )}
      </div>
    );
  }

  const totalSessions =
    activities.length;

  const activeSessions =
    activities.filter(
      (activity) =>
        !activity.isRevoked
    ).length;

  const revokedSessions =
    activities.filter(
      (activity) =>
        activity.isRevoked
    ).length;

  const filteredActivities =
    activities.filter(
      (activity) => {
        const searchValue =
          search
            .toLowerCase()
            .trim();

        const matchesSearch =
          !searchValue ||
          activity.user?.name
            ?.toLowerCase()
            .includes(
              searchValue
            ) ||
          activity.user?.username
            ?.toLowerCase()
            .includes(
              searchValue
            ) ||
          activity.user?.email
            ?.toLowerCase()
            .includes(
              searchValue
            ) ||
          activity.ipAddress
            .toLowerCase()
            .includes(
              searchValue
            );

        const matchesStatus =
          statusFilter ===
            "all" ||
          (statusFilter ===
            "active" &&
            !activity.isRevoked) ||
          (statusFilter ===
            "revoked" &&
            activity.isRevoked);

        const matchesDevice =
          deviceFilter ===
            "all" ||
          activity.deviceType
            .toLowerCase() ===
            deviceFilter;

        return (
          matchesSearch &&
          matchesStatus &&
          matchesDevice
        );
      }
    );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          {t(
            "title"
          )}
        </h2>

        <p className="mt-1 text-sm text-gray-600">
          {t(
            "monitor_user_login_sessions_and_device_activity"
          )}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            {t(
              "total_sessions"
            )}
          </p>

          <p className="mt-2 text-3xl font-bold text-gray-900">
            {totalSessions}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            {t(
              "active_sessions"
            )}
          </p>

          <p className="mt-2 text-3xl font-bold text-green-600">
            {activeSessions}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            {t(
              "revoked_sessions"
            )}
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
          onChange={(event) =>
            setSearch(
              event.target.value
            )
          }
          placeholder={t(
            "search_by_name_username_email_or_ip_address"
          )}
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-black outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(
              event.target
                .value as StatusFilter
            )
          }
          className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-500"
        >
          <option value="all">
            {t(
              "all_status"
            )}
          </option>

          <option value="active">
            {t(
              "active"
            )}
          </option>

          <option value="revoked">
            {t(
              "revoked"
            )}
          </option>
        </select>

        <select
          value={deviceFilter}
          onChange={(event) =>
            setDeviceFilter(
              event.target.value
            )
          }
          className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-500"
        >
          <option value="all">
            {t(
              "all_devices"
            )}
          </option>

          <option value="desktop">
            {t(
              "desktop"
            )}
          </option>

          <option value="mobile">
            {t(
              "mobile"
            )}
          </option>

          <option value="tablet">
            {t(
              "tablet"
            )}
          </option>

          <option value="unknown">
            {t(
              "unknown"
            )}
          </option>
        </select>
      </div>

      <div className="rounded-xl border bg-white">
        {filteredActivities.length ===
        0 ? (
          <div className="p-8 text-center text-gray-500">
            {t(
              "no_login_activity_found"
            )}
          </div>
        ) : (
          <div className="divide-y">
            {filteredActivities.map(
              (activity) => (
                <div
                  key={
                    activity._id
                  }
                  className="p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {activity.user
                          ?.name ||
                          t(
                            "unknown_user"
                          )}
                      </h3>

                      <p className="text-sm text-gray-500">
                        {activity.user
                          ?.email ||
                          t(
                            "no_email"
                          )}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        activity.isRevoked
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {activity.isRevoked
                        ? t(
                            "revoked"
                          )
                        : t(
                            "active"
                          )}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-3 text-sm text-gray-600 sm:grid-cols-2 lg:grid-cols-4">
                    <p>
                      <span className="font-medium text-gray-900">
                        {t(
                          "device"
                        )}
                        :
                      </span>{" "}
                      {
                        activity.deviceType
                      }
                    </p>

                    <p>
                      <span className="font-medium text-gray-900">
                        {t(
                          "browser"
                        )}
                        :
                      </span>{" "}
                      {
                        activity.browser
                      }
                    </p>

                    <p>
                      <span className="font-medium text-gray-900">
                        {t(
                          "os"
                        )}
                        :
                      </span>{" "}
                      {
                        activity.operatingSystem
                      }
                    </p>

                    <p>
                      <span className="font-medium text-gray-900">
                        {t(
                          "ip"
                        )}
                        :
                      </span>{" "}
                      {
                        activity.ipAddress
                      }
                    </p>

                    <p>
                      <span className="font-medium text-gray-900">
                        {t(
                          "trusted"
                        )}
                        :
                      </span>{" "}
                      {activity.isTrustedDevice
                        ? t(
                            "yes"
                          )
                        : t(
                            "no"
                          )}
                    </p>

                    <p>
                      <span className="font-medium text-gray-900">
                        {t(
                          "expires"
                        )}
                        :
                      </span>{" "}
                      {new Date(
                        activity.expiresAt
                      ).toLocaleString()}
                    </p>
                  </div>

                  <div className="mt-3 text-xs text-gray-500">
                    {t(
                      "login"
                    )}
                    :{" "}
                    {new Date(
                      activity.loginAt
                    ).toLocaleString()}
                    {" · "}
                    {t(
                      "last_active"
                    )}
                    :{" "}
                    {new Date(
                      activity.lastActivityAt
                    ).toLocaleString()}
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

export default LoginActivityPage;