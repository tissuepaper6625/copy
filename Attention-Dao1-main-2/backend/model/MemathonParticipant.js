import { model, Schema } from "mongoose";

const memathonParticipantSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  twitterUsername: {
    type: String,
    required: true
  },
  walletAddress: {
    type: String,
    required: true
  },
  sponsoredTweetId: {
    type: Schema.Types.ObjectId,
    ref: 'SponsoredTweet',
    required: true
  },
  tokenContractAddress: {
    type: String,
    required: true,
    unique: true // Each token creation is unique
  },
  memathonSeason: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    enum: ['politics', 'sports', 'entertainment', 'technology', 'crypto'],
    required: true
  },
  coinedAt: {
    type: Date,
    default: Date.now
  },
  // Token performance metrics for winner selection
  tokenPerformance: {
    initialMarketCap: { type: Number, default: 0 },
    currentMarketCap: { type: Number, default: 0 },
    peakMarketCap: { type: Number, default: 0 },
    volume24h: { type: Number, default: 0 },
    holders: { type: Number, default: 0 },
    totalTransactions: { type: Number, default: 0 },
    liquidityAdded: { type: Number, default: 0 },
    socialEngagement: {
      twitterShares: { type: Number, default: 0 },
      views: { type: Number, default: 0 },
      retweets: { type: Number, default: 0 }
    }
  },
  // Calculated winner score
  winnerScore: {
    type: Number,
    default: 0
  },
  // Awards and placement
  placement: {
    type: Number,
    default: null // 1st, 2nd, 3rd place etc.
  },
  prize: {
    amount: { type: Number, default: 0 },
    currency: { type: String, default: 'USD' },
    awarded: { type: Boolean, default: false },
    awardedAt: Date
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
memathonParticipantSchema.index({ memathonSeason: 1, category: 1 });
memathonParticipantSchema.index({ userId: 1, memathonSeason: 1 });
memathonParticipantSchema.index({ winnerScore: -1 });
memathonParticipantSchema.index({ coinedAt: 1 });
// memathonParticipantSchema.index({ tokenContractAddress: 1 });

export default model("MemathonParticipant", memathonParticipantSchema); 