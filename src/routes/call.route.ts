import { Router } from 'express';
import { authMiddleware } from '../middleware/authmiddleware';
import { connectExotel, getCalls } from '../controllers/getCalls.controller';

const callRouter = Router();

callRouter.post('/auth/connect',authMiddleware,connectExotel)
callRouter.get('/getall', authMiddleware, getCalls);

export default callRouter;
