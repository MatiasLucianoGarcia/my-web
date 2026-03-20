import { Router, type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import { PostStatus } from '@prisma/client';
import { prisma } from '../../lib/prisma.js';
import { AppError } from '../../middleware/errorHandler.js';
import { authenticate, requireAdmin, type AuthRequest } from '../../middleware/auth.js';
import { calculateReadingTime, buildPaginationMeta } from '../../utils/helpers.js';

const router = Router();

// ─── VALIDATION SCHEMAS ──────────────────────────────────────────────────────

const createPostSchema = z.object({
  title: z.string().min(1).max(255),
  slug: z
    .string()
    .min(1)
    .max(255)
    .regex(/^[a-z0-9-]+$/),
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
  featured: z
    .string()
    .optional()
    .transform((v) => (v === 'true' ? true : v === 'false' ? false : undefined)),
  status: z.nativeEnum(PostStatus).optional(),
});

// ─── SELECT HELPERS ──────────────────────────────────────────────────────────

const postListSelect = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  coverImage: true,
  status: true,
  featured: true,
  readingTime: true,
  publishedAt: true,
  createdAt: true,
  category: { select: { id: true, name: true, slug: true } },
  tags: { select: { tag: { select: { id: true, name: true, slug: true, color: true } } } },
  author: { select: { id: true, name: true, avatarUrl: true } },
} as const;

// ─── ROUTES ──────────────────────────────────────────────────────────────────

// GET /api/v1/posts - Public list (only PUBLISHED)
router.get('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const query = querySchema.parse(req.query);
    const { page, limit, search, categorySlug, tagSlug, featured } = query;
    const skip = (page - 1) * limit;

    const where = {
      status: PostStatus.PUBLISHED,
      ...(featured !== undefined && { featured }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
          { excerpt: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
      ...(categorySlug && { category: { slug: categorySlug } }),
      ...(tagSlug && { tags: { some: { tag: { slug: tagSlug } } } }),
    };

    const [total, posts] = await Promise.all([
      prisma.post.count({ where }),
      prisma.post.findMany({ where, skip, take: limit, select: postListSelect, orderBy: { publishedAt: 'desc' } }),
    ]);

    const formatted = posts.map((p) => ({ ...p, tags: p.tags.map((pt) => pt.tag) }));
    res.json({ success: true, data: formatted, meta: buildPaginationMeta(total, page, limit) });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/posts/admin - Admin list (all statuses)
router.get('/admin', authenticate, requireAdmin, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const query = querySchema.parse(req.query);
    const { page, limit, search, status, featured } = query;
    const skip = (page - 1) * limit;

    const where = {
      ...(status && { status }),
      ...(featured !== undefined && { featured }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
          { slug: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [total, posts] = await Promise.all([
      prisma.post.count({ where }),
      prisma.post.findMany({ where, skip, take: limit, select: postListSelect, orderBy: { updatedAt: 'desc' } }),
    ]);

    const formatted = posts.map((p) => ({ ...p, tags: p.tags.map((pt) => pt.tag) }));
    res.json({ success: true, data: formatted, meta: buildPaginationMeta(total, page, limit) });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/posts/:slug - Public detail
router.get('/:slug', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const post = await prisma.post.findFirst({
      where: { slug: req.params['slug'] as string, status: PostStatus.PUBLISHED },
      include: {
        author: { select: { id: true, name: true, avatarUrl: true, bio: true } },
        category: true,
        tags: { include: { tag: true } },
      },
    });

    if (!post) throw new AppError(404, 'Post not found');

    const relatedPosts = post.categoryId
      ? await prisma.post.findMany({
          where: {
            status: PostStatus.PUBLISHED,
            categoryId: post.categoryId,
            id: { not: post.id },
          },
          take: 3,
          select: postListSelect,
          orderBy: { publishedAt: 'desc' },
        })
      : [];

    res.json({
      success: true,
      data: {
        ...post,
        tags: post.tags.map((pt) => pt.tag),
        relatedPosts: relatedPosts.map((p) => ({ ...p, tags: p.tags.map((pt) => pt.tag) })),
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/posts - Admin create
router.post('/', authenticate, requireAdmin, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = createPostSchema.parse(req.body);
    const readingTime = calculateReadingTime(data.content);

    const post = await prisma.post.create({
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        coverImage: data.coverImage || null,
        status: data.status,
        featured: data.featured,
        readingTime,
        categoryId: data.categoryId || null,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        ogImage: data.ogImage || null,
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : data.status === PostStatus.PUBLISHED ? new Date() : null,
        authorId: req.userId!,
        tags: {
          create: (data.tagIds ?? []).map((tagId) => ({ tagId })),
        },
      },
      include: { author: true, category: true, tags: { include: { tag: true } } },
    });

    res.status(201).json({ success: true, data: { ...post, tags: post.tags.map((pt) => pt.tag) } });
  } catch (error) {
    next(error);
  }
});

// PUT /api/v1/posts/:id - Admin update
router.put('/:id', authenticate, requireAdmin, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = createPostSchema.partial().parse(req.body);
    const readingTime = data.content ? calculateReadingTime(data.content) : undefined;

    // Remove existing tags if tagIds is provided
    if (data.tagIds !== undefined) {
      await prisma.postTag.deleteMany({ where: { postId: req.params['id'] as string } });
    }

    const post = await prisma.post.update({
      where: { id: req.params['id'] as string },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.slug && { slug: data.slug }),
        ...(data.content && { content: data.content, readingTime }),
        ...(data.excerpt !== undefined && { excerpt: data.excerpt }),
        ...(data.status && { status: data.status }),
        ...(data.featured !== undefined && { featured: data.featured }),
        ...(data.categoryId !== undefined && { categoryId: data.categoryId || null }),
        ...(data.coverImage !== undefined && { coverImage: data.coverImage || null }),
        ...(data.metaTitle !== undefined && { metaTitle: data.metaTitle }),
        ...(data.metaDescription !== undefined && { metaDescription: data.metaDescription }),
        ...(data.ogImage !== undefined && { ogImage: data.ogImage || null }),
        ...(data.publishedAt && { publishedAt: new Date(data.publishedAt) }),
        ...(data.status === PostStatus.PUBLISHED && !data.publishedAt ? { publishedAt: new Date() } : {}),
        ...(data.tagIds !== undefined && {
          tags: { create: data.tagIds.map((tagId) => ({ tagId })) },
        }),
      },
      include: { author: true, category: true, tags: { include: { tag: true } } },
    });

    res.json({ success: true, data: { ...post, tags: post.tags.map((pt: { tag: unknown }) => pt.tag) } });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/v1/posts/:id - Admin delete
router.delete('/:id', authenticate, requireAdmin, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await prisma.post.delete({ where: { id: req.params['id'] as string } });
    res.json({ success: true, message: 'Post deleted' });
  } catch (error) {
    next(error);
  }
});

export default router;
