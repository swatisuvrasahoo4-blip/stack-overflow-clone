import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function SavedList({ max = 100 }: { max?: number }) {
  const [saved, setSaved] = useState<any[]>([]);
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = JSON.parse(localStorage.getItem("mockQuestions") || "[]");
      const list = stored.filter((q: any) => q.isBookmarked);
      setSaved(list.slice(0, max));
    } catch (e) {
      setSaved([]);
    }
  }, [max]);

  if (!saved || saved.length === 0) {
    return <div className="text-gray-600">You have no saved questions.</div>;
  }

  return (
    <div className="space-y-4">
      {saved.map((q) => (
        <div key={q._id} className="border rounded-lg bg-white p-4 shadow-sm">
          <Link href={`/questions/${q._id}`} className="text-blue-600 hover:text-blue-800 text-lg font-semibold">
            {q.questiontitle || "(no title)"}
          </Link>
          <p className="text-sm text-gray-700 mt-2 line-clamp-2">{q.questionbody?.slice(0, 200)}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {(q.questiontags || []).map((tag: any) => (
              <span key={tag} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{tag}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
