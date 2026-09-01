import { useState } from "react";

import { useRouter } from "next/router";

import axios from "axios";

import { toast } from "react-toastify";

import { useTranslation } from "react-i18next";

import { useAuth } from "@/lib/AuthContext";

import axiosInstance from "@/lib/axiosinstance";

import VerifyLoginDeviceForm from "@/components/auth/VerifyLoginDeviceForm";

interface LoginVerificationData {
  userId: string;
  deviceId: string;
}

const VerifyLoginDevice = () => {
  const router = useRouter();

  const { t } =
    useTranslation("auth");

  const { completeLogin } =
    useAuth();

  const [otp, setOtp] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // Verify login device
  const handleVerify =
    async (): Promise<void> => {
      try {
        const storedData =
          sessionStorage.getItem(
            "loginVerification"
          );

        if (!storedData) {
          toast.error(
            t(
              "login_device.messages.verification_session_not_found"
            )
          );

          void router.push(
            "/auth"
          );

          return;
        }

        const parsedData =
          JSON.parse(
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
              "login_device.messages.enter_6_digit_otp"
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
          !response.data.success
        ) {
          return;
        }

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
            "login_device.messages.device_verified_login_successful"
          )
        );

        void router.push("/");

      } catch (error: unknown) {
        if (
          axios.isAxiosError(
            error
          )
        ) {
          console.error(
            "Login device verification failed:",
            error.response?.data
              ?.message ||
              error.message
          );

          toast.error(
            t(
              "login_device.messages.otp_verification_failed"
            )
          );

          return;
        }

        console.error(
          "Login device verification failed:",
          error
        );

        toast.error(
          t(
            "login_device.messages.otp_verification_failed"
          )
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <VerifyLoginDeviceForm
      otp={otp}
      setOtp={setOtp}
      loading={loading}
      onVerify={() => {
        void handleVerify();
      }}
    />
  );
};

export default VerifyLoginDevice;