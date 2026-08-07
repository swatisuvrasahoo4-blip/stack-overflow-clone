import axiosInstance from "@/lib/axiosinstance";

export interface SupportRequestData {
  subject: string;
  message: string;
}

export const createSupportRequest = async (
  data: SupportRequestData
) => {
  const response = await axiosInstance.post("/support", data);
  return response.data;
};

export const getSupportRequests = async () => {
  const response = await axiosInstance.get("/support");

  return response.data;
};

export const resolveSupportRequest = async (id: string) => {
  const response = await axiosInstance.patch(
    `/support/${id}/resolve`
  );

  return response.data;
};