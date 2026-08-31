import {
  useEffect,
  useState,
} from "react";

import {
  ArrowLeft,
  UserRound,
} from "lucide-react";

import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

import MainLayout from "@/layout/Mainlayout";

import {
  getFollowers,
  getFollowing,
} from "@/components/services/followService";

import axiosInstance from "@/lib/axiosinstance";

interface ProfileUser {
  _id: string;
  id?: string;
  name: string;
  username?: string;
  email?: string;
}

interface ConnectionItem {
  _id: string;
  follower?: ProfileUser;
  following?: ProfileUser;
}

interface UsersResponse {
  data?: ProfileUser[];
}

type ConnectionTab =
  | "followers"
  | "following";

const ConnectionsPage = () => {
  const { t } = useTranslation();

  const router = useRouter();

  const { id, tab } =
    router.query;

  const [
    profileName,
    setProfileName,
  ] = useState("");

  const [
    activeTab,
    setActiveTab,
  ] =
    useState<ConnectionTab>(
      "followers"
    );

  const [
    users,
    setUsers,
  ] = useState<
    ConnectionItem[]
  >([]);

  const [
    loading,
    setLoading,
  ] = useState(false);

  // Sync active tab with URL
  useEffect(() => {
    if (
      tab === "following"
    ) {
      setActiveTab(
        "following"
      );
    } else {
      setActiveTab(
        "followers"
      );
    }
  }, [tab]);

  // Load followers or following
  useEffect(() => {
    const loadConnections =
      async (): Promise<void> => {
        if (
          !id ||
          typeof id !==
            "string"
        ) {
          return;
        }

        try {
          setLoading(true);

          const data =
            activeTab ===
            "followers"
              ? await getFollowers(
                  id
                )
              : await getFollowing(
                  id
                );

          setUsers(
            data || []
          );
        } catch (
          error: unknown
        ) {
          console.error(
            "Connections error:",
            error
          );

          setUsers([]);
        } finally {
          setLoading(false);
        }
      };

    void loadConnections();
  }, [
    id,
    activeTab,
  ]);

  // Load profile name
  useEffect(() => {
    const loadProfileName =
      async (): Promise<void> => {
        if (
          !id ||
          typeof id !==
            "string"
        ) {
          return;
        }

        try {
          const response =
            await axiosInstance.get<UsersResponse>(
              "/user/getalluser"
            );

          const matchedUser =
            response.data?.data?.find(
              (
                profileUser
              ) =>
                (profileUser._id ||
                  profileUser.id) ===
                id
            );

          setProfileName(
            matchedUser?.name ||
              "User"
          );
        } catch (
          error: unknown
        ) {
          console.error(
            "Profile name error:",
            error
          );

          setProfileName(
            "User"
          );
        }
      };

    void loadProfileName();
  }, [id]);

  // Change connection tab
  const handleTabChange = (
    selectedTab: ConnectionTab
  ) => {
    setActiveTab(
      selectedTab
    );

    if (
      !id ||
      typeof id !==
        "string"
    ) {
      return;
    }

    void router.replace(
      {
        pathname:
          router.pathname,
        query: {
          id,
          tab: selectedTab,
        },
      },
      undefined,
      {
        shallow: true,
      }
    );
  };

  // Return to previous page
  const handleBack = () => {
    router.back();
  };

  const validUsers =
    users.filter(
      (item) => {
        const profileUser =
          activeTab ===
          "followers"
            ? item.follower
            : item.following;

        return Boolean(
          profileUser?._id &&
            profileUser?.name
        );
      }
    );

  return (
    <MainLayout>
      <main className="min-h-screen w-full bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-2xl">
          {/* Back button */}
          <button
            type="button"
            onClick={
              handleBack
            }
            className="mb-4 inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />

            <span>
              Back
            </span>
          </button>

          {/* Connections card */}
          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            {/* Header */}
            <div className="border-b border-gray-200 px-5 py-5 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <UserRound className="h-5 w-5" />
                </div>

                <div>
                  <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
                    {profileName}
                  </h1>

                  <p className="mt-1 text-sm text-gray-500">
                    {activeTab ===
                    "followers"
                      ? t(
                          "user.followers"
                        )
                      : t(
                          "user.following"
                        )}
                  </p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 px-5 sm:px-6">
              <button
                type="button"
                onClick={() =>
                  handleTabChange(
                    "followers"
                  )
                }
                className={`relative px-4 py-4 text-sm font-medium transition ${
                  activeTab ===
                  "followers"
                    ? "text-blue-600"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {t(
                  "user.followers"
                )}

                {activeTab ===
                  "followers" && (
                  <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-blue-600" />
                )}
              </button>

              <button
                type="button"
                onClick={() =>
                  handleTabChange(
                    "following"
                  )
                }
                className={`relative px-4 py-4 text-sm font-medium transition ${
                  activeTab ===
                  "following"
                    ? "text-blue-600"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {t(
                  "user.following"
                )}

                {activeTab ===
                  "following" && (
                  <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-blue-600" />
                )}
              </button>
            </div>

            {/* Connections list */}
            <div className="p-4 sm:p-5">
              {loading ? (
                /* Loading state */
                <div className="flex min-h-40 items-center justify-center">
                  <p className="text-sm text-gray-500">
                    Loading...
                  </p>
                </div>
              ) : validUsers.length ===
                0 ? (
                /* Empty state */
                <div className="flex min-h-40 flex-col items-center justify-center text-center">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                    <UserRound className="h-6 w-6 text-gray-400" />
                  </div>

                  <p className="font-medium text-gray-700">
                    No{" "}
                    {activeTab}{" "}
                    found
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    There are no{" "}
                    {activeTab}{" "}
                    to display yet.
                  </p>
                </div>
              ) : (
                /* Users */
                <div className="space-y-3">
                  {validUsers.map(
                    (item) => {
                      const profileUser =
                        activeTab ===
                        "followers"
                          ? item.follower
                          : item.following;

                      if (
                        !profileUser
                      ) {
                        return null;
                      }

                      return (
                        <button
                          key={
                            item._id
                          }
                          type="button"
                          onClick={() =>
                            void router.push(
                              `/users/${profileUser._id}`
                            )
                          }
                          className="group flex w-full items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 text-left transition hover:border-blue-200 hover:bg-blue-50/40 hover:shadow-sm"
                        >
                          {/* Avatar */}
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-lg font-semibold text-blue-700">
                            {profileUser.name
                              .charAt(
                                0
                              )
                              .toUpperCase()}
                          </div>

                          {/* User information */}
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-semibold text-gray-900 transition group-hover:text-blue-600">
                              {
                                profileUser.name
                              }
                            </p>

                            {profileUser.username && (
                              <p className="mt-0.5 truncate text-sm text-gray-500">
                                @
                                {
                                  profileUser.username
                                }
                              </p>
                            )}

                            {!profileUser.username &&
                              profileUser.email && (
                                <p className="mt-0.5 truncate text-sm text-gray-500">
                                  {
                                    profileUser.email
                                  }
                                </p>
                              )}
                          </div>

                          {/* View user */}
                          <span className="hidden text-sm font-medium text-blue-600 sm:block">
                            View profile
                          </span>
                        </button>
                      );
                    }
                  )}
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </MainLayout>
  );
};

export default ConnectionsPage;