import type { Post } from "@/types/community";

interface BookmarkResult {
  success: boolean;
  message: string;
}

export const savePostToBookmarks = (
  post: Post
): BookmarkResult => {
  const savedPosts: Post[] = JSON.parse(
    localStorage.getItem("savedPosts") || "[]"
  ) as Post[];

  const alreadySaved = savedPosts.some(
    (item) => item._id === post._id
  );

  if (alreadySaved) {
    return {
      success: false,
      message: "Post already saved!",
    };
  }

  savedPosts.push(post);

  localStorage.setItem(
    "savedPosts",
    JSON.stringify(savedPosts)
  );

  return {
    success: true,
    message: "Post saved successfully!",
  };
};

export const shareCommunityPost = async (
  postId: string,
  t: (key: string) => string
): Promise<void> => {
  const shareUrl = `${window.location.origin}/community/${postId}`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: "Community Post",
        text: "Check out this community post!",
        url: shareUrl,
      });
    } catch (error: unknown) {
      console.error("Share failed:", error);
    }

    return;
  }

  try {
    await navigator.clipboard.writeText(shareUrl);

    alert(
      t("alert.link_copied_to_clipboard")
    );
  } catch (error: unknown) {
    console.error(
      "Failed to copy link:",
      error
    );
  }
};