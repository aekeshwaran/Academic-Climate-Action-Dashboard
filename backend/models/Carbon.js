import mongoose from 'mongoose';

const carbonSchema = new mongoose.Schema({
  source: String,
  emission_tons: Number,
  month: String,
  year: Number
}, { timestamps: true });

export default mongoose.model('Carbon', carbonSchema);
