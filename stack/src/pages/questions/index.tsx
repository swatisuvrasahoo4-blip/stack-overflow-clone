import Mainlayout from "@/layout/Mainlayout";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/router";
import SavedList from "@/components/SavedList";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosinstance";
import { useAuth } from "@/lib/AuthContext";
import React from "react";
export default function QuestionsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { panel } = router.query;
  const [items, setItems] = useState<any[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
const [showEditModal, setShowEditModal] = useState(false);
const [selectedQuestion, setSelectedQuestion] = useState<any>(null);
const [editTitle, setEditTitle] = useState("");
const [editContent, setEditContent] = useState("");
const [editTags, setEditTags] = useState<string[]>([]);
const [editTagInput, setEditTagInput] = useState("");

  function normalizeStoredQuestion(s: any) {
    const id = s._id || s.id;
    if(!id){
      throw new Error("Question Id is missing")
    }
    const title = s.questiontitle || s.title || s.questionTitle || "(no title)";
    const content = s.questionbody || s.content || s.body || "";
    const tags = s.questiontags || s.tags || [];
    const author = s.userposted || s.author || "Unkonwn";
    const authorId = s.userid || s.authorId || "";
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
      console.log(normalisedQuestions);
      
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
console.log(user);
const handleDelete = async (questionId: string) => {

  try {
    
    const token = user?.token;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/question/delete/${questionId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete question");
    }

    setItems((previousItems) =>
      previousItems.filter(
        (question) => (question._id || question.id) !== questionId
      )
    );
  } catch (error) {
    alert(
      error instanceof Error
        ? error.message
        : "Something went wrong while deleting"
    );
  }
};
const handleEdit = async () => {
  if (!selectedQuestion) return;

  try {
    const token = user?.token;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/question/edit/${
        selectedQuestion._id || selectedQuestion.id
      }`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          questiontitle:editTitle,
          questionbody: editContent,
          questiontags: editTags,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to edit question");
    }

    setItems((previousItems) =>
      previousItems.map((question) =>
        (question._id || question.id) ===
        (selectedQuestion._id || selectedQuestion.id)
          ? data.question || data
          : question
      )
    );

    setShowEditModal(false);
    setSelectedQuestion(null);
  } catch (error) {
    alert(
      error instanceof Error
        ? error.message
        : "Something went wrong while editing"
    );
  }
};

const addEditTag = () => {
  const newTag = editTagInput.trim();

  if (!newTag) return;
  if (editTags.includes(newTag)) return;
  if (editTags.length >= 5) return;

  setEditTags([...editTags, newTag]);
  setEditTagInput("");
};
const removeEditTag = (tagToRemove: string) => {
  setEditTags(editTags.filter((tag) => tag !== tagToRemove));
};
const handleEditTagKeyDown = (
  e: React.KeyboardEvent<HTMLInputElement>
) => {
  if (e.key === "Enter") {
    e.preventDefault();
    addEditTag();
  }
};

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
                
                {question.authorId === user?._id && (
                     <div className="flex gap-2 mt-3">
                 <button
                onClick={() => {
  setSelectedQuestion(question);
  setEditTitle(question.questiontitle || question.title || "");
  setEditContent(question.questionbody || question.content || "");
  setEditTags(
    Array.isArray(question.questiontags)
      ? question.questiontags.join(", ")
      : question.questiontags || question.tags || ""
  );
  setShowEditModal(true);
}}
                 className="text-blue-600 text-sm hover:underline transition">Edit</button>
                    <button
                    onClick={()=> {
                      setSelectedQuestionId(question._id || question.id)
                      setShowDeleteModal(true);}}
                    className="text-red-600 text-sm hover:underline transition">Delete</button>
               </div>
                 )}
                <div className="mt-3 flex flex-wrap gap-2">
                  {(question.tags || []).map((tag: string) => (
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
      {showDeleteModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="w-350px rounded-xl bg-white p-6 shadow-xl">
      <h2 className="text-lg font-semibold">Delete Question</h2>

      <p className="mt-2 text-gray-600">
        Are you sure you want to delete this question?
      </p>

      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={() => {
            setShowDeleteModal(false);
            setSelectedQuestionId(null);
          }}
          className="rounded-lg border px-4 py-2 hover:bg-gray-100"
        >
          No
        </button>

        <button
          onClick={() => {
            if (selectedQuestionId) {
              handleDelete(selectedQuestionId);
            }

            setShowDeleteModal(false);
            setSelectedQuestionId(null);
          }}
          className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
        >
          Yes, Delete
        </button>
      </div>
    </div>
  </div>
)}
{showEditModal && selectedQuestion && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="w-[90%] max-w-lg rounded-xl bg-white p-6 shadow-xl">
      <h2 className="text-lg font-semibold">Edit Question</h2>

      <div className="mt-4">
        <label className="text-sm font-medium">Title</label>
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:border-blue-500"
        />
      </div>

      <div className="mt-4">
        <label className="text-sm font-medium">Question</label>
        <textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          rows={5}
          className="mt-1 w-full resize-none rounded-lg border px-3 py-2 outline-none focus:border-blue-500"
        />
      </div>

      <div className="mb-3">
  <label className="block text-sm font-medium mb-2">
    Tags (Maximum 5)
  </label>

  <div className="flex gap-2">
    <input
      type="text"
      value={editTagInput}
      onChange={(e) => setEditTagInput(e.target.value)}
      onKeyDown={handleEditTagKeyDown}
      placeholder="Enter a tag"
      className="flex-1 border rounded-lg px-3 py-2"
    />

    <button
      type="button"
      onClick={addEditTag}
      className="bg-blue-600 text-white px-4 rounded-lg hover:bg-blue-700"
    >
      +
    </button>
  </div>

  <div className="flex flex-wrap gap-2 mt-3">
    {editTags.map((tag) => (
      <span
        key={tag}
        className="inline-flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm w-fit"
      >
        {tag}
        <button
          type="button"
          onClick={() => removeEditTag(tag)}
          className="ml-2 text-red-500 hover:text-red-700"
        >
          ×
        </button>
      </span>
    ))}
  </div>
</div>

      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={() => {
            setShowEditModal(false);
            setSelectedQuestion(null);
          }}
          className="rounded-lg border px-4 py-2 hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
        onClick={handleEdit}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Save Changes
        </button>
      </div>
    </div>
  </div>
)}
    </Mainlayout>
  );
}
