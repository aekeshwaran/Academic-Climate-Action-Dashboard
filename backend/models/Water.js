import mongoose from 'mongoose';

const waterSchema = new mongoose.Schema({
  building_name: String,
  daily_consumption_liters: Number,
  rainwater_harvested_liters: Number,
  date: Date
}, { timestamps: true });

export default mongoose.model('Water', waterSchema);
