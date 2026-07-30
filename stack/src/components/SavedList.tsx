import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getQuestionBookmarks } from "@/components/services/questionService"
import { useAuth } from "@/lib/AuthContext"
import { useRouter } from "next/router";

export default function SavedList({ max = 100 }: { max?: number }) {
  const router = useRouter();
  const { user } = useAuth();
  const [saved, setSaved] = useState<any[]>([]);
  const [savedPosts, setSavedPosts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("questions");

useEffect(() => {
  const loadSavedItems = async () => {
    try {
      const userId = user?._id || user?.id

      if (!userId) {
        setSaved([]);
        return;
      }

      const res = await getQuestionBookmarks(userId);

      setSaved(
        Array.isArray(res)
          ? res.slice(0, max)
          : []
      );

      const posts = JSON.parse(
        localStorage.getItem("savedPosts") || "[]"
      );

      setSavedPosts(posts);
    } catch (error) {
      console.error(
        "Unable to load saved questions:",
        error
      );

      setSaved([]);
    }
  };

  loadSavedItems();
}, [max, user?._id, user?.id]);


  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setActiveTab("questions")}
          className={`px-4 py-2 rounded-lg ${
            activeTab === "questions"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          Questions
        </button>

        <button
          onClick={() => setActiveTab("posts")}
          className={`px-4 py-2 rounded-lg ${
            activeTab === "posts"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          Community Posts
        </button>
      </div>


      {/* Saved Questions */}
      {activeTab === "questions" && (
        <>
          {saved.length === 0 ? (
            <div className="text-gray-600">
              You have no saved questions.
            </div>
          ) : (
            <div className="space-y-4">
              {saved.map((q) => (
                <div
                  key={q._id}
                  className="border rounded-lg bg-white p-4 shadow-sm cursor-pointer transition-all duration-200 hover:scale-[1.01]"
                  onClick={()=> router.push(`/questions/${q._id}`)}
                >
                  <Link
                    href={`/questions/${q._id}`}
                    className="text-blue-600 hover:text-blue-800 text-lg font-semibold"
                  >
                    {q.questiontitle || "(no title)"}
                  </Link>

                  <p className="text-sm text-gray-700 mt-2">
                    {q.questionbody?.slice(0, 200)}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {(q.questiontags || []).map(
                      (tag: string) => (
                        <span
                          key={tag}
                          className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}


      {/* Saved Community Posts */}
      {activeTab === "posts" && (
        <>
          {savedPosts.length === 0 ? (
            <div className="text-gray-600">
              No saved community posts.
            </div>
          ) : (
            <div className="space-y-4">
              {savedPosts.map((post) => (
                <div
                  key={post._id}
                  className="border rounded-lg bg-white p-4 shadow-sm cursor-pointer transition-all duration-200 hover:scale-[1.01]"
                  onClick={()=> router.push(`/community/${post._id}`)}
                >
                  <h3 className="font-semibold">
                    {post.authorName}
                  </h3>

                  <p className="text-sm text-blue-600 mt-1">
                    {post.postType}
                  </p>

                  <p className="mt-3">
                    {post.content}
                  </p>

                  <div className="flex gap-2 mt-3">
                    {(post.hashtags || []).map(
                      (tag: string) => (
                        <span
                          key={tag}
                          className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                        >
                          #{tag}
                        </span>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}