import axiosInstance from "@/lib/axiosinstance";
import axios from "axios";

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

export const getUserReputationActivity = async (userId: string) => {
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