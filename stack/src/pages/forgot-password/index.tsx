import { useState } from "react";
import { forgotPassword } from "@/components/services/forgotPasswordService";
import { useRouter } from "next/router";
import { LockKeyhole } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

interface ForgotPasswordResponse {
  message: string;
  password: string;
}

export default function ForgotPassword() {
  const router = useRouter();
  const { t } = useTranslation();

  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [generatedPassword, setGeneratedPassword] = useState<string>("");
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [passwordCopied, setPasswordCopied] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const handleForgotPassword = async (): Promise<void> => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!email.trim() || !username.trim()) {
      setErrorMessage(
        t("error.please_enter_your_registered_email_and_username")
      );
      return;
    }

    try {
      setLoading(true);

      const response: ForgotPasswordResponse = await forgotPassword(
        email,
        username
      );

      setSuccessMessage(response.message);
      setGeneratedPassword(response.password);
      setShowSuccessModal(true);

      setEmail("");
      setUsername("");
    } catch (error: unknown) {
      const apiError = error as ApiError;

      setErrorMessage(
        apiError.response?.data?.message ||
          t("error.something_went_wrong")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPassword = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(generatedPassword);

      setCopied(true);
      setPasswordCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error: unknown) {
      console.error("Failed to copy password:", error);
    }
  };

  const handleBackToLogin = (): void => {
    if (!passwordCopied) {
      const confirmLeave = window.confirm(
        `${t(
          "window.you_havenot_copied_your_generated_password_yet"
        )}\n\n${t(
          "window.are_you_sure_you_want_to_go_back_to_the_login_page"
        )}`
      );

      if (!confirmLeave) {
        return;
      }
    }

    setShowSuccessModal(false);
    void router.push("/auth");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <div className="flex flex-col items-center mb-4">
          <div className="bg-orange-100 p-4 rounded-full mb-4">
            <LockKeyhole className="h-8 w-8 text-orange-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900">
            {t("forgotpassword.forgot_password")}
          </h1>
        </div>

        <p className="mt-3 text-center text-sm leading-6 text-gray-500">
          {t("forgotpassword.enter_your_registered_email_address_below")}
          <br />
          {t(
            "forgotpassword.we_will_generate_a_new_password_for_your_account"
          )}
        </p>

        {successMessage && (
          <div className="mb-4 mt-4 rounded-lg border border-green-300 bg-green-100 px-4 py-3 text-sm text-green-700">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 mt-4 rounded-lg border border-red-300 bg-red-100 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        <label className="block text-sm font-semibold text-gray-700 mb-2 mt-3">
          {t("forgotpassword.registered_email")}
        </label>

        <input
          type="email"
          placeholder={t("forgotpassword.enter_your_registered_email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full text-gray-700 border rounded-lg px-4 py-3 mb-4 outline-none focus:ring-2 focus:ring-blue-500"
        />

        <label className="block text-sm font-semibold text-gray-700 mt-4 mb-2">
          {t("forgotpassword.username")}
        </label>

        <input
          type="text"
          placeholder={t("forgotpassword.enter_your_username")}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full text-gray-700 border rounded-lg px-4 py-3 mb-4 outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="button"
          onClick={handleForgotPassword}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading
            ? t("forgotpassword.generating_password")
            : t("forgotpassword.generate_new_password")}
        </button>
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-center text-green-600">
              {t("forgotpassword.password_generated_successfully")}
            </h2>

            <p className="text-center text-gray-500 mt-2">
              {t("forgotpassword.your_new_password_is_ready")}
              <br />
              {t(
                "forgotpassword.please_copy_before_returning_to_the_login_page"
              )}
            </p>

            <div className="mt-6 rounded-lg border-2 border-dashed border-orange-300 bg-orange-50 p-4 text-center">
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">
                {t("forgotpassword.generated_password")}
              </p>

              <p className="break-all font-mono text-2xl font-bold text-orange-600">
                {generatedPassword}
              </p>
            </div>

            <button
              type="button"
              onClick={handleCopyPassword}
              className="w-full mt-4 border border-gray-300 text-black rounded-lg py-2 hover:bg-gray-100"
            >
              {copied
                ? `✔ ${t("forgotpassword.copied")}`
                : t("forgotpassword.copy_password")}
            </button>

            <button
              type="button"
              onClick={handleBackToLogin}
              className="w-full mt-3 bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700"
            >
              {t("forgotpassword.back_to_login")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}