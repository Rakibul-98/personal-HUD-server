import mongoose, { Document, Schema } from 'mongoose';

export interface IRssSource extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  url: string;
  isActive: boolean;
  lastFetched: Date;
}

const RssSourceSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  url: { type: String, required: true, unique: true, trim: true },
  isActive: { type: Boolean, default: true },
  lastFetched: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model<IRssSource>('RssSource', RssSourceSchema);
