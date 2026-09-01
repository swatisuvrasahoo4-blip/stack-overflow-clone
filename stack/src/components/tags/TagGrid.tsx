import type { Tag } from "@/types/tag";

import TagCard from "./TagCard";

import { useTranslation } from "react-i18next";

interface TagGridProps {
  tags: Tag[];
}

const TagGrid = ({
  tags,
}: TagGridProps) => {
  const { t } =
    useTranslation("tag");

  if (tags.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-8 text-center">
        <h2 className="text-lg font-semibold text-gray-800">
          {t(
            "messages.no_hashtags_available"
          )}
        </h2>

        <p className="mt-2 text-sm text-gray-600">
          {t(
            "messages.real_hashtags_from_community_posts_will_appear_here"
          )}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {tags.map((tag) => (
        <TagCard
          key={tag.name}
          tag={tag}
        />
      ))}
    </div>
  );
};

export default TagGrid;