import axiosInstance from "@/lib/axiosinstance";

export const getMyReputationActivity = async () => {
  try {
    const response = await axiosInstance.get(
      "/reputation/my-activity"
    );

    return response.data;
  } catch (error: any) {
    console.error(
      "Get Reputation Activity Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};

export const getUserReputationActivity = async (userId: string) => {
  try {
    const response = await axiosInstance.get(
      `/reputation/user/${userId}`
    );

    return response.data;
  } catch (error: any) {
    console.error(
      "Get User Reputation Activity Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};