import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const testSms = async () => {
  try {
    const message = await client.messages.create({
      body: "sms_appointment_reminders",
      from: process.env.TWILIO_PHONE_NUMBER,
      to: "8658129159",
    });

    console.log("SMS sent:", message.sid);
  } catch (error) {
    console.error("Twilio test error:", error);
  }
};

testSms();