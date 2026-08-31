import axiosInstance from "@/lib/axiosinstance";

// Get current user's sessions
export const getMySessions = async () => {
  const response = await axiosInstance.get(
    "/user/sessions"
  );

  return response.data;
};

// Revoke user session
export const revokeSession = async (
  sessionId: string
) => {
  const response = await axiosInstance.patch(
    `/user/sessions/${sessionId}/revoke`
  );

  return response.data;
};