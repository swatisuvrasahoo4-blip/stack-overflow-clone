import Mainlayout from "@/layout/Mainlayout";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/AuthContext";


import CommunityHeader from "@/components/community/CommunityHeader";
import PostCard from "@/components/community/PostCard";
import { getPosts, toggleLikePost, deletePost, addComment, addReply, deleteComment, deleteReply, toggleBookmarkPost } from "@/components/services/communityService"
import { get } from "http";
import { shareCommunityPost } from "@/utils/communityUtils";
import { useRouter } from "next/router";

export default function CommunityPage() {
  const { user } = useAuth();
  const router = useRouter();
  //posts
  const [posts, setPosts] = useState<any[]>([]);
  // comments
  const [commentText, setCommentText] = useState("");
const [activeCommentPost, setActiveCommentPost] = useState<string | null>(null);
const [expandedComments, setExpandedComments] = useState<string[]>([]);

  //replies
const [replyText, setReplyText] = useState("");
const [activeReplyComment, setActiveReplyComment] = useState<string | null>(null);


//Delete Modals
const [showDeleteModal, setShowDeleteModal] = useState(false);
const [showDeleteCommentModal, setShowDeleteCommentModal] =
  useState(false);
const [showDeleteReplyModal, setShowDeleteReplyModal] =useState(false);


//Selected Items
const [selectedComment, setSelectedComment] = useState<{
  postId: string;
  commentId: string;
} | null>(null);
const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
const [selectedReply, setSelectedReply] = useState<{
  postId: string;
  commentId: string;
  replyId: string;
} | null>(null);



const fetchPosts = async () => {
  try {
    const post = await getPosts();
    setPosts(Array.isArray(post) ? post : []);
  } catch (error) {
    console.log(error);
  }
};

useEffect(() => {
  fetchPosts();
}, []);
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

const handleBookmark = async (post: any) => {
  if (!user?._id) {
    alert("Please log in to save posts.");
    return;
  }

  try {
    const result = await toggleBookmarkPost(user._id, post._id);
    alert(result.message);
  } catch (error) {
    alert("Unable to update bookmark");
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




  
const handleLike = async (postId: string) => {
  try {
    const updatedPost = await toggleLikePost(postId);

    setPosts((previousPosts: any[]) =>
      previousPosts.map((post) =>
        post._id === postId ? updatedPost : post
      )
    );
  } catch (error) {
    console.log(error);
  }
};
const handleComment = async (postId: string) => {
  if (!commentText.trim()) return;

  try {
    await addComment(postId, {
  text: commentText,
  userName: user?.name || user?.username || user?.email,
});
   const posts = await getPosts();
setPosts(posts);

    setCommentText("");
    setActiveCommentPost(null);
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

const handleDeleteReply = async (
  postId: string,
  commentId: string,
  replyId: string
) => {
  try {
    await deleteReply(postId, commentId, replyId)

    setPosts((prevPosts: any[]) =>
      prevPosts.map((post: any) =>
        post._id === postId
          ? {
              ...post,
              comments: post.comments.map((comment: any) =>
                comment._id === commentId
                  ? {
                      ...comment,
                      replies: comment.replies.filter(
                        (reply: any) => reply._id !== replyId
                      ),
                    }
                  : comment
              ),
            }
          : post
      )
    );
  } catch (error: any) {
    console.log(error);
  }
};
  return (
    <Mainlayout>
      <main className="min-w-0 p-4 lg:p-6">
        <CommunityHeader />
        {/* Feed */}
        
        {posts.map((post) => (
          <div key ={post._id}
            onClick={()=> router.push(`/community/${post._id}`)}
            className="cursor-pointer"
          >
          <PostCard
            key={post._id}
            post={post}
            user = {user}
            handleLike={handleLike}
            handleShare={handleShare}
            handleBookmark={handleBookmark}
            handleComment={handleComment}
            handleReply={handleReply}
            handleDelete={handleDelete}
            activeCommentPost={activeCommentPost}
            setActiveCommentPost={setActiveCommentPost}
            commentText={commentText}
            setCommentText={setCommentText}
            expandedComments={expandedComments}
  setExpandedComments={setExpandedComments}

  activeReplyComment={activeReplyComment}
  setActiveReplyComment={setActiveReplyComment}

  replyText={replyText}
  setReplyText={setReplyText}

  setSelectedComment={setSelectedComment}
  setShowDeleteCommentModal={setShowDeleteCommentModal}

  setSelectedReply={setSelectedReply}
  setShowDeleteReplyModal={setShowDeleteReplyModal}
   setSelectedPostId={setSelectedPostId}
  setShowDeleteModal={setShowDeleteModal}
          />
        </div>
        ))}
        
      </main>
      {showDeleteModal && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-6 w-350px shadow-xl">
      <h2 className="text-lg font-semibold">
        Delete Post
      </h2>

      <p className="text-gray-600 mt-2">
        Are you sure you want to delete this post?
      </p>

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={() => {
            setShowDeleteModal(false);
            setSelectedPostId(null);
          }}
          className="px-4 py-2 border rounded-lg"
        >
          No
        </button>

        <button
          onClick={() => {
            if (selectedPostId) {
              handleDelete(selectedPostId);
            }

            setShowDeleteModal(false);
            setSelectedPostId(null);
          }}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Yes, Delete
        </button>
      </div>
    </div>
  </div>
)}
{showDeleteCommentModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="w-350px rounded-xl bg-white p-6 shadow-xl">
      <h2 className="text-lg font-semibold">
        Delete Comment
      </h2>

      <p className="mt-2 text-gray-600">
        Are you sure you want to delete this comment?
      </p>

      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={() => {
            setShowDeleteCommentModal(false);
            setSelectedComment(null);
          }}
          className="rounded-lg border px-4 py-2"
        >
          No
        </button>

        <button
          onClick={() => {
            if (selectedComment) {
              handleDeleteComment(
                selectedComment.postId,
                selectedComment.commentId
              );
            }

            setShowDeleteCommentModal(false);
            setSelectedComment(null);
          }}
          className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
        >
          Yes, Delete
        </button>
      </div>
    </div>
  </div>
)}
{showDeleteReplyModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="w-350px rounded-xl bg-white p-6 shadow-xl">
      <h2 className="text-lg font-semibold">
        Delete Reply
      </h2>

      <p className="mt-2 text-gray-600">
        Are you sure you want to delete this reply?
      </p>

      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={() => {
            setShowDeleteReplyModal(false);
            setSelectedReply(null);
          }}
          className="rounded-lg border px-4 py-2"
        >
          No
        </button>

        <button
          onClick={() => {
            if (selectedReply) {
              handleDeleteReply(
                selectedReply.postId,
                selectedReply.commentId,
                selectedReply.replyId
              );
            }

            setShowDeleteReplyModal(false);
            setSelectedReply(null);
          }}
          className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
        >
          Yes, Delete
        </button>
      </div>
    </div>
  </div>
)}
    </Mainlayout>
  );
}