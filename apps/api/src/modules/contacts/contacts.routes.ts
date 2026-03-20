import { Router, type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../../lib/prisma.js';
import { authenticate, requireAdmin } from '../../middleware/auth.js';
import rateLimit from 'express-rate-limit';
import { getEnv } from '../../config/env.js';

const router = Router();

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1h
  max: 5,
  message: { success: false, message: 'Too many contact requests. Please try again later.' },
});

const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  subject: z.string().min(2).max(200),
  message: z.string().min(10).max(4000),
});

// POST /api/v1/contacts - Public (rate limited)
router.post('/', contactLimiter, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = contactSchema.parse(req.body);
    await prisma.contact.create({ data });
    res.status(201).json({ success: true, message: 'Message sent successfully' });
  } catch (error) { next(error); }
});

// GET /api/v1/contacts - Admin list
router.get('/', authenticate, requireAdmin, async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const contacts = await prisma.contact.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ success: true, data: contacts });
  } catch (error) { next(error); }
});

// PUT /api/v1/contacts/:id/read - Admin mark as read
router.put('/:id/read', authenticate, requireAdmin, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await prisma.contact.update({ where: { id: req.params['id'] as string }, data: { read: true } });
    res.json({ success: true, message: 'Marked as read' });
  } catch (error) { next(error); }
});

export default router;
