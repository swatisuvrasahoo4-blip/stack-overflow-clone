import axiosInstance from "@/lib/axiosinstance";

type SubscriptionPlan = "Bronze" | "Silver" | "Gold";

interface VerifyPaymentData {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  plan: SubscriptionPlan;
}

// Get current user's subscription
export const getSubscription = async () => {
  const response = await axiosInstance.get(
    "/subscription"
  );

  return response.data;
};

// Get payment history
export const getPaymentHistory = async () => {
  const response = await axiosInstance.get(
    "/subscription/payments"
  );

  return response.data;
};

// Create subscription order
export const createOrder = async (
  plan: SubscriptionPlan
) => {
  const response = await axiosInstance.post(
    "/subscription/create-order",
    {
      plan,
    }
  );

  return response.data;
};

// Verify subscription payment
export const verifyPayment = async (
  data: VerifyPaymentData
) => {
  const response = await axiosInstance.post(
    "/subscription/verify-payment",
    data
  );

  return response.data;
};

// Get user's subscription
export const getUserSubscription = async (
  userId: string
) => {
  const response = await axiosInstance.get(
    `/subscription/user/${userId}`
  );

  return response.data;
};