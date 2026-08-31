import axiosInstance from "@/lib/axiosinstance";

export interface SupportRequestData {
  subject: string;
  message: string;
}

// Create support request
export const createSupportRequest = async (
  data: SupportRequestData
) => {
  const response = await axiosInstance.post(
    "/support",
    data
  );

  return response.data;
};

// Get support requests
export const getSupportRequests = async () => {
  const response = await axiosInstance.get(
    "/support"
  );

  return response.data;
};

// Resolve support request
export const resolveSupportRequest = async (
  id: string
) => {
  const response = await axiosInstance.patch(
    `/support/${id}/resolve`
  );

  return response.data;
};