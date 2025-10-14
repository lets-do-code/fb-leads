import { Request, Response } from 'express';
import { TError } from '../types/types';

export default (request: Request, response: Response, error: TError) => {
  const responseData = {
    success: false,
    responseStatusCode: error.statusCode,
    responseMessage: error.message,
    request: {
      method: request.method,
      basesurl: request.baseUrl,
      endpoint: request.url
    }
  };
  return response.status(error.statusCode).json(responseData);
};
