import Mainlayout from "@/layout/Mainlayout";
import ActiveSessions from "@/components/security/ActiveSessions"
import { useTranslation } from "react-i18next";

const LoginSessions = () => {
  const {t} = useTranslation();
  return (
    <Mainlayout>
      <div className="max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            {t("logactivity.login_sessions")}
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            {t("logactivity.manage_the_devices_and_browsers_where_your_account_is_currently_signed_in")}
          </p>
        </div>

        <ActiveSessions />
      </div>
    </Mainlayout>
  );
};

export default LoginSessions;