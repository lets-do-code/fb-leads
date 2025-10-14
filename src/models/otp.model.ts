import mongoose, { Document, Schema } from 'mongoose';

/**
 * Interface for OTP documents
 */
export interface IOtp extends Document {
  userId: mongoose.Types.ObjectId; // reference to User
  otp: string;
  otpExpiresAt: Date; // expires in few minutes (short life)
  resendBlockExpiresAt: Date; // prevents resending too frequently (long life)
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const otpSchema = new Schema<IOtp>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },

    otp: {
      type: String,
      required: true
    },

    otpExpiresAt: {
      type: Date,
      required: true
    },

    resendBlockExpiresAt: {
      type: Date,
      required: true
    },

    verified: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export const Otp = mongoose.model<IOtp>('Otp', otpSchema);
