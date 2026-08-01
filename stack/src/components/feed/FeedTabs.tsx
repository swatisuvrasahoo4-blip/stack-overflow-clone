import { Dispatch, SetStateAction } from "react";
type FeedTabsProps = {
  activeFeed: "for-you" | "following";
  setActiveFeed: Dispatch<
    SetStateAction<"for-you" | "following">
  >;
};

export default function FeedTabs({
  activeFeed,
  setActiveFeed,
}: FeedTabsProps) {
  return (
    <div className="flex gap-2 mb-6">
      <button
        onClick={() => setActiveFeed("for-you")}
        className={`px-4 py-2 rounded ${
          activeFeed === "for-you"
            ? "bg-blue-600 text-white"
            : "bg-gray-200"
        }`}
      >
        For You
      </button>

      <button
        onClick={() => setActiveFeed("following")}
        className={`px-4 py-2 rounded ${
          activeFeed === "following"
            ? "bg-blue-600 text-white"
            : "bg-gray-200"
        }`}
      >
        Following
      </button>
    </div>
  );
}