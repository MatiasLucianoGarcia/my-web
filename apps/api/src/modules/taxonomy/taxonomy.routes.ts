import { Router, type Request, type Response, type NextFunction } from 'express';
import { prisma } from '../../lib/prisma.js';
import { authenticate, requireAdmin } from '../../middleware/auth.js';
import { z } from 'zod';

const router = Router();

const tagSchema = z.object({
  name: z.string().min(1).max(50),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
});

const categorySchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  description: z.string().optional(),
});

// ─── TAGS ──────────────────────────────────────────────────────────────────

// GET /api/v1/taxonomy/tags
router.get('/tags', async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const tags = await prisma.tag.findMany({ orderBy: { name: 'asc' } });
    res.json({ success: true, data: tags });
  } catch (error) { next(error); }
});

// POST /api/v1/taxonomy/tags
router.post('/tags', authenticate, requireAdmin, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = tagSchema.parse(req.body);
    const tag = await prisma.tag.create({ data: { ...data, color: data.color ?? null } });
    res.status(201).json({ success: true, data: tag });
  } catch (error) { next(error); }
});

// DELETE /api/v1/taxonomy/tags/:id
router.delete('/tags/:id', authenticate, requireAdmin, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params['id'] as string;
    await prisma.tag.delete({ where: { id } });
    res.json({ success: true, message: 'Tag deleted' });
  } catch (error) { next(error); }
});

// ─── CATEGORIES ──────────────────────────────────────────────────────────────

// GET /api/v1/taxonomy/categories
router.get('/categories', async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
    res.json({ success: true, data: categories });
  } catch (error) { next(error); }
});

// POST /api/v1/taxonomy/categories
router.post('/categories', authenticate, requireAdmin, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = categorySchema.parse(req.body);
    const category = await prisma.category.create({ data: { ...data, description: data.description ?? null } });
    res.status(201).json({ success: true, data: category });
  } catch (error) { next(error); }
});

// DELETE /api/v1/taxonomy/categories/:id
router.delete('/categories/:id', authenticate, requireAdmin, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params['id'] as string;
    await prisma.category.delete({ where: { id } });
    res.json({ success: true, message: 'Category deleted' });
  } catch (error) { next(error); }
});

export default router;
