import Link from "next/link";
import { useTranslation } from "react-i18next";

import { Badge } from "@/components/ui/badge";

import type { Tag } from "@/types/tag";

interface TagCardProps {
  tag: Tag;
}

const TagCard = ({
  tag,
}: TagCardProps) => {
  const { t } =
    useTranslation("tag");

  return (
    <Link
      href={`/tags/${encodeURIComponent(
        tag.name
      )}`}
      className="block rounded-lg border bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      {/* Tag information */}

      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="font-medium text-gray-800">
          #{tag.name}
        </span>

        <Badge
          variant="secondary"
          className="bg-blue-100 text-blue-800"
        >
          {tag.count}{" "}
          {tag.count === 1
            ? t(
                "labels.post"
              )
            : t(
                "labels.posts"
              )}
        </Badge>
      </div>

      {/* Tag description */}

      <p className="text-sm text-gray-600">
        {tag.description ||
          t(
            "messages.explore_community_posts_about_tag",
            {
              tag: tag.name,
            }
          )}
      </p>
    </Link>
  );
};

export default TagCard;