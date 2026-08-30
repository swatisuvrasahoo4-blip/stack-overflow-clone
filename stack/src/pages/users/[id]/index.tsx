import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Mainlayout from "@/layout/Mainlayout";
import { useAuth } from "@/lib/AuthContext";
import axiosInstance from "@/lib/axiosinstance";
import {
  Calendar,
  Lock,
  Edit,
  Plus,
  X,
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
import { FollowButton } from "@/components/follow/FollowButton";
import { FollowStats } from "@/components/follow/FollowStats";
import { getImageUrl } from "@/lib/getImageUrl";
import SubscriptionDashboard from "@/components/subscription/SubscriptionDashboard";
import {
  getUserSubscription,
  getSubscription,
} from "@/components/services/subscriptionService";
import PaymentHistory from "@/components/subscription/PaymentHistory";
import ReputationSummary from "@/components/reputation/ReputationSummary";
import TransferReputationButton from "@/components/reputation/TransferReputationButton";
import { useTranslation } from "react-i18next";

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

const Index = () => {
  const { t } = useTranslation();
  const { user, updateUser } = useAuth();
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
      profilePhoto:
        users.profilePhoto || "",
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
            data?.data?.status === "Active"
          ) {
            setSubscriptionPlan(
              data.data.plan || "Free"
            );
          } else {
            setSubscriptionPlan("Free");
          }
        } catch (error: unknown) {
          console.log(
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
          console.log(error);
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
          const res =
            await axiosInstance.get<UsersResponse>(
              "/user/getalluser"
            );

          const matchedUser =
            res.data.data?.find(
              (profileUser) =>
                String(
                  profileUser._id ||
                    profileUser.id
                ) === String(idStr)
            );

          if (matchedUser) {
            setUsers(matchedUser);
          } else {
            setUsers(null);
          }
        } catch (error: unknown) {
          console.log(error);
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
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-blue-500" />
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

  const currentUserId = user?._id;

  const profileUserId =
    users._id || users.id || "";

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
        const formData = new FormData();

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

        const res =
          await axiosInstance.patch<UpdatedUserResponse>(
            `/user/update/${user?._id}`,
            formData
          );

        const updatedData =
          res.data.data;

        if (updatedData) {
          const updatedUser: ProfileUser = {
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
        }
      } catch (error: unknown) {
        console.log(
          "profile update failed, applying local fallback",
          error
        );

        const updatedUser: ProfileUser = {
          ...users,
          name: editForm.name,
          about: editForm.about,
          tags: editForm.tags,
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
                ? JSON.parse(
                    storedValue
                  ) as ProfileUser[]
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
                JSON.stringify(stored)
              );
            }
          }
        } catch (storageError: unknown) {
          console.log(
            "Storage update error:",
            storageError
          );
        }

        setIsEditing(false);

        toast.success(
          t("toast.profile_updated")
        );
      }
    };

  const handleAddTag = (): void => {
    const trimmedTag =
      newTag.trim();

    if (
      trimmedTag &&
      !editForm.tags.includes(
        trimmedTag
      )
    ) {
      setEditForm({
        ...editForm,
        tags: [
          ...editForm.tags,
          trimmedTag,
        ],
      });

      setNewTag("");
    }
  };

  const handleRemoveTag = (
    tagToRemove: string
  ): void => {
    setEditForm({
      ...editForm,
      tags: editForm.tags.filter(
        (tag) =>
          tag !== tagToRemove
      ),
    });
  };

  return (
    <Mainlayout>
      <div className="max-w-6xl">
        <div className="mb-8 flex flex-col items-start gap-6 lg:flex-row lg:items-center">
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
                    <Dialog
                      open={
                        isEditing
                      }
                      onOpenChange={
                        setIsEditing
                      }
                    >
                      <DialogTrigger
                        render={
                          <Button
                            variant="outline"
                            className="flex items-center gap-2 bg-transparent"
                          />
                        }
                      >
                        <Edit className="h-4 w-4" />

                        {t(
                          "user.editProfile"
                        )}
                      </DialogTrigger>

                      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto bg-white text-gray-900">
                        <DialogHeader>
                          <DialogTitle>
                            {t(
                              "profile.edit_profile"
                            )}
                          </DialogTitle>
                        </DialogHeader>

                        <div className="space-y-6 py-4">
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold">
                              {t(
                                "profile.basic_information"
                              )}
                            </h3>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                              <div>
                                <Label htmlFor="username">
                                  {t(
                                    "profile.username"
                                  )}
                                </Label>

                                <Input
                                  id="username"
                                  value={
                                    users.username ||
                                    ""
                                  }
                                  disabled
                                  className="border-gray-300 bg-gray-100 text-gray-600"
                                />
                              </div>

                              <div>
                                <Label htmlFor="name">
                                  {t(
                                    "profile.display_name"
                                  )}
                                </Label>

                                <Input
                                  id="name"
                                  value={
                                    editForm.name
                                  }
                                  onChange={(
                                    event
                                  ) =>
                                    setEditForm(
                                      {
                                        ...editForm,
                                        name: event
                                          .target
                                          .value,
                                      }
                                    )
                                  }
                                  placeholder={t(
                                    "profile.your_display_name"
                                  )}
                                  className="border-gray-300 bg-white"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold">
                              {t(
                                "profile.profile_photo"
                              )}
                            </h3>

                            <div>
                              <Label htmlFor="profilePhoto">
                                {t(
                                  "profile.upload_photo"
                                )}
                              </Label>

                              <input
                                ref={
                                  profilePhotoInputRef
                                }
                                id="profilePhoto"
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                className="hidden"
                                onChange={(
                                  event
                                ) => {
                                  const file =
                                    event
                                      .target
                                      .files?.[0] ||
                                    null;

                                  setProfilePhotoFile(
                                    file
                                  );

                                  if (
                                    file
                                  ) {
                                    setRemoveProfilePhoto(
                                      false
                                    );

                                    setProfilePhotoPreview(
                                      URL.createObjectURL(
                                        file
                                      )
                                    );
                                  }
                                }}
                              />

                              <div className="mt-2 flex items-center rounded border p-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    profilePhotoInputRef.current?.click()
                                  }
                                  className="rounded bg-gray-100 px-4 py-2 hover:bg-gray-200"
                                >
                                  {t(
                                    "profile.choose_file"
                                  )}
                                </button>

                                <span
                                  className={`ml-3 text-sm ${
                                    profilePhotoFile
                                      ? "text-gray-700"
                                      : "text-red-600"
                                  }`}
                                >
                                  {profilePhotoFile
                                    ? t(
                                        "profile.file_selected"
                                      )
                                    : t(
                                        "profile.no_file_chosen"
                                      )}
                                </span>

                                {profilePhotoFile && (
                                  <button
                                    type="button"
                                    className="ml-auto text-xl font-bold text-red-600 hover:text-red-800"
                                    onClick={() => {
                                      setProfilePhotoFile(
                                        null
                                      );

                                      setProfilePhotoPreview(
                                        users.profilePhoto ||
                                          ""
                                      );

                                      if (
                                        profilePhotoInputRef.current
                                      ) {
                                        profilePhotoInputRef.current.value =
                                          "";
                                      }
                                    }}
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                )}
                              </div>

                              {profilePhotoPreview && (
                                <img
                                  src={
                                    profilePhotoPreview
                                  }
                                  alt="Profile preview"
                                  className="mt-3 h-24 w-24 rounded-full border object-cover"
                                />
                              )}

                              {profilePhotoPreview && (
                                <button
                                  type="button"
                                  className="mt-3 rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                                  onClick={() => {
                                    setProfilePhotoPreview(
                                      ""
                                    );

                                    setProfilePhotoFile(
                                      null
                                    );

                                    setRemoveProfilePhoto(
                                      true
                                    );
                                  }}
                                >
                                  {t(
                                    "profile.delete_profile_photo"
                                  )}
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold">
                              {t(
                                "profile.about"
                              )}
                            </h3>

                            <Textarea
                              id="about"
                              value={
                                editForm.about
                              }
                              onChange={(
                                event
                              ) =>
                                setEditForm(
                                  {
                                    ...editForm,
                                    about:
                                      event
                                        .target
                                        .value,
                                  }
                                )
                              }
                              placeholder={t(
                                "profile.tell_us_about_yourself"
                              )}
                              className="min-h-32 border-gray-300 bg-white"
                            />
                          </div>

                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold">
                              {t(
                                "profile.skills_and_technologies"
                              )}
                            </h3>

                            <div className="space-y-3">
                              <div className="flex gap-2">
                                <Input
                                  value={
                                    newTag
                                  }
                                  onChange={(
                                    event
                                  ) =>
                                    setNewTag(
                                      event
                                        .target
                                        .value
                                    )
                                  }
                                  placeholder={t(
                                    "profile.add_a_skill_or_technology"
                                  )}
                                  onKeyDown={(
                                    event
                                  ) => {
                                    if (
                                      event.key ===
                                      "Enter"
                                    ) {
                                      event.preventDefault();
                                      handleAddTag();
                                    }
                                  }}
                                  className="border-gray-300 bg-white"
                                />

                                <Button
                                  type="button"
                                  onClick={
                                    handleAddTag
                                  }
                                  variant="outline"
                                  size="sm"
                                  className="bg-orange-600 text-white"
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>

                              <div className="flex flex-wrap gap-2">
                                {editForm.tags.map(
                                  (
                                    tag
                                  ) => (
                                    <Badge
                                      key={
                                        tag
                                      }
                                      variant="secondary"
                                      className="flex items-center gap-1 bg-orange-100 text-orange-800"
                                    >
                                      {
                                        tag
                                      }

                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleRemoveTag(
                                            tag
                                          )
                                        }
                                        className="ml-1 hover:text-red-600"
                                      >
                                        <X className="h-3 w-3" />
                                      </button>
                                    </Badge>
                                  )
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-end gap-3 border-t pt-4">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() =>
                                setIsEditing(
                                  false
                                )
                              }
                              className="bg-white text-gray-800 hover:text-gray-900"
                            >
                              {t(
                                "profile.cancel"
                              )}
                            </Button>

                            <Button
                              type="button"
                              onClick={
                                handleSaveProfile
                              }
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              {t(
                                "profile.save_changes"
                              )}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

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

            <div className="flex flex-wrap items-center space-x-6 text-sm">
              <div className="flex items-center">
                <div className="mr-2 h-3 w-3 rounded-full bg-yellow-500" />

                <span className="font-semibold">
                  {users
                    .subscriptionBadges
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
                  {users
                    .subscriptionBadges
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
                  {users
                    .subscriptionBadges
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

        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  {t("user.about")}
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

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {t("user.topTags")}
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

            <ReputationSummary
              reputation={
                users.reputation ||
                0
              }
              onViewActivity={() => {
                void router.push(
                  `/reputation?userId=${profileUserId}`
                );
              }}
            />

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

export default Index;