// src/app.ts
import cors from 'cors';
import express, { Express, NextFunction, Request, Response } from 'express';
import { API_PREFIX } from './constants/apiPaths';
import globalErrorHandler from './middleware/globalErrorHandler';
import router from './routes';
import asyncHandler from './utils/asynchHandler';
import { NotFoundError } from './utils/errorHandler';
import httpResponse from './utils/httpResponse';
const app: Express = express();

// global middlewares
app.use(
  cors({
    origin: '*',
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE'
  })
);
// app.use('view engine', hbs);
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));

// sendEmail();
// routes
app.use(API_PREFIX, router);

app.get(
  '/',
  asyncHandler(async (req, res) => {
    httpResponse(req, res, 200, 'Server is working fine🥳🥳');
  })
);

//404 handler
app.use((req: Request, res: Response, next: NextFunction) => {
  // You can throw a custom error class
  next(new NotFoundError(`Route doesn't exist`));
});

// error handler
app.use(globalErrorHandler);

export default app;
