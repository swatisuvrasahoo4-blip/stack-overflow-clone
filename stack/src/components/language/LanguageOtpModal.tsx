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
    useTranslation();

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
            "error.please_enter_a_6-digit_otp"
          )
        );

        return;
      }

      if (!language) {
        setError(
          t(
            "error.language_not_selected"
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
          const message =
            error.response?.data
              ?.message;

          setError(
            typeof message ===
              "string"
              ? message
              : t(
                  "error.invalid_or_expired_otp"
                )
          );

          console.error(
            "OTP verification failed:",
            error.response
              ?.data ||
              error
          );

          return;
        }

        setError(
          t(
            "error.invalid_or_expired_otp"
          )
        );

        console.error(
          "OTP verification failed:",
          error
        );
      }
    };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40">
      <div className="relative w-380px rounded-2xl bg-white p-7 shadow-2xl">
        {/* Close button */}

        <button
          type="button"
          onClick={
            handleClose
          }
          className="absolute right-5 top-4 text-2xl text-gray-400 hover:text-gray-700"
          aria-label="Close OTP modal"
        >
          ×
        </button>

        {/* OTP heading */}

        <h2 className="text-xl font-semibold text-gray-800">
          {t(
            "language.verify_language_change"
          )}
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          {t(
            "language.enter_the_6-digit_otp_sent_to_your_device"
          )}
        </p>

        {/* OTP input */}

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
            "language.enter_6-digit_otp"
          )}
          className="mt-6 w-full rounded-lg border border-gray-300 px-4 py-3 text-center text-sm tracking-[0.3em] text-black outline-none focus:border-orange-500"
        />

        {/* OTP error */}

        {error && (
          <p className="mt-2 text-sm text-red-500">
            {error}
          </p>
        )}

        {/* Verify OTP */}

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
            "language.verify_otp"
          )}
        </button>

        {/* OTP timer */}

        <p className="mt-4 text-center text-xs text-gray-800">
          {!expiresAt ||
          sending ? (
            <span className="font-semibold text-gray-600">
              {t(
                "language.sending_otp"
              )}
            </span>
          ) : timeLeft >
            0 ? (
            <>
              {t(
                "language.otp_expires_in"
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
                "language.otp_expired"
              )}
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

export default LanguageOtpModal;