import mongoose, { Schema, Document } from 'mongoose';

export interface IClimateData extends Document {
  temperature: number;
  carbonEmission: number;
  energyUsage: number;
  waterUsage: number;
  timestamp: Date;
}

const ClimateDataSchema: Schema = new Schema({
  temperature: { type: Number, required: true },
  carbonEmission: { type: Number, required: true },
  energyUsage: { type: Number, required: true },
  waterUsage: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.models.ClimateData || mongoose.model<IClimateData>('ClimateData', ClimateDataSchema);
