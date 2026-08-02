import type { Tag } from "@/types/tag";
import TagCard from "./TagCard";

interface TagGridProps {
  tags: Tag[];
}

export default function TagGrid({ tags }: TagGridProps) {
  if (tags.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-8 text-center">
        <h2 className="text-lg font-semibold text-gray-800">
          No hashtags available
        </h2>

        <p className="mt-2 text-sm text-gray-600">
          Real hashtags from community posts will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {tags.map((tag) => (
        <TagCard key={tag.name} tag={tag} />
      ))}
    </div>
  );
}