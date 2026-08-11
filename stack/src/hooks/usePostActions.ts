import type { Dispatch, SetStateAction } from "react";
import { toggleLikePost,toggleBookmarkPost, getPosts, addComment, updatePost,deletePost, addReply, deleteComment } from "@/components/services/communityService";
import { shareCommunityPost } from "@/utils/communityUtils";

export default function usePostActions({
  posts,
  setPosts,
  user,
  updateUser,
  commentText,setCommentText,setActiveCommentPost,setEditingPost,editContent,setEditContent,editingPost,replyText,setReplyText,setActiveReplyComment,
}: {
  posts: any[];
  setPosts: React.Dispatch<React.SetStateAction<any[]>>;
  user: any;
  updateUser: (updatedUser: any) => void;
  commentText: string;
  setCommentText: React.Dispatch<React.SetStateAction<string>>;
  setActiveCommentPost: React.Dispatch<React.SetStateAction<string | null>>;
  editingPost: any;
  setEditingPost: React.Dispatch<React.SetStateAction<any>>;
  editContent: string;
  setEditContent: React.Dispatch<React.SetStateAction<string>>;
  replyText: string;
setReplyText: React.Dispatch<React.SetStateAction<string>>;
setActiveReplyComment: React.Dispatch<
  React.SetStateAction<string | null>
>;

}) {
  const handleLike = async (postId: string) => {
    try {
      const updatedPost = await toggleLikePost(postId);

      setPosts((previousPosts) =>
        previousPosts.map((post) =>
          post._id === postId ? updatedPost : post
        )
      );
    } catch (error: any) {
      
      
    }
  };
  const handleBookmark = async (post: any) => {
    const userId = user?._id || user?.id || user?.userId;

    if (!userId) {
      alert("Please log in to save posts.");
      return null;
    }
  
    try {
     const result = await toggleBookmarkPost(userId, post._id);


updateUser({
  bookmarks: result.bookmarks,
});
if (result.message === "Post bookmarked") {
  return true;
}

if (result.message === "Bookmark removed") {
  return false;
}

return null;
   } catch (error: any) {
  alert(
    error?.response?.data?.message ||
      "Unable to update bookmark. Please try again."
  );
  return null;
}
  };
  const handleComment = async (postId: string) => {
    if (!commentText.trim()) return;
  
    try {
      await addComment(postId, {
    text: commentText,
    userName: user?.name || user?.username || user?.email,
  });
     const response = await getPosts();
  setPosts(response.data || []);
  
      setCommentText("");
      setActiveCommentPost(null);
    } catch (error) {
      console.log(error);
    }
  };
  const handleShare = async (postId: string) => {
  if(!user){
    alert("Please log in to share posts.")
  }
  try{
    await shareCommunityPost(postId);
  }catch(error){
    console.log("Share Error:",error);
  }
};
const handleEdit = (post: any) => {
  if((user?.reputation || 0) < 100){
    alert("You need at least 100 reputation points to edit community posts.");
    return;
  }
  setEditingPost(post);
  setEditContent(post.content || "");
}

const handleSaveEdit = async () => {
  if (!editingPost) return;

  if (!editContent.trim()) {
    alert("Post content cannot be empty.");
    return;
  }
  try {
    const updatedPost = await updatePost(editingPost._id, {
      content: editContent,
      postType: editingPost.postType,
      image: editingPost.image,
      codeSnippet: editingPost.codeSnippet,
      hashtags: editingPost.hashtags,
    });

    setPosts((previousPosts: any[]) =>
      previousPosts.map((post) =>
        post._id === updatedPost._id ? updatedPost : post
      )
    );

    setEditingPost(null);
    setEditContent("");
  } catch (error: any) {
    console.log("Edit Post Error:", error);

    if (error?.response?.status === 401) {
      alert("Your session has expired. Please log in again.");
      return;
    }

    if (error?.response?.status === 403) {
      alert(error?.response?.data?.message || "You can only edit your own post.");
      return;
    }

    alert(
      error?.response?.data?.message ||
        "Something went wrong while updating the post."
    );
  }
};
const handleDelete = async (postId: string) => {

  try {
    await deletePost(postId);

    setPosts((prev) =>
      prev.filter((post) => post._id !== postId)
    );

    alert("Post deleted successfully!");
  } catch (error: any) {
    console.log(error);

    alert(
      error.response?.data?.message ||
        "Unable to delete the post"
    );
  }
};
const handleReply = async (postId: string, commentId: string) => {
  if (!replyText.trim()) return;

  try {
    await addReply(postId, commentId, {
  text: replyText,
  userName: user?.name || user?.username || user?.email,
});

    const post = await getPosts();
    setPosts(post)

    setReplyText("");
    setActiveReplyComment(null);
  } catch (error) {
    console.log(error);
  }
};
const handleDeleteComment = async (
  postId: string,
  commentId: string
) => {
  try {
    await deleteComment(postId, commentId)
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === postId
          ? {
              ...post,
              comments: post.comments.filter(
                (comment: any) => comment._id !== commentId
              ),
            }
          : post
      )
    );
  } catch (error) {
    console.error("Delete comment error:", error);
    alert("Unable to delete comment");
    
    
  }
};
  return {
    handleLike, handleBookmark, handleComment,handleShare, handleEdit, handleSaveEdit,handleDelete, handleReply, handleDeleteComment
  };
}