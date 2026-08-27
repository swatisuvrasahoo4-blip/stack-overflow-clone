import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Mainlayout from "@/layout/Mainlayout";
import SavedList from "@/components/SavedList";
import axiosInstance from "../lib/axiosinstance";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import FeedTabs from "@/components/feed/FeedTabs";
import ContentTabs from "@/components/feed/ContentTabs";
import QuestionFilters from "@/components/feed/QuestionFilters";
import PostFeed from "@/components/feed/PostFeed";
import { getFollowing } from "@/components/services/followService";
import { useTranslation } from "react-i18next";

export default function Home() {
  const {t} = useTranslation();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setloading] = useState(true);
  const [activeFeed, setActiveFeed] = useState<
  "trending" | "following" 
>("trending");
useEffect(() => {
  const savedFeed = sessionStorage.getItem("homeActiveFeed");


  if (savedFeed === "trending" || savedFeed === "following") {
    setActiveFeed(savedFeed);
  }
}, []);
  const [followingIds, setFollowingIds] = useState<string[]>([]);
  const [postCount, setPostCount] = useState(0);
  const router = useRouter();
const [activeContent, setActiveContent] = useState<
  "questions" | "posts"
>(router.query.content === "posts" ? "posts" : "questions");

  const { user } = useAuth();
  const { panel } = router.query;

  useEffect(() => {
    
    const loadHomeFeedData = async () => {
 
      try {
        const [questionsResponse, followingResponse] = await Promise.all([
          axiosInstance.get("/question/getallquestion"),
          user?._id || user?.id
            ? getFollowing(user._id || user.id)
            : Promise.resolve([]),
        ]);

        const questions = questionsResponse.data?.data || questionsResponse.data || [];
        setItems(questions.map(normalizeStoredQuestion));


        const following = Array.isArray(followingResponse)
          ? followingResponse
              .map((relationship: any) =>
                relationship.following?._id || relationship.following
              )
              .filter(Boolean)
              .map(String)
          : [];
        setFollowingIds(following);
      } catch (error) {
        console.error("Failed to load home feed:", error);
        setItems([]);
        setFollowingIds([]);
      } finally {
        setloading(false);
      }
    };

    loadHomeFeedData();
  }, [user?._id, user?.id]);
  useEffect(() => {
  const savedScroll = sessionStorage.getItem(
    "questionsScrollPosition"
  );

  if (!savedScroll || loading || activeContent !== "questions") {
    return;
  }

  let attempts = 0;
  const maxAttempts = 20;
  const position = Number(savedScroll);

  const restoreScroll = () => {
    window.scrollTo(0, position);

    attempts++;

    if (
      Math.abs(window.scrollY - position) < 5 ||
      attempts >= maxAttempts
    ) {
      sessionStorage.removeItem("questionsScrollPosition");
      return;
    }

    requestAnimationFrame(restoreScroll);
  };

  requestAnimationFrame(restoreScroll);
}, [loading, items.length, activeContent]);

  function normalizeStoredQuestion(s: any) {
    const id = s._id || s.id || String(Date.now());
    const title = s.questiontitle || s.title || s.questionTitle || "(no title)";
    const content = s.questionbody || s.content || s.body || "";
    const tags = s.questiontags || s.tags || [];
    const author = s.userposted || s.author || "You";
    const authorId = s.userid || s.authorId || "local";
    const timeAgo = (() => {
      try {
        const d = new Date(s.askedon || s.askedOn || s.asked || Date.now());
        const diff = Date.now() - d.getTime();
        const mins = Math.floor(diff / 60000);
        if (mins <= 0) return "just now";
        if (mins < 60) return `${mins} mins ago`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `${hours} hours ago`;
        const days = Math.floor(hours / 24);
        return `${days} days ago`;
      } catch (e) {
        return "just now";
      }
    })();
    const votes = (s.upvote?.length || s.upvotes || 0) - (s.downvote?.length || s.downvotes || 0);
    const answers = s.noofanswer || s.answers || (s.answer?.length || 0) || 0;
    const views = s.views || 0;
    return { id, title, content, tags, author, authorId, timeAgo, votes, answers, views };
  }
  return (
    <Mainlayout>
      <main className="min-w-0 p-4 lg:p-6 ">
        <div className="mb-6 space-y-6">
           {panel !== "saves" && (
            <>
           <FeedTabs
  activeFeed={activeFeed}
  setActiveFeed={setActiveFeed}
/>
<div className="flex justify-center">
  <ContentTabs
  activeContent={activeContent}
  setActiveContent={setActiveContent}
/>
</div>
</>
)}
         {activeContent === "questions" &&(
          <div className="flex justify-end mt-4">
          {panel !== "saves" && (
          <button
            onClick={() => {
              if(user){
                router.push("/ask")
              }
              else{
                router.push("/auth")
              }
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium whitespace-nowrap"
          >
            {t("community.askQuestion")}
          </button>
          )}
        </div>
        )}
        </div>
        <div className="w-full">
          <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4 text-sm gap-2 sm:gap-4">
            
            {activeContent === "questions" && panel !== "saves" && (
            <QuestionFilters>
              <span className="text-gray-600">{items.length} {t("community.questions")}</span>
              <button className="px-2 sm:px-3 py-1 bg-gray-200 text-gray-700 rounded text-xs sm:text-sm">
                {t("community.newest")}
              </button>
              <button className="px-2 sm:px-3 py-1 text-gray-600 hover:bg-gray-100 rounded text-xs sm:text-sm">
                {t("community.active")}
              </button>
              <button className="px-2 sm:px-3 py-1 text-gray-600 hover:bg-gray-100 rounded flex items-center text-xs sm:text-sm">
                {t("community.bountied")}
                <Badge variant="secondary" className="ml-1 text-xs">
                  25
                </Badge>
              </button>
              <button className="px-2 sm:px-3 py-1 text-gray-600 hover:bg-gray-100 rounded text-xs sm:text-sm">
                {t("community.unanswered")}
              </button>
              <button className="px-2 sm:px-3 py-1 text-gray-600 hover:bg-gray-100 rounded text-xs sm:text-sm">
                {t("community.more")} ▼
              </button>
              <button className="px-2 sm:px-3 py-1 border border-gray-300 text-gray-600 hover:bg-gray-50 rounded ml-auto text-xs sm:text-sm">
                🔍 {t("community.filter")}
              </button>
            </QuestionFilters>
            )}
          </div>
          <div className="space-y-4">
  {panel === "saves" ? (
    <SavedList />
  ) : activeContent === "questions" ? (
    (activeFeed === "trending"
      ? [...items].sort(
          (first, second) =>
            second.votes * 3 + second.answers * 5 + second.views -
            (first.votes * 3 + first.answers * 5 + first.views)
        )
      : items
    ).filter(
      (question) =>
        activeFeed === "trending" || followingIds.includes(String(question.authorId))
    )
      .map((question: any) => (
      <div
        key={question.id || question._id}
        className="border-b border-gray-200 pb-4"
      >
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex items-center gap-4 text-sm text-gray-600 sm:w-16 sm:flex-col sm:items-center sm:gap-2 lg:w-20">
            <div className="text-center">
              <div className="font-medium">{question.votes}</div>
              <div className="text-xs">{t("community.votes")}</div>
            </div>

            <div className="text-center">
              <div
                className={`font-medium ${
                  question.answers > 0
                    ? "rounded bg-green-100 px-2 py-1 text-green-600"
                    : ""
                }`}
              >
                {question.answers}
              </div>

              <div className="text-xs">
                {question.answers === 1 ? t('community.answer') : t('community.answers')}
              </div>
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <Link
  href={`/questions/${question.id || question._id}`}
  onClick={() => {
    sessionStorage.setItem("homeActiveFeed", activeFeed);
    sessionStorage.setItem(
      "questionsScrollPosition",
      String(window.scrollY)
    );
  }}
  className="mb-2 block text-base font-medium text-blue-600 hover:text-blue-800 lg:text-lg"
>
              {question.title}
            </Link>

            <p className="mb-3 line-clamp-2 text-sm text-gray-700">
              {question.content}
            </p>

            <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
              <div className="flex flex-wrap gap-1">
                {question.tags?.map((tag: any) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="cursor-pointer bg-blue-100 text-xs text-blue-800 hover:bg-blue-200"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex flex-shrink:0 items-center text-xs text-gray-600">
                <Link
  href={`/questions/${question.id || question._id}`}
  onClick={() => {
    console.log("saved",activeFeed);
    
    sessionStorage.setItem("homeActiveFeed", activeFeed);
    sessionStorage.setItem(
      "questionsScrollPosition",
      String(window.scrollY)
    );
  }}
  className="mb-2 block text-base font-medium ..."
>
                  <Avatar className="mr-1 h-4 w-4">
                    <AvatarFallback className="text-xs">
                      {question?.author?.[0]}
                    </AvatarFallback>
                  </Avatar>

                  <span className="mr-1 text-blue-600 hover:text-blue-800">
                    {question.author}
                  </span>
                </Link>

                <span>{t("community.asked")} {question.timeAgo}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      ))
  ) : (
    <PostFeed 
    activeFeed={activeFeed}
     followingIds={followingIds}
     onPostCountChange={setPostCount}
      />
  )}
</div>
        </div>
      </main>
    </Mainlayout>
  );
}