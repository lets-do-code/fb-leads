import { NextFunction, Request, Response } from 'express';
import responseMessage from '../constants/responseMessage';
import { TError } from '../types/types';
import httpError from '../utils/httpError';

export default function globalErrorHandler(
  error: TError,
  request: Request,
  response: Response,
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  _: NextFunction
) {
  error.message = error.message || responseMessage.INTERNAL_SERVER_ERROR;
  error.statusCode = error.statusCode || 500;

  return httpError(request, response, error);
}
