import { useEffect, useState } from "react";

import axios from "axios";
import { useTranslation } from "react-i18next";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  getMySessions,
  revokeSession,
} from "../services/sessionService";

interface Session {
  _id: string;
  browser: string;
  operatingSystem: string;
  deviceType: string;
  ipAddress: string;
  loginAt: string;
  lastActivityAt: string;
  isCurrent?: boolean;
}

const ActiveSessions = () => {
  const { t } =
    useTranslation("sessions");

  const [sessions, setSessions] =
    useState<Session[]>([]);

  const [loading, setLoading] =
    useState(true);

  const handleRevoke = async (
    sessionId: string
  ) => {
    try {
      await revokeSession(sessionId);

      setSessions(
        (previousSessions) =>
          previousSessions.filter(
            (session) =>
              session._id !==
              sessionId
          )
      );
    } catch (error: unknown) {
      if (
        axios.isAxiosError(error)
      ) {
        console.error(
          "Failed to revoke session:",
          error.response?.data
            ?.message
        );
      } else {
        console.error(
          "Failed to revoke session:",
          error
        );
      }

      alert(
        t(
          "messages.failed_to_revoke_session"
        )
      );
    }
  };

  useEffect(() => {
    const fetchSessions =
      async () => {
        try {
          const response =
            await getMySessions();

          setSessions(
            response?.data || []
          );
        } catch (error: unknown) {
          console.error(
            "Failed to fetch sessions:",
            error
          );
        } finally {
          setLoading(false);
        }
      };

    void fetchSessions();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            {t(
              "title.active_sessions"
            )}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-gray-500">
            {t(
              "status.loading_sessions"
            )}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {t(
            "title.active_sessions"
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {sessions.length === 0 ? (
          <p className="text-sm text-gray-500">
            {t(
              "messages.no_active_sessions"
            )}
          </p>
        ) : (
          sessions.map(
            (session) => (
              <div
                key={
                  session._id
                }
                className="rounded-lg border p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium">
                    {
                      session.browser
                    }{" "}
                    ·{" "}
                    {
                      session.operatingSystem
                    }
                  </p>

                  {session.isCurrent && (
                    <span className="text-sm font-medium text-green-600">
                      {t(
                        "labels.current_session"
                      )}
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-600">
                  {t(
                    "labels.device"
                  )}
                  :{" "}
                  {
                    session.deviceType
                  }
                </p>

                <p className="text-sm text-gray-600">
                  {t("labels.ip")}
                  :{" "}
                  {
                    session.ipAddress
                  }
                </p>

                <p className="text-sm text-gray-500">
                  {t(
                    "labels.login"
                  )}
                  :{" "}
                  {new Date(
                    session.loginAt
                  ).toLocaleString()}
                </p>

                <p className="text-sm text-gray-500">
                  {t(
                    "labels.last_active"
                  )}
                  :{" "}
                  {new Date(
                    session.lastActivityAt
                  ).toLocaleString()}
                </p>

                {!session.isCurrent && (
                  <button
                    type="button"
                    onClick={() =>
                      void handleRevoke(
                        session._id
                      )
                    }
                    className="mt-3 rounded-md border border-red-500 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
                  >
                    {t(
                      "actions.revoke"
                    )}
                  </button>
                )}
              </div>
            )
          )
        )}
      </CardContent>
    </Card>
  );
};

export default ActiveSessions;