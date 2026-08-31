import {
  useEffect,
  useState,
} from "react";

import {
  UserCheck,
  UserPlus,
} from "lucide-react";

import axios from "axios";
import { useTranslation } from "react-i18next";

import { useAuth } from "@/lib/AuthContext";

import {
  followUser,
  getFollowStatus,
  unfollowUser,
} from "../services/followService";

interface FollowButtonProps {
  userId: string;
  showText?: boolean;
}

export const FollowButton = ({
  userId,
  showText = false,
}: FollowButtonProps) => {
  const { user } = useAuth();
  const { t } = useTranslation();

  const [
    checkingStatus,
    setCheckingStatus,
  ] = useState(true);

  const [
    isFollowing,
    setIsFollowing,
  ] = useState(false);

  useEffect(() => {
    if (!user) {
      setCheckingStatus(false);
      return;
    }

    const loadFollowStatus =
      async (): Promise<void> => {
        try {
          const status =
            await getFollowStatus(
              userId
            );

          setIsFollowing(
            status
          );
        } catch (
          error: unknown
        ) {
          console.error(
            "Failed to get follow status:",
            error
          );
        } finally {
          setCheckingStatus(
            false
          );
        }
      };

    void loadFollowStatus();
  }, [userId, user]);

  const handleFollowClick =
    async (
      event: React.MouseEvent<HTMLButtonElement>
    ): Promise<void> => {
      event.preventDefault();
      event.stopPropagation();

      if (!user) {
        alert(
          t(
            "alert.please_log_in_to_follow_users"
          )
        );

        return;
      }

      try {
        if (isFollowing) {
          await unfollowUser(
            userId
          );
        } else {
          await followUser(
            userId
          );
        }

        setIsFollowing(
          (previousState) =>
            !previousState
        );
      } catch (
        error: unknown
      ) {
        if (
          axios.isAxiosError(
            error
          )
        ) {
          console.error(
            "Follow request failed:",
            error.response
              ?.data
          );

          return;
        }

        console.error(
          "Follow action failed:",
          error
        );
      }
    };

  if (checkingStatus) {
    return (
      <button
        type="button"
        disabled
        className="cursor-wait rounded-md bg-gray-200 p-1.5 text-sm font-medium text-gray-500"
      >
        {/* Follow status */}

        {showText ? (
          "Checking..."
        ) : (
          <UserPlus className="h-4 w-4 animate-pulse" />
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={
        handleFollowClick
      }
      className={`cursor-pointer rounded-md p-1.5 text-sm font-medium transition ${
        isFollowing
          ? "bg-gray-200 text-gray-700"
          : "bg-blue-600 text-white hover:bg-blue-700"
      }`}
    >
      {/* Follow button content */}

      {showText ? (
        isFollowing ? (
          "Following"
        ) : (
          "Follow"
        )
      ) : isFollowing ? (
        <UserCheck className="h-4 w-4" />
      ) : (
        <UserPlus className="h-4 w-4" />
      )}
    </button>
  );
};