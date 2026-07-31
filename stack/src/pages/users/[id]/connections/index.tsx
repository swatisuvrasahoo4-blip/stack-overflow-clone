import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import MainLayout from "@/layout/Mainlayout";
import {
  getFollowers,
  getFollowing,
} from "@/components/services/followService";
import axiosInstance from "@/lib/axiosinstance";

export default function ConnectionsPage() {
  const router = useRouter();
  const { id, tab } = router.query;
  const [profileName, setProfileName] = useState("");
  const [activeTab, setActiveTab] = useState<"followers" | "following">(
    "followers"
  );
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tab === "following") {
      setActiveTab("following");
    } else {
      setActiveTab("followers");
    }
  }, [tab]);

  useEffect(() => {
    const loadConnections = async () => {
      if (!id || typeof id !== "string") return;

      try {
        setLoading(true);

        const data =
          activeTab === "followers"
            ? await getFollowers(id)
            : await getFollowing(id);

        setUsers(data || []);
      } catch (error) {
        console.log("Connections Error:", error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    loadConnections();
  }, [id, activeTab]);
useEffect(() => {
  const loadProfileName = async () => {
    if (!id || typeof id !== "string") return;

    try {
      const res = await axiosInstance.get("/user/getalluser");
      const matchedUser = res?.data?.data?.find(
        (user: any) => (user._id || user.id) === id
      );

      setProfileName(matchedUser?.name || "User");
    } catch (error) {
      console.log("Profile name error:", error);
      setProfileName("User");
    }
  };

  loadProfileName();
}, [id]);
const validUsers = users.filter((item: any) => {
  const profileUser =
    activeTab === "followers" ? item.follower : item.following;

  return profileUser && profileUser._id && profileUser.name;
});
  return (
    <MainLayout>
      <div className="mx-auto w-full max-w-3xl p-4 sm:p-6">
        <h1 className="text-2xl font-semibold">{profileName}</h1>

        <div className="mt-5 flex border-b">
          <button
            type="button"
            onClick={() => setActiveTab("followers")}
            className={`px-4 py-2 ${
              activeTab === "followers"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600"
            }`}
          >
            Followers
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("following")}
            className={`px-4 py-2 ${
              activeTab === "following"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600"
            }`}
          >
            Following
          </button>
        </div>

        <div className="mt-5">
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : validUsers.length === 0 ? (
            <p className="text-gray-500">
              No {activeTab} found.
            </p>
          ) : (
            <div className="space-y-3">
              {validUsers.map((item: any) => {
                const profileUser =
                  activeTab === "followers"
                    ? item.follower
                    : item.following;

                if (!profileUser) return null;

                return (
                  <button
                    key={item._id}
                    type="button"
                    onClick={() =>
                      router.push(`/users/${profileUser._id}`)
                    }
                    className="flex w-full items-center gap-3 rounded-lg border bg-white p-4 text-left hover:shadow-sm"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
                      {profileUser.name?.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <p className="font-medium">{profileUser.name}</p>
                      <p className="text-sm text-gray-500">
                        {profileUser.email}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}