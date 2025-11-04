import { Router } from 'express';
import { authMiddleware } from '../middleware/authmiddleware';
import { checkConnectionStatus, connectExotel, getCalls } from '../controllers/getCalls.controller';

const callRouter = Router();

callRouter.post('/auth/connect',authMiddleware,connectExotel)
callRouter.get('/connection/status',authMiddleware,checkConnectionStatus)
callRouter.get('/getall', authMiddleware, getCalls);

export default callRouter;
