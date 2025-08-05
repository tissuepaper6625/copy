import mongoose from 'mongoose';

const { Schema } = mongoose;

const PlatformLimitsSchema = new Schema({
  date: { type: Date, required: true, unique: true }, // YYYY-MM-DD format
  totalCreated: { type: Number, default: 0 },
  totalPaid: { type: Number, default: 0 },
  dailyLimit: { type: Number, default: 1000 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// PlatformLimitsSchema.index({ date: 1 });

export default mongoose.model('PlatformLimits', PlatformLimitsSchema); 