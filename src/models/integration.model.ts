import mongoose from 'mongoose';

const integrationSchema = new mongoose.Schema(
  {
    ndid: { type: String, required: true },
    meta: { type: Boolean, default: false },
    google_analytics: { type: Boolean, default: false },
    gmail: { type: Boolean, default: false },
    WebsiteTracking: { type: Boolean, default: false }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

const IntegrationModel = mongoose.model('Integration', integrationSchema);

export default IntegrationModel;
