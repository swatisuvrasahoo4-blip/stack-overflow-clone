import {
  useState,
} from "react";

import type {
  ChangeEvent,
  FormEvent,
} from "react";

import Link from "next/link";

import { useRouter } from "next/router";

import { useTranslation } from "react-i18next";

import { toast } from "react-toastify";

import SocialLoginButtons from "./SocialLoginButtons";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { useAuth } from "@/lib/AuthContext";

interface LoginForm {
  email: string;
  password: string;
}

const LoginPage = () => {
  const router = useRouter();

  const { t } =
    useTranslation("auth");

  const {
    Login,
    loading,
  } = useAuth();

  const [
    form,
    setForm,
  ] = useState<LoginForm>({
    email: "",
    password: "",
  });

  // Update login form

  const handleChange = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    const {
      id,
      value,
    } = event.target;

    setForm(
      (previousForm) => ({
        ...previousForm,
        [id]: value,
      })
    );
  };

  // Submit login

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    if (
      !form.email ||
      !form.password
    ) {
      toast.error(
        t(
          "messages.all_fields_required"
        )
      );

      return;
    }

    try {
      const result =
        await Login(form);

      if (
        result
          ?.requiresDeviceVerification
      ) {
        sessionStorage.setItem(
          "loginVerification",
          JSON.stringify({
            userId:
              result.userId,
            deviceId:
              result.deviceId,
            email:
              form.email,
          })
        );

        await router.push(
          "/verifyLoginDevice"
        );

        return;
      }

      if (result === true) {
        await router.push("/");
      }
    } catch (error: unknown) {
      console.error(
        "Login error:",
        error
      );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-6 text-center lg:mb-8">
          <Link
            href="/"
            className="mb-4 flex items-center justify-center"
          >
            <div className="mr-2 flex h-6 w-6 items-center justify-center rounded bg-orange-500 lg:h-8 lg:w-8">
              <div className="flex h-4 w-4 items-center justify-center rounded-sm bg-white lg:h-6 lg:w-6">
                <div className="h-3 w-3 rounded-sm bg-orange-500 lg:h-4 lg:w-4" />
              </div>
            </div>

            <span className="text-lg font-bold text-gray-800 lg:text-xl">
              stack
              <span className="font-normal">
                overflow
              </span>
            </span>
          </Link>
        </div>

        {/* Login form */}
        <form
          onSubmit={
            handleSubmit
          }
        >
          <Card>
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-xl lg:text-2xl">
                {t(
                  "login.title"
                )}
              </CardTitle>

              <CardDescription>
                {t(
                  "login.description"
                )}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Social login */}
              <SocialLoginButtons />

              {/* Email */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm"
                >
                  {t(
                    "labels.email"
                  )}
                </Label>

                <Input
                  id="email"
                  type="email"
                  placeholder={t(
                    "placeholders.email_example"
                  )}
                  onChange={
                    handleChange
                  }
                  value={
                    form.email
                  }
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm"
                >
                  {t(
                    "labels.password"
                  )}
                </Label>

                <Input
                  id="password"
                  type="password"
                  onChange={
                    handleChange
                  }
                  value={
                    form.password
                  }
                />
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-sm hover:bg-blue-700"
              >
                {loading
                  ? t(
                      "status.logging_in"
                    )
                  : t(
                      "actions.log_in"
                    )}
              </Button>

              {/* Forgot password */}
              <div className="text-center text-sm">
                <Link
                  href="/forgot-password"
                  className="text-blue-600 hover:underline"
                >
                  {t(
                    "login.forgot_password"
                  )}
                </Link>
              </div>

              {/* Sign up */}
              <div className="text-center text-sm">
                {t(
                  "login.dont_have_account"
                )}{" "}

                <Link
                  href="/signup"
                  className="text-blue-600 hover:underline"
                >
                  {t(
                    "actions.sign_up"
                  )}
                </Link>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;