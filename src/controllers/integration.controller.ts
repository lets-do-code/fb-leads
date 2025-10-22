import { Request, Response } from 'express';
import IntegrationModel from '../models/integration.model';
import { getNdid } from '../utils/getndid';

// Extend Express Request type

export interface MyRequest extends Request {
  user?: {
    Email: string;
  };
}

export const getIntegration = async (req: MyRequest, res: Response) => {
  try {
    const user = req.user;

    const ndid = await getNdid(user?.Email);

    const integrations = await IntegrationModel.findOne({ ndid: ndid });

    res.status(200).json({ integrations });
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch integrations ${error}` });
  }
};
