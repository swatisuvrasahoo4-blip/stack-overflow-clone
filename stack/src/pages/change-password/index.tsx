import {
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

import { changePassword } from "@/components/services/changePasswordService";

import { useAuth } from "@/lib/AuthContext";

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

interface ChangePasswordResponse {
  message: string;
}

const ChangePassword = () => {
  const router = useRouter();

  const { user } = useAuth();
  const { t } = useTranslation();

  const [
    currentPassword,
    setCurrentPassword,
  ] = useState("");

  const [
    newPassword,
    setNewPassword,
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  // Change password
  const handleChangePassword =
    async (): Promise<void> => {
      setErrorMessage("");
      setSuccessMessage("");

      if (
        !currentPassword ||
        !newPassword ||
        !confirmPassword
      ) {
        setErrorMessage(
          t(
            "error.please_fill_in_all_fields"
          )
        );

        return;
      }

      try {
        setLoading(true);

        const response:
          ChangePasswordResponse =
          await changePassword(
            currentPassword,
            newPassword,
            confirmPassword
          );

        setSuccessMessage(
          response.message
        );

        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");

        setTimeout(() => {
          void router.push(
            `/users/${user?._id}`
          );
        }, 1500);
      } catch (error: unknown) {
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

  // Redirect unauthenticated users
  useEffect(() => {
    if (!user) {
      void router.replace(
        "/auth"
      );
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        {/* Page header */}
        <h1 className="mb-2 text-center text-3xl font-bold text-black">
          {t(
            "changepass.change_password"
          )}
        </h1>

        <p className="mb-6 text-center text-gray-500">
          {t(
            "changepass.update_your_account_password_securely"
          )}
        </p>

        {/* Success message */}
        {successMessage && (
          <div className="mb-4 rounded-lg border border-green-300 bg-green-100 px-4 py-3 text-sm text-green-700">
            {successMessage}
          </div>
        )}

        {/* Error message */}
        {errorMessage && (
          <div className="mb-4 rounded-lg border border-red-300 bg-red-100 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        {/* Current password */}
        <label
          htmlFor="currentPassword"
          className="mb-2 block text-sm font-semibold text-gray-700"
        >
          {t(
            "changepass.current_password"
          )}
        </label>

        <input
          id="currentPassword"
          type="password"
          value={currentPassword}
          onChange={(event) =>
            setCurrentPassword(
              event.target.value
            )
          }
          placeholder={t(
            "changepass.enter_current_password"
          )}
          className="mb-4 w-full rounded-lg border px-4 py-3 text-gray-700 outline-none focus:ring-2 focus:ring-orange-500"
        />

        {/* New password */}
        <label
          htmlFor="newPassword"
          className="mb-2 block text-sm font-semibold text-gray-700"
        >
          {t(
            "changepass.new_password"
          )}
        </label>

        <input
          id="newPassword"
          type="password"
          value={newPassword}
          onChange={(event) =>
            setNewPassword(
              event.target.value
            )
          }
          placeholder={t(
            "changepass.enter_new_password"
          )}
          className="mb-4 w-full rounded-lg border px-4 py-3 text-gray-700 outline-none focus:ring-2 focus:ring-orange-500"
        />

        {/* Confirm password */}
        <label
          htmlFor="confirmPassword"
          className="mb-2 block text-sm font-semibold text-gray-700"
        >
          {t(
            "changepass.confirm_password"
          )}
        </label>

        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(event) =>
            setConfirmPassword(
              event.target.value
            )
          }
          placeholder={t(
            "changepass.confirm_new_password"
          )}
          className="mb-6 w-full rounded-lg border px-4 py-3 text-gray-700 outline-none focus:ring-2 focus:ring-orange-500"
        />

        {/* Submit */}
        <button
          type="button"
          onClick={() =>
            void handleChangePassword()
          }
          disabled={loading}
          className="w-full rounded-lg bg-orange-600 py-3 text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? t(
                "changepass.changing_password"
              )
            : t(
                "changepass.change_password"
              )}
        </button>
      </div>
    </div>
  );
};

export default ChangePassword;