import Mainlayout from "@/layout/Mainlayout";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/router";
import SavedList from "@/components/SavedList";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosinstance";

export default function QuestionsPage() {
  const router = useRouter();
  const { panel } = router.query;
  const [items, setItems] = useState<any[]>([]);

  function normalizeStoredQuestion(s: any) {
    const id = s._id || s.id;
    if(!id){
      throw new Error("Question Id is missing")
    }
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

 useEffect(() => {
  const loadQuestions = async () => {
    try {
      const res = await axiosInstance.get("/question/getallquestion");

      const realQuestions =
        res.data?.data ||
        res.data ||
        [];

      const normalisedQuestions =
        realQuestions.map((question: any) =>
          normalizeStoredQuestion(question)
        );

      setItems(normalisedQuestions);
    } catch (error) {
      console.error(
        "Failed to load questions:",
        error
      );

      setItems([]);
    }
  };

  loadQuestions();
}, []);
  return (
    <Mainlayout>
      <main className="min-w-0 p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-xl lg:text-2xl font-semibold">All Questions</h1>
            <p className="text-sm text-gray-600 mt-1">
              Browse the latest questions from the community.
            </p>
          </div>
        </div>
        <div className="space-y-4">
          {panel === "saves" ? (
            <SavedList />
          ) : (
            items.map((question) => (
              <div key={question.id || question._id} className="border rounded-lg bg-white p-4 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
                  <Link  href={`/questions/${question._id || question.id}`}
                    className="text-blue-600 hover:underline"
                   >
                {question.questiontitle || question.title || "(no title)"}
                  </Link>
                  <div className="text-sm text-gray-600">
                    {question.answers} answers · {question.views} views
                  </div>
                </div>
                <p className="text-gray-700 mt-2 line-clamp-2">{question.content}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {question.tags.map((tag: string) => (
                    <Badge key={tag} variant="secondary" className="bg-blue-100 text-blue-800">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </Mainlayout>
  );
}
