import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling, withRouterConfig } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // 🔥 CRITICAL FIX: Disable change detection coalescing for SSR
    provideZoneChangeDetection({
      eventCoalescing: false,    // ⚠️ Changed from true to false
      runCoalescing: false       // ⚠️ Changed from true to false
    }),

    // 🔥 CRITICAL FIX: Router configuration for fresh data
    provideRouter(
      routes,
      // ⚠️ DISABLE blocking navigation to allow fresh data loading
      // withEnabledBlockingInitialNavigation(), // COMMENTED OUT

      // Scroll management
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled'
      }),

      // 🔥 CRITICAL FIX: Force reload on same URL navigation
      withRouterConfig({
        onSameUrlNavigation: 'reload',     // ⚠️ FORCE RELOAD
        canceledNavigationResolution: 'replace',
        urlUpdateStrategy: 'eager'         // ⚠️ Update URL immediately
      })
    ),

    // 🔥 CRITICAL FIX: Client hydration WITHOUT event replay for fresh data
    provideClientHydration(
      // withEventReplay() // ⚠️ COMMENTED OUT - prevents fresh data loading
    ),

    // Animations
    provideAnimations(),

    // 🔥 CRITICAL FIX: HTTP Client with fresh data configuration
    provideHttpClient(
      withFetch(),
      withInterceptorsFromDi()
    )
  ]
};