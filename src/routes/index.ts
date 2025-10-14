import { Router } from 'express';
import { ROUTES_PATH } from '../constants/apiPaths';
import userRouter from './user.route';
import authRouter from './metaAuth.route';

const router: Router = Router();

router.use(ROUTES_PATH.USER, userRouter);
router.use(ROUTES_PATH.AUTH, authRouter);
// router.use()

router.use(ROUTES_PATH.USER, (req, res) => res.status(404).send('Not Found'));

export default router;
