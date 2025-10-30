import { getIntegration } from '../controllers/integration.controller';
import { Router } from 'express';
import { authMiddleware } from '../middleware/authmiddleware';
const integrationRouter = Router();

integrationRouter.get('/get', authMiddleware, getIntegration);

export default integrationRouter;
