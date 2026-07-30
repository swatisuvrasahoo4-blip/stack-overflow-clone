export const savePostToBookmarks = (post: any) => {
  const savedPosts = JSON.parse(
    localStorage.getItem("savedPosts") || "[]"
  );

  const alreadySaved = savedPosts.some(
    (item: any) => item._id === post._id
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
export const shareCommunityPost = async (postId: string) => {
    const shareUrl = `${window.location.origin}/community/post/${postId}`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: "Community Post",
        text: "Check out this community post!",
        url: shareUrl,
      });
    } catch (err) {
      console.log(err);
    }
  } else {
    await navigator.clipboard.writeText(shareUrl);
    alert("Link copied to clipboard!");
  }
}