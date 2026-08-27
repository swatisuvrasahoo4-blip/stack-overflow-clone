import { useState, useEffect } from "react";
import { changePassword } from "@/components/services/changePasswordService";
import { useRouter } from "next/router";
import { useAuth } from "@/lib/AuthContext";
import { useTranslation } from "react-i18next";
export default function ChangePassword() {
    const router = useRouter();
    const { user } = useAuth();
    const {t} = useTranslation();
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
const [errorMessage, setErrorMessage] = useState("");
const [successMessage, setSuccessMessage] = useState("");
    const handleChangePassword = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!currentPassword || !newPassword || !confirmPassword) {
        setErrorMessage(t("error.please_fill_in_all_fields"));
        return;
    }

    try {
        setLoading(true);

        const response = await changePassword(
            currentPassword,
            newPassword,
            confirmPassword
        );

        setSuccessMessage(response.message);

        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");

        setTimeout(() => {
            router.push(`/users/${user._id}`);
        }, 1500);

    } catch (error: any) {
        setErrorMessage(
            error?.response?.data?.message || t("error.something_went_wrong")
        );
    } finally {
        setLoading(false);
    }
};
useEffect(() => {
    if (!user) {
        router.replace("/auth");
    }
}, [user, router]);
if (!user) return null
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">

                <h1 className="text-3xl font-bold text-center mb-2 text-black">
                    {t("changepass.change_password")}
                </h1>

                <p className="text-center text-gray-500 mb-6">
                    {t("changepass.update_your_account_password_securely")}
                </p>
{successMessage && (
    <div className="mb-4 rounded-lg bg-green-100 border border-green-300 text-green-700 px-4 py-3 text-sm">
        {successMessage}
    </div>
)}

{errorMessage && (
    <div className="mb-4 rounded-lg bg-red-100 border border-red-300 text-red-700 px-4 py-3 text-sm">
        {errorMessage}
    </div>
)}
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t("changepass.current_password")}
                </label>

                <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder={t("changepass.enter_current_password")}
                    className="w-full border rounded-lg text-gray-700 px-4 py-3 mb-4 outline-none focus:ring-2 focus:ring-orange-500"
                />

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t("changepass.new_password")}
                </label>

                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder={t("changepass.enter_new_password")}
                    className="w-full border rounded-lg text-gray-700 px-4 py-3 mb-4 outline-none focus:ring-2 focus:ring-orange-500"
                />

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t("changepass.confirm_password")}
                </label>

                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={t("changepass.confirm_new_password")}
                    className="w-full border rounded-lg text-gray-700 px-4 py-3 mb-6 outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button
    type="button"
    onClick={handleChangePassword}
    disabled={loading}
    className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
>
    {loading ? t("changepass.changing_password") : t("changepass.change_password")}
</button>
            </div>
        </div>
    );
}