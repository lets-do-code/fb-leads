import { Request, Response } from "express";
import { getNdid } from "../utils/getndid";
import httpResponse from "../utils/httpResponse";
import { ExotelModel } from "../models/integration.model";
import { decrypt, encrypt } from "../utils/crypto";
import axios from "axios";
import { parseStringPromise } from 'xml2js';

type MyRequest = Request & {
  user?: {
    Email: string;
  };
};


export const checkConnectionStatus=async(req:MyRequest,res:Response)=>{
  try {
    const user = req?.user;
    const data = req.body;

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const ndid = await getNdid(user?.Email);
    if (!ndid) {
      return res.status(400).json({ error: 'Failed to resolve NDID for user' });
    }

    const isExist=await ExotelModel.findOne({ndid:ndid})
    if(isExist){
      httpResponse(req,res,200,'🔐 Exotel credentials encrypted & saved successfully',{
        status:true
      });
    }
    else{
      httpResponse(req,res,404,'🔐 Does not exist',{
        status:false
      });
    }
  }
  catch(error:any){
    return res.status(500).json({ error: `Failed to connect Exotel: ${error.message || error}` });
  }
}
export const connectExotel = async (req: MyRequest, res: Response) => {
  try {
    const user = req?.user;
    const data = req.body;

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // 🧠 Validate required fields
    const requiredFields = ['apiKey', 'authToken', 'accountSID', 'subDomain'];
    for (const field of requiredFields) {
      if (!data?.[field]) {
        return res.status(400).json({ error: `Missing field: ${field}` });
      }
    }

    const ndid = await getNdid(user?.Email);
    if (!ndid) {
      return res.status(400).json({ error: 'Failed to resolve NDID for user' });
    }

    // 🔐 Encrypt sensitive data
    const encryptedData = {
        apiKey: encrypt(data.apiKey),
        authToken: encrypt(data.authToken),
        accountSID: encrypt(data.accountSID),
        subDomain: encrypt(data.subDomain),
    };

    
    console.log(encryptedData)
    const isExist = await ExotelModel.findOne({ ndid:ndid});

    if (!isExist) {
        await ExotelModel.create({
            ndid,
            ...encryptedData,
        });
    } else {
        isExist.apiKey = encryptedData.apiKey;
        isExist.authToken = encryptedData.authToken;
        isExist.accountSID = encryptedData.accountSID;
        isExist.subDomain = encryptedData.subDomain;
        await isExist.save();
    }

    httpResponse(req,res,200,'🔐 Exotel credentials encrypted & saved successfully',{
        docs:encryptedData
    });

  } catch (error: any) {
    console.error('Error connecting Exotel:', error);
    return res.status(500).json({ error: `Failed to connect Exotel: ${error.message || error}` });
  }
};

export const getCalls=async(req:MyRequest,res:Response)=>{
    try {
        const user = req?.user;

        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const ndid = await getNdid(user?.Email);

        const creds=await ExotelModel.findOne({ndid:ndid})
        if (!creds) return;
        const data={
            API_KEY:decrypt(creds.apiKey),
            Auth_Token:decrypt(creds.authToken),
            Subdomain:decrypt(creds.subDomain),
            Account_SID:decrypt(creds.accountSID)
        }

        console.log(data)

        const url=`https://${data.API_KEY}:${data.Auth_Token}@${data.Subdomain}/v1/Accounts/${data.Account_SID}/Calls`;

        console.log(url)

        const response = await axios.get(url);

        // console.log(response.data.)

        // Convert XML → JSON
        const json = await parseStringPromise(response.data, { explicitArray: false });
        console.log('Converted JSON:', JSON.stringify(json, null, 2));

        httpResponse(req, res, 200, 'Integrations fetched successfully', {
            docs:json.TwilioResponse??{},
        });
    } catch (error) {
        return res.status(500).json({ error: `Failed to fetch integrations ${error}` });
    }
}