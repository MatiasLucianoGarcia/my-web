import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getEnv } from '../config/env.js';
import { AppError } from './errorHandler.js';

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
}

export function authenticate(req: AuthRequest, _res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    next(new AppError(401, 'Authentication required'));
    return;
  }

  try {
    const payload = jwt.verify(token, getEnv().JWT_ACCESS_SECRET) as {
      sub: string;
      role: string;
    };
    req.userId = payload.sub;
    req.userRole = payload.role;
    next();
  } catch {
    next(new AppError(401, 'Invalid or expired token'));
  }
}

export function requireAdmin(req: AuthRequest, _res: Response, next: NextFunction): void {
  if (req.userRole !== 'ADMIN') {
    next(new AppError(403, 'Admin access required'));
    return;
  }
  next();
}
