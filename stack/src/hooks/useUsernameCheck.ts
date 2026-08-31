import {
  useEffect,
  useState,
} from "react";

import axiosInstance from "@/lib/axiosinstance";

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
  const [
    usernameStatus,
    setUsernameStatus,
  ] =
    useState<UsernameStatus>(
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

  // Check username availability
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
        "Use 3–20 letters, numbers, or underscores only"
      );

      setUsernameSuggestions([]);
      return;
    }

    setUsernameStatus(
      "checking"
    );

    setUsernameMessage(
      "Checking username..."
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
                "Username is available"
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
              "Username is already taken"
            );

            setUsernameSuggestions(
              response.data
                .suggestions ??
                []
            );
          } catch (
            error: unknown
          ) {
            const apiError =
              error as ApiError;

            setUsernameStatus(
              "invalid"
            );

            setUsernameMessage(
              apiError.response
                ?.data
                ?.message ||
                "Could not check username"
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
  }, [usernameValue]);

  return {
    usernameStatus,
    usernameMessage,
    usernameSuggestions,
  };
};

export default useUsernameCheck;