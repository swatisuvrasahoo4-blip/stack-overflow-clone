import { useState } from "react";

interface FollowButtonProps {
  userId: string;
}

export const FollowButton = ({ userId }: FollowButtonProps) => {
  const [isFollowing, setIsFollowing] = useState(false);

  return (
    <button
      className={`px-2 py-2 rounded-md text-sm font-medium transition ${
        isFollowing
          ? "bg-gray-200 text-gray-700"
          : "bg-blue-600 text-white hover:bg-blue-700"
      }`}
      onClick={() => setIsFollowing(!isFollowing)}
    >
      {isFollowing ? "Following" : "Follow"}
    </button>
  );
};