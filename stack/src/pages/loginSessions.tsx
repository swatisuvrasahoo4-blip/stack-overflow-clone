import Mainlayout from "@/layout/Mainlayout";
import ActiveSessions from "@/components/security/ActiveSessions"

const LoginSessions = () => {
  return (
    <Mainlayout>
      <div className="max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            Login Sessions
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage the devices and browsers where your account is currently
            signed in.
          </p>
        </div>

        <ActiveSessions />
      </div>
    </Mainlayout>
  );
};

export default LoginSessions;