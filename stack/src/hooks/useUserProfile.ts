import {
  useEffect,
  useRef,
  useState,
} from "react";

import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import { useAuth } from "@/lib/AuthContext";
import axiosInstance from "@/lib/axiosinstance";

import {
  getSubscription,
  getUserSubscription,
} from "@/components/services/subscriptionService";

interface SubscriptionBadges {
  gold?: number;
  silver?: number;
  bronze?: number;
}

export interface ProfileUser {
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

export interface ProfileEditForm {
  name: string;
  about: string;
  tags: string[];
  profilePhoto: string;
}

interface UseUserProfileProps {
  id: string | string[] | undefined;
}

const useUserProfile = ({
  id,
}: UseUserProfileProps) => {
  const { t } = useTranslation();

  const {
    user,
    updateUser,
  } = useAuth();

  const [
    users,
    setUsers,
  ] =
    useState<ProfileUser | null>(
      null
    );

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    subscription,
    setSubscription,
  ] =
    useState<SubscriptionData | null>(
      null
    );

  const [
    subscriptionPlan,
    setSubscriptionPlan,
  ] = useState("Free");

  const [
    removeProfilePhoto,
    setRemoveProfilePhoto,
  ] = useState(false);

  const [
    hasMounted,
    setHasMounted,
  ] = useState(false);

  const [
    isEditing,
    setIsEditing,
  ] = useState(false);

  const [
    profilePhotoFile,
    setProfilePhotoFile,
  ] =
    useState<File | null>(
      null
    );

  const [
    profilePhotoPreview,
    setProfilePhotoPreview,
  ] = useState("");

  const [
    newTag,
    setNewTag,
  ] = useState("");

  const [
    editForm,
    setEditForm,
  ] =
    useState<ProfileEditForm>({
      name: "",
      about: "",
      tags: [],
      profilePhoto: "",
    });

  const profilePhotoInputRef =
    useRef<HTMLInputElement>(
      null
    );

  const routeId =
    Array.isArray(id)
      ? id[0]
      : id;

  const currentUserId =
    user?._id;

  const profileUserId =
    users?._id ||
    users?.id ||
    "";

  const isOwnProfile =
    Boolean(
      routeId &&
        currentUserId &&
        String(routeId) ===
          String(
            currentUserId
          )
    );

  // Track client mount
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Close edit dialog after logout
  useEffect(() => {
    if (!user) {
      setIsEditing(false);
    }
  }, [user]);

  // Sync edit state with profile
  useEffect(() => {
    if (!users) {
      return;
    }

    setEditForm({
      name:
        users.name || "",
      about:
        users.about || "",
      tags:
        users.tags || [],
      profilePhoto:
        users.profilePhoto ||
        "",
    });

    setProfilePhotoPreview(
      users.profilePhoto ||
        ""
    );

    setProfilePhotoFile(
      null
    );

    setRemoveProfilePhoto(
      false
    );

    setNewTag("");
  }, [users]);

  // Load profile user
  useEffect(() => {
    const fetchUser =
      async (): Promise<void> => {
        if (!routeId) {
          return;
        }

        try {
          setLoading(true);
          setUsers(null);

          const response =
            await axiosInstance.get<UsersResponse>(
              "/user/getalluser"
            );

          const matchedUser =
            response.data.data?.find(
              (
                profileUser
              ) =>
                String(
                  profileUser._id ||
                    profileUser.id
                ) ===
                String(
                  routeId
                )
            );

          setUsers(
            matchedUser ||
              null
          );
        } catch (
          error: unknown
        ) {
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
  }, [routeId]);

  // Load profile subscription plan
  useEffect(() => {
    const fetchSubscription =
      async (): Promise<void> => {
        if (
          !profileUserId
        ) {
          return;
        }

        try {
          const data =
            (await getUserSubscription(
              profileUserId
            )) as UserSubscriptionResponse;

          if (
            data?.data
              ?.status ===
            "Active"
          ) {
            setSubscriptionPlan(
              data.data.plan ||
                "Free"
            );

            return;
          }

          setSubscriptionPlan(
            "Free"
          );
        } catch (
          error: unknown
        ) {
          console.error(
            "Subscription load error:",
            error
          );

          setSubscriptionPlan(
            "Free"
          );
        }
      };

    void fetchSubscription();
  }, [profileUserId]);

  // Load current user's subscription
  useEffect(() => {
    const loadSubscription =
      async (): Promise<void> => {
        try {
          const response =
            await getSubscription();

          setSubscription(
            response.data as SubscriptionData
          );
        } catch (
          error: unknown
        ) {
          console.error(
            "Subscription error:",
            error
          );

          setSubscription(null);
        }
      };

    void loadSubscription();
  }, []);

  // Save profile
  const handleSaveProfile =
    async (): Promise<void> => {
      if (
        !users ||
        !user?._id
      ) {
        return;
      }

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
            editForm.tags
          )
        );

        formData.append(
          "removeProfilePhoto",
          removeProfilePhoto.toString()
        );

        if (
          profilePhotoFile
        ) {
          formData.append(
            "profilePhoto",
            profilePhotoFile
          );
        }

        const response =
          await axiosInstance.patch<UpdatedUserResponse>(
            `/user/update/${user._id}`,
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

        setUsers(
          updatedUser
        );

        setIsEditing(
          false
        );

        toast.success(
          t(
            "toast.profile_updated_successfully"
          )
        );

        if (
          isOwnProfile
        ) {
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
      } catch (
        error: unknown
      ) {
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

        setUsers(
          updatedUser
        );

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
                (
                  profileUser
                ) =>
                  String(
                    profileUser._id ||
                      profileUser.id
                  ) ===
                  String(
                    updatedUser._id ||
                      updatedUser.id
                  )
              );

            if (
              index > -1
            ) {
              stored[index] =
                {
                  ...stored[
                    index
                  ],
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
        } catch (
          storageError: unknown
        ) {
          console.error(
            "Storage update error:",
            storageError
          );
        }

        setIsEditing(
          false
        );

        toast.success(
          t(
            "toast.profile_updated"
          )
        );
      }
    };

  // Add profile tag
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
        (
          previous
        ) => ({
          ...previous,
          tags: [
            ...previous.tags,
            trimmedTag,
          ],
        })
      );

      setNewTag("");
    };

  // Remove profile tag
  const handleRemoveTag = (
    tagToRemove: string
  ): void => {
    setEditForm(
      (
        previous
      ) => ({
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

  return {
    user,

    users,
    loading,

    subscription,
    subscriptionPlan,

    hasMounted,
    isOwnProfile,
    profileUserId,

    isEditing,
    setIsEditing,

    editForm,
    setEditForm,

    newTag,
    setNewTag,

    profilePhotoFile,
    setProfilePhotoFile,

    profilePhotoPreview,
    setProfilePhotoPreview,

    setRemoveProfilePhoto,

    profilePhotoInputRef,

    handleSaveProfile,
    handleAddTag,
    handleRemoveTag,
  };
};

export default useUserProfile;