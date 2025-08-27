import mongoose from 'mongoose';

const MenuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  type: { type: String, enum: ['breakfast', 'lunch', 'dinner', 'snack'], required: true },
  dayOfWeek: { type: String, enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'], required: true },
  isVegetarian: { type: Boolean, default: false },
  imageUrl: { type: String },

});

const MessSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    description: { type: String },
    address: { type: String },
    cuisineTypes: [{ type: String }],
    pricePerMeal: { type: Number, required: true },
    provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    imageUrl: { type: String },
    ratingAverage: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    menu: [MenuItemSchema]
  },
  { timestamps: true }
);

// Normalize id field and hide __v
MessSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  }
});

MessSchema.index({ name: 'text', description: 'text', cuisineTypes: 'text' });

const Mess = mongoose.model('Mess', MessSchema);
export default Mess;

