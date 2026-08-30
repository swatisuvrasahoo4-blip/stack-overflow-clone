import axiosInstance from "@/lib/axiosinstance";
import axios from "axios";

export const submitAnswer = async (
  questionId: string,
  answerData: {
    answerbody: string;
    useranswered: string;
    userid: string;
  }
) => {
  const res = await axiosInstance.post(
    `/question/answer/${questionId}`,
    answerData
  );

  return res.data;
};
export const toggleQuestionBookmark = async (
  userId: string,
  questionId: string
) => {
  const res = await axiosInstance.post("/question-bookmark/toggle", {
    userId,
    questionId,
  });

  return res.data;
};
export const getQuestionBookmarks = async (userId?: string) => {
  if (!userId) return [];

  try {
    const res = await axiosInstance.get(
      `/question-bookmark/get/${userId}`
    );

    return res.data.questionBookmarks || [];
  } catch (error: unknown) {
  if (
    axios.isAxiosError(error) &&
    error.response?.status === 401
  ) {
    return [];
  }

  throw error;
}
};

export const getQuestionById = async (questionId: string) => {
  const res = await axiosInstance.get(`/question/${questionId}`);

  return res.data.data;
};

export const acceptAnswer = async (
  questionId: string,
  answerId: string
) => {
  const res = await axiosInstance.patch(
    `/answer/accept/${questionId}/${answerId}`
  );

  return res.data;
};

export const voteQuestion = async (
  questionId: string,
  value: "upvote" | "downvote",
  userId: string
) => {
  const res = await axiosInstance.patch(
    `/question/vote/${questionId}`,
    {
      value,
      userid: userId,
    }
  );

  return res.data;
};

export const checkQuestionReportStatus = async (questionId: string) => {
  const response = await axiosInstance.get(
    `/report/check/question/${questionId}`
  );

  return response.data;
};

export const searchQuestions = async (
  query: string,
  cursor: string | null = null,
  limit = 10
) => {
  const res = await axiosInstance.get("/question/search", {
    params: {
      q: query,
      cursor: cursor || undefined,
      limit,
    },
  });

  return res.data;
};