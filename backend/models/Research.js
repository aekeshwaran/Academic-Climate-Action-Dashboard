import mongoose from 'mongoose';

const researchSchema = new mongoose.Schema({
  title: String,
  lead: String,
  start_date: Date,
  end_date: Date,
  description: String,
  funding: Number
}, { timestamps: true });

export default mongoose.model('Research', researchSchema);
