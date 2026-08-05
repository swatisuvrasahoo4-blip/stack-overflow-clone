import mongoose from "mongoose";

const paymentSchema = mongoose.Schema(
  {
    userid: {
      type: String,
      required: true,
    },

    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
    },

    plan: {
      type: String,
      enum: ["Bronze", "Silver", "Gold"],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    paymentid: {
      type: String,
      required: true,
    },

    orderid: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      default: "Paid",
    },

    paymentDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("payment", paymentSchema);