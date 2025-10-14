import { Router, Request, Response } from 'express';
import httpResponse from '../utils/httpResponse';

/**
 * Automatically adds 405 Method Not Allowed handler
 * for all routes in a router that don’t have the called HTTP method
 */
export function addMethodNotAllowed(router: Router) {
  // This middleware runs **after all routes** in this router
  router.use((req: Request, res: Response) => {
    // If we reached here, no route matched the method
    httpResponse(req, res, 405, `Method ${req.method} not allowed on ${req.originalUrl}`);
  });

  return router;
}
