import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Static routes → prerender at build time
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'about', renderMode: RenderMode.Prerender },
  { path: 'experience', renderMode: RenderMode.Prerender },
  { path: 'skills', renderMode: RenderMode.Prerender },
  { path: 'projects', renderMode: RenderMode.Prerender },
  { path: 'lab', renderMode: RenderMode.Prerender },
  { path: 'blog', renderMode: RenderMode.Prerender },
  { path: 'contact', renderMode: RenderMode.Prerender },
  { path: '404', renderMode: RenderMode.Prerender },

  // Dynamic routes with params → SSR on demand (can't prerender without knowing params)
  { path: 'projects/:slug', renderMode: RenderMode.Server },
  { path: 'lab/:slug', renderMode: RenderMode.Server },
  { path: 'blog/:slug', renderMode: RenderMode.Server },
  { path: 'admin', renderMode: RenderMode.Server },
  { path: 'admin/**', renderMode: RenderMode.Server },

  // Fallback
  { path: '**', renderMode: RenderMode.Server },
];
