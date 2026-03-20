import { Router, type Request, type Response } from 'express';
import { prisma } from '../../lib/prisma.js';
import { PostStatus } from '@prisma/client';

const router = Router();
const BASE_URL = process.env['PUBLIC_URL'] ?? 'https://yourdomain.com';

router.get('/sitemap.xml', async (_req: Request, res: Response): Promise<void> => {
  const posts = await prisma.post.findMany({
    where: { status: PostStatus.PUBLISHED },
    select: { slug: true, updatedAt: true },
    orderBy: { publishedAt: 'desc' },
  });
  const projects = await prisma.project.findMany({
    select: { slug: true, updatedAt: true },
  });
  const experiments = await prisma.experiment.findMany({
    select: { slug: true, updatedAt: true },
  });

  const staticPages = ['', '/about', '/experience', '/skills', '/projects', '/lab', '/blog', '/contact'];

  const urls = [
    ...staticPages.map((p) => ({ loc: `${BASE_URL}${p}`, lastmod: undefined as string | undefined, priority: p === '' ? '1.0' : '0.8' })),
    ...posts.map((p) => ({
      loc: `${BASE_URL}/blog/${p.slug}`,
      lastmod: p.updatedAt.toISOString(),
      priority: '0.7',
    })),
    ...projects.map((p) => ({
      loc: `${BASE_URL}/projects/${p.slug}`,
      lastmod: p.updatedAt.toISOString(),
      priority: '0.6',
    })),
    ...experiments.map((e) => ({
      loc: `${BASE_URL}/lab/${e.slug}`,
      lastmod: e.updatedAt.toISOString(),
      priority: '0.5',
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    ${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}
    <changefreq>weekly</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>`;

  res.header('Content-Type', 'application/xml');
  res.send(xml);
});

router.get('/robots.txt', (_req: Request, res: Response): void => {
  res.header('Content-Type', 'text/plain');
  res.send(`User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\nSitemap: ${BASE_URL}/sitemap.xml\n`);
});

export default router;
