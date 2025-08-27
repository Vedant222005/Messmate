import mongoose from 'mongoose';

const AbsenceDateSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  reason: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
});

const OrderSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    mess: { type: mongoose.Schema.Types.ObjectId, ref: 'Mess', required: true },
    quantity: { type: Number, default: 1, min: 1 },
    pricePerMeal: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'preparing', 'delivered', 'cancelled'], default: 'pending' },
    notes: { type: String },
    subscriptionType: { type: String, enum: ['daily', 'weekly', 'monthly'], default: 'daily' },
    subscriptionEndDate: { type: Date },
    absenceDates: [AbsenceDateSchema]
  },
  { timestamps: true }
);

OrderSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  }
});

const Order = mongoose.model('Order', OrderSchema);
export default Order;

