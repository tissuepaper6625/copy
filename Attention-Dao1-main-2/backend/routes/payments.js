import express from "express";
import { privyMiddleware } from "../middleware/privyMiddleware.js";
import { createStripePaymentIntent, confirmStripePayment, usePrivyWalletPayment, verifyPayment, createStripeCheckoutSession, getStripeCheckoutSession } from "../utils/payments.js";
import { getPrivyWalletBalance } from "../utils/limits.js";
import Payment from "../model/Payment.js";
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Rate limiter: 10 requests per minute per IP for payment endpoints
const paymentLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: { status: 'error', message: 'Too many payment requests, please try again later.' }
});

// Apply rate limiter to payment endpoints
router.use(paymentLimiter);

// Create Stripe payment intent
router.post("/create-intent", privyMiddleware, async (req, res) => {
  try {
    const user = req.user;
    const amount = parseInt(process.env.COIN_CREATION_PRICE) || 500;
    const result = await createStripePaymentIntent(user.id, user.wallet?.address, amount);
    res.status(200).json({ status: "success", data: result });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ status: "error", message: "Failed to create payment intent" });
  }
});

// Confirm Stripe payment
router.post("/confirm-stripe", privyMiddleware, async (req, res) => {
  try {
    const { paymentIntentId } = req.body;
    if (!paymentIntentId) {
      return res.status(400).json({ status: "error", message: "Missing paymentIntentId" });
    }
    const result = await confirmStripePayment(paymentIntentId);
    // Check PaymentIntent metadata matches authenticated user
    console.log('[PAYMENT DEBUG] req.user.id:', req.user.id, 'result.payment.userId:', result.payment && result.payment.userId);
    if (result.payment && result.payment.userId && req.user.id !== result.payment.userId) {
      return res.status(403).json({ status: "error", message: "PaymentIntent does not belong to this user" });
    }
    if (result.success && result.payment.status === 'completed') {
      console.log(`[PAYMENT] Confirmed Stripe paymentId=${result.payment._id} userId=${result.payment.userId}`);
      res.status(200).json({ status: "success", message: "Payment confirmed successfully", data: result.payment });
    } else {
      const status = result.payment && result.payment.status ? result.payment.status : 'unknown';
      res.status(400).json({ status: "error", message: `Payment not completed. Status: ${status}`, data: result.payment });
    }
  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({ status: "error", message: "Failed to confirm payment" });
  }
});

// Use Privy wallet for payment
router.post("/use-wallet", privyMiddleware, async (req, res) => {
  try {
    const user = req.user;
    const amount = parseInt(process.env.COIN_CREATION_PRICE) || 500;
    if (!user.id || !user.wallet?.address) {
      console.error('[PAYMENT] Missing userId or wallet address', { userId: user.id, wallet: user.wallet });
      return res.status(400).json({ status: "error", message: "Missing userId or wallet address" });
    }
    if (isNaN(amount) || amount <= 0) {
      console.error('[PAYMENT] Invalid amount', { amount });
      return res.status(400).json({ status: "error", message: "Invalid amount" });
    }
    const balance = await getPrivyWalletBalance(user.id);
    if (balance < amount) {
      console.error('[PAYMENT] Insufficient wallet balance', { balance, amount });
      return res.status(400).json({ status: "error", message: "Insufficient wallet balance" });
    }
    const result = await usePrivyWalletPayment(user.id, user.wallet?.address, amount);
    console.log('[PAYMENT] Wallet payment result:', result.payment);
    res.status(200).json({ status: "success", message: "Payment processed successfully", data: result.payment, paymentId: result.payment._id });
  } catch (error) {
    console.error('Error processing wallet payment:', error);
    res.status(500).json({ status: "error", message: "Failed to process wallet payment" });
  }
});

// Get payment history
router.get("/history/:userId", privyMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    if (req.user.id !== userId) {
      return res.status(403).json({ status: "error", message: "Forbidden: You can only access your own payment history." });
    }
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const payments = await Payment.find({ userId }).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit));
    const total = await Payment.countDocuments({ userId });
    console.log(`[PAYMENT] Fetched payment history for userId=${userId}`);
    res.status(200).json({
      status: "success",
      data: {
        payments,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Error getting payment history:', error);
    res.status(500).json({ status: "error", message: "Failed to get payment history" });
  }
});

// Create Stripe Checkout Session
router.post("/create-checkout-session", privyMiddleware, async (req, res) => {
  try {
    const user = req.user;
    const amount = parseInt(process.env.COIN_CREATION_PRICE) || 500;
    const session = await createStripeCheckoutSession(user.id, user.wallet?.address, amount);
    res.status(200).json({ status: "success", sessionId: session.id });
  } catch (error) {
    console.error('Error creating Stripe Checkout Session:', error);
    res.status(500).json({ status: "error", message: "Failed to create Stripe Checkout Session" });
  }
});

// Get Stripe Checkout Session by sessionId
router.get("/checkout-session/:sessionId", privyMiddleware, async (req, res) => {
  try {
    const { sessionId } = req.params;
    if (!sessionId) {
      return res.status(400).json({ status: "error", message: "Missing sessionId" });
    }
    const session = await getStripeCheckoutSession(sessionId);
    console.log('Stripe session:', session);
    res.status(200).json({ status: "success", session });
  } catch (error) {
    console.error('Error fetching Stripe Checkout Session:', error);
    res.status(500).json({ status: "error", message: "Failed to fetch Stripe Checkout Session" });
  }
});

export default router; 