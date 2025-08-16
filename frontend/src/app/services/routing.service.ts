import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map, distinctUntilChanged } from 'rxjs/operators';

export interface RouteData {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
}

@Injectable({
    providedIn: 'root'
})
export class RoutingService {
    private isBrowser: boolean;
    private currentRouteData$ = new BehaviorSubject<RouteData>({});
    private navigationInProgress$ = new BehaviorSubject<boolean>(false);

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private title: Title,
        private meta: Meta,
        @Inject(PLATFORM_ID) private platformId: Object,
        @Inject(DOCUMENT) private document: Document
    ) {
        this.isBrowser = isPlatformBrowser(this.platformId);
        this.initializeRouting();
    }

    /**
     * Initialize routing listeners
     */
    private initializeRouting(): void {
        // Listen to navigation events
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe((event: NavigationEnd) => {
            this.handleRouteChange(event);
            this.navigationInProgress$.next(false);
        });

        // Listen to navigation start
        this.router.events.pipe(
            filter(event => event.constructor.name === 'NavigationStart')
        ).subscribe(() => {
            this.navigationInProgress$.next(true);
        });
    }

    /**
     * Handle route changes and update SEO
     */
    private handleRouteChange(event: NavigationEnd): void {
        let route = this.activatedRoute;

        // Get the deepest activated route
        while (route.firstChild) {
            route = route.firstChild;
        }

        // Extract route data
        const routeData = route.snapshot.data;
        const params = route.snapshot.params;
        const queryParams = route.snapshot.queryParams;

        // Create route data object
        const data: RouteData = {
            title: routeData['title'] || 'Portfolio',
            description: routeData['description'] || 'My development portfolio',
            keywords: routeData['keywords'] || 'portfolio, web development, projects',
            url: this.getFullUrl(event.url)
        };

        // Update route data
        this.currentRouteData$.next(data);

        // Update SEO
        this.updateSEO(data);

        // Handle special routes
        this.handleSpecialRoutes(event.url, params, queryParams);
    }

    /**
     * Update SEO meta tags
     */
    private updateSEO(data: RouteData): void {
        // Update title
        if (data.title) {
            this.title.setTitle(data.title);
        }

        // Update meta description
        if (data.description) {
            this.meta.updateTag({ name: 'description', content: data.description });
        }

        // Update keywords
        if (data.keywords) {
            this.meta.updateTag({ name: 'keywords', content: data.keywords });
        }

        // Update Open Graph tags
        if (data.title) {
            this.meta.updateTag({ property: 'og:title', content: data.title });
        }

        if (data.description) {
            this.meta.updateTag({ property: 'og:description', content: data.description });
        }

        if (data.url) {
            this.meta.updateTag({ property: 'og:url', content: data.url });
        }

        // Update Twitter Card tags
        if (data.title) {
            this.meta.updateTag({ name: 'twitter:title', content: data.title });
        }

        if (data.description) {
            this.meta.updateTag({ name: 'twitter:description', content: data.description });
        }

        // Update canonical URL
        this.updateCanonicalUrl(data.url || '');
    }

    /**
     * Handle special routes (projects with dynamic data)
     */
    private handleSpecialRoutes(url: string, params: any, queryParams: any): void {
        // Handle project details route
        if (url.includes('/projects/') && params['id']) {
            this.handleProjectRoute(params['id']);
        }

        // Handle filtered projects
        if (url.includes('/projects') && Object.keys(queryParams).length > 0) {
            this.handleFilteredProjectsRoute(queryParams);
        }
    }

    /**
     * Handle project detail route
     */
    private handleProjectRoute(projectId: string): void {
        // This will be called by the projects component
        // when it has loaded the project data
    }

    /**
     * Handle filtered projects route
     */
    private handleFilteredProjectsRoute(queryParams: any): void {
        let title = 'Projects Portfolio';
        let description = 'Explore my development projects';

        if (queryParams['filter']) {
            const filter = queryParams['filter'];
            title = `${filter.charAt(0).toUpperCase() + filter.slice(1)} Projects`;
            description = `Browse my ${filter} development projects`;
        }

        if (queryParams['search']) {
            const search = decodeURIComponent(queryParams['search']);
            title = `Search: ${search} - Projects`;
            description = `Search results for "${search}" in my project portfolio`;
        }

        // Update SEO with filtered data
        this.updateSEO({ title, description });
    }

    /**
     * Update canonical URL
     */
    private updateCanonicalUrl(url: string): void {
        if (!this.isBrowser) return;

        // Remove existing canonical link
        const existingCanonical = this.document.querySelector('link[rel="canonical"]');
        if (existingCanonical) {
            existingCanonical.remove();
        }

        // Add new canonical link
        const canonical = this.document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        canonical.setAttribute('href', url);
        this.document.head.appendChild(canonical);
    }

    /**
     * Get full URL
     */
    private getFullUrl(path: string): string {
        if (this.isBrowser) {
            return `${window.location.origin}${path}`;
        }
        // Replace with your domain in production
        return `https://yourwebsite.com${path}`;
    }

    /**
     * Navigate with SEO-friendly parameters
     */
    navigateWithSEO(commands: any[], extras?: {
        queryParams?: any;
        fragment?: string;
        preserveFragment?: boolean;
        queryParamsHandling?: 'merge' | 'preserve' | '';
        replaceUrl?: boolean;
        state?: any;
    }): Promise<boolean> {
        // Set navigation in progress
        this.navigationInProgress$.next(true);

        return this.router.navigate(commands, {
            ...extras,
            // Always replace URL for smooth navigation
            replaceUrl: extras?.replaceUrl ?? true
        }).catch(error => {
            this.navigationInProgress$.next(false);
            throw error;
        });
    }

    /**
     * Update route data for dynamic content
     */
    updateRouteData(data: Partial<RouteData>): void {
        const currentData = this.currentRouteData$.value;
        const newData = { ...currentData, ...data };

        this.currentRouteData$.next(newData);
        this.updateSEO(newData);
    }

    /**
     * Get current route data
     */
    getCurrentRouteData(): Observable<RouteData> {
        return this.currentRouteData$.asObservable();
    }

    /**
     * Check if navigation is in progress
     */
    isNavigating(): Observable<boolean> {
        return this.navigationInProgress$.asObservable();
    }

    /**
     * Get current URL
     */
    getCurrentUrl(): string {
        return this.router.url;
    }

    /**
     * Check if current route matches pattern
     */
    isRouteActive(route: string | string[]): boolean {
        const currentUrl = this.router.url.split('?')[0]; // Remove query params

        if (Array.isArray(route)) {
            return route.some(r => currentUrl.includes(r));
        }

        return currentUrl.includes(route);
    }

    /**
     * Get route parameters
     */
    getRouteParams(): Observable<any> {
        return this.activatedRoute.params;
    }

    /**
     * Get query parameters
     */
    getQueryParams(): Observable<any> {
        return this.activatedRoute.queryParams;
    }

    /**
     * Update query parameters without navigation
     */
    updateQueryParams(params: any, options?: {
        merge?: boolean;
        replaceUrl?: boolean;
        preserveScroll?: boolean;
    }): Promise<boolean> {
        const currentParams = this.activatedRoute.snapshot.queryParams;
        const newParams = options?.merge ? { ...currentParams, ...params } : params;

        // Remove null/undefined values
        Object.keys(newParams).forEach(key => {
            if (newParams[key] === null || newParams[key] === undefined) {
                delete newParams[key];
            }
        });

        // Store current scroll position if we want to preserve it
        const scrollPosition = options?.preserveScroll && this.isBrowser
            ? { x: window.scrollX, y: window.scrollY }
            : null;

        return this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: newParams,
            replaceUrl: options?.replaceUrl ?? true,
            queryParamsHandling: options?.merge ? 'merge' : ''
        }).then((success) => {
            // Restore scroll position if needed
            if (scrollPosition && this.isBrowser) {
                // Use setTimeout to ensure navigation is complete
                setTimeout(() => {
                    window.scrollTo(scrollPosition.x, scrollPosition.y);
                }, 0);
            }
            return success;
        });
    }

    /**
     * Preload route component
     */
    preloadRoute(route: string): void {
        if (this.isBrowser) {
            // This would integrate with Angular's preloading strategy
            console.log(`Preloading route: ${route}`);
        }
    }

    /**
     * Scroll to top smoothly
     */
    scrollToTop(): void {
        if (this.isBrowser) {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth'
            });
        }
    }

    /**
     * Scroll to element
     */
    scrollToElement(elementId: string): void {
        if (this.isBrowser) {
            const element = this.document.getElementById(elementId);
            if (element) {
                element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    }
}