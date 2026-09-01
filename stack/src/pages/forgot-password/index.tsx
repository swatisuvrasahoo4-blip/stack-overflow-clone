import {
  useState,
} from "react";

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

  const { t } =
    useTranslation("auth");

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
            "forgot_password.messages.enter_registered_email_and_username"
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

        console.log(
          "Forgot password response:",
          response.message
        );

        setSuccessMessage(
          t(
            "forgot_password.messages.password_generated_successfully"
          )
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

        console.error(
          "Forgot password error:",
          apiError.response?.data
            ?.message ||
            apiError.message ||
            error
        );

        setErrorMessage(
          t(
            "forgot_password.messages.failed_to_generate_password"
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
              "forgot_password.messages.password_not_copied"
            )}\n\n${t(
              "forgot_password.messages.confirm_back_to_login"
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
              "forgot_password.title"
            )}
          </h1>
        </div>

        {/* Description */}

        <p className="mt-3 text-center text-sm leading-6 text-gray-500">
          {t(
            "forgot_password.description.enter_registered_email"
          )}

          <br />

          {t(
            "forgot_password.description.generate_new_password"
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
            "forgot_password.labels.registered_email"
          )}
        </label>

        <input
          id="forgot-email"
          type="email"
          placeholder={t(
            "forgot_password.placeholders.enter_registered_email"
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
            "forgot_password.labels.username"
          )}
        </label>

        <input
          id="forgot-username"
          type="text"
          placeholder={t(
            "forgot_password.placeholders.enter_username"
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
                "forgot_password.status.generating_password"
              )
            : t(
                "forgot_password.actions.generate_new_password"
              )}
        </button>
      </div>

      {/* Generated password modal */}

      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-center text-2xl font-bold text-green-600">
              {t(
                "forgot_password.modal.password_generated_successfully"
              )}
            </h2>

            <p className="mt-2 text-center text-gray-500">
              {t(
                "forgot_password.modal.new_password_ready"
              )}

              <br />

              {t(
                "forgot_password.modal.copy_before_returning"
              )}
            </p>

            {/* Generated password */}

            <div className="mt-6 rounded-lg border-2 border-dashed border-orange-300 bg-orange-50 p-4 text-center">
              <p className="mb-2 text-xs uppercase tracking-wider text-gray-500">
                {t(
                  "forgot_password.labels.generated_password"
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
                    "forgot_password.status.copied"
                  )}`
                : t(
                    "forgot_password.actions.copy_password"
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
                "forgot_password.actions.back_to_login"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;