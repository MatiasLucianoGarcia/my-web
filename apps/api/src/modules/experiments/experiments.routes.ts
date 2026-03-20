import { Router, type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import { ExperimentStatus } from '@prisma/client';
import { prisma } from '../../lib/prisma.js';
import { AppError } from '../../middleware/errorHandler.js';
import { authenticate, requireAdmin } from '../../middleware/auth.js';

const router = Router();

const experimentSchema = z.object({
  title: z.string().min(1).max(255),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  description: z.string().min(1),
  status: z.nativeEnum(ExperimentStatus).optional().default(ExperimentStatus.IDEA),
  stack: z.array(z.string()).optional().default([]),
  tags: z.array(z.string()).optional().default([]),
  demoUrl: z.string().url().optional().or(z.literal('')),
  featured: z.boolean().optional().default(false),
  order: z.number().int().optional().default(0),
});

// GET /api/v1/experiments
router.get('/', async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const experiments = await prisma.experiment.findMany({ orderBy: [{ order: 'asc' }, { createdAt: 'desc' }] });
    res.json({ success: true, data: experiments });
  } catch (error) { next(error); }
});

// GET /api/v1/experiments/:slug
router.get('/:slug', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const experiment = await prisma.experiment.findUnique({ where: { slug: req.params['slug'] } });
    if (!experiment) throw new AppError(404, 'Experiment not found');
    res.json({ success: true, data: experiment });
  } catch (error) { next(error); }
});

// POST /api/v1/experiments
router.post('/', authenticate, requireAdmin, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = experimentSchema.parse(req.body);
    const experiment = await prisma.experiment.create({ data: { ...data, demoUrl: data.demoUrl || null } });
    res.status(201).json({ success: true, data: experiment });
  } catch (error) { next(error); }
});

// PUT /api/v1/experiments/:id
router.put('/:id', authenticate, requireAdmin, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = experimentSchema.partial().parse(req.body);
    const experiment = await prisma.experiment.update({
      where: { id: req.params['id'] },
      data: { ...data, demoUrl: data.demoUrl || null },
    });
    res.json({ success: true, data: experiment });
  } catch (error) { next(error); }
});

// DELETE /api/v1/experiments/:id
router.delete('/:id', authenticate, requireAdmin, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await prisma.experiment.delete({ where: { id: req.params['id'] } });
    res.json({ success: true, message: 'Experiment deleted' });
  } catch (error) { next(error); }
});

export default router;
