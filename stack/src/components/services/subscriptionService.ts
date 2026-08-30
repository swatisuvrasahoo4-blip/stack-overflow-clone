import axiosInstance from "@/lib/axiosinstance";

interface VerifyPaymentData {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  plan: "Bronze" | "Silver" | "Gold";
}


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

export const verifyPayment = async (
  data: VerifyPaymentData
) => {
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