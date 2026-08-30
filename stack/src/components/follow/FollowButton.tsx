import { useState, useEffect } from "react";
import { UserPlus, UserCheck } from "lucide-react";
import { followUser, unfollowUser, getFollowStatus } from "../services/followService";
import { useAuth } from "@/lib/AuthContext";
import { useTranslation } from "react-i18next";
import axios from "axios";

interface FollowButtonProps {
  userId: string;
  showText?: boolean;
}

export const FollowButton = ({ userId, showText=false }: FollowButtonProps) => {
  const { user } = useAuth();
  const {t} = useTranslation();
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  useEffect(() => {
    if(!user){
      setCheckingStatus(false);
      return;
    }
  const loadFollowStatus = async () => {
    try {
      const status = await getFollowStatus(userId);
      setIsFollowing(status);
    } catch (error) {
      console.error(error);
    }finally{
      setCheckingStatus(false);
    }
  };

  loadFollowStatus();
}, [userId,user]);

 if (checkingStatus) {
  return (
    <button
      type="button"
      disabled
      className="cursor-wait rounded-md bg-gray-200 p-1.5 text-sm font-medium text-gray-500"
    >
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
    className={`cursor-pointer rounded-md p-1.5 text-sm font-medium transition ${
      isFollowing
        ? "bg-gray-200 text-gray-700"
        : "bg-blue-600 text-white hover:bg-blue-700"
    }`}
    onClick={async (e) => {
  e.preventDefault();
  e.stopPropagation();

  if (!user) {
    alert(t("alert.please_log_in_to_follow_users"));
    return;
  }

  try {
    if (isFollowing) {
      await unfollowUser(userId);
    } else {
      await followUser(userId);
    }

    setIsFollowing(!isFollowing);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.log(error.response?.status);
      console.log(error.response?.data);
    }

    console.error("Follow action failed:", error);
  }
}}
  >
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