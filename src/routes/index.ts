import { Router } from 'express';
import { ROUTES_PATH } from '../constants/apiPaths';
import authRouter from './metaAuth.route';
import webhookRouter from './webhook.route';
import metaRouter from './meta.route';
import integrationRouter from './integration.route';
import callRouter from './call.route';

const router: Router = Router();

router.use(ROUTES_PATH.AUTH, authRouter);
router.use(ROUTES_PATH.WEBHOOK, webhookRouter);
router.use(ROUTES_PATH.META, metaRouter);
router.use(ROUTES_PATH.INTEGRATION, integrationRouter);
router.use(ROUTES_PATH.CALL,callRouter)
// router.use()

// router.use(ROUTES_PATH.META, (req, res) => res.status(404).send('Not Found'));

export default router;
