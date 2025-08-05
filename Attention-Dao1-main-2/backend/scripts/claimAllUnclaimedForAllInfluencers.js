// claimAllUnclaimedForAllInfluencers.js
// Usage: node claimAllUnclaimedForAllInfluencers.js

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
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  // Find all unique influencer_twitter usernames with unclaimed tokens
  const influencers = await Token.distinct('influencer_twitter', { unclaimed: true });
  if (!influencers.length) {
    console.log('No unclaimed tokens found for any influencer.');
    process.exit(0);
  }
  console.log(`Found ${influencers.length} influencers with unclaimed tokens.`);

  for (const influencerTwitter of influencers) {
    // Fetch influencer's wallet address from Privy
    let user;
    try {
      user = await privy.getUserByTwitterUsername(influencerTwitter);
    } catch (err) {
      console.error(`Error fetching Privy user for @${influencerTwitter}:`, err.message);
      continue;
    }
    if (!user || !user.wallet || !user.wallet.address) {
      console.log(`Influencer @${influencerTwitter} not found on Privy or missing wallet address. Skipping.`);
      continue;
    }
    const walletAddress = user.wallet.address;
    console.log(`Updating tokens for @${influencerTwitter} with wallet ${walletAddress}`);

    // Update all unclaimed tokens for this influencer
    const result = await Token.updateMany(
      { influencer_twitter: influencerTwitter, unclaimed: true },
      { $set: { influencer_address: walletAddress, unclaimed: false } }
    );
    console.log(`Updated ${result.modifiedCount} tokens for @${influencerTwitter}`);
  }

  console.log('All unclaimed tokens for all influencers updated.');
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
}); 