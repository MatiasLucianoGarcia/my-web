import { Router, type Request, type Response, type NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { z } from 'zod';
import rateLimit from 'express-rate-limit';
import { prisma } from '../../lib/prisma.js';
import { getEnv } from '../../config/env.js';
import { AppError } from '../../middleware/errorHandler.js';
import { authenticate, type AuthRequest } from '../../middleware/auth.js';

const router = Router();

const authLimiter = rateLimit({
  windowMs: getEnv().RATE_LIMIT_WINDOW_MS,
  max: getEnv().AUTH_RATE_LIMIT_MAX,
  message: { success: false, message: 'Too many login attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

function signAccessToken(userId: string, role: string): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const expiresIn = getEnv().JWT_ACCESS_EXPIRES_IN as any;
  return jwt.sign({ sub: userId, role }, getEnv().JWT_ACCESS_SECRET, { expiresIn });
}

function signRefreshToken(userId: string): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const expiresIn = getEnv().JWT_REFRESH_EXPIRES_IN as any;
  return jwt.sign({ sub: userId }, getEnv().JWT_REFRESH_SECRET, { expiresIn });
}

// POST /api/v1/auth/login
router.post(
  '/login',
  authLimiter,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = loginSchema.parse(req.body);

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) throw new AppError(401, 'Invalid credentials');

      const valid = await bcrypt.compare(password, user.pwHash);
      if (!valid) throw new AppError(401, 'Invalid credentials');

      const accessToken = signAccessToken(user.id, user.role);
      const refreshToken = signRefreshToken(user.id);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: getEnv().NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
        path: '/api/v1/auth',
      });

      res.json({
        success: true,
        data: {
          accessToken,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            avatarUrl: user.avatarUrl,
            createdAt: user.createdAt.toISOString(),
          },
        },
      });
    } catch (error) {
      next(error);
    }
  },
);

// POST /api/v1/auth/refresh
router.post('/refresh', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const refreshToken = req.cookies?.['refreshToken'] as string | undefined;
    if (!refreshToken) throw new AppError(401, 'No refresh token');

    const payload = jwt.verify(refreshToken, getEnv().JWT_REFRESH_SECRET) as { sub: string };
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) throw new AppError(401, 'User not found');

    const accessToken = signAccessToken(user.id, user.role);
    res.json({ success: true, data: { accessToken } });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/auth/logout
router.post('/logout', (_req: Request, res: Response): void => {
  res.clearCookie('refreshToken', { path: '/api/v1/auth' });
  res.json({ success: true, message: 'Logged out' });
});

// GET /api/v1/auth/me
router.get('/me', authenticate, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) throw new AppError(404, 'User not found');
    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt.toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
