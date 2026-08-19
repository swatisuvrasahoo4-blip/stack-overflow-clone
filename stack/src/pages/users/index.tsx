import { Avatar, AvatarFallback, AvatarImage, } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import Mainlayout from "@/layout/Mainlayout";
import axiosInstance from "@/lib/axiosinstance";
import { Calendar, Search, Star } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FollowButton } from "@/components/follow/FollowButton";
import { useAuth } from "@/lib/AuthContext";
import { useTranslation } from "react-i18next";

const index = () => {
  const {t} = useTranslation();
  const [users, setusers] = useState<any>([]);
  const [loading, setloading] = useState(false);
  const { user: currentUser } = useAuth();
  useEffect(() => {
    const fetchuser = async () => {
      try {
        setloading(true);
        const res = await axiosInstance.get("/user/getalluser");
        const data = res?.data?.data;
        if (data && data.length > 0) {
          const sortedUsers = [...data].sort((a: any, b: any) => {
  const priority: any = {
    Gold: 3,
    Silver: 2,
    Bronze: 1,
    Free: 0,
  };

  return (
    (priority[b.subscription || "Free"] || 0) -
    (priority[a.subscription || "Free"] || 0)
  );
});

setusers(sortedUsers);
        } else {
          setusers([]);
        }
      } catch (error) {
        console.log(error);
        setusers([]);
      } finally {
        setloading(false);
      }
    };
    fetchuser();
  }, []);
  if (loading) {
    return (
      <Mainlayout>
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </Mainlayout>
    );
  }
  if (!users) {
    return (
      <Mainlayout>
        <div className="text-center text-gray-500 mt-4">No users found.</div>
      </Mainlayout>
    );
  }
  
  return (
    <Mainlayout>
      <div className="max-w-6xl">
        <h1 className="text-xl lg:text-2xl font-semibold mb-6">{t("user.users")}</h1>

        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input placeholder={t("user.filterByUser")} className="pl-10" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {users.map((user: any) => (
            <Link key={user._id || user.id || user.username} href={`/users/${user._id || user.id || user.username}`}>
              <div
  className={`relative rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer border ${
    user.subscription === "Silver"
      ? "border-slate-300 bg-slate-50"
      : user.subscription === "Gold"
      ? "border-yellow-200"
      : "border-gray-200"
  }`}
>
                <div className="flex items-start justify-between mb-3">
                 <Avatar className="w-12 h-12 mr-3">
  <AvatarImage
    src={user.profilePhoto || user.profilePicture || user.avatar}
    alt={user.name}
    className="object-cover"
  />

  <AvatarFallback className="text-lg">
    {user.name
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()}
  </AvatarFallback>
</Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="absolute top-4 right-4 flex flex-col items-center gap-2">
  {(!currentUser ||
    (currentUser?._id || currentUser?.id) !== (user._id || user.id)) && (
    <FollowButton
      userId={user._id || user.id}
    />
  )}

  {user.subscription === "Gold" && (
    <div
      className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center"
      aria-label="Featured Gold User"
    >
      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
    </div>
  )}
</div>
                    <div className="pr-8">
                      <h3 className="font-semibold text-blue-600 hover:text-blue-800 truncate flex items-center gap-1">
  {user.name}
</h3>

                    <p className="text-sm text-gray-600 truncate">
                      @{user.name}
                    </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>{t("user.joined")} {new Date(user.joinDate).getFullYear()}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Mainlayout>
  );
};

export default index;