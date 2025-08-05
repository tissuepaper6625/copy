import UserLimits from '../model/UserLimits.js';
import PlatformLimits from '../model/PlatformLimits.js';
import { PrivyClient } from "@privy-io/server-auth";

const privy = new PrivyClient(process.env.PRIVY_APP_ID, process.env.PRIVY_APP_SECRET);

// Get or create user limits
export const getUserLimits = async (userId, userAddress, twitterUsername) => {
  if (!userAddress) {
    throw new Error('userAddress is required for UserLimits. Received: ' + userAddress);
  }
  // Use upsert to avoid duplicate key errors
  let userLimits = await UserLimits.findOneAndUpdate(
    { userId },
    {
      $setOnInsert: {
        userId,
        userAddress,
        twitterUsername,
        freeLimit: parseInt(process.env.USER_FREE_LIMIT) || 10,
        dailyLimit: parseInt(process.env.USER_DAILY_LIMIT) || 50,
        dailyCreated: 0,
        totalCreated: 0,
        totalPaid: 0,
        lastDailyReset: new Date()
      }
    },
    { upsert: true, new: true }
  );
  // Reset daily count if it's a new day
  const now = new Date();
  const lastReset = new Date(userLimits.lastDailyReset);
  if (now.getUTCDate() !== lastReset.getUTCDate() || 
      now.getUTCMonth() !== lastReset.getUTCMonth() || 
      now.getUTCFullYear() !== lastReset.getUTCFullYear()) {
    userLimits.dailyCreated = 0;
    userLimits.lastDailyReset = now;
    await userLimits.save();
  }
  return userLimits;
};

// Get or create platform limits for today
export const getPlatformLimits = async () => {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  let platformLimits = await PlatformLimits.findOne({ date: today });
  if (!platformLimits) {
    platformLimits = new PlatformLimits({
      date: today,
      dailyLimit: parseInt(process.env.DAILY_PLATFORM_LIMIT) || 1000
    });
    await platformLimits.save();
  }
  return platformLimits;
};

// Check if user can create a coin
export const checkUserCanCreate = async (userId, userAddress, twitterUsername) => {
  const userLimits = await getUserLimits(userId, userAddress, twitterUsername);
  const platformLimits = await getPlatformLimits();
  const userRemaining = Math.max(0, userLimits.freeLimit - userLimits.dailyCreated);
  const userDailyRemaining = Math.max(0, userLimits.dailyLimit - userLimits.dailyCreated);
  const platformRemaining = Math.max(0, platformLimits.dailyLimit - platformLimits.totalCreated);
  const canCreate = userDailyRemaining > 0 && platformRemaining > 0;
  const requiresPayment = userRemaining <= 0;
  const paymentAmount = requiresPayment ? parseInt(process.env.COIN_CREATION_PRICE) || 500 : 0;
  return {
    canCreate,
    requiresPayment,
    paymentAmount,
    userRemaining,
    userDailyRemaining,
    platformRemaining,
    userLimits,
    platformLimits
  };
};

// Update user limits after coin creation
export const updateUserLimits = async (userId, isPaid = false) => {
  const userLimits = await UserLimits.findOne({ userId });
  if (!userLimits) return;
  userLimits.dailyCreated += 1;
  userLimits.totalCreated += 1;
  if (isPaid) userLimits.totalPaid += 1;
  await userLimits.save();
};

// Update platform limits after coin creation
export const updatePlatformLimits = async (isPaid = false) => {
  const platformLimits = await getPlatformLimits();
  platformLimits.totalCreated += 1;
  if (isPaid) platformLimits.totalPaid += 1;
  await platformLimits.save();
};

// Get Privy wallet balance (placeholder)
export const getPrivyWalletBalance = async (userId) => {
  try {
    const user = await privy.getUserById(userId);
    if (!user || !user.wallet) return 0;
    // Implement actual balance check as needed
    return 0;
  } catch (error) {
    console.error('Error getting Privy wallet balance:', error);
    return 0;
  }
}; 