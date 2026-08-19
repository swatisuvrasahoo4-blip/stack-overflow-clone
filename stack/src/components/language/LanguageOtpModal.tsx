"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axiosinstance";
import { useTranslation } from "react-i18next";

interface LanguageOtpModalProps {
  open: boolean;
  onClose: () => void;
  expiresAt: string | null;
  sending: boolean;
  language: string | null;
  onVerified: (language: string) => void;
}

const LanguageOtpModal = ({
  open,
  onClose,
  expiresAt,
  sending,
  language,
  onVerified,
}: LanguageOtpModalProps) => {
    const { i18n } = useTranslation();
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [error, setError] = useState("");
useEffect(() => {
  if (!open || !expiresAt) {
    return;
  }

  const updateTimer = () => {
    const remaining = Math.max(
      0,
      Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000)
    );

    setTimeLeft(remaining);
  };

  updateTimer();

  const timer = setInterval(updateTimer, 1000);

  return () => clearInterval(timer);
}, [open, expiresAt]);
const minutes = Math.floor(timeLeft / 60);
const seconds = timeLeft % 60;
useEffect(() => {
  if (open) {
    setOtp("");
  }
}, [open]);

  if (!open) return null;

  const handleOtpChange = (value: string) => {
    const numbersOnly = value.replace(/\D/g, "").slice(0, 6);
    setOtp(numbersOnly);
    setError("");
  };

  const handleVerifyOtp = async () => {
    console.log("language before verify",language);
    
  if (otp.length !== 6) {
    setError("Please enter a 6-digit OTP");
    return;
  }

  if (!language) {
  setError("Language not selected");
  return;
}
   
  setError("");

  try {
   const response = await axiosInstance.post(
  "/language/verify-otp",
  {
    otp,
    language
  },
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }
);

console.log("VERIFY RESPONSE:", response.data);
console.log("LANGUAGE FROM SERVER:", response.data.language);

if (response.data.success) {
  await i18n.changeLanguage(language);

  console.log("i18n language AFTER change:", i18n.language);

  setOtp("");
  onVerified(language);
  onClose();
}
  } catch (error: any) {
    console.error(
      "OTP verification failed:",
      error.response?.data || error
    );
  }
};

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40">
      <div className="relative w-380px rounded-2xl bg-white p-7 shadow-2xl">

        <button
          onClick={()=>{
            setOtp("");
            onClose();
          }}
          className="absolute right-5 top-4 text-2xl text-gray-400 hover:text-gray-700"
        >
          ×
        </button>

        <h2 className="text-xl font-semibold text-gray-800">
          Verify Language Change
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Enter the 6-digit OTP sent to your registered email.
        </p>

        <input
          type="text"
          inputMode="numeric"
          value={otp}
          onChange={(e) => handleOtpChange(e.target.value)}
          placeholder="Enter 6-digit OTP"
          className="mt-6 w-full text-black rounded-lg border border-gray-300 px-4 py-3 text-center text-lg tracking-[0.3em] outline-none focus:border-orange-500"
        />

        {error && (
  <p className="mt-2 text-sm text-red-500">
    {error}
  </p>
)}

        <button
        onClick={handleVerifyOtp}
          disabled={timeLeft === 0 || sending}
          className="mt-5 w-full rounded-lg bg-orange-500 py-3 font-medium text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Verify OTP
        </button>

     <p className="mt-4 text-center text-xs text-gray-800">
  {!expiresAt || sending ? (
    <span className="font-semibold text-gray-600">
      Sending OTP...
    </span>
  ) : timeLeft > 0 ? (
    <>
      OTP expires in{" "}
      <span className="font-semibold">
        {String(minutes).padStart(2, "0")}:
        {String(seconds).padStart(2, "0")}
      </span>
    </>
  ) : (
    <span className="font-semibold text-red-500">
      OTP expired
    </span>
  )}
</p>

      </div>
    </div>
  );
};

export default LanguageOtpModal;