import axiosInstance from "./axiosinstance";

export const getMySessions = async () => {
  const response = await axiosInstance.get("/user/sessions");

  return response.data;
};

export const revokeSession = async (sessionId: string) => {
  const response = await axiosInstance.patch(
    `/user/sessions/${sessionId}/revoke`
  );

  return response.data;
};