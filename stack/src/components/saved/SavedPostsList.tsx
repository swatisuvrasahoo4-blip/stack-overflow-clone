"use client";

import PostCard from "../community/PostCard/PostCard";

import type { PostCardProps } from "@/types/community";

type SavedPostCardProps = Omit<
  PostCardProps,
  "post" | "isBookmarked"
>;

interface SavedPostsListProps {
  posts: PostCardProps["post"][];
  postCardProps: SavedPostCardProps;
}

const SavedPostsList = ({
  posts,
  postCardProps,
}: SavedPostsListProps) => {
  if (posts.length === 0) {
    return (
      <div className="text-gray-600">
        No saved community posts.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard
          key={post._id}
          {...postCardProps}
          post={post}
          isBookmarked
        />
      ))}
    </div>
  );
};

export default SavedPostsList;