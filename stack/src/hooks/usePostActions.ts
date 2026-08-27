import type { Dispatch, SetStateAction } from "react";
import { toggleLikePost,toggleBookmarkPost, getPosts, addComment, updatePost,deletePost, addReply, deleteComment } from "@/components/services/communityService";
import { shareCommunityPost } from "@/utils/communityUtils";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

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
  const router = useRouter();
  const {t} = useTranslation();
  const handleLike = async (postId: string) => {
    if (!user) {
  toast.info(t("toast.please_login_to_continue"));
  router.push("/auth");
  return;
}
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

   if (!user) {
  toast.info(t("toast.please_login_to_continue"));
  router.push("/auth");
  return;
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
      (t("alert.unable_to_update_bookmark_please_try_again"))
  );
  return null;
}
  };
  const handleComment = async (postId: string) => {
    
  if (!commentText.trim()) return;
console.log(postId);


  try {
    const response = await addComment(postId, {
      text: commentText,
      userName: user?.name || user?.username || user?.email,
    });

console.log("COMMENT RESPONSE:", response);
    const updatedPost = response?.data;

    if (updatedPost) {
      setPosts((previousPosts) =>
        previousPosts.map((post) =>
          post._id === postId ? updatedPost : post
        )
      );
    }

    setCommentText("");
    setActiveCommentPost(null);
  } catch (error) {
    console.log("Add Comment Error:", error);
  }
};
  const handleShare = async (postId: string) => {
  if (!user) {
  toast.info(t("toast.please_login_to_continue"));
  router.push("/auth");
  return;
}
  try{
    await shareCommunityPost(postId);
  }catch(error){
    console.log("Share Error:",error);
  }
};
const handleEdit = (post: any) => {
  if((user?.reputation || 0) < 100){
    alert(t("alert.you_need_atleast_100_reputation_points_to_edit_community_posts"));
    return;
  }
  setEditingPost(post);
  setEditContent(post.content || "");
}

const handleSaveEdit = async () => {
  if (!editingPost) return;

  if (!editContent.trim()) {
    alert(t("alert.post_content_cannot_be_empty"));
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
      alert(t("alert.your_session_has_expired_please_log_in_again"));
      return;
    }

    if (error?.response?.status === 403) {
      alert(error?.response?.data?.message || t("alert.you_can_only_edit_your_own_post"));
      return;
    }

    alert(
      error?.response?.data?.message ||
        t("alert.something_went_wrong_while_updating_the_post")
    );
  }
};
const handleDelete = async (postId: string) => {

  try {
    await deletePost(postId);

    setPosts((prev) =>
      prev.filter((post) => post._id !== postId)
    );

    alert(t("alert.post_deleted_successfully"));
  } catch (error: any) {
    console.log(error);

    alert(
      error.response?.data?.message ||
        t("alert.unable_to_delete_the_post")
    );
  }
};
const handleReply = async (postId: string, commentId: string) => {
   
  const reputation = Number(user?.reputation ?? 0);

if (reputation < 50) {
  alert(
    t(`alert.you_need_atleast_50_reputation_points_to_reply_your_current_reputation_is ${reputation}`)
  );
  return;
}

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
    const response = await deleteComment(postId, commentId);

    const updatedPost = response?.data;

    if (!updatedPost) {
      console.error(
        "Updated post missing from delete comment response:",
        response
      );
      return;
    }

    setPosts((previousPosts) =>
      previousPosts.map((post) =>
        post._id === postId ? updatedPost : post
      )
    );
  } catch (error: any) {
    console.error("Delete comment error:", error);

    alert(
      error?.response?.data?.message ||
        t("alert.unable_to_delete_comment")
    );
  }
};
  return {
    handleLike, handleBookmark, handleComment,handleShare, handleEdit, handleSaveEdit,handleDelete, handleReply, handleDeleteComment
  };
}