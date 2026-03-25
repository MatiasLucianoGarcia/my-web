import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { TaxonomyService } from './taxonomy.service.js';

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

export const TaxonomyController = {
  async listTags(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await TaxonomyService.listTags();
      res.json({ success: true, data });
    } catch (error) { next(error); }
  },

  async createTag(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = tagSchema.parse(req.body);
      const data = await TaxonomyService.createTag(body);
      res.status(201).json({ success: true, data });
    } catch (error) { next(error); }
  },

  async deleteTag(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await TaxonomyService.deleteTag(req.params['id'] as string);
      res.json({ success: true, message: 'Tag deleted' });
    } catch (error) { next(error); }
  },

  async listCategories(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await TaxonomyService.listCategories();
      res.json({ success: true, data });
    } catch (error) { next(error); }
  },

  async createCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = categorySchema.parse(req.body);
      const data = await TaxonomyService.createCategory(body);
      res.status(201).json({ success: true, data });
    } catch (error) { next(error); }
  },

  async deleteCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await TaxonomyService.deleteCategory(req.params['id'] as string);
      res.json({ success: true, message: 'Category deleted' });
    } catch (error) { next(error); }
  },
};
