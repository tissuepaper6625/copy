import mongoose from 'mongoose';

const { Schema } = mongoose;

const UserLimitsSchema = new Schema({
  userId: { type: String, required: true, unique: true },
  userAddress: { type: String, required: true },
  twitterUsername: String,
  dailyCreated: { type: Number, default: 0 },
  lastDailyReset: { type: Date, default: Date.now },
  totalCreated: { type: Number, default: 0 },
  totalPaid: { type: Number, default: 0 },
  stripeCustomerId: String,
  lastPaymentDate: Date,
  freeLimit: { type: Number, default: 10 },
  dailyLimit: { type: Number, default: 50 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

//UserLimitsSchema.index({ userId: 1 });
UserLimitsSchema.index({ userAddress: 1 });
UserLimitsSchema.index({ lastDailyReset: 1 });

export default mongoose.model('UserLimits', UserLimitsSchema); 