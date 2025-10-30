import { Router } from 'express';
import { getAccounts, getLeads } from '../controllers/metaData.controller';
import { authMiddleware } from '../middleware/authmiddleware';
// import { updateNdid } from '../controllers/metaData.controller';
const metaRouter = Router();

// metaRouter.get('/update/ndid/:accountId', updateNdid);
// metaRouter.get('/messages', getMessages);
metaRouter.get('/leads',authMiddleware, getLeads);
metaRouter.get('/accounts',authMiddleware, getAccounts);
// metaRouter.get('/connected-page', getConnectedPage);
export default metaRouter;
