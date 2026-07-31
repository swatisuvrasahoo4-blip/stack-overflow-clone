import { useEffect, useState } from "react";
import { getFollowCounts } from "../services/followService";
import { useRouter } from "next/router";

interface FollowStatsProps {
  userId: string;
}

export const FollowStats = ({ userId }: FollowStatsProps) => {
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const loadFollowCounts = async () => {
      try {
        const data = await getFollowCounts(userId);

        setFollowers(data.followers || 0);
        setFollowing(data.following || 0);
      } catch (error) {
        console.log("Follow count error:", error);
      }
    };

    if (userId) {
      loadFollowCounts();
    }
  }, [userId]);

  return (
    <div className="flex items-center gap-5 text-sm">
     <button
  type="button"
  onClick={() =>
    router.push(`/users/${userId}/connections?tab=followers`)
  }
  className="cursor-pointer hover:underline"
>
  <span className="font-semibold">{followers}</span> Followers
</button>

      <button
  type="button"
  onClick={() =>
    router.push(`/users/${userId}/connections?tab=following`)
  }
  className="cursor-pointer hover:underline"
>
  <span className="font-semibold">{following}</span> Following
</button>
    </div>
  );
};