import mongoose from 'mongoose';

const PageConnectionSchema = new mongoose.Schema({
  // userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  pageId: { type: String, required: true },
  pageName: { type: String },
  pageAccessToken: { type: String, required: true },
  instagramBusinessId: { type: String },
  longLivedToken: { type: String },
  connectedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Meta Account', PageConnectionSchema);
