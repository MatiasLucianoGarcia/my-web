import { Router, type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../../lib/prisma.js';
import { AppError } from '../../middleware/errorHandler.js';
import { authenticate, requireAdmin } from '../../middleware/auth.js';

const router = Router();

const projectSchema = z.object({
  title: z.string().min(1).max(255),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  description: z.string().min(1),
  content: z.string().optional(),
  coverImage: z.string().url().optional().or(z.literal('')),
  liveUrl: z.string().url().optional().or(z.literal('')),
  repoUrl: z.string().url().optional().or(z.literal('')),
  featured: z.boolean().optional().default(false),
  status: z.string().optional().default('active'),
  stack: z.array(z.string()).optional().default([]),
  tags: z.array(z.string()).optional().default([]),
  order: z.number().int().optional().default(0),
});

// GET /api/v1/projects
router.get('/', async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const projects = await prisma.project.findMany({ orderBy: [{ order: 'asc' }, { createdAt: 'desc' }] });
    res.json({ success: true, data: projects });
  } catch (error) { next(error); }
});

// GET /api/v1/projects/:slug
router.get('/:slug', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const project = await prisma.project.findUnique({ where: { slug: req.params['slug'] } });
    if (!project) throw new AppError(404, 'Project not found');
    res.json({ success: true, data: project });
  } catch (error) { next(error); }
});

// POST /api/v1/projects
router.post('/', authenticate, requireAdmin, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = projectSchema.parse(req.body);
    const project = await prisma.project.create({
      data: { ...data, coverImage: data.coverImage || null, liveUrl: data.liveUrl || null, repoUrl: data.repoUrl || null },
    });
    res.status(201).json({ success: true, data: project });
  } catch (error) { next(error); }
});

// PUT /api/v1/projects/:id
router.put('/:id', authenticate, requireAdmin, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = projectSchema.partial().parse(req.body);
    const project = await prisma.project.update({
      where: { id: req.params['id'] },
      data: {
        ...data,
        coverImage: data.coverImage || null,
        liveUrl: data.liveUrl || null,
        repoUrl: data.repoUrl || null,
      },
    });
    res.json({ success: true, data: project });
  } catch (error) { next(error); }
});

// DELETE /api/v1/projects/:id
router.delete('/:id', authenticate, requireAdmin, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await prisma.project.delete({ where: { id: req.params['id'] } });
    res.json({ success: true, message: 'Project deleted' });
  } catch (error) { next(error); }
});

export default router;
