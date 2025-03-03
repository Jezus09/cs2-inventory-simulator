import mongoose, { Document, Schema } from 'mongoose';

export interface Item extends Document {
  name: string;
  description: string;
  price: number;
  sellerId: string;
  buyerId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ItemSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  sellerId: { type: String, required: true },
  buyerId: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model<Item>('Item', ItemSchema);