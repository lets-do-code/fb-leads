import { Router } from 'express';
import { createUser, getAllUsers, loginUser } from '../controllers/user.controller';

const userRouter: Router = Router();

userRouter.route('/').get(getAllUsers);
userRouter.route('/login').post(loginUser);
userRouter.route('/register').post(createUser);

// userRouter.route('/create').post(createUser);

export default userRouter;
