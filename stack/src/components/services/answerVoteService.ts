import axiosInstance from "@/lib/axiosinstance";

// Vote on answer
export const voteAnswer = async (
  questionId: string,
  answerId: string,
  voteType: "upvote" | "downvote"
) => {
  const response = await axiosInstance.patch(
    `/answer/vote/${questionId}/${answerId}`,
    { voteType }
  );

  return response.data;
};