import { model, Schema } from "mongoose";

const sponsoredTweetSchema = new Schema({
  twitterUrl: {
    type: String,
    required: true,
    unique: true
  },
  tweetId: {
    type: String,
    required: true
  },
  sponsorName: {
    type: String,
    required: true
  },
  sponsorContact: {
    type: String,
    required: true // Contact email/info for the sponsor
  },
  category: {
    type: String,
    enum: ['politics', 'sports', 'entertainment', 'technology', 'crypto'],
    required: true
  },
  memathonSeason: {
    type: Number,
    required: true
  },
  addedBy: {
    type: String,
    required: true // Admin email who added this
  },
  isActive: {
    type: Boolean,
    default: true
  },
  priority: {
    type: Number,
    default: 1 // For positioning in feed (higher = more prominent)
  },
  amountPaid: {
    type: Number,
    required: true
  },
  // Tweet content cached for performance
  tweetContent: {
    text: String,
    author: {
      name: String,
      username: String,
      profileImageUrl: String,
      verified: Boolean
    },
    metrics: {
      retweets: Number,
      likes: Number,
      replies: Number,
      quotes: Number
    },
    media: [String],
    createdAt: Date
  },
  // Performance tracking
  stats: {
    views: { type: Number, default: 0 },
    coins: { type: Number, default: 0 }, // How many tokens created from this tweet
    participants: { type: Number, default: 0 }, // Unique users who coined it
    totalValue: { type: Number, default: 0 } // Combined value of all tokens created
  }
}, {
  timestamps: true
});

// Indexes for performance
sponsoredTweetSchema.index({ memathonSeason: 1, category: 1, isActive: 1 });
sponsoredTweetSchema.index({ priority: -1 });
sponsoredTweetSchema.index({ tweetId: 1 });

export default model("SponsoredTweet", sponsoredTweetSchema); 