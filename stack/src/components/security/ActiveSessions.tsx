import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getMySessions, revokeSession } from "../services/sessionService";
import { useTranslation } from "react-i18next";

const ActiveSessions = () => {
  const {t} = useTranslation();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const handleRevoke = async (sessionId: string) => {
  try {
    await revokeSession(sessionId);

    setSessions((prev) =>
      prev.filter((session) => session._id !== sessionId)
    );
  } catch (error: any) {
    console.log("Failed to revoke session", error);

    alert(
      error?.response?.data?.message || t("alert.failed_to_revoke_session")
    );
  }
};5

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await getMySessions();
        setSessions(response?.data || []);
      } catch (error) {
        console.log("Failed to fetch sessions", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("loginactivity.active_sessions")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">
            {t("logactivity.loading_sessions")}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("logactivity.active_sessions")}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {sessions.length === 0 ? (
          <p className="text-sm text-gray-500">
            {t("logactivity.no_active_sessions_found")}
          </p>
        ) : (
          sessions.map((session) => (
            <div
              key={session._id}
              className="rounded-lg border p-4"
            >
              <div className="flex items-center justify-between gap-2">
  <p className="font-medium">
    {session.browser} · {session.operatingSystem}
  </p>

  {session.isCurrent && (
    <span className="text-sm font-medium text-green-600">
      {t("logactivity.current_session")}
    </span>
  )}
</div>

              <p className="text-sm text-gray-600">
                {t("logactivity.device")}: {session.deviceType}
              </p>

              <p className="text-sm text-gray-600">
                {t("logactivity.ip")}: {session.ipAddress}
              </p>

              <p className="text-sm text-gray-500">
                {t("logactivity.login")}:{" "}
                {new Date(session.loginAt).toLocaleString()}
              </p>

              <p className="text-sm text-gray-500">
                {t("logactivity.last_active")}:{" "}
                {new Date(session.lastActivityAt).toLocaleString()}
              </p>
              {!session.isCurrent && (
  <button
    type="button"
    onClick={() => handleRevoke(session._id)}
    className="mt-3 rounded-md border border-red-500 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
  >
    {t("logactivity.revoke")}
  </button>
)}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default ActiveSessions;