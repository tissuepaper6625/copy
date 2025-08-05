import Stripe from 'stripe';
import Payment from '../model/Payment.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'fallback_test_key');

export const createStripePaymentIntent = async (userId, userAddress, amount) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount, // amount in cents
    currency: 'usd',
    metadata: {
      userId: userId || '',
      userAddress: userAddress || ''
    }
  });
  return { clientSecret: paymentIntent.client_secret, paymentId: paymentIntent.id };
};

export const confirmStripePayment = async (paymentIntentId) => {
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  const userId = paymentIntent.metadata?.userId || 'test-user-id';
  const userAddress = paymentIntent.metadata?.userAddress || '0xTestAddress';
  const amount = paymentIntent.amount || 500;

  const payment = new Payment({
    userId,
    userAddress,
    amount,
    paymentMethod: 'stripe',
    stripePaymentIntentId: paymentIntentId,
    status: paymentIntent.status === 'succeeded' ? 'completed' : 'pending',
    createdAt: new Date(),
    updatedAt: new Date()
  });
  await payment.save();
  return { success: true, payment };
};

export const usePrivyWalletPayment = async (userId, userAddress, amount) => {
  const payment = new Payment({
    userId,
    userAddress,
    amount,
    paymentMethod: 'privy_wallet',
    status: 'completed',
    createdAt: new Date(),
    updatedAt: new Date()
  });
  await payment.save();
  return { success: true, payment };
};

export const verifyPayment = async (userId, paymentId) => {
  if (!userId || !paymentId) return false;
  const payment = await Payment.findOne({ _id: paymentId, userId });
  if (!payment) return false;
  if (payment.status !== 'completed') return false;
  if (payment.used) return false;

  payment.used = true;
  await payment.save();
  return true;
};

export const createStripeCheckoutSession = async (userId, userAddress, amount) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Premium Meme Coin Creation',
          },
          unit_amount: amount,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: process.env.FRONTEND_SUCCESS_URL || 'http://localhost:8080/payment/success?session_id={CHECKOUT_SESSION_ID}',
    cancel_url: process.env.FRONTEND_CANCEL_URL || 'http://localhost:8080/payment/cancel',
    payment_intent_data: {
      metadata: {
        userId: userId || '',
        userAddress: userAddress || '',
      }
    }
  });
  return session;
};

export const getStripeCheckoutSession = async (sessionId) => {
  return await stripe.checkout.sessions.retrieve(sessionId);
};
