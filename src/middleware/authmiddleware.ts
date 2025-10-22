import { Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { MyRequest } from '../controllers/integration.controller';

export const authMiddleware = (req: MyRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Explicitly specify algorithm and secret for verification
    const decoded = jwt.verify(token, process.env.JWT_SECRETS as string, {
      algorithms: ['HS256']
    }) as JwtPayload;

    // Attach decoded payload to request

    if (!decoded || typeof decoded.Email !== 'string') {
      return res.status(401).json({ message: 'Invalid token payload: Email missing' });
    }

    req.user = { Email: decoded.Email };

    next();
  } catch (err) {
    console.error('JWT verification failed:', err);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
