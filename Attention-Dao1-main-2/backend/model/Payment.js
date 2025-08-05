import mongoose from 'mongoose';
const { Schema } = mongoose;

const PaymentSchema = new Schema({
  userId: { type: String, required: true, index: true },
  userAddress: { type: String, required: true },
  amount: { type: Number, required: true }, // in USD cents
  paymentMethod: { 
    type: String, 
    enum: ['stripe', 'privy_wallet'], 
    required: true 
  },
  stripePaymentIntentId: { type: String, index: true },
  privyTransactionHash: String,
  status: { 
    type: String, 
    enum: ['pending', 'completed', 'failed'], 
    default: 'pending',
    index: true
  },
  coinsPurchased: { type: Number, default: 1 },
  metadata: Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Payment', PaymentSchema);
