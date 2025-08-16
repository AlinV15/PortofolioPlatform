
import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // 🔥 CRITICAL FIX: Force SSR for ALL routes to ensure fresh data
  {
    path: '',
    renderMode: RenderMode.Server  // ⚠️ Changed from Prerender to Server
  },
  {
    path: 'about',
    renderMode: RenderMode.Server  // ⚠️ Force server rendering for fresh data
  },
  {
    path: 'projects',
    renderMode: RenderMode.Server
  },
  {
    path: 'projects/**',
    renderMode: RenderMode.Server
  },
  {
    path: 'skills',
    renderMode: RenderMode.Server
  },
  {
    path: 'contact',
    renderMode: RenderMode.Server
  },

  // Static pages can remain prerendered (they don't change)
  {
    path: 'terms',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'privacy',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'hire-me',
    renderMode: RenderMode.Server  // ⚠️ Changed to Server for dynamic content
  },

  // Default for all other routes
  {
    path: '**',
    renderMode: RenderMode.Server
  }
];