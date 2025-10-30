import { Request,Response } from "express";
import PageConnectionModel from "../models/PageConnection.model";
import { getNdid } from "../utils/getndid";
import axios from "axios";
import httpResponse from "../utils/httpResponse";

// export const getConnectedPage = async (req: Request, res: Response) => {
//   try {
//     // You can later filter by user ID or token if multi-user
//     const connection = await PageConnectionModel.findOne();
//     if (!connection) {
//       return res.status(404).json({ message: 'No page connected yet' });
//     }

//     res.json({
//       pageId: connection?.pageId,
//       pageName: connection?.pageName,
//       instagramBusinessId: connection.instagramBusinessId
//     });
//   } catch (err) {
//     console.error('Error fetching connected page:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// export const getMessages = async (req: Request, res: Response) => {
//   try {
//     const { pageId } = req.query;
//     const connection = await PageConnection.findOne({ pageId });
//     if (!connection) return res.status(404).json({ error: 'Page not connected' });

//     const pageAccessToken = connection.pageAccessToken;

//     const convos = await axios.get(`https://graph.facebook.com/v24.0/${pageId}/conversations`, {
//       params: { access_token: pageAccessToken }
//     });

//     const messages = await Promise.all(
//       convos.data.data.map(async (convo) => {
//         const convoDetail = await axios.get(
//           `https://graph.facebook.com/v24.0/${convo.id}/messages`,
//           { params: { access_token: pageAccessToken } }
//         );
//         return { id: convo.id, snippet: convo.snippet, messages: convoDetail.data.data };
//       })
//     );

//     console.log(messages, 'msg');

//     res.json({ messages });
//   } catch (err) {
//     console.error('❌ Error fetching messages:', err.response?.data || err.message);
//     res.status(500).json({ error: 'Failed to fetch messages' });
//   }
// };


type MyRequest = Request & {
  user?: {
    Email: string;
  };
};

export const getAccounts=async(req:MyRequest,res:Response)=>{
  try {
    const user = req?.user;

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const ndid = await getNdid(user?.Email);

    const connection = await PageConnectionModel.findOne({ndid:ndid});
    httpResponse(req,res,200,"Accounts fetched successfully",{
      docs:connection
    })
  } catch (error) {
    
  }
}
export const getLeads = async (req: MyRequest, res: Response) => {
  try {
    const { pageId } = req.query;

    console.log(pageId)

    const user = req?.user;

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const ndid = await getNdid(user?.Email);

    const connection = await PageConnectionModel.findOne(
        { ndid: ndid, "pages.id": pageId }, // match document containing the page
        { "pages.$": 1 } // project only the matched element
    );

    if (!connection) return res.status(404).json({ error: 'Page not connected' });
    const data=connection?.pages[0]

    const pageAccessToken = data.access_token;

    const formsResp = await axios.get(`https://graph.facebook.com/v24.0/${pageId}/leadgen_forms`, {
      params: { access_token: pageAccessToken }
    });

    console.log(formsResp.data.data)
    const leadsData = [];
    for (const form of formsResp.data.data) {
      const leadsResp = await axios.get(`https://graph.facebook.com/v24.0/${form.id}/leads`, {
        params: { access_token: pageAccessToken }
      });
      leadsData.push(...leadsResp.data.data);
    }
    console.log(leadsData, 'leads');
    res.json({ leads: leadsData });
  } catch (err) {
    // console.error('❌ Error fetching leads:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
};
