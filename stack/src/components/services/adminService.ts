import axiosInstance from "@/lib/axiosinstance";

export const getAdminReports = async () => {
  const response = await axiosInstance.get("/report");
  return response.data;
};

export const updateAdminReportStatus = async (
  reportId: string,
  status: "pending" | "reviewed" | "dismissed" | "action_taken"
) => {
  const response = await axiosInstance.patch(`/report/${reportId}`, {
    status,
  });

  return response.data;
};

export const suspendAdminUser = async (
  userId: string,
  reason: string
) => {
  const response = await axiosInstance.patch(
    `/admin/users/${userId}/suspend`,
    { reason }
  );

  return response.data;
};

export const unsuspendAdminUser = async (userId: string) => {
  const response = await axiosInstance.patch(
    `/admin/users/${userId}/unsuspend`
  );

  return response.data;
};