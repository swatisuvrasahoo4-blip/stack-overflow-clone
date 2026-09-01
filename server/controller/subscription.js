import crypto from "crypto";
import subscription from "../models/subscription.js";
import razorpay from "../config/razorpay.js";
import auth from "../models/auth.js";
import payment from "../models/payment.js";
import transporter from "../config/email.js";
import generateInvoice from "../utils/generateInvoice.js";

export const getSubscription = async (req, res) => {
  try {
    const data = await subscription.findOne({
      userid: req.userid,
    });

    if (
  data &&
  data.plan !== "Free" &&
  data.status === "Active" &&
  data.renewaldate &&
  new Date(data.renewaldate) <= new Date()
) {
  data.status = "Expired";
  await data.save();

  await auth.findByIdAndUpdate(req.userid, {
    subscription: "Free",
    subscriptionStatus: "Active",
    renewalDate: null,
  });
}

    if (!data) {
      return res.status(200).json({
        success: true,
        data: {
          plan: "Free",
          status: "Active",
        },
      });
    }

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json("Something went wrong...");
  }
};

export const getPaymentHistory = async (req, res) => {
  try {
    const payments = await payment
      .find({ userid: req.userid })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: payments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json("Something went wrong...");
  }
};

export const createOrder = async (req, res) => {
  try {
    const { plan } = req.body;

   let amount = 0;

switch (plan) {
  case "Bronze":
    amount = 99;
    break;

  case "Silver":
    amount = 299;
    break;

  case "Gold":
    amount = 999;
    break;

  default:
    return res.status(400).json({
      success: false,
      message: "Invalid subscription plan.",
    });
}

const options = {
  amount: amount * 100,
  currency: "INR",
  receipt: `receipt_${Date.now()}`,
};

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      order,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json("Something went wrong...");
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      plan,
    } = req.body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed.",
      });
    }

    let amount = 0;
    let renewalDate = new Date();

    switch (plan) {
      case "Bronze":
        amount = 99;
        renewalDate.setMonth(renewalDate.getMonth() + 1);
        break;

      case "Silver":
        amount = 299;
        renewalDate.setMonth(renewalDate.getMonth() + 1);
        break;

      case "Gold":
        amount = 999;
        renewalDate.setMonth(renewalDate.getMonth() + 1);
        break;

      default:
        return res.status(400).json({
          success: false,
          message: "Invalid subscription plan.",
        });
    }

    await subscription.findOneAndUpdate(
      { userid: req.userid },
      {
        userid: req.userid,
        plan,
        status: "Active",
        amount,
        paymentid: razorpay_payment_id,
        orderid: razorpay_order_id,
        startdate: new Date(),
        renewaldate: renewalDate,
      },
      {
        upsert: true,
        new: true,
      }
    );
   await auth.findByIdAndUpdate(req.userid, {
  subscription: plan,
  subscriptionStatus: "Active",
  renewalDate: renewalDate,
});

await auth.findByIdAndUpdate(
  req.userid,
  {
    $inc: {
      [`subscriptionBadges.${plan.toLowerCase()}`]: 1,
    },
  }
);

const currentUser = await auth.findById(req.userid);

const invoiceNumber = `CQ-${Date.now()}`;

await payment.create({
  userid: req.userid,
  invoiceNumber,
  plan,
  amount,
  paymentid: razorpay_payment_id,
  orderid: razorpay_order_id,
  status: "Paid",
});
try{
  const invoicePdf = await generateInvoice(
  {
    invoiceNumber,
    plan,
    amount,
    paymentId: razorpay_payment_id,
    renewalDate,
  },
  currentUser
);

await transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: currentUser.email,
  subject: `CodeQuest - ${plan} Plan Activated`,
  html: `
    <h2>Subscription Activated Successfully</h2>

    <p>Hello ${currentUser.name},</p>

    <p>Your <strong>${plan}</strong> subscription has been activated successfully.</p>

    <p><strong>Plan:</strong> ${plan}</p>
    <p><strong>Amount Paid:</strong> ₹${amount}</p>
    <p><strong>Invoice Number:</strong> ${invoiceNumber}</p>
    <p><strong>Payment ID:</strong> ${razorpay_payment_id}</p>
    <p><strong>Status:</strong> Paid</p>
    <p><strong>Renewal Date:</strong> ${renewalDate.toLocaleDateString("en-IN")}</p>

    <p>Thank you for choosing CodeQuest!</p>
  `,
  attachments: [
  {
    filename: `CodeQuest-Invoice-${invoiceNumber}.pdf`,
    content: invoicePdf,
    contentType: "application/pdf",
  },
],
});
console.log("Subscription confirmation sent");

}catch(error){
  console.error("Confirmation email failed",error);
  
}

    res.status(200).json({
      success: true,
      message: "Subscription activated successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json("Something went wrong...");
  }
};

export const getUserSubscription = async (req, res) => {
  try {
    const { userId } = req.params;

    const userSubscription = await subscription.findOne({
      userid: userId,
      status: "Active",
    });

    if (!userSubscription) {
      return res.status(200).json({
        success: true,
        data: {
          plan: "Free",
          status: "Active",
        },
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        plan: userSubscription.plan,
        status: userSubscription.status,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
};