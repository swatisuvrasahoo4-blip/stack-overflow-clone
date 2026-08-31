import axios from "axios";
import axiosInstance from "@/lib/axiosinstance";

interface AnswerData {
  answerbody: string;
  useranswered: string;
  userid: string;
}

// Submit answer
export const submitAnswer = async (
  questionId: string,
  answerData: AnswerData
) => {
  const response = await axiosInstance.post(
    `/question/answer/${questionId}`,
    answerData
  );

  return response.data;
};

// Toggle question bookmark
export const toggleQuestionBookmark = async (
  userId: string,
  questionId: string
) => {
  const response = await axiosInstance.post(
    "/question-bookmark/toggle",
    {
      userId,
      questionId,
    }
  );

  return response.data;
};

// Get question bookmarks
export const getQuestionBookmarks = async (
  userId?: string
) => {
  if (!userId) {
    return [];
  }

  try {
    const response = await axiosInstance.get(
      `/question-bookmark/get/${userId}`
    );

    return response.data.questionBookmarks || [];
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

// Get question by ID
export const getQuestionById = async (
  questionId: string
) => {
  const response = await axiosInstance.get(
    `/question/${questionId}`
  );

  return response.data.data;
};

// Accept answer
export const acceptAnswer = async (
  questionId: string,
  answerId: string
) => {
  const response = await axiosInstance.patch(
    `/answer/accept/${questionId}/${answerId}`
  );

  return response.data;
};

// Vote on question
export const voteQuestion = async (
  questionId: string,
  value: "upvote" | "downvote",
  userId: string
) => {
  const response = await axiosInstance.patch(
    `/question/vote/${questionId}`,
    {
      value,
      userid: userId,
    }
  );

  return response.data;
};

// Check question report status
export const checkQuestionReportStatus = async (
  questionId: string
) => {
  const response = await axiosInstance.get(
    `/report/check/question/${questionId}`
  );

  return response.data;
};

// Search questions
export const searchQuestions = async (
  query: string,
  cursor: string | null = null,
  limit = 10
) => {
  const response = await axiosInstance.get(
    "/question/search",
    {
      params: {
        q: query,
        cursor: cursor || undefined,
        limit,
      },
    }
  );

  return response.data;
};