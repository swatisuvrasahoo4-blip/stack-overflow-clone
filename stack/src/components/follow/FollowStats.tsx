import {
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

import { getFollowCounts } from "../services/followService";

interface FollowStatsProps {
  userId: string;
}

export const FollowStats = ({
  userId,
}: FollowStatsProps) => {
  const { t } =
    useTranslation("community");

  const router =
    useRouter();

  const [
    followers,
    setFollowers,
  ] = useState(0);

  const [
    following,
    setFollowing,
  ] = useState(0);

  useEffect(() => {
    const loadFollowCounts =
      async (): Promise<void> => {
        try {
          const data =
            await getFollowCounts(
              userId
            );

          setFollowers(
            data.followers || 0
          );

          setFollowing(
            data.following || 0
          );
        } catch (
          error: unknown
        ) {
          console.error(
            "Failed to load follow counts:",
            error
          );
        }
      };

    if (userId) {
      void loadFollowCounts();
    }
  }, [userId]);

  const handleFollowersClick =
    () => {
      void router.push(
        `/users/${userId}/connections?tab=followers`
      );
    };

  const handleFollowingClick =
    () => {
      void router.push(
        `/users/${userId}/connections?tab=following`
      );
    };

  return (
    <div className="flex items-center gap-5 text-sm">
      <button
        type="button"
        onClick={
          handleFollowersClick
        }
        className="cursor-pointer hover:underline"
      >
        <span className="font-semibold">
          {followers}
        </span>{" "}
        {t(
          "follow.followers"
        )}
      </button>

      <button
        type="button"
        onClick={
          handleFollowingClick
        }
        className="cursor-pointer hover:underline"
      >
        <span className="font-semibold">
          {following}
        </span>{" "}
        {t(
          "follow.following"
        )}
      </button>
    </div>
  );
};