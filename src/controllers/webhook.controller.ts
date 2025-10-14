import { Request, Response } from 'express';
import { ENV } from '../config/env';

export const verifyWebhook = (req: Request, res: Response) => {
  const VERIFY_TOKEN = ENV.META_CONFIG.VERIFY_TOKEN;
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token === VERIFY_TOKEN) {
    console.log('✅ Webhook verified!');
    return res.status(200).send(challenge);
  }
  res.sendStatus(403);
};

export const handleWebhook = (req: Request, res: Response) => {
  console.log('📩 Webhook Event:', JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
};
