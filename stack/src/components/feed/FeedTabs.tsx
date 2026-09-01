import type {
  Dispatch,
  SetStateAction,
} from "react";

import { useTranslation } from "react-i18next";

type FeedType =
  | "trending"
  | "following";

interface FeedTabsProps {
  activeFeed: FeedType;

  setActiveFeed: Dispatch<
    SetStateAction<FeedType>
  >;
}

const FeedTabs = ({
  activeFeed,
  setActiveFeed,
}: FeedTabsProps) => {
  const { t } = useTranslation("community");

  const handleFeedChange = (
    feed: FeedType
  ) => {
    sessionStorage.setItem(
      "homeActiveFeed",
      feed
    );

    setActiveFeed(feed);
  };

  return (
    <div className="mb-6 flex gap-2">
      <button
        type="button"
        onClick={() =>
          handleFeedChange(
            "trending"
          )
        }
        className={`rounded px-4 py-2 ${
          activeFeed ===
          "trending"
            ? "bg-blue-600 text-white"
            : "bg-gray-200"
        }`}
      >
        {t("feed.trending")}
      </button>

      <button
        type="button"
        onClick={() =>
          handleFeedChange(
            "following"
          )
        }
        className={`rounded px-4 py-2 ${
          activeFeed ===
          "following"
            ? "bg-blue-600 text-white"
            : "bg-gray-200"
        }`}
      >
        {t("feed.following")}
      </button>
    </div>
  );
};

export default FeedTabs;