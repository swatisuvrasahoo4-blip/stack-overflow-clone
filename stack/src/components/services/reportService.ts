import axiosInstance from "@/lib/axiosinstance";

interface CreateReportPayload {
  postId: string;
  reason: string;
  details?: string;
}

interface CreateQuestionReportPayload {
  questionId: string;
  reason: string;
  details?: string;
}

// Create post report
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

// Get reports
export const getReports = async () => {
  const response = await axiosInstance.get("/report");

  return response.data;
};

// Check post report status
export const checkReportStatus = async (
  postId: string
) => {
  const response = await axiosInstance.get(
    `/report/check/post/${postId}`
  );

  return response.data;
};

// Create question report
export const createQuestionReport = async ({
  questionId,
  reason,
  details = "",
}: CreateQuestionReportPayload) => {
  const response = await axiosInstance.post("/report", {
    questionId,
    reason,
    details,
  });

  return response.data;
};