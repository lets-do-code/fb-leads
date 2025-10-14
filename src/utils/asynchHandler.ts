import { NextFunction, Request, Response } from 'express';

type AsyncHandlerFunction = (req: Request, res: Response, next: NextFunction) => Promise<void>;

const asyncHandler = (asyncHandlerFunction: AsyncHandlerFunction) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(asyncHandlerFunction(req, res, next)).catch(next);
  };
};

export default asyncHandler;
