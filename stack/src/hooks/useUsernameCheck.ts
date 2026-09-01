import {
  useEffect,
  useState,
} from "react";

import { useTranslation } from "react-i18next";

import axiosInstance from "@/lib/axiosinstance";

interface UsernameCheckResponse {
  available: boolean;
  suggestions?: string[];
  message?: string;
}

export type UsernameStatus =
  | "idle"
  | "checking"
  | "available"
  | "taken"
  | "invalid";

interface UseUsernameCheckResult {
  usernameStatus: UsernameStatus;
  usernameMessage: string;
  usernameSuggestions: string[];
}

const useUsernameCheck = (
  usernameValue: string
): UseUsernameCheckResult => {
  const { t } =
    useTranslation("auth");

  const [
    usernameStatus,
    setUsernameStatus,
  ] = useState<UsernameStatus>(
    "idle"
  );

  const [
    usernameMessage,
    setUsernameMessage,
  ] = useState("");

  const [
    usernameSuggestions,
    setUsernameSuggestions,
  ] = useState<string[]>([]);

  useEffect(() => {
    const username =
      usernameValue
        .trim()
        .toLowerCase();

    if (!username) {
      setUsernameStatus("idle");
      setUsernameMessage("");
      setUsernameSuggestions([]);
      return;
    }

    const usernamePattern =
      /^[a-z0-9_]{3,20}$/;

    if (
      !usernamePattern.test(
        username
      )
    ) {
      setUsernameStatus(
        "invalid"
      );

      setUsernameMessage(
        t(
          "username_check.invalid_format"
        )
      );

      setUsernameSuggestions([]);

      return;
    }

    setUsernameStatus(
      "checking"
    );

    setUsernameMessage(
      t(
        "username_check.checking"
      )
    );

    setUsernameSuggestions([]);

    const timer =
      window.setTimeout(
        async () => {
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

            if (
              response.data
                .available
            ) {
              setUsernameStatus(
                "available"
              );

              setUsernameMessage(
                t(
                  "username_check.available"
                )
              );

              setUsernameSuggestions(
                []
              );

              return;
            }

            setUsernameStatus(
              "taken"
            );

            setUsernameMessage(
              t(
                "username_check.taken"
              )
            );

            setUsernameSuggestions(
              response.data
                .suggestions ??
                []
            );
          } catch (
            error: unknown
          ) {
            console.error(
              "Username check error:",
              error
            );

            setUsernameStatus(
              "invalid"
            );

            setUsernameMessage(
              t(
                "username_check.failed"
              )
            );

            setUsernameSuggestions(
              []
            );
          }
        },
        500
      );

    return () => {
      window.clearTimeout(
        timer
      );
    };
  }, [
    usernameValue,
    t,
  ]);

  return {
    usernameStatus,
    usernameMessage,
    usernameSuggestions,
  };
};

export default useUsernameCheck;