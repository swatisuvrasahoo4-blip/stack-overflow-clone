import { useState } from "react";

import { LockKeyhole } from "lucide-react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

import { forgotPassword } from "@/components/services/forgotPasswordService";

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

const ForgotPassword = () => {
  const router = useRouter();
  const { t } = useTranslation();

  const [email, setEmail] =
    useState("");

  const [username, setUsername] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [
    generatedPassword,
    setGeneratedPassword,
  ] = useState("");

  const [
    showSuccessModal,
    setShowSuccessModal,
  ] = useState(false);

  const [copied, setCopied] =
    useState(false);

  const [
    passwordCopied,
    setPasswordCopied,
  ] = useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  // Generate a new password
  const handleForgotPassword =
    async (): Promise<void> => {
      setErrorMessage("");
      setSuccessMessage("");

      if (
        !email.trim() ||
        !username.trim()
      ) {
        setErrorMessage(
          t(
            "error.please_enter_your_registered_email_and_username"
          )
        );

        return;
      }

      try {
        setLoading(true);

        const response:
          ForgotPasswordResponse =
          await forgotPassword(
            email,
            username
          );

        setSuccessMessage(
          response.message
        );

        setGeneratedPassword(
          response.password
        );

        setShowSuccessModal(
          true
        );

        setPasswordCopied(
          false
        );

        setCopied(false);

        setEmail("");
        setUsername("");
      } catch (
        error: unknown
      ) {
        const apiError =
          error as ApiError;

        setErrorMessage(
          apiError.response?.data
            ?.message ||
            t(
              "error.something_went_wrong"
            )
        );
      } finally {
        setLoading(false);
      }
    };

  // Copy generated password
  const handleCopyPassword =
    async (): Promise<void> => {
      try {
        await navigator.clipboard.writeText(
          generatedPassword
        );

        setCopied(true);
        setPasswordCopied(true);

        window.setTimeout(() => {
          setCopied(false);
        }, 2000);
      } catch (
        error: unknown
      ) {
        console.error(
          "Failed to copy password:",
          error
        );
      }
    };

  // Return to login page
  const handleBackToLogin =
    (): void => {
      if (!passwordCopied) {
        const confirmLeave =
          window.confirm(
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

      setShowSuccessModal(
        false
      );

      void router.push("/auth");
    };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      {/* Forgot password card */}
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        {/* Header */}
        <div className="mb-4 flex flex-col items-center">
          <div className="mb-4 rounded-full bg-orange-100 p-4">
            <LockKeyhole className="h-8 w-8 text-orange-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900">
            {t(
              "forgotpassword.forgot_password"
            )}
          </h1>
        </div>

        {/* Description */}
        <p className="mt-3 text-center text-sm leading-6 text-gray-500">
          {t(
            "forgotpassword.enter_your_registered_email_address_below"
          )}

          <br />

          {t(
            "forgotpassword.we_will_generate_a_new_password_for_your_account"
          )}
        </p>

        {/* Success message */}
        {successMessage && (
          <div className="mb-4 mt-4 rounded-lg border border-green-300 bg-green-100 px-4 py-3 text-sm text-green-700">
            {successMessage}
          </div>
        )}

        {/* Error message */}
        {errorMessage && (
          <div className="mb-4 mt-4 rounded-lg border border-red-300 bg-red-100 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        {/* Email */}
        <label
          htmlFor="forgot-email"
          className="mb-2 mt-3 block text-sm font-semibold text-gray-700"
        >
          {t(
            "forgotpassword.registered_email"
          )}
        </label>

        <input
          id="forgot-email"
          type="email"
          placeholder={t(
            "forgotpassword.enter_your_registered_email"
          )}
          value={email}
          onChange={(event) =>
            setEmail(
              event.target.value
            )
          }
          className="mb-4 w-full rounded-lg border px-4 py-3 text-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Username */}
        <label
          htmlFor="forgot-username"
          className="mb-2 mt-4 block text-sm font-semibold text-gray-700"
        >
          {t(
            "forgotpassword.username"
          )}
        </label>

        <input
          id="forgot-username"
          type="text"
          placeholder={t(
            "forgotpassword.enter_your_username"
          )}
          value={username}
          onChange={(event) =>
            setUsername(
              event.target.value
            )
          }
          className="mb-4 w-full rounded-lg border px-4 py-3 text-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Generate password */}
        <button
          type="button"
          onClick={() =>
            void handleForgotPassword()
          }
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 py-3 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? t(
                "forgotpassword.generating_password"
              )
            : t(
                "forgotpassword.generate_new_password"
              )}
        </button>
      </div>

      {/* Generated password modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-center text-2xl font-bold text-green-600">
              {t(
                "forgotpassword.password_generated_successfully"
              )}
            </h2>

            <p className="mt-2 text-center text-gray-500">
              {t(
                "forgotpassword.your_new_password_is_ready"
              )}

              <br />

              {t(
                "forgotpassword.please_copy_before_returning_to_the_login_page"
              )}
            </p>

            {/* Generated password */}
            <div className="mt-6 rounded-lg border-2 border-dashed border-orange-300 bg-orange-50 p-4 text-center">
              <p className="mb-2 text-xs uppercase tracking-wider text-gray-500">
                {t(
                  "forgotpassword.generated_password"
                )}
              </p>

              <p className="break-all font-mono text-2xl font-bold text-orange-600">
                {
                  generatedPassword
                }
              </p>
            </div>

            {/* Copy password */}
            <button
              type="button"
              onClick={() =>
                void handleCopyPassword()
              }
              className="mt-4 w-full rounded-lg border border-gray-300 py-2 text-black hover:bg-gray-100"
            >
              {copied
                ? `✔ ${t(
                    "forgotpassword.copied"
                  )}`
                : t(
                    "forgotpassword.copy_password"
                  )}
            </button>

            {/* Back to login */}
            <button
              type="button"
              onClick={
                handleBackToLogin
              }
              className="mt-3 w-full rounded-lg bg-blue-600 py-2 text-white hover:bg-blue-700"
            >
              {t(
                "forgotpassword.back_to_login"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;