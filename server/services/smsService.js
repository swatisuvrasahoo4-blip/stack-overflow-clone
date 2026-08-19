import axios from "axios";

const sendSmsOtp = async (mobile, otp) => {
  try {
    const response = await axios.post(
      `https://2factor.in/API/V1/${process.env.TWOFACTOR_API_KEY}/SMS/${mobile}/${otp}`
    );

    console.log("2Factor OTP response:", response.data);

    if (response.data.Status !== "Success") {
      throw new Error(response.data.Details || "2Factor OTP sending failed");
    }

    return {
      success: true,
      details: response.data.Details,
    };
  } catch (error) {
    console.error(
      "2Factor SMS error:",
      error.response?.data || error.message
    );

    throw error;
  }
};

export default sendSmsOtp;