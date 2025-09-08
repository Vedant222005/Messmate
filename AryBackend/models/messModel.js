import mongoose from 'mongoose';

const messSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  address: { type: String, default: '' },
  pricePerMonth: {
    oneTime: { type: Number, required: true },
    twoTime: { type: Number, required: true }
  },
  customers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
    }
  ],
  notices: [
    {
      message: { type: String, required: true },
      date: { type: Date, default: Date.now }
    }
  ],
  todaysMenu: {
    breakfast: { type: String, default: '' },
    lunch: { type: String, default: '' },
    dinner: { type: String, default: '' }
  }
}, { timestamps: true });

export default mongoose.model('Mess', messSchema);
