import { getIntegration } from '../controllers/integration.controller';
import { authMiddleware } from './../middleware/authmiddleware';
import { Router } from 'express';
const integrationRouter = Router();

integrationRouter.get('/get', authMiddleware, getIntegration);

export default integrationRouter;
