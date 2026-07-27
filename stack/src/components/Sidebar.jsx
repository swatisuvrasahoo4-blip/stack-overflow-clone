import { cn } from "@/lib/utils";
import {
  Bookmark,
  Bot,
  Building,
  FileText,
  Home,
  MessageSquare,
  MessageSquareIcon,
  Tag,
  Trophy,
  Users,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Badge } from "./ui/badge";

const Sidebar = ({ isopen }) => {
  return (
    <div
      className={cn(
        "shrink-0 overflow-hidden transition-all duration-300 ease-in-out",
        isopen ? "w-48 lg:w-64" : "w-0"
      )}
    >
      <aside
        className={cn(
          "h-[calc(100vh-53px)] md:h-screen bg-white shadow-sm border-r transition-transform duration-200 ease-in-out",
          "fixed left-0 top:53px z-30 md:static md:top-auto",
          "w-48 lg:w-64",
          isopen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <nav className="p-2 lg:p-4">
          <ul className="space-y-1">
            <li>
              <Link
                href="/"
                className="flex items-center px-2 py-2 text-gray-700 hover:bg-gray-100 rounded text-sm"
              >
                <Home className="w-4 h-4 mr-2 lg:mr-3" />
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/questions"
                className="flex items-center px-2 py-2 text-gray-700 hover:bg-gray-100 rounded text-sm"
              >
                <MessageSquareIcon className="w-4 h-4 mr-2 lg:mr-3" />
                Questions
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="flex items-center px-2 py-2 text-gray-700 hover:bg-gray-100 rounded text-sm"
              >
                <Bot className="w-4 h-4 mr-2 lg:mr-3" />
                AI Assist
                <Badge variant="secondary" className="ml-auto text-xs">
                  Labs
                </Badge>
              </Link>
            </li>
            <li>
              <Link
                href="/tags"
                className="flex items-center px-2 py-2 text-gray-700 hover:bg-gray-100 rounded text-sm"
              >
                <Tag className="w-4 h-4 mr-2 lg:mr-3" />
                Tags
              </Link>
            </li>
            <li>
              <Link
                href="/users"
                className="flex items-center px-2 py-2 text-gray-700 hover:bg-gray-100 rounded text-sm"
              >
                <Users className="w-4 h-4 mr-2 lg:mr-3" />
                Users
              </Link>
            </li>
            <li>
              <Link
                href="/community"
                className="flex items-center px-2 py-2 text-gray-700 hover:bg-gray-100 rounded text-sm"
              >
                <UsersRound className="w-4 h-4 mr-2 lg:mr-3" />
                Community
              </Link>
            </li>
            <li>
              <Link
                href="/?panel=saves"
                className="flex items-center px-2 py-2 text-gray-700 hover:bg-gray-100 rounded text-sm"
              >
                <Bookmark className="w-4 h-4 mr-2 lg:mr-3" />
                Saves
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="flex items-center px-2 py-2 text-gray-700 hover:bg-gray-100 rounded text-sm"
              >
                <Trophy className="w-4 h-4 mr-2 lg:mr-3" />
                Challenges
                <Badge
                  variant="secondary"
                  className="ml-auto text-xs bg-orange-100 text-orange-800"
                >
                  NEW
                </Badge>
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="flex items-center px-2 py-2 text-gray-700 hover:bg-gray-100 rounded text-sm"
              >
                <MessageSquare className="w-4 h-4 mr-2 lg:mr-3" />
                Chat
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="flex items-center px-2 py-2 text-gray-700 hover:bg-gray-100 rounded text-sm"
              >
                <FileText className="w-4 h-4 mr-2 lg:mr-3" />
                Articles
              </Link>
            </li>

            <li>
              <Link
                href="#"
                className="flex items-center px-2 py-2 text-gray-700 hover:bg-gray-100 rounded text-sm"
              >
                <Building className="w-4 h-4 mr-2 lg:mr-3" />
                Companies
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
    </div>
  );
};

export default Sidebar;

function SavedList() {
  const [saved, setSaved] = useState([]);
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = JSON.parse(localStorage.getItem("mockQuestions") || "[]");
      const list = stored.filter((q) => q.isBookmarked);
      setSaved(list.slice(0, 6));
    } catch (e) {
      setSaved([]);
    }
  }, []);
  useEffect(() => {
    const handler = () => {
      try {
        const stored = JSON.parse(localStorage.getItem("mockQuestions") || "[]");
        const list = stored.filter((q) => q.isBookmarked);
        setSaved(list.slice(0, 6));
      } catch (e) {
        setSaved([]);
      }
    };
    window.addEventListener("mockQuestionsUpdated", handler);
    return () => window.removeEventListener("mockQuestionsUpdated", handler);
  }, []);
  if (!saved || saved.length === 0) {
    return <div className="text-xs text-gray-500 mt-2">No saved questions</div>;
  }
  return (
    <ul className="mt-2 space-y-2 text-sm">
      {saved.map((q) => (
        <li key={q._id}>
          <Link href={`/questions/${q._id}`} className="text-blue-600 hover:underline">
            {q.questiontitle?.slice(0, 60) || "(no title)"}
          </Link>
        </li>
      ))}
    </ul>
  );
}