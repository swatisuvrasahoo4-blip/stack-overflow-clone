import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/lib/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import axiosInstance from "@/lib/axiosinstance";
import { useTranslation } from "react-i18next";

interface SignupForm {
  name: string;
  username: string;
  email: string;
  mobile: string;
  password: string;
}

interface UsernameCheckResponse {
  available: boolean;
  suggestions?: string[];
  message?: string;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

type UsernameStatus =
  | "idle"
  | "checking"
  | "available"
  | "taken"
  | "invalid";

export default function SignUpPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { Signup, loading } = useAuth();

  const [form, setForm] = useState<SignupForm>({
    name: "",
    username: "",
    email: "",
    mobile: "",
    password: "",
  });

  const [usernameStatus, setUsernameStatus] =
    useState<UsernameStatus>("idle");

  const [usernameMessage, setUsernameMessage] =
    useState<string>("");

  const [usernameSuggestions, setUsernameSuggestions] =
    useState<string[]>([]);

  useEffect(() => {
    const username = form.username.trim().toLowerCase();

    if (!username) {
      setUsernameStatus("idle");
      setUsernameMessage("");
      setUsernameSuggestions([]);
      return;
    }

    const usernamePattern = /^[a-z0-9_]{3,20}$/;

    if (!usernamePattern.test(username)) {
      setUsernameStatus("invalid");
      setUsernameMessage(
        "Use 3–20 letters, numbers, or underscores only"
      );
      setUsernameSuggestions([]);
      return;
    }

    setUsernameStatus("checking");
    setUsernameMessage("Checking username...");

    const timer = setTimeout(async () => {
      try {
        const response =
          await axiosInstance.get<UsernameCheckResponse>(
            "/user/check-username",
            {
              params: {
                username,
              },
            }
          );

        console.log(response.data);

        if (response.data.available) {
          setUsernameStatus("available");
          setUsernameMessage("Username is available");
          setUsernameSuggestions([]);
        } else {
          setUsernameStatus("taken");
          setUsernameMessage("Username is already taken");
          setUsernameSuggestions(
            response.data.suggestions ?? []
          );
        }
      } catch (error: unknown) {
        const apiError = error as ApiError;

        setUsernameStatus("invalid");

        setUsernameMessage(
          apiError.response?.data?.message ||
            "Could not check username"
        );

        setUsernameSuggestions([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [form.username]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { id, value } = e.target;

    setForm((previousForm) => ({
      ...previousForm,
      [id]: value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (
      !form.name.trim() ||
      !form.username.trim() ||
      !form.email.trim() ||
      !form.mobile.trim() ||
      !form.password
    ) {
      toast.error(
        t("toast.all_fields_are_required")
      );
      return;
    }

    const mobilePattern = /^[0-9]{10}$/;

    if (!mobilePattern.test(form.mobile)) {
      toast.error(
        t(
          "toast.mobile_number_must_contain_exactly_10_digits"
        )
      );
      return;
    }

    if (
      form.password.length < 8 ||
      !/[A-Za-z]/.test(form.password) ||
      !/[0-9]/.test(form.password)
    ) {
      toast.error(
        t(
          "toast.password_must_contain_at_least_8_characters_including_atleast_1_letter_and_1_number"
        )
      );
      return;
    }

    if (usernameStatus !== "available") {
      toast.error(
        t(
          "toast.please_choose_an_available_username"
        )
      );
      return;
    }

    try {
      await Signup(form);

      void router.push("/");
    } catch (error: unknown) {
      console.error("Signup failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6 lg:mb-8">
          <Link
            href="/"
            className="flex items-center justify-center mb-4"
          >
            <div className="w-6 h-6 lg:w-8 lg:h-8 bg-orange-500 rounded mr-2 flex items-center justify-center">
              <div className="w-4 h-4 lg:w-6 lg:h-6 bg-white rounded-sm flex items-center justify-center">
                <div className="w-3 h-3 lg:w-4 lg:h-4 bg-orange-500 rounded-sm" />
              </div>
            </div>

            <span className="text-lg lg:text-xl font-bold text-gray-800">
              stack
              <span className="font-normal">
                overflow
              </span>
            </span>
          </Link>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-xl lg:text-2xl">
                Create your account
              </CardTitle>

              <CardDescription>
                Join the Stack Overflow community
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <Button
                type="button"
                variant="outline"
                className="w-full bg-transparent text-sm"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />

                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />

                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />

                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>

                Sign up with Google
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full bg-transparent text-sm"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                    clipRule="evenodd"
                  />
                </svg>

                Sign up with GitHub
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>

                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm">
                  Display name
                </Label>

                <Input
                  id="name"
                  placeholder="Enter your display name"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm">
                  Username
                </Label>

                <Input
                  id="username"
                  placeholder="Choose a username"
                  value={form.username}
                  onChange={handleChange}
                />
              </div>

              {usernameMessage && (
                <p
                  className={`text-sm ${
                    usernameStatus === "available"
                      ? "text-green-600"
                      : usernameStatus === "checking"
                        ? "text-gray-500"
                        : "text-red-500"
                  }`}
                >
                  {usernameMessage}
                </p>
              )}

              {usernameSuggestions.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">
                    Try one of these:
                  </p>

                  <div className="mt-2 flex flex-wrap gap-2">
                    {usernameSuggestions.map(
                      (suggestion) => (
                        <button
                          key={suggestion}
                          type="button"
                          onClick={() =>
                            setForm(
                              (previousForm) => ({
                                ...previousForm,
                                username: suggestion,
                              })
                            )
                          }
                          className="rounded-md bg-blue-100 px-3 py-1 text-sm text-blue-700 hover:bg-blue-200"
                        >
                          @{suggestion}
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm">
                  Email
                </Label>

                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile" className="text-sm">
                  Mobile Number
                </Label>

                <Input
                  id="mobile"
                  type="tel"
                  placeholder="Enter your mobile number"
                  value={form.mobile}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm">
                  Password
                </Label>

                <Input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                />

                <p className="text-xs text-gray-600">
                  Passwords must contain at least eight characters,
                  including at least 1 letter and 1 number.
                </p>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  className="mt-1"
                />

                <Label
                  htmlFor="terms"
                  className="text-sm leading-relaxed"
                >
                  I agree to the{" "}
                  <Link
                    href="#"
                    className="text-blue-600 hover:underline"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="#"
                    className="text-blue-600 hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              <Button
                type="submit"
                disabled={loading || usernameStatus === "checking"}
                className="w-full bg-blue-600 hover:bg-blue-700 text-sm"
              >
                {loading
                  ? "Signing up..."
                  : "Sign up"}
              </Button>

              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link
                  href="/auth"
                  className="text-blue-600 hover:underline"
                >
                  Log in
                </Link>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}