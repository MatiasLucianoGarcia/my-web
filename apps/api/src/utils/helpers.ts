import { marked } from 'marked';

/**
 * Calculates estimated reading time for a post.
 * Average reading speed: 200 words per minute.
 */
export function calculateReadingTime(content: string): number {
  const text = content.replace(/<[^>]*>/g, '').replace(/[#*`_~\[\]()]/g, '');
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

/**
 * Generates a URL-friendly slug from a title.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/**
 * Renders markdown to HTML (server side, for API consumers that need it).
 */
export async function renderMarkdown(content: string): Promise<string> {
  return marked.parse(content);
}

/**
 * Creates pagination metadata.
 */
export function buildPaginationMeta(
  total: number,
  page: number,
  limit: number,
) {
  const totalPages = Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}
