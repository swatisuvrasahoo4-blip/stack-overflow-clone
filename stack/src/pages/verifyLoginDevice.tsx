import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axiosInstance from "@/lib/axiosinstance";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const VerifyLoginDevice = () => {
  const router = useRouter();
  const {t} = useTranslation();
  const { completeLogin } = useAuth();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    try {
      const storedData = sessionStorage.getItem("loginVerification");

      if (!storedData) {
        toast.error(t("toast.login_verification_session_not_found"));
        router.push("/auth");
        return;
      }

      const { userId, deviceId } = JSON.parse(storedData);

      if (!otp || otp.length !== 6) {
        toast.error(t("toast.please_enter the_6-digit_otp"));
        return;
      }

      setLoading(true);

      const response = await axiosInstance.post(
        "/user/login/verify-device",
        {
          userId,
          deviceId,
          otp,
        }
      );

      if (response.data.success) {
  const { data, token } = response.data;

  completeLogin({ data, token });

  sessionStorage.removeItem("loginVerification");

  toast.success(t("toast.device_verified_and_login_successful"));

  router.push("/");
}
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "OTP verification failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Verify New Device</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            We detected a login from a new device. Enter the 6-digit OTP
            sent to your email address.
          </p>

          <Input
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value.replace(/\D/g, ""))
            }
          />

          <Button
            onClick={()=>{
              console.log("button clicked");
              
              handleVerify()

            }}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {loading ? "Verifying..." : "Verify Device"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyLoginDevice;