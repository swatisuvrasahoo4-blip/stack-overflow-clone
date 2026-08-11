import axiosinstance from "@/lib/axiosinstance";

export const voteToCloseQuestion = async (
  questionId: string,
  reason: string
) => {
  const response = await axiosinstance.put(
    `/close-vote/${questionId}`,
    { reason }
  );

  return response.data;
};