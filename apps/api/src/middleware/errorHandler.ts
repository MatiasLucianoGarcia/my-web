import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { logger } from '../config/logger.js';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public errors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.errors && { errors: err.errors }),
    });
    return;
  }

  if (err instanceof ZodError) {
    const errors: Record<string, string[]> = {};
    err.errors.forEach((e) => {
      const key = e.path.join('.') || 'root';
      if (!errors[key]) errors[key] = [];
      errors[key]!.push(e.message);
    });
    res.status(400).json({
      success: false,
      message: 'Validation error',
      errors,
    });
    return;
  }

  logger.error(err);
  res.status(500).json({
    success: false,
    message:
      process.env['NODE_ENV'] === 'production'
        ? 'Internal server error'
        : err.message,
  });
}

export function notFound(_req: Request, res: Response): void {
  res.status(404).json({ success: false, message: 'Route not found' });
}
