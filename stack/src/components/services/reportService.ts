import axiosInstance from "@/lib/axiosinstance";

interface CreateReportPayload {
  postId: string;
  reason: string;
  details?: string;
}

export const createReport = async ({
  postId,
  reason,
  details = "",
}: CreateReportPayload) => {
  const response = await axiosInstance.post("/report", {
    postId,
    reason,
    details,
  });

  return response.data;
};

export const getReports = async () => {
  const response = await axiosInstance.get("/report");

  return response.data;
};
export const checkReportStatus = async (postId: string) => {
  const response = await axiosInstance.get(
    `/report/check/${postId}`
  );

  return response.data;
};