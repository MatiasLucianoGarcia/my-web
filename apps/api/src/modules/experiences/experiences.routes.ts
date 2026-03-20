import { Router, type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../../lib/prisma.js';
import { AppError } from '../../middleware/errorHandler.js';
import { authenticate, requireAdmin } from '../../middleware/auth.js';

const router = Router();

const experienceSchema = z.object({
  company: z.string().min(1).max(255),
  role: z.string().min(1).max(255),
  description: z.string().min(1),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional().nullable(),
  current: z.boolean().optional().default(false),
  logoUrl: z.string().url().optional().or(z.literal('')),
  stack: z.array(z.string()).optional().default([]),
  order: z.number().int().optional().default(0),
});

// GET /api/v1/experiences - Public
router.get('/', async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const experiences = await prisma.experience.findMany({ orderBy: [{ order: 'asc' }, { startDate: 'desc' }] });
    res.json({ success: true, data: experiences });
  } catch (error) { next(error); }
});

// POST /api/v1/experiences
router.post('/', authenticate, requireAdmin, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = experienceSchema.parse(req.body);
    const experience = await prisma.experience.create({
      data: {
        ...data,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        logoUrl: data.logoUrl || null,
      },
    });
    res.status(201).json({ success: true, data: experience });
  } catch (error) { next(error); }
});

// PUT /api/v1/experiences/:id
router.put('/:id', authenticate, requireAdmin, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = experienceSchema.partial().parse(req.body);
    const experience = await prisma.experience.update({
      where: { id: req.params['id'] },
      data: {
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : null,
        logoUrl: data.logoUrl || null,
      },
    });
    res.json({ success: true, data: experience });
  } catch (error) { next(error); }
});

// DELETE /api/v1/experiences/:id
router.delete('/:id', authenticate, requireAdmin, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await prisma.experience.delete({ where: { id: req.params['id'] } });
    res.json({ success: true, message: 'Experience deleted' });
  } catch (error) { next(error); }
});

export default router;
