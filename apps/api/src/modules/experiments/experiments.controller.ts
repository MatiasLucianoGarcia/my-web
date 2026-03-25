import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ExperimentStatus } from '@prisma/client';
import { ExperimentsService } from './experiments.service.js';

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

export const ExperimentsController = {
  async list(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await ExperimentsService.list();
      res.json({ success: true, data });
    } catch (error) { next(error); }
  },

  async getBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await ExperimentsService.findBySlug(req.params['slug'] as string);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  },

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = experimentSchema.parse(req.body);
      const data = await ExperimentsService.create(body);
      res.status(201).json({ success: true, data });
    } catch (error) { next(error); }
  },

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = experimentSchema.partial().parse(req.body);
      const data = await ExperimentsService.update(req.params['id'] as string, body);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  },

  async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await ExperimentsService.delete(req.params['id'] as string);
      res.json({ success: true, message: 'Experiment deleted' });
    } catch (error) { next(error); }
  },
};
