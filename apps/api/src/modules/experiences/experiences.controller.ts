import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ExperiencesService } from './experiences.service.js';

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

export const ExperiencesController = {
  async list(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await ExperiencesService.list();
      res.json({ success: true, data });
    } catch (error) { next(error); }
  },

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = experienceSchema.parse(req.body);
      const data = await ExperiencesService.create(body);
      res.status(201).json({ success: true, data });
    } catch (error) { next(error); }
  },

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = experienceSchema.partial().parse(req.body);
      const data = await ExperiencesService.update(req.params['id'] as string, body);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  },

  async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await ExperiencesService.delete(req.params['id'] as string);
      res.json({ success: true, message: 'Experience deleted' });
    } catch (error) { next(error); }
  },
};
