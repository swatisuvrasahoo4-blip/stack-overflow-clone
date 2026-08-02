import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { Tag } from "@/types/tag";

interface TagCardProps {
  tag: Tag;
}

export default function TagCard({ tag }: TagCardProps) {
  return (
    <Link
      href={`/tags/${encodeURIComponent(tag.name)}`}
      className="block rounded-lg border bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="font-medium text-gray-800">#{tag.name}</span>

        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          {tag.count} {tag.count === 1 ? "post" : "posts"}
        </Badge>
      </div>

      <p className="text-sm text-gray-600">
        {tag.description || `Explore community posts about ${tag.name}.`}
      </p>
    </Link>
  );
}