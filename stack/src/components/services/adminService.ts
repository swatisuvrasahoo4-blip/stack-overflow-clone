import axiosInstance from "@/lib/axiosinstance";

export type AdminReportStatus =
  | "pending"
  | "reviewed"
  | "dismissed"
  | "action_taken";

// Fetch admin reports
export const getAdminReports = async () => {
  const response = await axiosInstance.get("/report");

  return response.data;
};

// Update report status
export const updateAdminReportStatus = async (
  reportId: string,
  status: AdminReportStatus
) => {
  const response = await axiosInstance.patch(
    `/report/${reportId}`,
    { status }
  );

  return response.data;
};

// Suspend user
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

// Unsuspend user
export const unsuspendAdminUser = async (
  userId: string
) => {
  const response = await axiosInstance.patch(
    `/admin/users/${userId}/unsuspend`
  );

  return response.data;
};