import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/lib/AuthContext";
import { getBookmarkedPosts } from "@/components/services/communityService";
import { getQuestionBookmarks } from "@/components/services/questionService";

const SavesPage = () => {
  const [saved, setSaved] = useState<any[]>([]);
  const [savedPosts, setSavedPosts] = useState<any[]>([]);
const [activeTab, setActiveTab] = useState("questions");
 const { user } = useAuth();
  useEffect(() => {
  const fetchBookmarks = async () => {
    if (!user?._id){
      setSaved([]);
      setSavedPosts([]);
      return;
    }

    try {
      const bookmarks = await getBookmarkedPosts(user._id);
      setSavedPosts(bookmarks);
      const questionBookmarks = await getQuestionBookmarks(user._id);
setSaved(questionBookmarks);
    } catch (error) {
      console.log(error);
    }
  };

  fetchBookmarks();
}, [user]);

   return (
  <div className="max-w-5xl mx-auto py-8 px-4">
    <h1 className="text-3xl font-bold mb-6">Saves</h1>

    <div className="flex gap-3 mb-8">
      <button
        onClick={() => setActiveTab("questions")}
        className={`px-5 py-2 rounded-lg ${
          activeTab === "questions"
            ? "bg-blue-600 text-white"
            : "bg-gray-100"
        }`}
      >
        Questions
      </button>

      <button
        onClick={() => setActiveTab("posts")}
        className={`px-5 py-2 rounded-lg ${
          activeTab === "posts"
            ? "bg-blue-600 text-white"
            : "bg-gray-100"
        }`}
      >
        Community Posts
      </button>
    </div>

    <div>
  {activeTab === "questions" && (
    <div>
      {saved.length === 0 ? (
        <p className="text-gray-500">
          No saved questions yet.
        </p>
      ) : (
        saved.map((question) => (
          <Card key={question._id} className="mb-4">
            <CardContent className="p-4">
              <Link href={`/questions/${question._id}`}>
                <h2 className="font-semibold text-lg hover:text-blue-600">
                  {question.title}
                </h2>
              </Link>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )}

  {activeTab === "posts" && (
    <div>
      {savedPosts.length === 0 ? (
        <p className="text-gray-500">
          No saved community posts yet.
        </p>
      ) : (
        savedPosts.map((post) => (
          <Card key={post._id} className="mb-4">
            <CardContent className="p-4">
              <h2 className="font-semibold text-lg">
                {post.title || "Community Post"}
              </h2>

              <p className="text-gray-600 mt-2">
                {post.content || post.description}
              </p>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )}
</div>
  </div>
);
};

export default SavesPage;
