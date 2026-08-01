import React, { useState } from "react";
import PostActions from "./PostActions";
import CommentSection from "./CommentSection";
import { Bookmark } from "lucide-react";

export default function PostCard({post,user,handleLike,handleEdit,handleShare,handleBookmark,handleComment,handleReply,handleDelete, activeCommentPost, setActiveCommentPost, commentText, setCommentText,expandedComments, setExpandedComments, activeReplyComment, setActiveReplyComment, replyText, setReplyText, setSelectedComment, setShowDeleteCommentModal, setSelectedReply, setShowDeleteReplyModal, setSelectedPostId, setShowDeleteModal,selectedPostId,showDeleteModal,isBookmarked: initialBookmarked,}:any){
    const [isBookmarked, setIsBookmarked] = useState(
      initialBookmarked ??
        post.isBookmarked ??
        user?.bookmarks?.some((bookmarkId: any) =>
          String(bookmarkId) === String(post._id)
        ) ??
        false
    );
    
  return(
        <>
        <div key={post._id} className="bg-white border rounded-lg p-5 mb-4">
    <div className="flex items-start justify-between">
  <div>
    <h3 className="font-semibold">{post.authorName}</h3>

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
    {post.image && (
  <img
    src={post.image}
    alt="Post"
    className="mt-4 w-full rounded-lg border max-h-96 object-cover"
  />
)}
    {post.codeSnippet && (
  <pre className="mt-4 bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
    <code>{post.codeSnippet}</code>
  </pre>
)}

    <div className="flex gap-2 mt-4 flex-wrap">
      {post.hashtags?.map((tag:string, index:number) => (
        <span
          key={index}
          className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs"
        >
          #{tag}
        </span>
      ))}
    </div>

   <div className="flex flex-wrap gap-4 mt-5 text-gray-600 text-sm [&>button]:w-[calc(50%-0.5rem)] md:[&>button]:w-auto md:[&>button]:flex-1">
      <button
      className="cursor-pointer"
      onClick={(e) =>{ handleLike(post._id)
        e.stopPropagation();
      }}>
  👍 {post.likes?.length || 0} Like
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
      className={`inline-flex items-center pl-10 gap-1 cursor-pointer ${isBookmarked ? "text-blue-600" : ""}`}>
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
  </div>

        </>
    )
}

  