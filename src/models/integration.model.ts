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



const exotelSchema=new mongoose.Schema({
  ndid: { type: String, required: true },
  apiKey:{type:String,required:true},
  authToken:{type:String,required:true},
  accountSID:{type:String,required:true},
  subDomain:{type:String,required:true},
},
{
    timestamps: true,
    versionKey: false
  }
)

exotelSchema.index({ ndid: 1 });
export const ExotelModel=mongoose.model('Exotel',exotelSchema)


integrationSchema.index({ndid:1});
const IntegrationModel = mongoose.model('Integration', integrationSchema);

export default IntegrationModel;
