import type {
  ChangeEvent,
  FormEvent,
} from "react";

import Link from "next/link";

import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { UsernameStatus } from "@/hooks/useUsernameCheck";

export interface SignupFormData {
  name: string;
  username: string;
  email: string;
  mobile: string;
  password: string;
}

interface SignUpFormProps {
  form: SignupFormData;
  usernameStatus: UsernameStatus;
  usernameMessage: string;
  usernameSuggestions: string[];
  loading: boolean;
  onChange: (
    event: ChangeEvent<HTMLInputElement>
  ) => void;
  onUsernameSelect: (
    username: string
  ) => void;
  onSubmit: (
    event: FormEvent<HTMLFormElement>
  ) => void | Promise<void>;
}

const SignUpForm = ({
  form,
  usernameStatus,
  usernameMessage,
  usernameSuggestions,
  loading,
  onChange,
  onUsernameSelect,
  onSubmit,
}: SignUpFormProps) => {
  const { t } =
    useTranslation("auth");

  return (
    <form
      onSubmit={(event) =>
        void onSubmit(event)
      }
    >
      <div className="space-y-4">
        {/* Display name */}

        <div className="space-y-2">
          <Label
            htmlFor="name"
            className="text-sm"
          >
            {t(
              "labels.display_name"
            )}
          </Label>

          <Input
            id="name"
            placeholder={t(
              "placeholders.enter_display_name"
            )}
            value={form.name}
            onChange={onChange}
          />
        </div>

        {/* Username */}

        <div className="space-y-2">
          <Label
            htmlFor="username"
            className="text-sm"
          >
            {t(
              "labels.username"
            )}
          </Label>

          <Input
            id="username"
            placeholder={t(
              "placeholders.choose_username"
            )}
            value={form.username}
            onChange={onChange}
          />
        </div>

        {/* Username status */}

        {usernameMessage && (
          <p
            className={`text-sm ${
              usernameStatus ===
              "available"
                ? "text-green-600"
                : usernameStatus ===
                    "checking"
                  ? "text-gray-500"
                  : "text-red-500"
            }`}
          >
            {usernameMessage}
          </p>
        )}

        {/* Username suggestions */}

        {usernameSuggestions.length >
          0 && (
          <div>
            <p className="text-sm text-gray-600">
              {t(
                "messages.try_one_of_these"
              )}
            </p>

            <div className="mt-2 flex flex-wrap gap-2">
              {usernameSuggestions.map(
                (suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() =>
                      onUsernameSelect(
                        suggestion
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
            value={form.email}
            onChange={onChange}
          />
        </div>

        {/* Mobile */}

        <div className="space-y-2">
          <Label
            htmlFor="mobile"
            className="text-sm"
          >
            {t(
              "labels.mobile_number"
            )}
          </Label>

          <Input
            id="mobile"
            type="tel"
            placeholder={t(
              "placeholders.enter_mobile_number"
            )}
            value={form.mobile}
            onChange={onChange}
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
            value={form.password}
            onChange={onChange}
          />

          <p className="text-xs text-gray-600">
            {t(
              "messages.password_requirements"
            )}
          </p>
        </div>

        {/* Terms */}

        <div className="flex items-start space-x-2">
          <Checkbox
            id="terms"
            className="mt-1"
          />

          <Label
            htmlFor="terms"
            className="text-sm leading-relaxed"
          >
            {t(
              "legal.i_agree_to_the"
            )}{" "}
            <Link
              href="#"
              className="text-blue-600 hover:underline"
            >
              {t(
                "legal.terms_of_service"
              )}
            </Link>{" "}
            {t(
              "legal.and"
            )}{" "}
            <Link
              href="#"
              className="text-blue-600 hover:underline"
            >
              {t(
                "legal.privacy_policy"
              )}
            </Link>
          </Label>
        </div>

        {/* Submit */}

        <Button
          type="submit"
          disabled={
            loading ||
            usernameStatus ===
              "checking"
          }
          className="w-full bg-blue-600 text-sm hover:bg-blue-700"
        >
          {loading
            ? t(
                "status.signing_up"
              )
            : t(
                "actions.sign_up"
              )}
        </Button>

        {/* Login link */}

        <div className="text-center text-sm">
          {t(
            "messages.already_have_account"
          )}{" "}
          <Link
            href="/auth"
            className="text-blue-600 hover:underline"
          >
            {t(
              "actions.log_in"
            )}
          </Link>
        </div>
      </div>
    </form>
  );
};

export default SignUpForm;