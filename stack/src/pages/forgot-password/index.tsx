import { useState } from "react";
import { forgotPassword } from "@/components/services/forgotPasswordService";
import { useRouter } from "next/router";
import { LockKeyhole } from "lucide-react";
export default function ForgotPassword() {
    const router = useRouter();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState("");
const [showSuccessModal, setShowSuccessModal] = useState(false);
const [ copied, setCopied] = useState(false);
const [passwordCopied, setPasswordCopied] = useState(false);
const [errorMessage, setErrorMessage] = useState("");
const [successMessage, setSuccessMessage] = useState("");
const handleForgotPassword = async () => {
    setErrorMessage("");
    setSuccessMessage("");
    if (!email.trim()) {
        setErrorMessage("Please enter your registered email and username.");
        return;
    }

    try {
        setLoading(true);

        const response = await forgotPassword(email, username);
        setSuccessMessage(response.message);
        setGeneratedPassword(response.password);
setShowSuccessModal(true);
setEmail("");
setUsername("");
       

        setEmail("");
    } catch (error: any) {
        setErrorMessage(error?.response?.data?.message || "Something went wrong.");
    } finally {
        setLoading(false);
    }
};
  return (
  <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
      <div className="flex flex-col items-center mb-4">
    <div className="bg-orange-100 p-4 rounded-full mb-4">
        <LockKeyhole className="h-8 w-8 text-orange-600" />
    </div>

    <h1 className="text-3xl font-bold text-gray-900">
        Forgot Password
    </h1>
</div>

<p className="mt-3 text-center text-sm leading-6 text-gray-500">
    Enter your registered email address below.
    <br />
    We'll generate a new password for your account.
    <br />
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
<label className="block text-sm font-semibold text-gray-700 mb-2 mt-3">
    Registered Email
</label>
      <input
        type="email"
        placeholder="Enter your registered email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full text-gray-700 border rounded-lg px-4 py-3  mb-4 outline-none focus:ring-2 focus:ring-blue-500"
      />
      <label className="block text-sm font-semibold text-gray-700 mt-4 mb-2">
    Username
</label>

<input
    type="text"
    placeholder="Enter your username"
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
        {loading ? "Generating Password..." : "Generate New Password"}
      </button>
    </div>

    {showSuccessModal && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm">

         <h2 className="text-2xl font-bold text-center text-green-600">
           Password Generated Successfully
</h2>
          <p className="text-center text-gray-500 mt-2">
            Your new password is ready.
Please copy it before returning to the login page.
          </p>

          <div className="mt-6 rounded-lg border-2 border-dashed border-orange-300 bg-orange-50 p-4 text-center">
    <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">
        Generated Password
    </p>

    <p className="font-mono text-2xl font-bold text-orange-600 break-all">
        {generatedPassword}
    </p>
</div>

          <button
            onClick={() => {
                
                navigator.clipboard.writeText(generatedPassword);

setCopied(true);
setPasswordCopied(true);

    setTimeout(() => {
        setCopied(false);
    }, 2000);
}}
            className="w-full mt-4 border border-gray-300 rounded-lg py-2 hover:bg-gray-100"
          >
            {copied ? "✔ Copied" : "Copy Password"}
          </button>

          <button
            onClick={() => {
    if (!passwordCopied) {
        const confirmLeave = window.confirm(
            "You haven't copied your generated password yet.\n\nAre you sure you want to go back to the login page?"
        );

        if (!confirmLeave) return;
    }

    setShowSuccessModal(false);
    router.push("/auth");
}}
            className="w-full mt-3 bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700"
          >
            Back to Login
          </button>

        </div>
      </div>
    )}
  </div>
);
}