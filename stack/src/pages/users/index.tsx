import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import Mainlayout from "@/layout/Mainlayout";
import axiosInstance from "@/lib/axiosinstance";
import {
  Calendar,
  Search,
  Star,
} from "lucide-react";
import Link from "next/link";
import {
  useEffect,
  useState,
} from "react";
import { FollowButton } from "@/components/follow/FollowButton";
import { useAuth } from "@/lib/AuthContext";
import { useTranslation } from "react-i18next";

type SubscriptionPlan =
  | "Free"
  | "Bronze"
  | "Silver"
  | "Gold";

interface UserItem {
  _id?: string;
  id?: string;
  username?: string;
  name: string;
  profilePhoto?: string;
  profilePicture?: string;
  avatar?: string;
  subscription?: SubscriptionPlan;
  joinDate?: string;
}

interface UsersResponse {
  data?: UserItem[];
}

const Index = () => {
  const { t } = useTranslation();

  const [users, setUsers] =
    useState<UserItem[]>([]);

  const [loading, setLoading] =
    useState(false);

  const { user: currentUser } =
    useAuth();

  useEffect(() => {
    const fetchUsers =
      async (): Promise<void> => {
        try {
          setLoading(true);

          const res =
            await axiosInstance.get<UsersResponse>(
              "/user/getalluser"
            );

          const data =
            res.data.data ?? [];

          const priority: Record<
            SubscriptionPlan,
            number
          > = {
            Gold: 3,
            Silver: 2,
            Bronze: 1,
            Free: 0,
          };

          const sortedUsers = [
            ...data,
          ].sort((a, b) => {
            const bPlan =
              b.subscription ?? "Free";

            const aPlan =
              a.subscription ?? "Free";

            return (
              priority[bPlan] -
              priority[aPlan]
            );
          });

          setUsers(sortedUsers);
        } catch (error: unknown) {
          console.log(error);
          setUsers([]);
        } finally {
          setLoading(false);
        }
      };

    void fetchUsers();
  }, []);

  if (loading) {
    return (
      <Mainlayout>
        <div className="flex min-h-48 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-blue-500" />
        </div>
      </Mainlayout>
    );
  }

  if (users.length === 0) {
    return (
      <Mainlayout>
        <div className="mt-4 text-center text-gray-500">
          No users found.
        </div>
      </Mainlayout>
    );
  }

  return (
    <Mainlayout>
      <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6">

        <h1 className="mb-6 text-xl font-semibold lg:text-2xl">
          {t("user.users")}
        </h1>

        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />

            <Input
              placeholder={t(
                "user.filterByUser"
              )}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

          {users.map((profileUser) => {
            const userId =
              profileUser._id ||
              profileUser.id ||
              profileUser.username;

            if (!userId) {
              return null;
            }

            const currentUserId =
              currentUser?._id ||
              currentUser?.id;

            const isCurrentUser =
              String(currentUserId) ===
              String(userId);

            return (
              <Link
                key={userId}
                href={`/users/${userId}`}
              >
                <div
                  className={`relative cursor-pointer rounded-lg border p-4 transition-shadow hover:shadow-md ${
                    profileUser.subscription ===
                    "Silver"
                      ? "border-slate-300 bg-slate-50"
                      : profileUser.subscription ===
                          "Gold"
                        ? "border-yellow-200"
                        : "border-gray-200"
                  }`}
                >

                  <div className="mb-3 flex items-start justify-between">

                    <Avatar className="mr-3 h-12 w-12">
                      <AvatarImage
                        src={
                          profileUser.profilePhoto ||
                          profileUser.profilePicture ||
                          profileUser.avatar
                        }
                        alt={
                          profileUser.name
                        }
                        className="object-cover"
                      />

                      <AvatarFallback className="text-lg">
                        {profileUser.name
                          ?.split(" ")
                          .map(
                            (namePart) =>
                              namePart[0]
                          )
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex-1">

                      <div className="absolute right-4 top-4 flex flex-col items-center gap-2">

                        {!isCurrentUser && (
                          <FollowButton
                            userId={
                              userId
                            }
                          />
                        )}

                        {profileUser.subscription ===
                          "Gold" && (
                          <div
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100"
                            aria-label="Featured Gold User"
                          >
                            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                          </div>
                        )}

                      </div>

                      <div className="pr-8">

                        <h3 className="flex items-center gap-1 truncate font-semibold text-blue-600 hover:text-blue-800">
                          {
                            profileUser.name
                          }
                        </h3>

                        <p className="truncate text-sm text-gray-600">
                          @
                          {profileUser.username ||
                            profileUser.name}
                        </p>

                      </div>

                    </div>

                  </div>

                  <div className="mb-3 flex items-center text-sm text-gray-600">

                    <Calendar className="mr-1 h-4 w-4" />

                    <span>
                      {t("user.joined")}{" "}
                      {profileUser.joinDate
                        ? new Date(
                            profileUser.joinDate
                          ).getFullYear()
                        : "-"}
                    </span>

                  </div>

                </div>
              </Link>
            );
          })}

        </div>
      </div>
    </Mainlayout>
  );
};

export default Index;