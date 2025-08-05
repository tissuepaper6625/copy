import { PrivyClient } from '@privy-io/server-auth';

const privy = new PrivyClient(process.env.PRIVY_APP_ID, process.env.PRIVY_APP_SECRET);

/**
 * Check email verification status for a user
 * @param {string} userId - The Privy user ID
 * @returns {Object} Email verification status
 */
export const checkEmailVerification = async (userId) => {
  try {
    const user = await privy.getUserById(userId);
    
    return {
      hasEmail: !!user.email,
      emailAddress: user.email?.address || null,
      isVerified: !!(user.email?.verifiedAt),
      canProceed: !!(user.email?.verifiedAt)
    };
  } catch (error) {
    console.error('Error checking email verification:', error);
    return {
      hasEmail: false,
      emailAddress: null,
      isVerified: false,
      canProceed: false
    };
  }
};

/**
 * Middleware to require email verification for protected routes
 * Use this middleware after privyMiddleware
 */
export const requireEmailVerification = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const emailStatus = await checkEmailVerification(userId);
    
    if (!emailStatus.canProceed) {
      return res.status(403).json({
        error: 'Email verification required',
        message: 'You must verify your email address to perform this action.',
        emailStatus,
        requiresEmailVerification: true
      });
    }
    
    // Add email status to request for use in route handlers
    req.emailVerified = true;
    req.emailStatus = emailStatus;
    next();
  } catch (error) {
    console.error('Email verification middleware error:', error);
    return res.status(500).json({
      error: 'Email verification check failed',
      details: error.message
    });
  }
};

/**
 * Optional middleware to get email status without blocking the request
 * Use this when you want to know email status but don't want to block unverified users
 */
export const getEmailStatus = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const emailStatus = await checkEmailVerification(userId);
    
    req.emailStatus = emailStatus;
    next();
  } catch (error) {
    console.error('Email status check error:', error);
    // Don't block the request if we can't check email status
    req.emailStatus = {
      hasEmail: false,
      emailAddress: null,
      isVerified: false,
      canProceed: false
    };
    next();
  }
}; 