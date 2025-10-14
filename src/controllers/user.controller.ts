import { NextFunction, Request, Response } from 'express';
import httpResponse from '../utils/httpResponse';
import asyncHandler from '../utils/asynchHandler';
import { User } from '../models/user.model';
import ErrorHandler from '../utils/errorHandler';

const mockUsers = [
  { id: 1, name: 'Sushil KC', email: 'sushil@example.com' },
  { id: 2, name: 'Hem Bahadur', email: 'hem@example.com' }
];

// export const registerUser = async (req: Request, res: Response) => {
//   return httpResponse(req, res, 200, 'success', {
//     docs: mockUsers
//   });
// };

export const getAllUsers = async (req: Request, res: Response) => {
  return httpResponse(req, res, 200, 'success', {
    docs: mockUsers
  });
};

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  await User.create({
    name: 'sushil',
    email: 'sushil@example.com',
    password: '123'
  });
  httpResponse(req, res, 201, 'User register successfully');
});

export const loginUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorHandler('User not found', 404));
  }

  if (user.password !== password) {
    return next(new ErrorHandler('Invalid credentials', 401));
  }

  httpResponse(req, res, 200, 'User login successfully');
});
