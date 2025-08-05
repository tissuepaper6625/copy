// claimAllUnclaimedForInfluencer.js
// Usage: node claimAllUnclaimedForInfluencer.js <influencer_twitter>

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Token from '../model/Token.js';
import { PrivyClient } from '@privy-io/server-auth';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const PRIVY_APP_ID = process.env.PRIVY_APP_ID;
const PRIVY_APP_SECRET = process.env.PRIVY_APP_SECRET;

if (!MONGO_URI || !PRIVY_APP_ID || !PRIVY_APP_SECRET) {
  console.error('Missing required environment variables.');
  process.exit(1);
}

const privy = new PrivyClient(PRIVY_APP_ID, PRIVY_APP_SECRET);

async function main() {
  const influencerTwitter = process.argv[2];
  if (!influencerTwitter) {
    console.error('Usage: node claimAllUnclaimedForInfluencer.js <influencer_twitter>');
    process.exit(1);
  }

  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  // Find all unclaimed tokens for this influencer
  const tokens = await Token.find({ influencer_twitter: influencerTwitter, unclaimed: true });
  if (!tokens.length) {
    console.log('No unclaimed tokens found for influencer:', influencerTwitter);
    process.exit(0);
  }
  console.log(`Found ${tokens.length} unclaimed tokens for @${influencerTwitter}`);

  // Fetch influencer's wallet address from Privy
  const user = await privy.getUserByTwitterUsername(influencerTwitter);
  if (!user || !user.wallet || !user.wallet.address) {
    console.error('Influencer not found on Privy or missing wallet address.');
    process.exit(1);
  }
  const walletAddress = user.wallet.address;
  console.log('Influencer wallet address:', walletAddress);

  // Update all tokens
  for (const token of tokens) {
    token.influencer_address = walletAddress;
    token.unclaimed = false;
    await token.save();
    console.log(`Updated token ${token.contract_address}`);
  }

  console.log('All tokens updated.');
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
}); 