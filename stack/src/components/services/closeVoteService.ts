import axiosInstance from "@/lib/axiosinstance";

// Vote to close question
export const voteToCloseQuestion = async (
  questionId: string,
  reason: string
) => {
  const response = await axiosInstance.put(
    `/close-vote/${questionId}`,
    { reason }
  );

  return response.data;
};