import mongoose, { Document, Schema } from 'mongoose';

export interface User extends Document {
  username: string;
  balance: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true },
  balance: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model<User>('User', UserSchema);