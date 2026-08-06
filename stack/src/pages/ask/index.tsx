import Mainlayout from "@/layout/Mainlayout";
import React, { useState } from "react";
import { useRouter } from "next/router";
import axiosInstance from "@/lib/axiosinstance";
import { log } from "console";
import { toast } from "react-toastify";

const index = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tagsArr, setTagsArr] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [subscriptionPlan, setSubscriptionPlan] = useState("Free");


  const addTag = (t: string) => {
    const tag = t.trim();
    if (!tag) return;
    if (tagsArr.includes(tag)) return;
    if (tagsArr.length >= 5) return;
    setTagsArr((s) => [...s, tag]);
  };

  const removeTag = (t: string) => {
    setTagsArr((s) => s.filter((x) => x !== t));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (tagInput.includes(",")) {
        tagInput
          .split(",")
          .map((x) => x.trim())
          .forEach((x) => addTag(x));
        setTagInput("");
        return;
      }
      addTag(tagInput);
      setTagInput("");
    }
    if (e.key === ",") {
      e.preventDefault();
      addTag(tagInput.replace(/,/g, ""));
      setTagInput("");
    }
  };

const handlePost = async () => {
  try {
    const res = await axiosInstance.post("/question/ask", {
      postquestiondata: {
        questiontitle: title,
        questionbody: body,
        questiontags: tagsArr,
        noofanswer: 0,
        answer: [],
        userposted: "You",
        askedon: new Date(),
        upvote: [],
        downvote: [],
      },
    });

    const createdQuestion = res.data?.data;
    router.push(`/questions/${createdQuestion._id}`);
  } catch (error: any) {
  toast.error(
    error.response?.data?.message || "Something went wrong."
  );
}
};

  return (
    <Mainlayout>
      <div className="p-3 w-full max-w-3xl mx-auto sm:p-6">
        <div className="mb-4">
          <h1 className="text-2xl font-semibold">Ask a public question</h1>
          <p className="text-gray-600 text-sm mt-1">Other users will be able to see and answer your question.</p>
        </div>

        <div className="space-y-6">
            <section className="rounded-lg border border-gray-200 bg-white sm:p-5 p-3 shadow-sm">
              <h2 className="text-xl font-medium mb-2">Title</h2>
              <p className="text-sm text-gray-600 mb-3">Summarize your problem in a single sentence.</p>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Be specific and imagine asking the question to another person"
                className="w-full border border-gray-300 px-3 py-3 rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </section>

            <section className="rounded-lg border border-gray-200 bg-white sm:p-5 p-3 shadow-sm">
              <h2 className="text-xl font-medium mb-2">What are the details of your problem?</h2>
              <p className="text-sm text-gray-600 mb-3">Explain what you are trying to do and include any errors or output.</p>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Include code, expected behavior, and steps to reproduce the issue"
                className="w-full border border-gray-300 px-3 py-3 rounded min-h: 180px focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </section>

            <section className="rounded-lg border border-gray-200 bg-white sm:p-5 p-3 shadow-sm">
              <h2 className="text-xl font-medium mb-2">Tags</h2>
              <p className="text-sm text-gray-600 mb-3">Add up to 5 tags to describe what your question is about.</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {tagsArr.map((t) => (
                  <span key={t} className="inline-flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm w-fit">
                    {t}
                    <button type="button" onClick={() => removeTag(t)} className="ml-2 text-blue-600">×</button>
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a tag and press Enter (e.g. javascript)"
                  className="flex-1 w-full sm:flex-1 border border-gray-300 px-3 py-2 rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
                <button
                  type="button"
                  onClick={() => { addTag(tagInput); setTagInput(""); }}
                  aria-label="Add tag"
                  className="inline-flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </section>

            {!showPreview ? (
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => setShowPreview(true)}
                  className="w-full sm:w-auto bg-blue-600 text-white px-5 py-3 rounded hover:bg-blue-700"
                >
                  Review your question
                </button>
                <button
                  type="button"
                  onClick={() => router.push('/')}
                  className="w-full sm:w-auto px-5 py-3 rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="rounded-lg border border-gray-200 bg-white sm:p-5 p-3 shadow-sm">
                <h3 className="text-lg font-medium mb-3">Preview</h3>
                <div className="mb-3">
                  <h4 className="font-semibold">{title || "(no title)"}</h4>
                  <p className="text-gray-700 mt-2 whitespace-pre-wrap">{body || "(no details provided)"}</p>
                </div>
                <div className="mb-4">
                  {tagsArr.map((t) => (
                    <span key={t} className="inline-flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm mr-2">{t}</span>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button type="button" onClick={handlePost} className="w-full sm:w-auto bg-green-600 text-white px-4 py-2 rounded">Post question</button>
                  <button onClick={() => setShowPreview(false)} className="w-full sm:w-auto px-4 py-2 rounded border">Edit</button>
                </div>
              </div>
            )}
          </div>
      </div>
    </Mainlayout>
  );
};

export default index;
