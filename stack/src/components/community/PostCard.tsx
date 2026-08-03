import React, { useState } from "react";
import PostActions from "./PostActions";
import CommentSection from "./CommentSection";
import { Bookmark, ThumbsUp } from "lucide-react";
import MentionAvatar from "../mentions/MentionAvatar";
import { getImageUrl } from "@/lib/getImageUrl";
import Link from "next/link";
import ReportPostButton from "../reports/ReportPostButton";
import ReportPostModal from "../reports/ReportPostModal";
import { createReport, checkReportStatus } from "../services/reportService";


export default function PostCard({post,user,handleLike,handleEdit,handleShare,handleBookmark,handleComment,handleReply,
handleDelete, activeCommentPost, setActiveCommentPost, commentText, setCommentText,expandedComments, setExpandedComments, 
activeReplyComment, setActiveReplyComment, replyText, setReplyText, setSelectedComment, setShowDeleteCommentModal, setSelectedReply, 
setShowDeleteReplyModal, setSelectedPostId, setShowDeleteModal,selectedPostId,showDeleteModal,isBookmarked: initialBookmarked,}:any){
    const [isBookmarked, setIsBookmarked] = useState(
      initialBookmarked ??
        post.isBookmarked ??
        user?.bookmarks?.some((bookmarkId: any) =>
          String(bookmarkId) === String(post._id)
        ) ??
        false
    );
const [showReportModal, setShowReportModal] = useState(false);
    const [isLiked, setIsLiked] = useState(
      post.likes?.some((likeUserId: any) =>
        String(likeUserId) === String(user?.id || user?._id)
      ) ?? false
    );
const handleReportClick = async () => {
  try {
    const response = await checkReportStatus(post._id);

    if (response.alreadyReported) {
      alert("You have already reported this post.");
      return;
    }

    setShowReportModal(true);
  } catch (error) {
    alert("Failed to check report status.");
  }
};
    const handleLikeClick = (postId: string) => {
      setIsLiked(!isLiked);
      handleLike(postId);
    };

    const hashtags = Array.isArray(post.hashtags)
      ? post.hashtags
      : typeof post.hashtags === "string"
      ? post.hashtags.split(",").map((tag: string) => tag.trim()).filter(Boolean)
      : [];
    
  return(
        <>
        <div key={post._id} className="bg-white border rounded-lg p-5 mb-4">
    <div className="flex items-start justify-between">
  <div>
    <Link
  href={`/users/${post.authorId}`}
  className="font-semibold text-lg hover:text-blue-600 hover:underline"
  onClick={(e) => e.stopPropagation()}
>
  {post.authorName}
</Link>

    <p className="text-xs text-blue-600 font-medium">
      {post.postType}
    </p>

    <p className="text-xs text-gray-500">
  {new Date(post.createdAt).toLocaleString()}
  {post.isEdited && (
    <span className="ml-2 italic text-gray-400">
      Edited
    </span>
  )}
</p>
  </div>
  
{(user?._id || user?.id)?.toString() !==
  post.authorId?.toString() && (
  <ReportPostButton
  onClick={handleReportClick}
/>
)}
<PostActions
  post={post}
  user={user}
  onDelete={handleDelete}
  onEdit={handleEdit}
  setSelectedPostId={setSelectedPostId}
  setShowDeleteModal={setShowDeleteModal}
/>
</div>

    <p className="mt-4">{post.content}</p>
    {post.postType === "Project Showcase" && post.projectTitle && (
      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-semibold text-blue-900">{post.projectTitle}</h4>
        {post.projectLink && (
          <a
            href={post.projectLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            View Project →
          </a>
        )}
      </div>
    )}
    {post.postType === "Learning Achievement" && post.achievementTitle && (
      <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
        <h4 className="font-semibold text-green-900">🏆 {post.achievementTitle}</h4>
        {post.achievementDescription && (
          <p className="mt-2 text-sm text-green-800">{post.achievementDescription}</p>
        )}
      </div>
    )}
    {post.image && (
  <img
  src={getImageUrl(post.image)}
  alt="Post"
  className="mt-4 max-h-96 w-full rounded-lg object-cover"
/>
)}
    {post.codeSnippet && (
  <pre className="mt-4 bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
    <code>{post.codeSnippet}</code>
  </pre>
)}

    <div className="flex gap-2 mt-4 flex-wrap">
      {hashtags.map((tag:string, index:number) => (
        <span
          key={index}
          className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs"
        >
          #{tag.replace(/^#/, "")}
        </span>
      ))}
    </div>

   <div className="flex flex-wrap items-center justify-between gap-2 mt-4 text-gray-600 text-sm [&>button]:w-[calc(50%-0.25rem)] md:[&>button]:w-auto">
      <button
      className={`inline-flex items-center gap-1 cursor-pointer ${isLiked ? "text-blue-600" : ""}`}
      onClick={(e) =>{ handleLikeClick(post._id)
        e.stopPropagation();
      }}>

  <ThumbsUp
    className="h-4 w-4"
    fill={isLiked ? "currentColor" : "none"}
  />
  {post.likes?.length || 0} Like
</button>
      <button
      className="cursor-pointer"
  onClick={(e) =>{
    e.stopPropagation();
    setActiveCommentPost(
      activeCommentPost === post._id ? null : post._id
    )
  }}
>
  💬 {post.comments?.length || 0} Comment
</button>
      <button
      type="button"
      onClick={(e)=>{ 
        e.stopPropagation();
        handleBookmark(post).then((nextState: boolean | null) => {
          if (nextState !== null) setIsBookmarked(nextState);
        });
      }}
      className={`inline-flex items-center gap-1 cursor-pointer ${isBookmarked ? "text-blue-600" : ""}`}>
        <Bookmark
          className="h-4 w-4"
          fill={isBookmarked ? "currentColor" : "none"}
        />
        Bookmark
      </button>
      
      <button
      className="cursor-pointer"
  onClick={(e) =>{
    e.stopPropagation();
    handleShare(post._id)}}
>
  ↗ Share
</button>
<MentionAvatar
  mentions={(post.mentions || [])}
/>
    </div>
    {activeCommentPost === post._id && (
  <div className="mt-4">
    <textarea
     onClick={(e)=> e.stopPropagation()}
      value={commentText}
      onChange={(e) =>{
        e.stopPropagation();
        setCommentText(e.target.value)
      }}
      placeholder="Write a comment..."
      className="w-full border rounded-lg p-2"
    />

    <button
      onClick={(e) =>{ 
        e.stopPropagation();
        handleComment(post._id)}}
      className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
    >
      Post Comment
    </button>
  </div>
)}
<CommentSection
  post={post}
  user={user}

  expandedComments={expandedComments}
  setExpandedComments={setExpandedComments}

  activeReplyComment={activeReplyComment}
  setActiveReplyComment={setActiveReplyComment}

  replyText={replyText}
  setReplyText={setReplyText}

  handleReply={handleReply}

  setSelectedComment={setSelectedComment}
  setShowDeleteCommentModal={setShowDeleteCommentModal}

  setSelectedReply={setSelectedReply}
  setShowDeleteReplyModal={setShowDeleteReplyModal}

/>
  </div><ReportPostModal
  open={showReportModal}
  onClose={() => setShowReportModal(false)}
  onSubmit={async (reason, details) => {
    try {
      await createReport({
        postId: post._id,
        reason,
        details,
      });

      alert("Post reported successfully.");
      setShowReportModal(false);
    } catch (error: any) {
      alert(
        error?.response?.data?.message ||
          "Failed to report post."
      );
    }
  }}
/>
        </>
    )
}

  