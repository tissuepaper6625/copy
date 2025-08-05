import { checkEmailVerification } from './emailVerification.js';

// Admin emails - these users get admin privileges
const ADMIN_EMAILS = [
  'abhishek@attention.ad',
  'admin@attention.ad',
  'sales@attention.ad',
  'memathon-admin@attention.ad'
];

/**
 * Check if user has admin privileges
 * Requires both authentication and verified email matching admin list
 */
export const checkAdminPrivileges = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ 
        error: 'Authentication required',
        message: 'Please log in to access admin features'
      });
    }

    // Check email verification status
    const emailStatus = await checkEmailVerification(req.user.id);
    
    if (!emailStatus.isVerified) {
      return res.status(403).json({ 
        error: 'Email verification required',
        message: 'Admin access requires a verified email address',
        requiresEmailVerification: true
      });
    }

    if (!ADMIN_EMAILS.includes(emailStatus.emailAddress)) {
      return res.status(403).json({ 
        error: 'Admin privileges required',
        message: 'Your account does not have admin privileges',
        userEmail: emailStatus.emailAddress
      });
    }

    // Add admin info to request
    req.isAdmin = true;
    req.adminEmail = emailStatus.emailAddress;
    
    console.log(`[ADMIN ACCESS] ${emailStatus.emailAddress} accessed admin endpoint: ${req.method} ${req.path}`);
    
    next();
  } catch (error) {
    console.error('Admin verification error:', error);
    res.status(500).json({ 
      error: 'Admin verification failed',
      message: 'Unable to verify admin privileges'
    });
  }
};

/**
 * Check if a user is an admin (without middleware functionality)
 */
export const isUserAdmin = async (userId) => {
  try {
    const emailStatus = await checkEmailVerification(userId);
    return emailStatus.isVerified && ADMIN_EMAILS.includes(emailStatus.emailAddress);
  } catch (error) {
    console.error('Admin check error:', error);
    return false;
  }
};

/**
 * Get all admin emails (for reference)
 */
export const getAdminEmails = () => {
  return [...ADMIN_EMAILS];
}; 