import axiosInstance from "@/lib/axiosinstance";

export interface ReputationTransferData {
  receiverId: string;
  points: number;
  reason: string;
}

export const transferReputation = async (
  data: ReputationTransferData
) => {
  const response = await axiosInstance.post(
    "/reputation-transfer",
    data
  );

  return response.data;
};