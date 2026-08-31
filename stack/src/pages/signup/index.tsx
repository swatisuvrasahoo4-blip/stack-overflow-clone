import {
  useState,
} from "react";

import type {
  ChangeEvent,
  FormEvent,
} from "react";

import Link from "next/link";
import { useRouter } from "next/router";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import SignUpForm, {
  type SignupFormData,
} from "@/components/auth/SignUpForm";

import SocialLoginButtons from "../auth/SocialLoginButtons";
import useUsernameCheck from "@/hooks/useUsernameCheck";

import { useAuth } from "@/lib/AuthContext";

import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const SignUpPage = () => {
  const router = useRouter();
  const { t } = useTranslation();

  const {
    Signup,
    loading,
  } = useAuth();

  // Signup form
  const [
    form,
    setForm,
  ] = useState<SignupFormData>({
    name: "",
    username: "",
    email: "",
    mobile: "",
    password: "",
  });

  // Username availability
  const {
    usernameStatus,
    usernameMessage,
    usernameSuggestions,
  } = useUsernameCheck(
    form.username
  );

  // Update form fields
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

  // Select username suggestion
  const handleUsernameSelect = (
    username: string
  ): void => {
    setForm(
      (previousForm) => ({
        ...previousForm,
        username,
      })
    );
  };

  // Submit signup form
  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    if (
      !form.name.trim() ||
      !form.username.trim() ||
      !form.email.trim() ||
      !form.mobile.trim() ||
      !form.password
    ) {
      toast.error(
        t(
          "toast.all_fields_are_required"
        )
      );

      return;
    }

    const mobilePattern =
      /^[0-9]{10}$/;

    if (
      !mobilePattern.test(
        form.mobile
      )
    ) {
      toast.error(
        t(
          "toast.mobile_number_must_contain_exactly_10_digits"
        )
      );

      return;
    }

    const validPassword =
      form.password.length >= 8 &&
      /[A-Za-z]/.test(
        form.password
      ) &&
      /[0-9]/.test(
        form.password
      );

    if (!validPassword) {
      toast.error(
        t(
          "toast.password_must_contain_at_least_8_characters_including_atleast_1_letter_and_1_number"
        )
      );

      return;
    }

    if (
      usernameStatus !==
      "available"
    ) {
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
    } catch (
      error: unknown
    ) {
      console.error(
        "Signup failed:",
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

        {/* Signup card */}
        <Card>
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-xl lg:text-2xl">
              Create your account
            </CardTitle>

            <CardDescription>
              Join the Stack Overflow
              community
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Social signup */}
            <SocialLoginButtons />

            {/* Signup form */}
            <SignUpForm
              form={form}
              usernameStatus={
                usernameStatus
              }
              usernameMessage={
                usernameMessage
              }
              usernameSuggestions={
                usernameSuggestions
              }
              loading={loading}
              onChange={
                handleChange
              }
              onUsernameSelect={
                handleUsernameSelect
              }
              onSubmit={
                handleSubmit
              }
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUpPage;