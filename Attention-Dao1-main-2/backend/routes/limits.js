import express from "express";
import { privyMiddleware } from "../middleware/privyMiddleware.js";
import { getUserLimits, getPlatformLimits, checkUserCanCreate } from "../utils/limits.js";

const router = express.Router();

// const BYPASS_LIMITS = true; // TEMP: Bypass all coin creation limits for local testing

// Test endpoint - no auth required
router.get("/test", async (req, res) => {
  res.status(200).json({ 
    status: "success", 
    message: "Limits API is working",
    timestamp: new Date().toISOString()
  });
});

// Get user limits (always use authenticated user)
router.get("/user", async (req, res, next) => {
  // if (BYPASS_LIMITS) {
  //   return res.status(200).json({
  //     status: "success",
  //     data: {
  //       userRemaining: 999,
  //       userDailyRemaining: 999,
  //       platformRemaining: 999,
  //       totalCreated: 0,
  //       totalPaid: 0,
  //       freeLimit: 999,
  //       dailyLimit: 999
  //     }
  //   });
  // }
  return privyMiddleware(req, res, next);
}, async (req, res) => {
  try {
    const user = req.user;
    if (!user || !user.id) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    const userLimits = await getUserLimits(user.id, user.wallet?.address, user.twitter?.username);
    const platformLimits = await getPlatformLimits();
    const userRemaining = Math.max(0, userLimits.freeLimit - userLimits.dailyCreated);
    const userDailyRemaining = Math.max(0, userLimits.dailyLimit - userLimits.dailyCreated);
    const platformRemaining = Math.max(0, platformLimits.dailyLimit - platformLimits.totalCreated);
    res.status(200).json({
      status: "success",
      data: {
        userRemaining,
        userDailyRemaining,
        platformRemaining,
        totalCreated: userLimits.totalCreated,
        totalPaid: userLimits.totalPaid,
        freeLimit: userLimits.freeLimit,
        dailyLimit: userLimits.dailyLimit
      }
    });
  } catch (error) {
    console.error('Error getting user limits:', error);
    res.status(500).json({ status: "error", message: "Failed to get user limits" });
  }
});

// Get platform limits
router.get("/platform", async (req, res) => {
  try {
    const platformLimits = await getPlatformLimits();
    const dailyRemaining = Math.max(0, platformLimits.dailyLimit - platformLimits.totalCreated);
    res.status(200).json({
      status: "success",
      data: {
        dailyRemaining,
        totalCreated: platformLimits.totalCreated,
        totalPaid: platformLimits.totalPaid,
        dailyLimit: platformLimits.dailyLimit
      }
    });
  } catch (error) {
    console.error('Error getting platform limits:', error);
    res.status(500).json({ status: "error", message: "Failed to get platform limits" });
  }
});

// Fix endpoint paths for correct mounting
router.post('/user', privyMiddleware, async (req, res) => {
  const privyId = (req.body && req.body.privyId) || (req.headers && req.headers['x-privy-id']);
  if (!privyId) {
    return res.status(401).json({ status: 'error', message: 'Missing Privy user ID' });
  }
  try {
    const user = req.user;
    console.log('[POST /user] privyId:', privyId, 'user:', user);
    const limits = await getUserLimits(user.id, user.wallet?.address, user.twitter?.username);
    // Add remaining and max fields for frontend
    const remaining = Math.max(0, limits.freeLimit - limits.dailyCreated);
    const max = limits.freeLimit;
    return res.status(200).json({ status: 'success', data: { ...limits.toObject(), remaining, max } });
  } catch (err) {
    console.error('Error in POST /api/limits/user:', err);
    return res.status(500).json({ status: 'error', message: 'Failed to fetch user limits', details: err.stack || err.message });
  }
});

// Add GET route for compatibility (supports both GET and POST)
router.get('/user', privyMiddleware, async (req, res) => {
  const privyId = req.headers['x-privy-id'];
  if (!privyId) {
    return res.status(401).json({ status: 'error', message: 'Missing Privy user ID in headers' });
  }
  try {
    const user = req.user;
    console.log('[GET /user] privyId:', privyId, 'user:', user);
    const limits = await getUserLimits(user.id, user.wallet?.address, user.twitter?.username);
    // Add remaining and max fields for frontend
    const remaining = Math.max(0, limits.freeLimit - limits.dailyCreated);
    const max = limits.freeLimit;
    return res.status(200).json({ status: 'success', data: { ...limits.toObject(), remaining, max } });
  } catch (err) {
    console.error('Error in GET /api/limits/user:', err);
    return res.status(500).json({ status: 'error', message: 'Failed to fetch user limits', details: err.stack || err.message });
  }
});

router.post('/check', privyMiddleware, async (req, res) => {
  const privyId = (req.body && req.body.privyId) || (req.headers && req.headers['x-privy-id']);
  if (!privyId) {
    return res.status(401).json({ status: 'error', message: 'Missing Privy user ID' });
  }
  try {
    const user = req.user;
    console.log('[POST /check] privyId:', privyId, 'user:', user);
    const check = await checkUserCanCreate(user.id, user.wallet?.address, user.twitter?.username);
    return res.status(200).json({ status: 'success', data: check });
  } catch (err) {
    console.error('Error in POST /api/limits/check:', err);
    return res.status(500).json({ status: 'error', message: 'Failed to check user limits', details: err.stack || err.message });
  }
});
export default router; 