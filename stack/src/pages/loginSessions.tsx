import Mainlayout from "@/layout/Mainlayout";

import ActiveSessions from "@/components/security/ActiveSessions";

import { useTranslation } from "react-i18next";

const LoginSessions = () => {
  const { t } =
    useTranslation("sessions");

  return (
    <Mainlayout>
      <div className="max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            {t(
              "title.login_sessions"
            )}
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            {t(
              "messages.manage_signed_in_devices"
            )}
          </p>
        </div>

        <ActiveSessions />
      </div>
    </Mainlayout>
  );
};

export default LoginSessions;