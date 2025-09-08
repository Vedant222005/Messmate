import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subscription: {
    messId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mess' },
    type: { type: String, enum: ['one-time', 'two-time'] },
    startDate: Date,
    endDate: Date,
    installmentDue: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    dueAmount: { type: Number, default: 0 }
  },
  age: { type: Number }
}, { timestamps: true });

export default mongoose.model('Customer', customerSchema);
