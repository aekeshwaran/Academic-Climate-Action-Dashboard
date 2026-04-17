import mongoose from 'mongoose';

const energySchema = new mongoose.Schema({
  building_name: String,
  electricity_kwh: Number,
  solar_kwh: Number,
  period_date: Date,
  month: String,
  year: Number
}, { timestamps: true });

export default mongoose.model('Energy', energySchema);
