import { PrivyClient } from '@privy-io/server-auth';

const privy = new PrivyClient(process.env.PRIVY_APP_ID, process.env.PRIVY_APP_SECRET);

export const privyMiddleware = async (req, res, next) => {
  // Debug: log headers and body
  console.log('--- Privy Middleware Debug ---');
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);

  // Prefer privyId from header, fallback to body
  const privyId = req.headers['x-privy-id'] || (req.body && req.body.privyId);
  console.log('Extracted privyId:', privyId);

  if (privyId) {
    try {
      const user = await privy.getUserById(privyId);
      if (!user) {
        console.error('Privy getUserById returned null user');
        return res.status(401).json({ error: 'Invalid Privy user ID' });
      }
      req.user = user;
      return next();
    } catch (error) {
      console.error('Privy getUserById error:', error);
      return res.status(401).json({ error: 'Invalid Privy user ID', details: error?.message || 'Authentication failed' });
    }
  }

  // Fallback: try Authorization header (legacy)
  const authorization = req.headers?.authorization;
  console.log('Authorization header:', authorization ? authorization.slice(0, 30) + '...' : 'None');
  
  if (!authorization) {
    console.error('No authorization header provided and no privyId');
    return res.status(401).json({ error: 'No Privy user ID or auth token provided' });
  }
  
  try {
    const token = authorization.replace('Bearer ', '');
    const user = await privy.getUser(token);
    if (!user) {
      console.error('Privy returned null user');
      return res.status(401).json({ error: 'Invalid user data' });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error('Privy auth error:', error);
    if (error?.status === 404) {
      console.error('Privy user not found. Token may be invalid, expired, or from wrong environment.');
    }
    return res.status(401).json({ 
      error: 'Invalid auth token', 
      details: error?.message || 'Authentication failed' 
    });
  }
};
