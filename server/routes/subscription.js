import express from "express";
import auth from "../middleware/auth.js";
import { getSubscription, getUserSubscription, createOrder, verifyPayment, getPaymentHistory } from "../controller/subscription.js";

const router = express.Router();

router.get("/user/:userId", getUserSubscription);
router.get("/", auth, getSubscription);
router.get("/payments", auth, getPaymentHistory);
router.post("/create-order", auth, createOrder);
router.post("/verify-payment", auth, verifyPayment)


export default router;