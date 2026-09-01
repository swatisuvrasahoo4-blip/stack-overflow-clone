"use client";

import {
  useEffect,
  useState,
} from "react";

import axios from "axios";
import { useTranslation } from "react-i18next";

import axiosInstance from "@/lib/axiosinstance";

interface LanguageOtpModalProps {
  open: boolean;
  onClose: () => void;
  expiresAt: string | null;
  sending: boolean;
  language: string | null;
  onVerified: (
    language: string
  ) => void;
}

const LanguageOtpModal = ({
  open,
  onClose,
  expiresAt,
  sending,
  language,
  onVerified,
}: LanguageOtpModalProps) => {
  const { t, i18n } =
    useTranslation("language");

  const [
    otp,
    setOtp,
  ] = useState("");

  const [
    timeLeft,
    setTimeLeft,
  ] = useState(0);

  const [
    error,
    setError,
  ] = useState("");

  useEffect(() => {
    if (
      !open ||
      !expiresAt
    ) {
      return;
    }

    const updateTimer = () => {
      const remaining =
        Math.max(
          0,
          Math.floor(
            (
              new Date(
                expiresAt
              ).getTime() -
              Date.now()
            ) / 1000
          )
        );

      setTimeLeft(
        remaining
      );
    };

    updateTimer();

    const timer =
      window.setInterval(
        updateTimer,
        1000
      );

    return () => {
      window.clearInterval(
        timer
      );
    };
  }, [
    open,
    expiresAt,
  ]);

  useEffect(() => {
    if (open) {
      setOtp("");
      setError("");
    }
  }, [open]);

  const minutes =
    Math.floor(
      timeLeft / 60
    );

  const seconds =
    timeLeft % 60;

  const handleOtpChange = (
    value: string
  ) => {
    const numbersOnly =
      value
        .replace(
          /\D/g,
          ""
        )
        .slice(0, 6);

    setOtp(
      numbersOnly
    );

    setError("");
  };

  const handleClose = () => {
    setOtp("");
    setError("");
    onClose();
  };

  const handleVerifyOtp =
    async (): Promise<void> => {
      if (otp.length !== 6) {
        setError(
          t(
            "errors.please_enter_6_digit_otp"
          )
        );

        return;
      }

      if (!language) {
        setError(
          t(
            "errors.language_not_selected"
          )
        );

        return;
      }

      setError("");

      try {
        const response =
          await axiosInstance.post(
            "/language/verify-otp",
            {
              otp,
              language,
            },
            {
              headers: {
                Authorization:
                  `Bearer ${localStorage.getItem(
                    "token"
                  )}`,
              },
            }
          );

        if (
          response.data.success
        ) {
          await i18n.changeLanguage(
            language
          );

          setOtp("");
          setError("");

          onVerified(
            language
          );

          onClose();
        }
      } catch (
        error: unknown
      ) {
        if (
          axios.isAxiosError(
            error
          )
        ) {
          console.error(
            "OTP verification failed:",
            error.response?.data ||
              error
          );
        } else {
          console.error(
            "OTP verification failed:",
            error
          );
        }

        setError(
          t(
            "errors.invalid_or_expired_otp"
          )
        );
      }
    };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40">
      <div className="relative w-[380px] rounded-2xl bg-white p-7 shadow-2xl">
        <button
          type="button"
          onClick={
            handleClose
          }
          className="absolute right-5 top-4 text-2xl text-gray-400 hover:text-gray-700"
          aria-label={t(
            "accessibility.close_otp_modal"
          )}
        >
          ×
        </button>

        <h2 className="text-xl font-semibold text-gray-800">
          {t(
            "otp.verify_language_change"
          )}
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          {t(
            "otp.enter_6_digit_otp_sent_to_device"
          )}
        </p>

        <input
          type="text"
          inputMode="numeric"
          value={otp}
          maxLength={6}
          onChange={(
            event
          ) =>
            handleOtpChange(
              event.target.value
            )
          }
          placeholder={t(
            "otp.enter_6_digit_otp"
          )}
          className="mt-6 w-full rounded-lg border border-gray-300 px-4 py-3 text-center text-sm tracking-[0.3em] text-black outline-none focus:border-orange-500"
        />

        {error && (
          <p className="mt-2 text-sm text-red-500">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={() =>
            void handleVerifyOtp()
          }
          disabled={
            timeLeft === 0 ||
            sending
          }
          className="mt-5 w-full rounded-lg bg-orange-500 py-3 font-medium text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {t(
            "otp.verify_otp"
          )}
        </button>

        <p className="mt-4 text-center text-xs text-gray-800">
          {!expiresAt ||
          sending ? (
            <span className="font-semibold text-gray-600">
              {t(
                "otp.sending_otp"
              )}
            </span>
          ) : timeLeft >
            0 ? (
            <>
              {t(
                "otp.otp_expires_in"
              )}{" "}
              <span className="font-semibold">
                {String(
                  minutes
                ).padStart(
                  2,
                  "0"
                )}
                :
                {String(
                  seconds
                ).padStart(
                  2,
                  "0"
                )}
              </span>
            </>
          ) : (
            <span className="font-semibold text-red-500">
              {t(
                "otp.otp_expired"
              )}
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

export default LanguageOtpModal;