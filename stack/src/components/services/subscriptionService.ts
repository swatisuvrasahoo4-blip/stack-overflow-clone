import axiosInstance from "@/lib/axiosinstance";

export const getSubscription = async () => {
  const response = await axiosInstance.get("/subscription");
  return response.data;
};

export const getPaymentHistory = async () => {
  const response = await axiosInstance.get("/subscription/payments");
  return response.data;
};

export const createOrder = async (plan: string) => {
  const response = await axiosInstance.post(
    "/subscription/create-order",
    {
      plan,
    }
  );

  return response.data;
};

export const verifyPayment = async (data: any) => {
  const response = await axiosInstance.post(
    "/subscription/verify-payment",
    data
  );

  return response.data;
};

export const getUserSubscription = async (userId: string) => {
  const response = await axiosInstance.get(`/subscription/user/${userId}`);
  return response.data;
};