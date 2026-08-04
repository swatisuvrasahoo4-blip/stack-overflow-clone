import { Dispatch, SetStateAction } from "react";
type FeedTabsProps = {
  activeFeed: "trending" | "following";
  setActiveFeed: Dispatch<
    SetStateAction<"trending" | "following">
  >;
};

export default function FeedTabs({
  activeFeed,
  setActiveFeed,
}: FeedTabsProps) {
  return (
    <div className="flex gap-2 mb-6">
      <button
        onClick={() => {
          sessionStorage.setItem("homeActiveFeed","trending")
          setActiveFeed("trending")}
        }
        className={`px-4 py-2 rounded ${
          activeFeed === "trending"
            ? "bg-blue-600 text-white"
            : "bg-gray-200"
        }`}
      >
        Trending
      </button>

      <button
        onClick={() =>{ 
          console.log("clicked following");
          console.log("befote clicked",activeFeed);
          
          
          sessionStorage.setItem("homeActiveFeed","following")
          console.log(sessionStorage.getItem("homeActiveFeed"));
          
          setActiveFeed("following")}}
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