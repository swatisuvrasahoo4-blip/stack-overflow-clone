import "dotenv/config";
import axios from "axios";

const transporter = {
  sendMail: async ({
    from,
    to,
    subject,
    html,
    attachments = [],
  }) => {
    const emailData = {
      sender: {
        email: process.env.EMAIL_USER,
        name: "CodeQuest",
      },
      to: [
        {
          email: to,
        },
      ],
      subject,
      htmlContent: html,
    };

    if (attachments.length > 0) {
      emailData.attachment = attachments.map((file) => ({
        name: file.filename,
        content: file.content.toString("base64"),
      }));
    }

    try {
      const response = await axios.post(
        "https://api.brevo.com/v3/smtp/email",
        emailData,
        {
          headers: {
            accept: "application/json",
            "api-key": process.env.BREVO_API_KEY,
            "content-type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error(
        "Brevo email error:",
        error.response?.data || error.message
      );

      throw error;
    }
  },
};

export default transporter;