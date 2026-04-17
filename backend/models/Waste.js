import mongoose from 'mongoose';

const wasteSchema = new mongoose.Schema({
  type: String,
  generated_kg: Number,
  recycled_kg: Number,
  month: String,
  year: Number
}, { timestamps: true });

export default mongoose.model('Waste', wasteSchema);
