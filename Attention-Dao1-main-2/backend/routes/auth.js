import express from "express";
import { decodeJWT } from "../utils/auth.js";
import axios from "axios";
import querystring from "querystring"
import { fetchTwitterAccount, getUserFollowings } from "../utils/tweets.js";
import { PrivyClient } from "@privy-io/server-auth";
import { privyMiddleware } from "../middleware/privyMiddleware.js";
import { fetchWalletBalance } from "../utils/marketcap.js";
import { checkEmailVerification, requireEmailVerification } from "../utils/emailVerification.js";
import { checkAdminPrivileges } from "../utils/adminAuth.js";

const router = express.Router();

const TWITTER_CLIENT_ID = process.env.TWITTER_CLIENT_ID;
const TWITTER_CLIENT_SECRET = process.env.TWITTER_CLIENT_SECRET;
const TWITTER_TOKEN_URL = process.env.TWITTER_TOKEN_URL;

const privy = new PrivyClient(process.env.PRIVY_APP_ID, process.env.PRIVY_APP_SECRET);

router.get("/user", (req, res) => {
  if (req.cookies.toauth2) {
    const { accessToken, refreshToken, ...safeUserData } = decodeJWT(req.cookies.toauth2);
    res.json({ isAuthenticated: true, user: safeUserData });
  } else {
    res.json({ isAuthenticated: false });
  }
});

router.get("/logout", (_, res) => {
  res.clearCookie("toauth2");
  res.json({ success: true });
});

router.post("/refresh", async (req, res) => {
  if (!req.session.user?.refreshToken) {
    return res.status(401).json({ error: "No refresh token" });
  }

  try {
    const tokenResponse = await axios.post(
      TWITTER_TOKEN_URL,
      querystring.stringify({
        grant_type: "refresh_token",
        refresh_token: req.session.user.refreshToken,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(
            `${TWITTER_CLIENT_ID}:${TWITTER_CLIENT_SECRET}`,
          ).toString("base64")}`,
        },
      },
    );

    const { access_token, refresh_token } = tokenResponse.data;

    req.session.user = {
      ...req.session.user,
      accessToken: access_token,
      refreshToken: refresh_token,
    };

    res.json({ success: true });
  } catch (error) {
    console.error(
      "Token refresh error:",
      error.response?.data || error.message,
    );
    res.status(401).json({ error: "Failed to refresh token" });
  }
});

router.post("/register-user-by-username", privyMiddleware, async (req, res) => {

  try {
    const { username } = req.body;
    const account = await fetchTwitterAccount(username);
    const privy = new PrivyClient(process.env.PRIVY_APP_ID, process.env.PRIVY_APP_SECRET);
    const result = await privy.importUser({
      linkedAccounts: [{
        type: "twitter_oauth",
        subject: account.id,
        username,
        name: account.name
      }],
      createEthereumWallet: true,
    });

    res.status(200).json({
      result: result.wallet.address
    });
  } catch (error) {
    console.log(error)
    res.status(500).json(error);
  }

});

router.get("/get-all-users", async (req, res) => {
  try {
    let result = await privy.getUsers();
    res.status(200).json({
      result: result
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      error
    })
  }
});

router.get("/get-user/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const user = await privy.getUserByTwitterUsername(username);
    if (user) {
      const walletBalance = await fetchWalletBalance(user.wallet.address);
      res.status(200).json({
        user: {
          username: user.twitter.username,
          name: user.twitter.name,
          walletAddress: user.wallet.address,
          profilePictureUrl: user.twitter.profilePictureUrl,
          walletBalance: walletBalance
        },
      });
    } else {
      res.status(500).json({
        message: "user not found"
      });
    }
  } catch (error) {
    console.log(error)
    res.status(500).json(error);
  }
});

router.get("/get-user-followings", privyMiddleware, async (req, res) => {
  try {
    const user = req.user;
    const userData = await privy.getUserById(user.id);
    const followings = await getUserFollowings(userData.twitter.username);
    res.status(200).json({
      followings
    });
  } catch (error) {
    console.log(error)
    res.status(500).json(error);
  }
});

// Get email verification status for authenticated user
router.get("/email-status", privyMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const emailStatus = await checkEmailVerification(userId);
    
    console.log(`[EMAIL STATUS] User ${userId}: ${JSON.stringify(emailStatus)}`);
    
    res.json({
      success: true,
      ...emailStatus
    });
  } catch (error) {
    console.error('Email status check failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check email status',
      details: error.message
    });
  }
});

// Test endpoint to demonstrate email verification requirement
router.get("/email-test", privyMiddleware, requireEmailVerification, async (req, res) => {
  try {
    res.json({
      success: true,
      message: "Email verification passed! You can access this protected resource.",
      user: {
        id: req.user.id,
        email: req.emailStatus
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Test endpoint failed',
      details: error.message
    });
  }
});

// Debug endpoint to see full user data
router.get("/debug-user", privyMiddleware, async (req, res) => {
  try {
    const user = req.user;
    const emailStatus = await checkEmailVerification(user.id);
    
    res.json({
      success: true,
      userId: user.id,
      fullUser: user,
      emailStatus,
      emailObject: user.email || null,
      linkedAccounts: user.linkedAccounts || []
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Debug failed',
      details: error.message
    });
  }
});

// Admin status check endpoint
router.get('/admin-status', async (req, res) => {
  try {
    // Extract Privy ID from header or authorization
    const privyId = req.headers['x-privy-id'] || req.headers['authorization']?.replace('Bearer ', '');
    
    if (!privyId) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'No Privy ID provided'
      });
    }

    // For admin status, we can use a more direct check
    // privy is already imported at the top
    let user;
    
    try {
      // Try to get user by ID first
      user = await privy.getUserById(privyId);
    } catch (privyError) {
      // If that fails, check if it's a token - verify it
      try {
        const verifiedUser = await privy.verifyAuthToken(privyId);
        user = await privy.getUserById(verifiedUser.userId);
      } catch (tokenError) {
        return res.status(401).json({
          error: 'Invalid authentication',
          message: 'Could not verify user identity'
        });
      }
    }
    
    // Admin check logic
    const ADMIN_EMAILS = [
      'abhishek@attention.ad',
      'admin@attention.ad'
    ];
    
    const emailAddress = user.email?.address;
    const isEmailVerified = !!(user.email?.verifiedAt);
    const isAdmin = isEmailVerified && 
                    emailAddress && 
                    ADMIN_EMAILS.includes(emailAddress.toLowerCase());
    
    res.json({
      isAdmin,
      email: emailAddress,
      emailVerified: isEmailVerified,
      privileges: isAdmin ? ['admin', 'sponsored_tweets', 'memathon_management'] : []
    });
  } catch (error) {
    console.error('Admin status check error:', error);
    res.status(500).json({
      error: 'Failed to check admin status',
      details: error.message
    });
  }
});

// Admin test endpoint (requires admin privileges)
router.get('/admin-test', privyMiddleware, checkAdminPrivileges, (req, res) => {
  res.json({
    success: true,
    message: 'Admin access confirmed! You have admin privileges.',
    user: req.user.email || 'No email found'
  });
});

export default router;
