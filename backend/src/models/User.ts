import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  id: string;
  password?: string;
  name: string;
  email: string;
  role: 'Admin' | 'General User';
}

const UserSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  password: { type: String },
  name: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, enum: ['Admin', 'General User'], required: true }
});

export default mongoose.model<IUser>('User', UserSchema);
