import mongoose from "mongoose";

const subscriptionSchema = mongoose.Schema(
  {
    userid: {
      type: String,
      required: true,
    },

    plan: {
      type: String,
      enum: ["Free", "Bronze", "Silver", "Gold"],
      default: "Free",
    },

    status: {
      type: String,
      enum: ["Active", "Expired", "Cancelled"],
      default: "Active",
    },

    amount: {
      type: Number,
      default: 0,
    },

    paymentid: {
      type: String,
      default: "",
    },

    orderid: {
      type: String,
      default: "",
    },

    startdate: {
      type: Date,
      default: Date.now,
    },

    renewaldate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("subscription", subscriptionSchema);