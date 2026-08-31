import {
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/router";

import { useAuth } from "@/lib/AuthContext";

import { useTranslation } from "react-i18next";

import Mainlayout from "@/layout/Mainlayout";

import FeedTabs from "@/components/feed/FeedTabs";
import ContentTabs from "@/components/feed/ContentTabs";
import QuestionFilters from "@/components/feed/QuestionFilters";
import QuestionFeed from "@/components/feed/QuestionFeed";
import PostFeed from "@/components/feed/PostFeed";

import SavedList from "@/components/saved/SavedList";

import {
  getFollowing,
} from "@/components/services/followService";

type FeedType =
  | "trending"
  | "following";

type ContentType =
  | "questions"
  | "posts";

type FollowingRelationship = {
  following?:
    | string
    | {
        _id?: string;
        id?: string;
      };
};

export default function Home() {
  const { t } =
    useTranslation();

  const router =
    useRouter();

  const { user } =
    useAuth();

  const { panel } =
    router.query;

  const [
    activeFeed,
    setActiveFeed,
  ] =
    useState<FeedType>(
      "trending"
    );

  const [
    activeContent,
    setActiveContent,
  ] =
    useState<ContentType>(
      "questions"
    );

  const [
    followingIds,
    setFollowingIds,
  ] =
    useState<string[]>(
      []
    );

  const [
    contentReady,
    setContentReady,
  ] =
    useState(false);

  const [
    ,
    setPostCount,
  ] =
    useState(0);

  // Restore selected feed
  useEffect(() => {
    if (
      typeof window ===
      "undefined"
    ) {
      return;
    }

    const savedFeed =
      sessionStorage.getItem(
        "homeActiveFeed"
      );

    if (
      savedFeed ===
        "trending" ||
      savedFeed ===
        "following"
    ) {
      setActiveFeed(
        savedFeed
      );
    }
  }, []);

  // Read content from URL
  useEffect(() => {
    if (
      !router.isReady
    ) {
      return;
    }

    const content =
      router.query.content;

    if (
      content ===
        "posts" ||
      content ===
        "questions"
    ) {
      setActiveContent(
        content
      );
    } else {
      setActiveContent(
        "questions"
      );
    }

    setContentReady(
      true
    );
  }, [
    router.isReady,
    router.query.content,
  ]);

  // Load users that the current user follows
  useEffect(() => {
    let cancelled =
      false;

    const loadFollowing =
      async (): Promise<void> => {
        const userId =
          user?._id ||
          user?.id;

        if (!userId) {
          if (
            !cancelled
          ) {
            setFollowingIds(
              []
            );
          }

          return;
        }

        try {
          const response =
            await getFollowing(
              userId
            );

          if (
            cancelled
          ) {
            return;
          }

          if (
            !Array.isArray(
              response
            )
          ) {
            setFollowingIds(
              []
            );

            return;
          }

          const ids =
            (
              response as FollowingRelationship[]
            )
              .map(
                (
                  relationship
                ) => {
                  if (
                    typeof relationship.following ===
                    "string"
                  ) {
                    return relationship.following;
                  }

                  return (
                    relationship
                      .following
                      ?._id ||
                    relationship
                      .following
                      ?.id
                  );
                }
              )
              .filter(
                (
                  id
                ): id is string =>
                  Boolean(id)
              );

          setFollowingIds(
            ids
          );
        } catch (
          error: unknown
        ) {
          console.error(
            "Failed to load following users:",
            error
          );

          if (
            !cancelled
          ) {
            setFollowingIds(
              []
            );
          }
        }
      };

    void loadFollowing();

    return () => {
      cancelled =
        true;
    };
  }, [
    user?._id,
    user?.id,
  ]);

  if (
    !contentReady
  ) {
    return (
      <Mainlayout>
        <main className="min-w-0 p-4 lg:p-6">
          <div className="flex items-center justify-center py-10">
            <p className="text-sm text-gray-500">
              {t(
                "feed.loading"
              )}
            </p>
          </div>
        </main>
      </Mainlayout>
    );
  }

  return (
    <Mainlayout>
      <main className="min-w-0 p-4 lg:p-6">
        {panel !==
          "saves" && (
          <div className="mb-6 space-y-6">
            <FeedTabs
              activeFeed={
                activeFeed
              }
              setActiveFeed={
                setActiveFeed
              }
            />

            <div className="flex justify-center">
              <ContentTabs
                activeContent={
                  activeContent
                }
                setActiveContent={
                  setActiveContent
                }
              />
            </div>
          </div>
        )}

        <div className="w-full">
          {activeContent ===
            "questions" &&
            panel !==
              "saves" && (
              <div className="mb-4 flex flex-col items-start gap-2 text-sm sm:flex-row sm:items-center sm:gap-4">
                <QuestionFilters>
                  <span className="text-gray-600">
                    {t(
                      "community.questions"
                    )}
                  </span>

                  <button
                    type="button"
                    className="rounded bg-gray-200 px-2 py-1 text-xs text-gray-700 sm:px-3 sm:text-sm"
                  >
                    {t(
                      "community.newest"
                    )}
                  </button>

                  <button
                    type="button"
                    className="rounded px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 sm:px-3 sm:text-sm"
                  >
                    {t(
                      "community.active"
                    )}
                  </button>

                  <button
                    type="button"
                    className="flex items-center rounded px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 sm:px-3 sm:text-sm"
                  >
                    {t(
                      "community.bountied"
                    )}

                    <span className="ml-1 rounded bg-gray-200 px-1.5 py-0.5 text-xs">
                      25
                    </span>
                  </button>

                  <button
                    type="button"
                    className="rounded px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 sm:px-3 sm:text-sm"
                  >
                    {t(
                      "community.unanswered"
                    )}
                  </button>

                  <button
                    type="button"
                    className="rounded px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 sm:px-3 sm:text-sm"
                  >
                    {t(
                      "community.more"
                    )}{" "}
                    ▼
                  </button>

                  <button
                    type="button"
                    className="ml-auto rounded border border-gray-300 px-2 py-1 text-xs text-gray-600 hover:bg-gray-50 sm:px-3 sm:text-sm"
                  >
                    🔍{" "}
                    {t(
                      "community.filter"
                    )}
                  </button>
                </QuestionFilters>
              </div>
            )}

          <div className="space-y-4">
            {panel ===
            "saves" ? (
              <SavedList />
            ) : activeContent ===
              "questions" ? (
              <QuestionFeed
                activeFeed={
                  activeFeed
                }
                followingIds={
                  followingIds
                }
              />
            ) : (
              <PostFeed
                activeFeed={
                  activeFeed
                }
                followingIds={
                  followingIds
                }
                onPostCountChange={
                  setPostCount
                }
              />
            )}
          </div>
        </div>
      </main>
    </Mainlayout>
  );
}