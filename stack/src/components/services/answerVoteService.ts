import axiosInstance from "@/lib/axiosinstance";

export const voteAnswer = async (
  questionId: string,
  answerId: string,
  voteType: "upvote" | "downvote"
) => {
  const res = await axiosInstance.patch(
    `/answer/vote/${questionId}/${answerId}`,
    {
      voteType,
    }
  );

  return res.data;
};