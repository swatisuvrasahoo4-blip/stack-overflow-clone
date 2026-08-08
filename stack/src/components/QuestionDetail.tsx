import {
  Bookmark,
  ChevronDown,
  ChevronUp,
  Clock,
  Flag,
  History,
  Share,
  Trash,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useAuth } from "@/lib/AuthContext";
import { submitAnswer, acceptAnswer, toggleQuestionBookmark, getQuestionById, getQuestionBookmarks } from "./services/questionService";
import axiosInstance from "@/lib/axiosinstance";
import AnswerVote from "./AnswerVote";

const QuestionDetail = ({ questionId }: any) => {
  const router = useRouter();
  const [question, setquestion] = useState<any>(null);
  const [answer, setanswer] = useState<any>(null);
  const [newanswer, setnewAnswer] = useState("");
  const [isSubmitting, setisSubmitting] = useState(false);
  const [loading, setloading] = useState(true);
  const { user } = useAuth();
  const onAnswerVoteSuccess = (
  answerId: string,
  upvotes: string[],
  downvotes: string[]
) => {
  setquestion((prev: any) => {
    if (!prev) return prev;

    return {
      ...prev,
      answer: prev.answer.map((ans: any) =>
        String(ans._id) === String(answerId)
          ? {
              ...ans,
              upvote: upvotes,
              downvote: downvotes,
            }
          : ans
      ),
    };
  });
};
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => setHasMounted(true), []);
 useEffect(() => {
  const loadQuestion = async () => {
    try {
      setloading(true);

      const realQuestion = await getQuestionById(String(questionId));
const questionData =
  realQuestion?.data?.question ||
  realQuestion?.question ||
  realQuestion?.data ||
  realQuestion;
      const userId = user?._id || user?.id;

let isBookmarked = false;

if (userId) {
  const savedQuestions = await getQuestionBookmarks(String(userId));

  isBookmarked = Array.isArray(savedQuestions)
    ? savedQuestions.some(
        (saved: any) =>
          String(saved?._id || saved) ===
          String(questionData?._id)
      )
    : false;
}

setquestion({
  ...questionData,
  isBookmarked,
});

setanswer(questionData?.answer || []);
    } catch (error) {
      console.error("Failed to fetch question:", error);
      setquestion(null);
      setanswer([]);
    } finally {
      setloading(false);
    }
  };

  if (questionId) {
    loadQuestion();
  }
}, [questionId, user?._id, user?.id]);
  if (loading) {
    return (
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
    );
  }
  if (!question) {
    return (
      <div className="text-center text-gray-500 mt-4">No question found.</div>
    );
  }

  const handleVote = async (vote: String) => {
    if(!user){
      toast.info("Please login to continue")
      router.push("/")
      return
    }
    try {
      setquestion((prev: any) => {
        if (!prev) return prev;
        const up = new Set(prev.upvote || []);
        const down = new Set(prev.downvote || []);
        if (vote === "upvote") {
          up.add(user._id);
          down.delete(user._id);
        } else {
          down.add(user._id);
          up.delete(user._id);
        }
        return { ...prev, upvote: Array.from(up), downvote: Array.from(down) };
      });
      toast.success("Vote Updated (local)");
    } catch (error) {
      console.error(error);
      toast.error("Failed to Vote question");
    }
  };
const handlebookmark = async () => {
  const userId = user?._id || user?.id;

  if (!userId) {
    toast.info("Please login to save questions");
    router.push("/");
    return;
  }

  const questionId = question?._id;

  if (!questionId) {
    toast.error("Question ID not found");
    return;
  }

  try {
    const result = await toggleQuestionBookmark(
      String(userId),
      String(questionId)
    );

    const updatedBookmarks = result.questionBookmarks || [];

    const isNowBookmarked = updatedBookmarks.some(
      (id: any) => String(id) === String(questionId)
    );

    setquestion((prev: any) => ({
      ...prev,
      isBookmarked: isNowBookmarked,
    }));

    toast.success(result.message);
  } catch (error: any) {
    toast.error(
      error?.response?.data?.message || "Unable to update bookmark"
    );
  }
};
  const handleSubmitanswer = async () => {
    if(!user){
      toast.info("Please login to continue")
      router.push("/")
      return
    }
    if (!newanswer.trim()) return;
    setisSubmitting(true);
    try {
      const result = await submitAnswer(String(question._id), {
  answerbody: newanswer,
  useranswered: user.name,
  userid: user._id,
});

setquestion(result.data);

toast.success("Answer uploaded successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to Answer");
    } finally {
      setnewAnswer("");
      setisSubmitting(false);
    }
  };

  const handleAcceptAnswer = async (answerId: string) => {
  try {
    await acceptAnswer(String(question._id), answerId);

    toast.success("Answer accepted successfully");

    // Refresh question data so accepted status appears immediately
    const updatedQuestion = await getQuestionById(String(question._id));

    setquestion(updatedQuestion);
    setanswer(updatedQuestion?.answer || []);
  } catch (error: any) {
    console.error(error);

    toast.error(
      error?.response?.data?.message || "Failed to accept answer"
    );
  }
};

  const handleDelete = async () => {
    if(!user){
      toast.info("Please login to continue")
      router.push("/")
      return
    }
    if (!window.confirm("Are you sure you want to delete this question?"))
      return;
   
    toast.success("Question deleted (local)");
    router.push("/");
  };
  const handleDeleteanswer = async (id: String) => {
    if(!user){
      toast.info("Please login to continue")
      router.push("/")
      return
    }
    if (!window.confirm("Are you sure you want to delete this answer?"))
      return;
    try {
      await axiosInstance.delete(
  `/answer/delete/${question._id}/${id}`
);
      const updateanswer = (question.answer || []).filter(
        (ans: any) => String(ans._id) !== String(id)
      );
      setquestion((prev: any) => ({
        ...prev,
        noofanswer: updateanswer.length,
        answer: updateanswer,
      }));
      toast.success("Answer deleted");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete answer");
    }
  };
const handleShare = async () => {
  const shareUrl = window.location.href;

  try {
    if (navigator.share) {
      await navigator.share({
        title: question?.questiontitle || "Question",
        text: "Check out this question on CodeQuest",
        url: shareUrl,
      });
    } else {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Question link copied!");
    }
  } catch (error) {
    console.log(error);
  }
};

const hasAcceptedAnswer =
  question?.answer?.some((ans: any) => ans.isAccepted) ?? false;
  return (
    <div className="max-w-5xl">
      {/* Question Header */}
      <div className="mb-6">
        <h1 className="text-xl lg:text-2xl font-semibold mb-4 text-gray-900">
          {question.questiontitle}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>Asked {question.askedon
  ? new Date(question.askedon).toLocaleDateString()
  : "Unknown date"}</span>
          </div>
        </div>
      </div>

      {/* Question Content */}
      <Card className="mb-8">
        <CardContent className="p-0">
          <div className="flex flex-col sm:flex-row">
            {/* Voting Section */}
            <div className="flex sm:flex-col items-center sm:items-center p-4 sm:p-6 border-b sm:border-b-0 sm:border-r border-gray-200">
              <Button
                variant="ghost"
                size="sm"
                className={`p-2 ${"text-gray-600 hover:text-orange-500"}`}
                onClick={() => handleVote("upvote")}
              >
                <ChevronUp className="w-6 h-6" />
              </Button>
              <span>
  {(question.upvote?.length || 0) - (question.downvote?.length || 0)}
</span>
              <Button
                variant="ghost"
                size="sm"
                className={`p-2 ${"text-gray-600 hover:text-orange-500"}`}
                onClick={() => handleVote("downvote")}
              >
                <ChevronDown className="w-6 h-6" />
              </Button>
              <div className="flex sm:flex-col gap-2 sm:gap-4 mt-4 sm:mt-6">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`p-2 ${
                    question?.isBookmarked
                      ? "text-yellow-500"
                      : "text-gray-600 hover:text-yellow-500"
                  }`}
                  onClick={handlebookmark}
                >
                  <Bookmark
                    className="w-5 h-5"
                    fill={question?.isBookmarked ? "currentColor" : "none"}
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 text-gray-600 hover:text-gray-800"
                >
                  <History className="w-5 h-5" />
                </Button>
              </div>
            </div>
            <div className="flex-1 p-4 sm:p-6">
              <div className="prose max-w-none mb-6">
                <div
                  className="text-gray-800 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: (question.questionbody || "")
                      .replace(
                        /## (.*)/g,
                        '<h3 class="text-lg font-semibold mt-6 mb-3 text-gray-900">$1</h3>'
                      )
                      .replace(
                        /```(\w+)?\n([\s\S]*?)```/g,
                        '<pre class="bg-gray-100 p-4 rounded-lg overflow-x-auto my-4"><code class="text-sm">$2</code></pre>'
                      )
                      .replace(
                        /`([^`]+)`/g,
                        '<code class="bg-gray-100 px-2 py-1 rounded text-sm">$1</code>'
                      )
                      .replace(/\n\n/g, '</p><p class="mb-4">')
                      .replace(/^/, '<p class="mb-4">')
                      .replace(/$/, "</p>")
                      .replace(
                        /\n(\d+\. .*)/g,
                        '<ol class="list-decimal list-inside my-4"><li>$1</li></ol>'
                      ),
                  }}
                />
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {(question.questiontags || []).map((tag: any) => (
                  <Link key={tag} href={`/tags/${tag}`}>
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer"
                    >
                      {tag}
                    </Badge>
                  </Link>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex gap-2">
                  <Button
                    onClick={handleShare}
                    variant="ghost"
                    size="sm"
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <Share className="w-4 h-4 mr-1" />
                    Share
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <Flag className="w-4 h-4 mr-1" />
                    Flag
                  </Button>
                  {hasMounted && question.userid === user?._id && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleDelete}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  )}
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600">
                    asked {question.askedon && !isNaN(new Date(question.askedon).getTime())
  ? new Date(question.askedon).toISOString().split("T")[0]
  : "Date unavailable"}
                  </span>
                  <Link
                    href={`/users/${question.userid}`}
                    className="flex items-center gap-2 hover:bg-blue-50 p-2 rounded"
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-sm">
                        {question.userposted?.[0]?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-blue-600 hover:text-blue-800 font-medium">
                        {question.userposted}
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-6 text-gray-900">
          {(question.answer || []).length} Answer
{(question.answer || []).length !== 1 ? "s" : ""}
        </h2>
        <div className="space-y-6">
          {(question.answer || []).map((ans: any) => (
            <Card key={ans._id} className={""}>
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row">
                  <AnswerVote
  questionId={question._id}
  answerId={ans._id}
  upvotes={ans.upvote || []}
  downvotes={ans.downvote || []}
  currentUserId={user?._id}
  answerUserId={ans.userid}
  onVoteSuccess={onAnswerVoteSuccess}
/>
                  {/* Answer Content */}
                  <div className="flex-1 p-4 sm:p-6">
                    <div className="prose max-w-none mb-6">
                      <div
                        className="text-gray-800 leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: ans.answerbody
                            .replace(
                              /## (.*)/g,
                              '<h3 class="text-lg font-semibold mt-6 mb-3 text-gray-900">$1</h3>'
                            )
                            .replace(
                              /```(\w+)?\n([\s\S]*?)```/g,
                              '<pre class="bg-gray-100 p-4 rounded-lg overflow-x-auto my-4"><code class="text-sm">$2</code></pre>'
                            )
                            .replace(
                              /`([^`]+)`/g,
                              '<code class="bg-gray-100 px-2 py-1 rounded text-sm">$1</code>'
                            )
                            .replace(/\n\n/g, '</p><p class="mb-4">')
                            .replace(/^/, '<p class="mb-4">')
                            .replace(/$/, "</p>")
                            .replace(
                              /\n(\d+\. .*)/g,
                              '<ol class="list-decimal list-inside my-4"><li>$1</li></ol>'
                            ),
                        }}
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-600 hover:text-gray-800"
                        >
                          <Share className="w-4 h-4 mr-1" />
                          Share
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-600 hover:text-gray-800"
                        >
                          <Flag className="w-4 h-4 mr-1" />
                          Flag
                        </Button>
                                    {hasMounted && ans.userid === user?._id && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteanswer(ans._id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                        )}
                       {String(question.userid) === String(user?._id || user?.id) &&
  String(ans.userid) !== String(user?._id || user?.id) &&
  !hasAcceptedAnswer && (
  <Button
    variant="outline"
    size="sm"
    onClick={() => handleAcceptAnswer(ans._id)}
    className="text-green-600 bg-amber-50 border-green-600 hover:bg-green-50 hover:text-black"
  >
    Accept Answer
  </Button>
)}

{ans.isAccepted && (
  <span className="text-green-600 font-semibold text-sm">
    ✓ Accepted Answer
  </span>
)}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-600">
                          answered {ans.answeredon}
                        </span>
                        <Link
                          href={`/users/${ans.userid}`}
                          className="flex items-center gap-2 hover:bg-blue-50 p-2 rounded"
                        >
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="text-sm">
                              {ans.useranswered[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-blue-600 hover:text-blue-800 font-medium">
                              {ans.useranswered}
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">
            Your Answer
          </h3>
          <Textarea
            placeholder="Write your answer here... You can use Markdown formatting."
            value={newanswer}
            onChange={(e) => setnewAnswer(e.target.value)}
            className="min-h-32 mb-4 resize-none"
          />
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <Button
              onClick={handleSubmitanswer}
              disabled={!newanswer.trim() || isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSubmitting ? "Posting..." : "Post Your Answer"}
            </Button>
            <p className="text-sm text-gray-600">
              By posting your answer, you agree to the{" "}
              <Link href="#" className="text-blue-600 hover:underline">
                privacy policy
              </Link>{" "}
              and{" "}
              <Link href="#" className="text-blue-600 hover:underline">
                terms of service
              </Link>
              .
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuestionDetail;