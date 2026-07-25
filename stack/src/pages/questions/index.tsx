import Mainlayout from "@/layout/Mainlayout";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/router";
import SavedList from "@/components/SavedList";
import { useEffect, useState } from "react";

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
    timeAgo: "20 mins ago",
  },
  {
    id: 4,
    votes: 0,
    answers: 0,
    views: 6,
    title:
      "call:fail action: private-web3-wallet-v2-open-wallet-connect, error: Pairing error: Subscribe error: Timed out waiting for 60000 ms /what it means",
    content:
      "Can't connect my web3 wallet with a dApp. A message pops: Accounts must be CAIP-10 compliant The error message reads: call:fail action: private-web3-wallet-v2-open-wallet-connect, error: Pairing ...",
    tags: ["web3", "wallet", "blockchain"],
    author: "CryptoUser",
    authorId: 4,
    timeAgo: "25 mins ago",
  },
];

export default function QuestionsPage() {
  const router = useRouter();
  const { panel } = router.query;
  const [items, setItems] = useState<any[]>(questions.map((q) => ({ ...q, id: q.id || String(q.id) })));

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
                  <Link href={`/questions/${question.id}`} className="text-blue-600 hover:text-blue-800 text-lg font-semibold">
                    {question.title}
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
