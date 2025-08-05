import mongoose from 'mongoose';

const { Schema } = mongoose;

const TokenSchema = new Schema({
  id: String,
  position_id: String,
  pair: String,
  contract_address: { type: String, required: true, unique: true },
  pool_address: String,
  tx_hash: String,
  name: String,
  symbol: String,
  img_url: String,
  description: String,
  
  // New metadata management fields
  metadata_cid: String,
  metadata_version: { type: Number, default: 1 },
  last_updated: { type: Date, default: Date.now },
  deployed_at: Date,
  update_history: [{
    cid: String,
    txHash: String,
    updatedAt: { type: Date, default: Date.now },
    fields: [String]
  }],
  original_post: String,
  owner_twitter: String,
  owner_address: String,
  influencer_twitter: String,
  influencer_address: String,
  unclaimed: {
    type: Boolean,
    default: false
  },
  price: {
    default: "0",
    type: String,
  },
  unCollectedFeeToken: {
      default: "0",
      type: String,
    },
    unCollectedFeeNative: {
      default: "0",
      type: String,
    },
  starting_market_cap: Number,
    market_cap: {
      default: "0",
      type: String,
    },
    volume24H: {
      default: "0",
      type: String,
    },
    volumeWeek: {
      default: "0",
      type: String,
    },
    volume30D: {
      default: "0",
      type: String,
    },
    totalValueLocked: {
      default: "0",
      type: String,
    },
    last_price: {
      default: "0",
      type: String,
    },
    last_market_cap: {
      default: "0",
      type: String,
    },
    last_volume24H: {
      default: "0",
      type: String,
    },
    last_volumeWeek: {
      default: "0",
      type: String,
    },
    last_volume30D: {
      default: "0",
      type: String,
    },
  created_at: String,
  // Replace the detailed metadata schema with a flexible Mixed type
  metadata: { type: Schema.Types.Mixed, default: {} },
  // Add generated meme image and caption fields
  generatedImage: String,
  generatedCaption: String,
  // Add tweet URL field to store the X post created during deployment
  tweet_url: String,
}, {
  timestamps: true
});

export default mongoose.model('Token', TokenSchema);
