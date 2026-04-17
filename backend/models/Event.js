import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: String,
  date: Date,
  trees_planted: { type: Number, default: 0 },
  participants: { type: Number, default: 0 },
  description: String
}, { timestamps: true });

export default mongoose.model('Event', eventSchema);
