"use client";

import { useState, useEffect } from "react";
import LanguageButton from "./LanguageButton";
import LanguageMenu from "./LanguageMenu";
import LanguageOtpModal from "./LanguageOtpModal";
import axiosInstance from "@/lib/axiosinstance";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { useAuth } from "@/lib/AuthContext";
import { toast } from "react-toastify";

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();
  const router = useRouter();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [otpOpen, setOtpOpen] = useState(false);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [otpSending, setOtpSending] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(
    null
  );

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");

    if (savedLanguage && savedLanguage !== i18n.language) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  const handleLanguageSelect = async (code: string, name: string) => {
    // Close language menu
    setOpen(false);

    // Remember which language the user wants
    setSelectedLanguage(code);

    // Open OTP modal
    setOtpSending(true);
    setExpiresAt(null);
    setOtpOpen(true);

    try {
      const response = await axiosInstance.post(
        "/language/send-otp",
        { language: code },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setExpiresAt(response.data.expiresAt);
      setOtpSending(false);
    } catch (error) {
      console.error("Failed to send OTP:", error);
      setOtpSending(false);
      setOtpOpen(false);
      setSelectedLanguage(null);
    }
  };

  return (
    <>
      <LanguageButton onClick={() => {
        if (!user) {
    toast.info(t("toast.please_login_to_continue"));
    router.push("/auth");
    return;
  }
        setOpen(!open)
        }} />

      <LanguageMenu
        open={open}
        onClose={() => setOpen(false)}
        onSelect={handleLanguageSelect}
      />

      <LanguageOtpModal
        open={otpOpen}
        onClose={() => {
          setOtpOpen(false);
          setExpiresAt(null);
          setSelectedLanguage(null);
        }}
        expiresAt={expiresAt}
        sending={otpSending}
        language={selectedLanguage}
        onVerified={async (language) => {
          try {
            // Change language immediately after successful OTP verification
            await i18n.changeLanguage(language);

            // Save selected language
            localStorage.setItem("language", language);

            // Close OTP modal
            setOtpOpen(false);
            setExpiresAt(null);
            setSelectedLanguage(null);

            //Reload page after successful OTP verification
            window.location.reload();
          } catch (error) {
            console.error("Failed to change language:", error);
          }
        }}
      />
    </>
  );
};

export default LanguageSwitcher;