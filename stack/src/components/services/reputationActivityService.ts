import axios from "axios";
import axiosInstance from "@/lib/axiosinstance";

// Get current user's reputation activity
export const getMyReputationActivity = async () => {
  try {
    const response = await axiosInstance.get(
      "/reputation/my-activity"
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Get Reputation Activity Error:",
        error.response?.data || error.message
      );
    } else {
      console.error(
        "Get Reputation Activity Error:",
        error
      );
    }

    throw error;
  }
};

// Get user's reputation activity
export const getUserReputationActivity = async (
  userId: string
) => {
  try {
    const response = await axiosInstance.get(
      `/reputation/user/${userId}`
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Get User Reputation Activity Error:",
        error.response?.data || error.message
      );
    } else {
      console.error(
        "Get User Reputation Activity Error:",
        error
      );
    }

    throw error;
  }
};