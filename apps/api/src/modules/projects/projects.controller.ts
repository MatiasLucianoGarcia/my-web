import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ProjectsService } from './projects.service.js';

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

export const ProjectsController = {
  async list(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await ProjectsService.list();
      res.json({ success: true, data });
    } catch (error) { next(error); }
  },

  async getBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await ProjectsService.findBySlug(req.params['slug'] as string);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  },

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = projectSchema.parse(req.body);
      const data = await ProjectsService.create(body);
      res.status(201).json({ success: true, data });
    } catch (error) { next(error); }
  },

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = projectSchema.partial().parse(req.body);
      const data = await ProjectsService.update(req.params['id'] as string, body);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  },

  async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await ProjectsService.delete(req.params['id'] as string);
      res.json({ success: true, message: 'Project deleted' });
    } catch (error) { next(error); }
  },
};
