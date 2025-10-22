import { Router } from 'express';
import { handleWebhook, verifyWebhook } from '../controllers/webhook.controller';

const webhookRouter: Router = Router();

webhookRouter.route('/').get(verifyWebhook);
webhookRouter.route('/').post(handleWebhook);

// userRouter.route('/create').post(createUser);

export default webhookRouter;
