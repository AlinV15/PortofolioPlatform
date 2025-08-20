import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling, withRouterConfig } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // Disable change detection coalescing for SSR
    provideZoneChangeDetection({
      eventCoalescing: false,
      runCoalescing: false
    }),

    // Router configuration for fresh data
    provideRouter(
      routes,


      // Scroll management
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled'
      }),

      // Force reload on same URL navigation
      withRouterConfig({
        onSameUrlNavigation: 'reload',
        canceledNavigationResolution: 'replace',
        urlUpdateStrategy: 'eager'
      })
    ),

    // Client hydration WITHOUT event replay for fresh data
    provideClientHydration(
      // withEventReplay() 
    ),

    // Animations
    provideAnimations(),

    // HTTP Client with fresh data configuration
    provideHttpClient(
      withFetch(),
      withInterceptorsFromDi()
    )
  ]
};