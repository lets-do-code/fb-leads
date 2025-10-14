import { Router } from 'express';
import { metaCallback, startOAuth } from '../controllers/metaAuth.controller.ts';
const authRouter: Router = Router();

authRouter.get('/meta/start', startOAuth);
authRouter.get('/meta/callback', metaCallback);

export default authRouter;
