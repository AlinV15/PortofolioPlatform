
import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Server
  },
  {
    path: 'about',
    renderMode: RenderMode.Server
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
    renderMode: RenderMode.Server
  },

  // Default for all other routes
  {
    path: '**',
    renderMode: RenderMode.Server
  }
];