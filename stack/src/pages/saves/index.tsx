import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

const SavesPage = () => {
  const [saved, setSaved] = useState<any[]>([]);
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = JSON.parse(localStorage.getItem("mockQuestions") || "[]");
      const list = stored.filter((q: any) => q.isBookmarked);
      setSaved(list);
    } catch (e) {
      setSaved([]);
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-semibold mb-6">Saved Questions</h1>
      {saved.length === 0 ? (
        <div className="text-gray-600">You have no saved questions.</div>
      ) : (
        <div className="space-y-4">
          {saved.map((q) => (
            <Card key={q._id}>
              <CardContent>
                <Link href={`/questions/${q._id}`} className="text-blue-600 hover:underline">
                  {q.questiontitle || "(no title)"}
                </Link>
                <div className="text-sm text-gray-600">{q.questiontags?.join(", ")}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavesPage;
