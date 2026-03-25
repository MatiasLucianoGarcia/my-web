import { PostStatus } from '@prisma/client';
import { prisma } from '../../lib/prisma.js';
import { AppError } from '../../middleware/errorHandler.js';
import { calculateReadingTime, buildPaginationMeta } from '../../utils/helpers.js';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PostQuery {
  page: number;
  limit: number;
  search?: string;
  categorySlug?: string;
  tagSlug?: string;
  featured?: boolean;
  status?: PostStatus;
}

export interface CreatePostData {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  status: PostStatus;
  featured: boolean;
  categoryId?: string;
  tagIds: string[];
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  publishedAt?: string;
  authorId: string;
}

export type UpdatePostData = Partial<Omit<CreatePostData, 'authorId'>>;

// ─── Select helpers ───────────────────────────────────────────────────────────

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

const flattenTags = <T extends { tags: { tag: unknown }[] }>(posts: T[]) =>
  posts.map((p) => ({ ...p, tags: p.tags.map((pt) => pt.tag) }));

// ─── Service ──────────────────────────────────────────────────────────────────

export const PostsService = {
  async listPublished(query: PostQuery) {
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

    return { data: flattenTags(posts), meta: buildPaginationMeta(total, page, limit) };
  },

  async listAdmin(query: PostQuery) {
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

    return { data: flattenTags(posts), meta: buildPaginationMeta(total, page, limit) };
  },

  async findBySlug(slug: string) {
    const post = await prisma.post.findFirst({
      where: { slug, status: PostStatus.PUBLISHED },
      include: {
        author: { select: { id: true, name: true, avatarUrl: true, bio: true } },
        category: true,
        tags: { include: { tag: true } },
      },
    });

    if (!post) throw new AppError(404, 'Post not found');

    const relatedPosts = post.categoryId
      ? await prisma.post.findMany({
          where: { status: PostStatus.PUBLISHED, categoryId: post.categoryId, id: { not: post.id } },
          take: 3,
          select: postListSelect,
          orderBy: { publishedAt: 'desc' },
        })
      : [];

    return {
      ...post,
      tags: post.tags.map((pt) => pt.tag),
      relatedPosts: flattenTags(relatedPosts),
    };
  },

  async create(data: CreatePostData) {
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
        publishedAt:
          data.publishedAt
            ? new Date(data.publishedAt)
            : data.status === PostStatus.PUBLISHED
            ? new Date()
            : null,
        authorId: data.authorId,
        tags: { create: data.tagIds.map((tagId) => ({ tagId })) },
      },
      include: { author: true, category: true, tags: { include: { tag: true } } },
    });

    return { ...post, tags: post.tags.map((pt) => pt.tag) };
  },

  async update(id: string, data: UpdatePostData) {
    const readingTime = data.content ? calculateReadingTime(data.content) : undefined;

    if (data.tagIds !== undefined) {
      await prisma.postTag.deleteMany({ where: { postId: id } });
    }

    const post = await prisma.post.update({
      where: { id },
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
        ...(data.tagIds !== undefined && { tags: { create: data.tagIds.map((tagId) => ({ tagId })) } }),
      },
      include: { author: true, category: true, tags: { include: { tag: true } } },
    });

    return { ...post, tags: post.tags.map((pt: { tag: unknown }) => pt.tag) };
  },

  async delete(id: string) {
    await prisma.post.delete({ where: { id } });
  },
};
