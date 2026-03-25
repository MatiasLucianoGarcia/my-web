import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { PostStatus } from '@prisma/client';
import { PostsService } from './posts.service.js';
import type { AuthRequest } from '../../middleware/auth.js';

// ─── Validation schemas ───────────────────────────────────────────────────────

export const createPostSchema = z.object({
  title: z.string().min(1).max(255),
  slug: z.string().min(1).max(255).regex(/^[a-z0-9-]+$/),
  excerpt: z.string().max(500).optional(),
  content: z.string().min(1),
  coverImage: z.string().url().optional().or(z.literal('')),
  status: z.nativeEnum(PostStatus).optional().default(PostStatus.DRAFT),
  featured: z.boolean().optional().default(false),
  categoryId: z.string().cuid().optional().or(z.literal('')),
  tagIds: z.array(z.string().cuid()).optional().default([]),
  metaTitle: z.string().max(70).optional(),
  metaDescription: z.string().max(160).optional(),
  ogImage: z.string().url().optional().or(z.literal('')),
  publishedAt: z.string().datetime().optional(),
});

const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10),
  search: z.string().optional(),
  categorySlug: z.string().optional(),
  tagSlug: z.string().optional(),
  featured: z.string().optional().transform((v) => (v === 'true' ? true : v === 'false' ? false : undefined)),
  status: z.nativeEnum(PostStatus).optional(),
});

// ─── Controller ───────────────────────────────────────────────────────────────

export const PostsController = {
  async listPublished(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = querySchema.parse(req.query);
      const result = await PostsService.listPublished(query);
      res.json({ success: true, ...result });
    } catch (error) { next(error); }
  },

  async listAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = querySchema.parse(req.query);
      const result = await PostsService.listAdmin(query);
      res.json({ success: true, ...result });
    } catch (error) { next(error); }
  },

  async getBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await PostsService.findBySlug(req.params['slug'] as string);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  },

  async create(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = createPostSchema.parse(req.body);
      const data = await PostsService.create({ ...body, tagIds: body.tagIds ?? [], authorId: req.userId! });
      res.status(201).json({ success: true, data });
    } catch (error) { next(error); }
  },

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = createPostSchema.partial().parse(req.body);
      const data = await PostsService.update(req.params['id'] as string, body);
      res.json({ success: true, data });
    } catch (error) { next(error); }
  },

  async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await PostsService.delete(req.params['id'] as string);
      res.json({ success: true, message: 'Post deleted' });
    } catch (error) { next(error); }
  },
};
