import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    uuid: string;
  };
}

export const verifyUser = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
 // console.log('All request headers:', req.headers);
  
  const authHeader = req.header('Authorization');
 // console.log('Authorization header:', authHeader);

  const token = authHeader?.split(' ')[1];
 // console.log('Extracted token:', token);

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string, uuid: string };
   // console.log('Decoded token:', decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    if (error instanceof jwt.JsonWebTokenError) {
      console.log('JWT Error:', error.message);
    }
    res.status(401).json({ message: 'Invalid token' });
  }

};