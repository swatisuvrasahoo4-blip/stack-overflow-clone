import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Mainlayout from "@/layout/Mainlayout";
import SavedList from "@/components/SavedList";
import axiosInstance from "../lib/axiosinstance";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/AuthContext";

const questions = [
  {
    id: 1,
    votes: 0,
    answers: 0,
    views: 3,
    title:
      "Mouse Cursor in 16-bit Assembly (NASM) Overwrites Screen Content in VGA Mode 0x12",
    content:
      "I'm developing a PS/2 mouse driver in 16-bit assembly (NASM) for a custom operating system running in VGA mode 0x12 (640x480, 16 colors). The driver initializes the mouse, handles mouse events, and ...",
    tags: ["assembly", "operating-system", "driver", "osdev"],
    author: "PR0X",
    authorId: 1,
    authorRep: 3,
    timeAgo: "2 mins ago",
  },
  {
    id: 2,
    votes: 0,
    answers: 1,
    views: 12,
    title:
      "Template specialization inside a template class using class template parameters",
    content:
      "template<typename TypA, typename TypX> struct MyClass { using TypAlias = TypA<TypX>; // error: 'TypA' is not a template [-Wtemplate-body] }; MyClass is very often specialized like ...",
    tags: ["c++", "templates"],
    author: "Felix.leg",
    authorId: 2,
    authorRep: 799,
    timeAgo: "11 mins ago",
  },
  {
    id: 3,
    votes: -2,
    answers: 0,
    views: 13,
    title: "How can i block user with middleware?",
    content:
      "The problem I am trying to create a complete user login form in NextJS and I want to block the user to go to other pages without a login process before. So online i found that one of the most complete ...",
    tags: ["node.js", "forms", "authentication", "next.js", "middleware"],
    author: "Aledi5",
    authorId: 3,
    authorRep: 31,
    timeAgo: "20 mins ago",
  },
  {
    id: 4,
    votes: 0,
    answers: 0,
    views: 6,
    title:
      "call:fail action: private-web3-wallet-v2-o pen-wallet-connect, error: Pairing error: Subscribe error: Timed out waiting for 60000 ms /what it means",
    content:
      "Can't connect my web3 wallet with a dApp. A message pops: Accounts must be CAIP-10 compliant The error message reads: call:fail action: private-web3-wallet-v2-o pen-wallet-connect, error: Pairing ...",
    tags: ["web3", "wallet", "blockchain"],
    author: "CryptoUser",
    authorId: 4,
    authorRep: 1,
    timeAgo: "25 mins ago",
  },
];
export default function Home() {
  const [items, setItems] = useState<any[]>(questions.map((q) => ({ ...q, id: q.id || String(q.id) })));
  const [loading, setloading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();
  const { panel } = router.query;

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
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = JSON.parse(localStorage.getItem("mockQuestions") || "[]");
      const storedNorm = (stored || []).map((s: any) => normalizeStoredQuestion(s));
      const ids = new Set(storedNorm.map((s: any) => String(s.id)));
      const merged = [
        ...storedNorm,
        ...questions.filter((q) => !ids.has(String(q.id))),
      ];
      setItems(merged);
    } catch (e) {
      // ignore
    }
  }, []);
  return (
    <Mainlayout>
      <main className="min-w-0 p-4 lg:p-6 ">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-xl lg:text-2xl font-semibold">Top Questions</h1>
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
            Ask Question
          </button>
        </div>
        <div className="w-full">
          <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4 text-sm gap-2 sm:gap-4">
            <span className="text-gray-600">{items.length} questions</span>
            <div className="flex flex-wrap gap-1 sm:gap-2">
              <button className="px-2 sm:px-3 py-1 bg-gray-200 text-gray-700 rounded text-xs sm:text-sm">
                Newest
              </button>
              <button className="px-2 sm:px-3 py-1 text-gray-600 hover:bg-gray-100 rounded text-xs sm:text-sm">
                Active
              </button>
              <button className="px-2 sm:px-3 py-1 text-gray-600 hover:bg-gray-100 rounded flex items-center text-xs sm:text-sm">
                Bountied
                <Badge variant="secondary" className="ml-1 text-xs">
                  25
                </Badge>
              </button>
              <button className="px-2 sm:px-3 py-1 text-gray-600 hover:bg-gray-100 rounded text-xs sm:text-sm">
                Unanswered
              </button>
              <button className="px-2 sm:px-3 py-1 text-gray-600 hover:bg-gray-100 rounded text-xs sm:text-sm">
                More ▼
              </button>
              <button className="px-2 sm:px-3 py-1 border border-gray-300 text-gray-600 hover:bg-gray-50 rounded ml-auto text-xs sm:text-sm">
                🔍 Filter
              </button>
            </div>
          </div>
          <div className="space-y-4">
            {panel === "saves" ? (
              <SavedList />
            ) : (
              items.map((question: any) => (
                <div key={question.id || question._id} className="border-b border-gray-200 pb-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex sm:flex-col items-center sm:items-center text-sm text-gray-600 sm:w-16 lg:w-20 gap-4 sm:gap-2">
                      <div className="text-center">
                        <div className="font-medium">{question.votes}</div>
                        <div className="text-xs">votes</div>
                      </div>
                      <div className="text-center">
                        <div
                          className={`font-medium ${
                            question.answers > 0
                              ? "text-green-600 bg-green-100 px-2 py-1 rounded"
                              : ""
                          }`}
                        >
                          {question.answers}
                        </div>
                        <div className="text-xs">{question.answers === 1 ? "answer" : "answers"}</div>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/questions/${question.id}`}
                        className="text-blue-600 hover:text-blue-800 text-base lg:text-lg font-medium mb-2 block"
                      >
                        {question.title}
                      </Link>
                      <p className="text-gray-700 text-sm mb-3 line-clamp-2">{question.content}</p>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <div className="flex flex-wrap gap-1">
                          {question.tags?.map((tag: any) => (
                            <div key={tag}>
                              <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer">
                                {tag}
                              </Badge>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center text-xs text-gray-600 flex-shrink: 0">
                          <Link href={`/users/${question.authorId}`} className="flex items-center">
                            <Avatar className="w-4 h-4 mr-1">
                              <AvatarFallback className="text-xs">{question?.author?.[0]}</AvatarFallback>
                            </Avatar>
                            <span className="text-blue-600 hover:text-blue-800 mr-1">{question.author}</span>
                          </Link>

                          <span>asked {question.timeAgo}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </Mainlayout>
  );
}