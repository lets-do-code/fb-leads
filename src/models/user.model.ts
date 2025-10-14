import mongoose, { Document, Schema } from 'mongoose';

interface TUser extends Document {
  name: string;
  email: string;
  password: string;
}

const userSchema = new Schema<TUser>({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

export const User = mongoose.model<TUser>('user', userSchema);
