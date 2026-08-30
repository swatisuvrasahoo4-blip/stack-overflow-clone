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
import axios from "axios";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

interface LoginVerificationData {
  userId: string;
  deviceId: string;
}

const VerifyLoginDevice = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { completeLogin } = useAuth();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    try {
      const storedData = sessionStorage.getItem(
        "loginVerification"
      );

      if (!storedData) {
        toast.error(
          t(
            "toast.login_verification_session_not_found"
          )
        );

        void router.push("/auth");
        return;
      }

      const parsedData = JSON.parse(
        storedData
      ) as LoginVerificationData;

      const {
        userId,
        deviceId,
      } = parsedData;

      if (
        !otp ||
        otp.length !== 6
      ) {
        toast.error(
          t(
            "toast.please_enter_the_6_digit_otp"
          )
        );

        return;
      }

      setLoading(true);

      const response =
        await axiosInstance.post(
          "/user/login/verify-device",
          {
            userId,
            deviceId,
            otp,
          }
        );

      if (
        response.data.success
      ) {
        const {
          data,
          token,
        } = response.data;

        completeLogin({
          data,
          token,
        });

        sessionStorage.removeItem(
          "loginVerification"
        );

        toast.success(
          t(
            "toast.device_verified_and_login_successful"
          )
        );

        void router.push("/");
      }
    } catch (
      error: unknown
    ) {
      if (
        axios.isAxiosError(
          error
        )
      ) {
        toast.error(
          error.response?.data
            ?.message ||
            t(
              "toast.otp_verification_failed"
            )
        );

        return;
      }

      toast.error(
        t(
          "toast.otp_verification_failed"
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            {t(
              "login_device.verify_new_device"
            )}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            {t(
              "login_device.new_device_message"
            )}
          </p>

          <Input
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder={t(
              "login_device.enter_otp"
            )}
            value={otp}
            onChange={(
              event
            ) =>
              setOtp(
                event.target.value.replace(
                  /\D/g,
                  ""
                )
              )
            }
          />

          <Button
            type="button"
            onClick={() => {
              void handleVerify();
            }}
            disabled={
              loading
            }
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {loading
              ? t(
                  "login_device.verifying"
                )
              : t(
                  "login_device.verify_device"
                )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyLoginDevice;