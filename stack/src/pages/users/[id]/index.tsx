import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Mainlayout from "@/layout/Mainlayout";

import { useAuth } from "@/lib/AuthContext";
import axiosInstance from "@/lib/axiosinstance";

import {
  Calendar,
  Lock,
  Shield,
  Crown,
  Award,
} from "lucide-react";

import { useRouter } from "next/router";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import { FollowButton } from "@/components/follow/FollowButton";
import { FollowStats } from "@/components/follow/FollowStats";

import { getImageUrl } from "@/lib/getImageUrl";

import SubscriptionDashboard from "@/components/subscription/SubscriptionDashboard";
import PaymentHistory from "@/components/subscription/PaymentHistory";

import {
  getUserSubscription,
  getSubscription,
} from "@/components/services/subscriptionService";

import ReputationSummary from "@/components/reputation/ReputationSummary";
import TransferReputationButton from "@/components/reputation/TransferReputationButton";

import EditProfileDialog from "@/components/profile/EditProfileDialog";

interface SubscriptionBadges {
  gold?: number;
  silver?: number;
  bronze?: number;
}

interface ProfileUser {
  _id?: string;
  id?: string;
  name: string;
  username?: string;
  email?: string;
  about?: string;
  tags: string[];
  profilePhoto?: string;
  joinDate?: string;
  reputation?: number;
  subscriptionBadges?: SubscriptionBadges;
}

interface UsersResponse {
  data?: ProfileUser[];
}

interface UpdatedUserResponse {
  data?: ProfileUser;
}

interface UserSubscriptionResponse {
  data?: {
    status?: string;
    plan?: string;
  };
}

interface SubscriptionData {
  plan?: string;
  status?: string;
  [key: string]: unknown;
}

const UserProfilePage = () => {
  const { t } = useTranslation();

  const {
    user,
    updateUser,
  } = useAuth();

  const router = useRouter();

  const { id } = router.query;

  const [users, setUsers] =
    useState<ProfileUser | null>(null);

  const [loading, setLoading] =
    useState(false);

  const profilePhotoInputRef =
    useRef<HTMLInputElement>(null);

  const [subscription, setSubscription] =
    useState<SubscriptionData | null>(null);

  const [subscriptionPlan, setSubscriptionPlan] =
    useState("Free");

  const [removeProfilePhoto, setRemoveProfilePhoto] =
    useState(false);

  const [hasMounted, setHasMounted] =
    useState(false);

  const [isEditing, setIsEditing] =
    useState(false);

  const [profilePhotoFile, setProfilePhotoFile] =
    useState<File | null>(null);

  const [
    profilePhotoPreview,
    setProfilePhotoPreview,
  ] = useState("");

  const [newTag, setNewTag] =
    useState("");

  const [editForm, setEditForm] =
    useState({
      name: "",
      about: "",
      tags: [] as string[],
      profilePhoto: "",
    });

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!user) {
      setIsEditing(false);
    }
  }, [user]);

  useEffect(() => {
    if (!users) {
      return;
    }

    setEditForm({
      name: users.name || "",
      about: users.about || "",
      tags: users.tags || [],
      profilePhoto: users.profilePhoto || "",
    });

    setProfilePhotoPreview(
      users.profilePhoto || ""
    );
  }, [users]);

  useEffect(() => {
    const fetchSubscription =
      async (): Promise<void> => {
        if (!users) {
          return;
        }

        try {
          const profileUserId =
            users._id || users.id;

          if (!profileUserId) {
            return;
          }

          const data =
            (await getUserSubscription(
              profileUserId
            )) as UserSubscriptionResponse;

          if (
            data?.data?.status ===
            "Active"
          ) {
            setSubscriptionPlan(
              data.data.plan || "Free"
            );
          } else {
            setSubscriptionPlan("Free");
          }
        } catch (error: unknown) {
          console.error(
            "Subscription load error:",
            error
          );

          setSubscriptionPlan("Free");
        }
      };

    void fetchSubscription();
  }, [users]);

  useEffect(() => {
    const loadSubscription =
      async (): Promise<void> => {
        try {
          const response =
            await getSubscription();

          setSubscription(
            response.data as SubscriptionData
          );
        } catch (error: unknown) {
          console.error(
            "Subscription error:",
            error
          );
        }
      };

    void loadSubscription();
  }, []);

  useEffect(() => {
    const fetchUser =
      async (): Promise<void> => {
        const idStr =
          Array.isArray(id)
            ? id[0]
            : id;

        if (!idStr) {
          return;
        }

        setLoading(true);
        setUsers(null);

        try {
          const response =
            await axiosInstance.get<UsersResponse>(
              "/user/getalluser"
            );

          const matchedUser =
            response.data.data?.find(
              (profileUser) =>
                String(
                  profileUser._id ||
                    profileUser.id
                ) ===
                String(idStr)
            );

          if (matchedUser) {
            setUsers(matchedUser);
          } else {
            setUsers(null);
          }
        } catch (error: unknown) {
          console.error(
            "User load error:",
            error
          );

          setUsers(null);
        } finally {
          setLoading(false);
        }
      };

    void fetchUser();
  }, [id]);

  if (loading) {
    return (
      <Mainlayout>
        <div className="flex min-h-48 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-blue-500" />
        </div>
      </Mainlayout>
    );
  }

  if (!users) {
    return (
      <Mainlayout>
        <div className="mt-4 text-center text-gray-500">
          No user found.
        </div>
      </Mainlayout>
    );
  }

  const currentUserId =
    user?._id;

  const profileUserId =
    users._id ||
    users.id ||
    "";

  const routeId =
    Array.isArray(id)
      ? id[0]
      : id;

  const isOwnProfile =
    String(routeId) ===
    String(currentUserId);

  const handleSaveProfile =
    async (): Promise<void> => {
      try {
        const formData =
          new FormData();

        formData.append(
          "name",
          editForm.name
        );

        formData.append(
          "about",
          editForm.about
        );

        formData.append(
          "tags",
          JSON.stringify(
            editForm.tags || []
          )
        );

        formData.append(
          "removeProfilePhoto",
          removeProfilePhoto.toString()
        );

        if (profilePhotoFile) {
          formData.append(
            "profilePhoto",
            profilePhotoFile
          );
        }

        const response =
          await axiosInstance.patch<UpdatedUserResponse>(
            `/user/update/${user?._id}`,
            formData
          );

        const updatedData =
          response.data.data;

        if (!updatedData) {
          return;
        }

        const updatedUser: ProfileUser =
          {
            ...users,
            ...updatedData,
            tags:
              updatedData.tags ||
              users.tags ||
              [],
          };

        setUsers(updatedUser);

        setIsEditing(false);

        toast.success(
          t(
            "toast.profile_updated_successfully"
          )
        );

        if (isOwnProfile) {
          updateUser({
            name:
              updatedData.name ||
              users.name,
            about:
              updatedData.about ||
              users.about,
            tags:
              updatedData.tags ||
              users.tags,
            profilePhoto:
              updatedData.profilePhoto ||
              "",
          });
        }
      } catch (error: unknown) {
        console.error(
          "Profile update failed, applying local fallback:",
          error
        );

        const updatedUser: ProfileUser =
          {
            ...users,
            name:
              editForm.name,
            about:
              editForm.about,
            tags:
              editForm.tags,
            profilePhoto:
              profilePhotoPreview,
          };

        setUsers(updatedUser);

        try {
          if (
            typeof window !==
            "undefined"
          ) {
            const storedValue =
              localStorage.getItem(
                "mockUsers"
              );

            const stored: ProfileUser[] =
              storedValue
                ? (JSON.parse(
                    storedValue
                  ) as ProfileUser[])
                : [];

            const index =
              stored.findIndex(
                (profileUser) =>
                  String(
                    profileUser._id ||
                      profileUser.id
                  ) ===
                  String(
                    updatedUser._id ||
                      updatedUser.id
                  )
              );

            if (index > -1) {
              stored[index] = {
                ...stored[index],
                ...updatedUser,
              };

              localStorage.setItem(
                "mockUsers",
                JSON.stringify(
                  stored
                )
              );
            }
          }
        } catch (storageError: unknown) {
          console.error(
            "Storage update error:",
            storageError
          );
        }

        setIsEditing(false);

        toast.success(
          t(
            "toast.profile_updated"
          )
        );
      }
    };

  const handleAddTag =
    (): void => {
      const trimmedTag =
        newTag.trim();

      if (
        !trimmedTag ||
        editForm.tags.includes(
          trimmedTag
        )
      ) {
        return;
      }

      setEditForm(
        (previous) => ({
          ...previous,
          tags: [
            ...previous.tags,
            trimmedTag,
          ],
        })
      );

      setNewTag("");
    };

  const handleRemoveTag = (
    tagToRemove: string
  ): void => {
    setEditForm(
      (previous) => ({
        ...previous,
        tags:
          previous.tags.filter(
            (tag) =>
              tag !==
              tagToRemove
          ),
      })
    );
  };

  return (
    <Mainlayout>
      <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6">

        {/* Profile header */}
        <div className="mb-6 flex flex-col items-start gap-4 lg:flex-row lg:items-center">

          <Avatar className="h-24 w-24 lg:h-32 lg:w-32">
            {users.profilePhoto ? (
              <AvatarImage
                src={getImageUrl(
                  users.profilePhoto
                )}
                alt={`${users.name} profile`}
              />
            ) : (
              <AvatarFallback className="text-2xl lg:text-3xl">
                {users.name
                  .split(" ")
                  .map(
                    (namePart) =>
                      namePart[0]
                  )
                  .join("")}
              </AvatarFallback>
            )}
          </Avatar>

          <div className="min-w-0 flex-1">
            <div className="mb-4 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">

              <div>
                <h1 className="mb-1 text-2xl font-bold text-gray-800 lg:text-3xl">
                  {users.name}
                </h1>

                <p className="mb-2 flex items-center gap-2 text-sm text-gray-500">
                  @{users.username}

                  {subscriptionPlan ===
                    "Bronze" && (
                    <Shield
                      className="h-4 w-4 text-amber-600"
                      strokeWidth={2.2}
                    />
                  )}

                  {subscriptionPlan ===
                    "Silver" && (
                    <Award
                      className="h-4 w-4 text-slate-800"
                      strokeWidth={2.2}
                    />
                  )}

                  {subscriptionPlan ===
                    "Gold" && (
                    <Crown
                      className="h-4 w-4 fill-yellow-400 text-yellow-500"
                      strokeWidth={2.2}
                    />
                  )}
                </p>

                {user &&
                  !isOwnProfile &&
                  profileUserId && (
                    <FollowButton
                      userId={
                        profileUserId
                      }
                      showText
                    />
                  )}

                {profileUserId && (
                  <FollowStats
                    userId={
                      profileUserId
                    }
                  />
                )}
              </div>

              {hasMounted &&
                user &&
                isOwnProfile && (
                  <div className="flex w-fit flex-col gap-2">

                    <EditProfileDialog
                      isEditing={
                        isEditing
                      }
                      setIsEditing={
                        setIsEditing
                      }
                      username={
                        users.username
                      }
                      editForm={
                        editForm
                      }
                      setEditForm={
                        setEditForm
                      }
                      newTag={
                        newTag
                      }
                      setNewTag={
                        setNewTag
                      }
                      profilePhotoFile={
                        profilePhotoFile
                      }
                      setProfilePhotoFile={
                        setProfilePhotoFile
                      }
                      profilePhotoPreview={
                        profilePhotoPreview
                      }
                      setProfilePhotoPreview={
                        setProfilePhotoPreview
                      }
                      setRemoveProfilePhoto={
                        setRemoveProfilePhoto
                      }
                      currentProfilePhoto={
                        users.profilePhoto
                      }
                      profilePhotoInputRef={
                        profilePhotoInputRef
                      }
                      handleAddTag={
                        handleAddTag
                      }
                      handleRemoveTag={
                        handleRemoveTag
                      }
                      handleSaveProfile={
                        handleSaveProfile
                      }
                    />

                    <Button
                      type="button"
                      variant="outline"
                      className="flex justify-center gap-2 bg-white"
                      onClick={() =>
                        void router.push(
                          "/loginSessions"
                        )
                      }
                    >
                      {t(
                        "user.loginSessions"
                      )}
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      className="flex justify-center gap-2 bg-white"
                      onClick={() =>
                        void router.push(
                          "/change-password"
                        )
                      }
                    >
                      <Lock className="h-4 w-4" />

                      {t(
                        "user.changePassword"
                      )}
                    </Button>
                  </div>
                )}

              {hasMounted &&
                user &&
                !isOwnProfile &&
                profileUserId && (
                  <TransferReputationButton
                    receiverId={
                      profileUserId
                    }
                    receiverName={
                      users.name
                    }
                  />
                )}
            </div>

            {/* Join date */}
            <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Calendar className="mr-1 h-4 w-4" />

                {t(
                  "user.memberSince"
                )}{" "}

                {users.joinDate
                  ? new Date(
                      users.joinDate
                    )
                      .toISOString()
                      .split("T")[0]
                  : "-"}
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-6 text-sm">

              <div className="flex items-center">
                <div className="mr-2 h-3 w-3 rounded-full bg-yellow-500" />

                <span className="font-semibold">
                  {users.subscriptionBadges
                    ?.gold || 0}
                </span>

                <span className="ml-1 text-gray-600">
                  {t(
                    "user.goldBadges"
                  )}
                </span>
              </div>

              <div className="flex items-center">
                <div className="mr-2 h-3 w-3 rounded-full bg-gray-400" />

                <span className="font-semibold">
                  {users.subscriptionBadges
                    ?.silver || 0}
                </span>

                <span className="ml-1 text-gray-600">
                  {t(
                    "user.silverBadges"
                  )}
                </span>
              </div>

              <div className="flex items-center">
                <div className="mr-2 h-3 w-3 rounded-full bg-amber-600" />

                <span className="font-semibold">
                  {users.subscriptionBadges
                    ?.bronze || 0}
                </span>

                <span className="ml-1 text-gray-600">
                  {t(
                    "user.bronzeBadges"
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile content */}
        <div className="grid grid-cols-1 gap-6">

          {/* About */}
          <div className="space-y-6 lg:col-span-2">

            <Card>
              <CardHeader>
                <CardTitle>
                  {t(
                    "user.about"
                  )}
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="prose max-w-none">
                  <p className="whitespace-pre-line leading-relaxed text-gray-700">
                    {users.about || ""}
                  </p>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Right content */}
          <div className="space-y-6">

            {/* Top tags */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {t(
                    "user.topTags"
                  )}
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">

                  {(users.tags || []).map(
                    (tag) => (
                      <div
                        key={tag}
                        className="flex items-center justify-between"
                      >
                        <Badge
                          variant="secondary"
                          className="cursor-pointer bg-blue-100 text-blue-800 hover:bg-blue-200"
                        >
                          {tag}
                        </Badge>
                      </div>
                    )
                  )}

                </div>
              </CardContent>
            </Card>

            {/* Reputation */}
            <ReputationSummary
              reputation={
                users.reputation || 0
              }
              onViewActivity={() => {
                void router.push(
                  `/reputation?userId=${profileUserId}`
                );
              }}
            />

            {/* Subscription */}
            {isOwnProfile &&
              subscription &&
              [
                "Bronze",
                "Silver",
                "Gold",
              ].includes(
                subscriptionPlan
              ) && (
                <>
                  <SubscriptionDashboard />

                  <PaymentHistory />
                </>
              )}

          </div>
        </div>
      </div>
    </Mainlayout>
  );
};

export default UserProfilePage;