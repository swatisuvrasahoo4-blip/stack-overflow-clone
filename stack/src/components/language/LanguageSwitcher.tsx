"use client";

import {
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { useAuth } from "@/lib/AuthContext";
import axiosInstance from "@/lib/axiosinstance";

import LanguageButton from "./LanguageButton";
import LanguageMenu from "./LanguageMenu";
import LanguageOtpModal from "./LanguageOtpModal";

const LanguageSwitcher = () => {
  const { i18n, t } =
    useTranslation();

  const router =
    useRouter();

  const { user } =
    useAuth();

  const [
    open,
    setOpen,
  ] = useState(false);

  const [
    otpOpen,
    setOtpOpen,
  ] = useState(false);

  const [
    expiresAt,
    setExpiresAt,
  ] = useState<
    string | null
  >(null);

  const [
    otpSending,
    setOtpSending,
  ] = useState(false);

  const [
    selectedLanguage,
    setSelectedLanguage,
  ] = useState<
    string | null
  >(null);

  useEffect(() => {
    const savedLanguage =
      localStorage.getItem(
        "language"
      );

    if (
      savedLanguage &&
      savedLanguage !==
        i18n.language
    ) {
      void i18n.changeLanguage(
        savedLanguage
      );
    }
  }, [i18n]);

  const handleLanguageButtonClick =
    () => {
      if (!user) {
        toast.info(
          t(
            "toast.please_login_to_continue"
          )
        );

        void router.push(
          "/auth"
        );

        return;
      }

      setOpen(
        (previousOpen) =>
          !previousOpen
      );
    };

  const handleLanguageSelect =
    async (
      code: string,
      _name: string
    ): Promise<void> => {
      setOpen(false);

      setSelectedLanguage(
        code
      );

      setOtpSending(true);
      setExpiresAt(null);
      setOtpOpen(true);

      try {
        const response =
          await axiosInstance.post(
            "/language/send-otp",
            {
              language: code,
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

        setExpiresAt(
          response.data
            .expiresAt
        );
      } catch (
        error: unknown
      ) {
        console.error(
          "Failed to send OTP:",
          error
        );

        setOtpOpen(false);

        setSelectedLanguage(
          null
        );
      } finally {
        setOtpSending(
          false
        );
      }
    };

  const handleOtpClose =
    () => {
      setOtpOpen(false);
      setExpiresAt(null);

      setSelectedLanguage(
        null
      );
    };

  const handleVerified =
    async (
      language: string
    ): Promise<void> => {
      try {
        await i18n.changeLanguage(
          language
        );

        localStorage.setItem(
          "language",
          language
        );

        setOtpOpen(false);
        setExpiresAt(null);

        setSelectedLanguage(
          null
        );

        window.location.reload();
      } catch (
        error: unknown
      ) {
        console.error(
          "Failed to change language:",
          error
        );
      }
    };

  return (
    <>
      {/* Language button */}

      <LanguageButton
        onClick={
          handleLanguageButtonClick
        }
      />

      {/* Language menu */}

      <LanguageMenu
        open={open}
        onClose={() =>
          setOpen(false)
        }
        onSelect={
          handleLanguageSelect
        }
      />

      {/* Language OTP modal */}

      <LanguageOtpModal
        open={otpOpen}
        onClose={
          handleOtpClose
        }
        expiresAt={
          expiresAt
        }
        sending={
          otpSending
        }
        language={
          selectedLanguage
        }
        onVerified={
          handleVerified
        }
      />
    </>
  );
};

export default LanguageSwitcher;