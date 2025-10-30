import { Request, Response } from 'express';
import IntegrationModel from '../models/integration.model';
import { getNdid } from '../utils/getndid';
import httpResponse from '../utils/httpResponse';

// Extend Express Request type

type MyRequest = Request & {
  user?: {
    Email: string;
  };
};

export const getIntegration = async (req: MyRequest, res: Response) => {
  try {
    const user = req?.user;

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const ndid = await getNdid(user?.Email);

    const integrations = await IntegrationModel.findOne({ ndid: ndid });
    console.log(integrations)

    httpResponse(req, res, 200, 'Integrations fetched successfully', {
      docs:integrations??{},
    });
    // res.status(200).json({ integrations });
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch integrations ${error}` });
  }
};
