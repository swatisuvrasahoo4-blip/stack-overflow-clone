import axiosInstance from "@/lib/axiosinstance";

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
export const getQuestionBookmarks = async (userId: string) => {
  const res = await axiosInstance.get(
    `/question-bookmark/get/${userId}`
  );

  return res.data.questionBookmarks;
};
export const getQuestionById = async (questionId: string) => {
  const res = await axiosInstance.get(`/question/${questionId}`);

  return res.data;
};