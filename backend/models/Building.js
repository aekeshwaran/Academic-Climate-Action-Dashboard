import mongoose from 'mongoose';

const buildingSchema = new mongoose.Schema({
  name: String,
  location: String,
  area: Number
}, { timestamps: true });

export default mongoose.model('Building', buildingSchema);
