import mongoose from 'mongoose';

const PageConnectionSchema = new mongoose.Schema(
  {
    ndid: { type: String, required: true },
    account_id: { type: String, required: true },
    account_name: { type: String, required: true },
    pages: [{ type: Object }]
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export default mongoose.model('Meta Account', PageConnectionSchema);
