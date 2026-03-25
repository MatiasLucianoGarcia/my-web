import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ContactsService } from './contacts.service.js';

export const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  subject: z.string().min(2).max(200),
  message: z.string().min(10).max(4000),
});

export const ContactsController = {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = contactSchema.parse(req.body);
      await ContactsService.create(body);
      res.status(201).json({ success: true, message: 'Message sent successfully' });
    } catch (error) { next(error); }
  },

  async list(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await ContactsService.list();
      res.json({ success: true, data });
    } catch (error) { next(error); }
  },

  async markAsRead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await ContactsService.markAsRead(req.params['id'] as string);
      res.json({ success: true, message: 'Marked as read' });
    } catch (error) { next(error); }
  },
};
