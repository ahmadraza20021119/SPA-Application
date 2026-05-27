import mongoose, { Schema, Document } from 'mongoose';

export interface IRecord extends Document {
  id: string;
  userId: string;
  title: string;
  category: string;
  confidentiality: string;
  date: string;
  description: string;
}

const RecordSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  confidentiality: { type: String, required: true },
  date: { type: String, required: true },
  description: { type: String, required: true }
});

export default mongoose.model<IRecord>('Record', RecordSchema);
