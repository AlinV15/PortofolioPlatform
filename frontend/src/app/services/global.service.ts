import { Injectable, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, BehaviorSubject, timer } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import {
    map,
    catchError,
    timeout,
    retry,
    shareReplay,
    finalize,
    takeUntil,
    distinctUntilChanged,
    filter
} from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { CacheConfig, CacheEntry, RequestConfig } from '../shared/models/request.interface';
import { EndpointType } from '../shared/enums/EndpointType';

@Injectable()
export abstract class GlobalService implements OnDestroy {
    protected readonly apiUrl = environment.api.baseUrl;
    protected readonly isBrowser: boolean;

    // 🔥 ROUTE-AWARE CACHING STRATEGY
    protected readonly cache = new Map<string, CacheEntry<any>>();
    protected readonly destroy$ = new BehaviorSubject<boolean>(false);
    private currentRoute: string = '';
    private routeContext: string = '';

    // Loading states pentru fiecare endpoint
    protected readonly loadingStates = new Map<string, BehaviorSubject<boolean>>();
    protected abstract readonly cacheConfig: CacheConfig;
    protected abstract readonly serviceApiUrl: string;
    protected abstract readonly serviceName: string;

    //  Shorter cache times to prevent stale data
    protected readonly requestConfigs: Record<EndpointType, RequestConfig> = {
        [EndpointType.HIGHLIGHTS]: {
            timeout: 8000,
            retryCount: 2,
            cacheTTL: 30000 // 30 seconds - much shorter!
        },
        [EndpointType.ACHIEVEMENTS]: {
            timeout: 8000,
            retryCount: 2,
            cacheTTL: 60000 // 1 minute
        },
        [EndpointType.VALUES]: {
            timeout: 8000,
            retryCount: 2,
            cacheTTL: 60000 // 1 minute
        },
        [EndpointType.HOBBIES]: {
            timeout: 8000,
            retryCount: 2,
            cacheTTL: 60000 // 1 minute
        },
        [EndpointType.FUTURE_GOALS]: {
            timeout: 8000,
            retryCount: 3,
            cacheTTL: 30000 // 30 seconds
        },
        [EndpointType.INTERESTS]: {
            timeout: 8000,
            retryCount: 2,
            cacheTTL: 60000 // 1 minute
        },
        [EndpointType.PERSONALITY_TRAITS]: {
            timeout: 8000,
            retryCount: 2,
            cacheTTL: 60000 // 1 minute
        },
        [EndpointType.KEY_STATS]: {
            timeout: 10000,
            retryCount: 3,
            cacheTTL: 30000 // 30 seconds
        },
        [EndpointType.CERTIFICATES]: {
            timeout: 12000,
            retryCount: 2,
            cacheTTL: 120000 // 2 minutes
        },
        [EndpointType.CERTIFICATE_STATS]: {
            timeout: 10000,
            retryCount: 3,
            cacheTTL: 60000 // 1 minute
        },
        [EndpointType.CERTIFICATE_CATEGORIES]: {
            timeout: 8000,
            retryCount: 2,
            cacheTTL: 120000 // 2 minutes
        },
        [EndpointType.CONTACT_INFO]: {
            timeout: 8000,
            retryCount: 3,
            cacheTTL: 300000 // 5 minutes (more stable)
        },
        [EndpointType.CONTACT_LOCATION]: {
            timeout: 8000,
            retryCount: 2,
            cacheTTL: 300000 // 5 minutes (more stable)
        },
        [EndpointType.VOLUNTEER_EXPERIENCES]: {
            timeout: 10000,
            retryCount: 2,
            cacheTTL: 120000 // 2 minutes
        },
        [EndpointType.VOLUNTEER_SKILLS]: {
            timeout: 8000,
            retryCount: 2,
            cacheTTL: 120000 // 2 minutes
        },
        [EndpointType.VOLUNTEER_STATS]: {
            timeout: 8000,
            retryCount: 3,
            cacheTTL: 60000 // 1 minute
        },
        [EndpointType.EDUCATION]: {
            timeout: 8000,
            retryCount: 2,
            cacheTTL: 120000 // 2 minutes
        },
        [EndpointType.CURRENT_LEARNING]: {
            timeout: 8000,
            retryCount: 3,
            cacheTTL: 30000 // 30 seconds (frequently updated)
        },
        [EndpointType.LEARNING_MILESTONES]: {
            timeout: 8000,
            retryCount: 2,
            cacheTTL: 120000 // 2 minutes
        },
        [EndpointType.LEARNING_PROGRESS]: {
            timeout: 8000,
            retryCount: 3,
            cacheTTL: 30000 // 30 seconds (frequently updated)
        },
        [EndpointType.EDUCATION_STATS]: {
            timeout: 10000,
            retryCount: 3,
            cacheTTL: 60000 // 1 minute
        },
        [EndpointType.ACADEMIC_PROJECTS]: {
            timeout: 10000,
            retryCount: 2,
            cacheTTL: 120000 // 2 minutes
        },
        [EndpointType.TIMELINE_ITEMS]: {
            timeout: 10000,
            retryCount: 2,
            cacheTTL: 120000 // 2 minutes
        },
        [EndpointType.TIMELINE_MILESTONES]: {
            timeout: 10000,
            retryCount: 2,
            cacheTTL: 120000 // 2 minutes
        },
        [EndpointType.TIMELINE_STATS]: {
            timeout: 10000,
            retryCount: 2,
            cacheTTL: 60000 // 1 minute
        },
        [EndpointType.SKILLS]: {
            timeout: 10000,
            retryCount: 2,
            cacheTTL: 120000 // 2 minutes
        },
        [EndpointType.SKILLS_CATEGORIES]: {
            timeout: 10000,
            retryCount: 2,
            cacheTTL: 120000 // 2 minutes
        },
        [EndpointType.SKILLS_STATS]: {
            timeout: 10000,
            retryCount: 2,
            cacheTTL: 60000 // 1 minute
        },
        [EndpointType.TOP_SKILLS]: {
            timeout: 10000,
            retryCount: 2,
            cacheTTL: 120000 // 2 minutes
        },
        [EndpointType.FEATURED_SKILLS]: {
            timeout: 10000,
            retryCount: 2,
            cacheTTL: 120000 // 2 minutes
        },
        [EndpointType.TECHNOLOGIES]: {
            timeout: 20000,
            retryCount: 2,
            cacheTTL: 120000 // 2 minutes
        },
        [EndpointType.TECHNOLOGIES_CATEGORIES]: {
            timeout: 10000,
            retryCount: 2,
            cacheTTL: 120000 // 2 minutes
        },
        [EndpointType.TECHNOLOGIES_STATS]: {
            timeout: 10000,
            retryCount: 2,
            cacheTTL: 60000 // 1 minute
        },
        [EndpointType.PROJECTS]: {
            timeout: 10000,
            retryCount: 2,
            cacheTTL: 60000 // 1 minute
        },
        [EndpointType.PROJECT_DETAIL]: {
            timeout: 10000,
            retryCount: 2,
            cacheTTL: 60000 // 1 minute
        },
        [EndpointType.PROJECT_EXPERIENCE]: {
            timeout: 10000,
            retryCount: 2,
            cacheTTL: 60000 // 1 minute
        },
        [EndpointType.PROJECT_STATS]: {
            timeout: 10000,
            retryCount: 2,
            cacheTTL: 60000 // 1 minute
        },
        [EndpointType.TOP_TECHNOLOGIES]: {
            timeout: 20000,
            retryCount: 2,
            cacheTTL: 60000 // 1 minute
        },
        [EndpointType.CATEGORY_DISTRIBUTION]: {
            timeout: 10000,
            retryCount: 2,
            cacheTTL: 60000 // 1 minute
        },
        [EndpointType.FEATURED_PROJECTS]: {
            timeout: 10000,
            retryCount: 2,
            cacheTTL: 60000 // 1 minute
        },

    };

    constructor(
        protected http: HttpClient,
        @Inject(PLATFORM_ID) protected platformId: Object,
        protected router?: Router // 🔥 INJECT ROUTER FOR ROUTE AWARENESS
    ) {
        this.isBrowser = isPlatformBrowser(this.platformId);
        this.initializeService();
        this.setupRouteAwareness(); // 🔥 NEW: Setup route monitoring
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
        this.cache.clear();
        this.loadingStates.forEach(state => state.complete());
        this.loadingStates.clear();
    }

    // ========================
    // 🔥 ROUTE AWARENESS SETUP
    // ========================

    private setupRouteAwareness(): void {
        if (!this.router || !this.isBrowser) return;

        // Listen for route changes
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd),
            takeUntil(this.destroy$)
        ).subscribe((event: NavigationEnd) => {
            const newRoute = event.url;

            if (this.currentRoute !== newRoute) {
                this.log(`🔄 Route changed: ${this.currentRoute} → ${newRoute}`, 'info');
                this.handleRouteChange(this.currentRoute, newRoute);
                this.currentRoute = newRoute;
                this.updateRouteContext(newRoute);
            }
        });
    }

    private updateRouteContext(route: string): void {
        // Extract route context (page type)
        if (route.includes('/contact')) {
            this.routeContext = 'contact';
        } else if (route.includes('/projects')) {
            this.routeContext = 'projects';
        } else if (route.includes('/skills')) {
            this.routeContext = 'skills';
        } else if (route.includes('/about')) {
            this.routeContext = 'about';
        } else if (route === '' || route === '/') {
            this.routeContext = 'home';
        } else {
            this.routeContext = 'other';
        }

        this.log(`📍 Route context updated: ${this.routeContext}`);
    }


    private shouldClearCacheOnRouteChange(oldRoute: string, newRoute: string): boolean {
        const oldContext = this.extractRouteContext(oldRoute);
        const newContext = this.extractRouteContext(newRoute);

        // ALWAYS clear cache when routes change (except same route)
        if (oldContext !== newContext) {
            this.log(`🔄 Cache clear required: ${oldContext} → ${newContext}`);
            return true;
        }

        // Don't clear for same route
        return false;
    }

    private handleRouteChange(oldRoute: string, newRoute: string): void {
        // FORCE clear cache on route change
        if (this.shouldClearCacheOnRouteChange(oldRoute, newRoute)) {
            this.log(`🧹 Clearing ALL cache due to route change: ${oldRoute} → ${newRoute}`);
            this.cache.clear(); // Clear ALL cache, not just specific endpoint

            // Also clear loading states to force fresh requests
            this.loadingStates.forEach(state => state.next(false));
        }
    }

    // Also add this method to force fresh data on route changes
    public forceRefreshOnRouteChange(): void {
        this.log(`💨 ${this.serviceName}: Forcing fresh data due to route change`);
        this.cache.clear();
        this.loadingStates.forEach(state => state.next(false));
    }
    private extractRouteContext(route: string): string {
        if (route.includes('/contact')) return 'contact';
        if (route.includes('/projects')) return 'projects';
        if (route.includes('/skills')) return 'skills';
        if (route.includes('/about')) return 'about';
        if (route === '' || route === '/') return 'home';
        return 'other';
    }

    // ========================
    // 🔥 UPDATED: ROUTE-AWARE CACHE METHODS
    // ========================

    /**
     * Generate route-aware cache key
     */
    private getRouteAwareCacheKey(endpoint: EndpointType): string {
        // Include route context in cache key to prevent cross-contamination
        return `${this.routeContext}:${endpoint}`;
    }

    /**
     * Invalidate cache for specific endpoint or all cache
     */
    invalidateCache(endpoint?: EndpointType): void {
        if (endpoint) {
            // Clear specific endpoint for current route
            const routeAwareKey = this.getRouteAwareCacheKey(endpoint);
            this.cache.delete(routeAwareKey);

            // Also clear the generic key (for backward compatibility)
            this.cache.delete(endpoint);

            this.log(`🗑️ Cache invalidated for ${endpoint} (route: ${this.routeContext})`);
        } else {
            // Clear all cache
            const keysBeforeClear = this.cache.size;
            this.cache.clear();
            this.log(`🗑️ All ${this.serviceName} cache invalidated (${keysBeforeClear} entries cleared)`);
        }
    }

    /**
     * Clear cache for specific route context
     */
    invalidateCacheForRoute(routeContext: string): void {
        const keysToDelete: string[] = [];

        this.cache.forEach((_, key) => {
            if (key.startsWith(`${routeContext}:`)) {
                keysToDelete.push(key);
            }
        });

        keysToDelete.forEach(key => this.cache.delete(key));

        if (keysToDelete.length > 0) {
            this.log(`🗑️ Cache cleared for route ${routeContext}: ${keysToDelete.length} entries`);
        }
    }

    /**
     * Force fresh data fetch (bypass all cache)
     */
    forceFreshData(): void {
        this.log(`💨 ${this.serviceName}: Forcing fresh data fetch`);
        this.invalidateCache();
    }

    // ========================
    // 🔥ROUTE-AWARE REQUEST METHOD
    // ========================

    /**
     * Centralized request method with route-aware caching
     */
    protected makeRequest<T>(
        endpoint: EndpointType,
        url: string,
        fallbackData?: T,
        forceRefresh: boolean = false
    ): Observable<T> {
        const config = this.requestConfigs[endpoint];
        if (!config) {
            throw new Error(`No configuration found for endpoint: ${endpoint}`);
        }

        // 🔥 Use route-aware cache key
        const cacheKey = this.getRouteAwareCacheKey(endpoint);


        this.setLoadingState(endpoint, true);

        // 🔥 Check cache (with route awareness)
        if (!forceRefresh && this.cache.has(cacheKey) && !config.bypassCache) {
            const cached = this.cache.get(cacheKey)!;
            if (this.isCacheValid(cached)) {
                this.setLoadingState(endpoint, false);
                this.log(`📦 Cache hit for ${endpoint} (route: ${this.routeContext})`);
                return cached.data;
            } else {
                this.cache.delete(cacheKey);
                this.log(`⏰ Cache expired for ${endpoint} (route: ${this.routeContext})`);
            }
        }

        if (forceRefresh) {
            this.log(`💨 Force refresh for ${endpoint} (route: ${this.routeContext})`);
        }

        // 🔥 Add route context to headers
        const headers = this.getOptimizedHeaders().set('X-Route-Context', this.routeContext);


        const request$ = this.http.get<T>(url, { headers }).pipe(
            timeout(config.timeout),
            retry({
                count: config.retryCount,
                delay: (error, retryCount) => {
                    const delay = Math.min(1000 * Math.pow(2, retryCount), 15000);
                    this.log(`🔄 Retrying ${endpoint} in ${delay}ms (attempt ${retryCount + 1}) [route: ${this.routeContext}]`);
                    return timer(delay);
                }
            }),
            map(data => {
                this.log(`✅ Data loaded for ${endpoint} (route: ${this.routeContext})`);
                return this.validateAndTransformData<T>(data, endpoint);
            }),
            shareReplay(1),
            finalize(() => this.setLoadingState(endpoint, false)),
            catchError(error => {
                this.log(`❌ Error loading ${endpoint} (route: ${this.routeContext}): ${error.message}`, 'error');
                return this.handleError<T>(`${endpoint}`, fallbackData)(error);
            })
        );

        // 🔥 Cache request with route-aware key
        const cacheEntry: CacheEntry<T> = {
            data: request$,
            timestamp: Date.now(),
            ttl: config.cacheTTL || this.cacheConfig.defaultTTL
        };

        this.cache.set(cacheKey, cacheEntry);
        this.maintainCacheSize();

        return request$;
    }

    /**
     * 🔥 Method for forcing fresh data
     */
    protected makeRequestFresh<T>(
        endpoint: EndpointType,
        url: string,
        fallbackData?: T
    ): Observable<T> {
        return this.makeRequest(endpoint, url, fallbackData, true);
    }

    // ========================
    // UTILITY METHODS (UPDATED)
    // ========================

    /**
     * Stats for the cache
     */
    getCacheStats(): {
        size: number;
        keys: string[];
        routeKeys: string[];
        currentRoute: string;
        totalMemoryUsed: number;
        hitRate: number;
        oldestEntry: string | null;
    } {
        const now = Date.now();
        let oldestTimestamp = now;
        let oldestKey: string | null = null;

        const routeKeys = Array.from(this.cache.keys()).filter(key =>
            key.startsWith(`${this.routeContext}:`)
        );

        this.cache.forEach((entry, key) => {
            if (entry.timestamp < oldestTimestamp) {
                oldestTimestamp = entry.timestamp;
                oldestKey = key;
            }
        });

        return {
            size: this.cache.size,
            keys: Array.from(this.cache.keys()),
            routeKeys,
            currentRoute: this.routeContext,
            totalMemoryUsed: this.estimateCacheSize(),
            hitRate: this.calculateHitRate(),
            oldestEntry: oldestKey
        };
    }

    // ========================
    // ABSTRACT METHODS (UNCHANGED)
    // ========================

    abstract warmupCache(): void;
    protected abstract prefetchEssentialData(): void;
    protected abstract validateAndTransformData<T>(data: any, endpoint: EndpointType): T;

    // ========================
    // PROTECTED METHODS (MOSTLY UNCHANGED)
    // ========================

    protected setLoadingState(endpoint: EndpointType, isLoading: boolean): void {
        if (!this.loadingStates.has(endpoint)) {
            this.loadingStates.set(endpoint, new BehaviorSubject<boolean>(false));
        }
        this.loadingStates.get(endpoint)!.next(isLoading);
    }

    protected isCacheValid(entry: CacheEntry<any>): boolean {
        return (Date.now() - entry.timestamp) < entry.ttl;
    }

    protected validateNumber(value: any, defaultValue: number): number {
        const num = Number(value);
        return isNaN(num) || num < 0 ? defaultValue : num;
    }

    protected sanitizeUrl(url?: string): string | undefined {
        if (!url) return undefined;

        try {
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                url = 'https://' + url;
            }

            new URL(url);
            return url;
        } catch {
            if (url.startsWith('/')) {
                return environment.api.baseUrl + url;
            }
            return undefined;
        }
    }

    isLoading(endpoint: EndpointType): Observable<boolean> {
        if (!this.loadingStates.has(endpoint)) {
            this.loadingStates.set(endpoint, new BehaviorSubject<boolean>(false));
        }
        return this.loadingStates.get(endpoint)!.asObservable().pipe(
            distinctUntilChanged()
        );
    }

    // ========================
    // PRIVATE METHODS (MOSTLY UNCHANGED)
    // ========================

    private initializeService(): void {
        // Periodical cleanup cache
        if (this.isBrowser) {
            const cleanupInterval = this.cacheConfig?.cleanupInterval || 180000;
            timer(0, cleanupInterval)
                .pipe(takeUntil(this.destroy$))
                .subscribe(() => this.cleanupExpiredCache());
        }
    }

    private cleanupExpiredCache(): void {
        const now = Date.now();
        const keysToDelete: string[] = [];

        this.cache.forEach((entry, key) => {
            if (!this.isCacheValid(entry)) {
                keysToDelete.push(key);
            }
        });

        keysToDelete.forEach(key => {
            this.cache.delete(key);
        });

        if (keysToDelete.length > 0) {
            this.log(`🧹 Cleaned up ${keysToDelete.length} expired ${this.serviceName} cache entries`);
        }
    }

    private maintainCacheSize(): void {
        if (this.cache.size <= this.cacheConfig.maxCacheSize) return;

        const entries = Array.from(this.cache.entries())
            .sort(([, a], [, b]) => a.timestamp - b.timestamp);

        const toDelete = entries.slice(0, this.cache.size - this.cacheConfig.maxCacheSize);
        toDelete.forEach(([key]) => this.cache.delete(key));

        this.log(`📏 ${this.serviceName} cache size maintained: removed ${toDelete.length} old entries`);
    }

    private estimateCacheSize(): number {
        const avgEntrySize = this.cacheConfig.avgEntrySize || 1024;
        return this.cache.size * avgEntrySize;
    }

    private calculateHitRate(): number {
        const baseHitRate = this.cacheConfig.expectedHitRate || 0.85;
        return this.cache.size > 0 ? baseHitRate : 0;
    }

    private getOptimizedHeaders(): HttpHeaders {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });

        if (this.isBrowser) {
            headers = headers.set('Accept-Encoding', 'gzip, deflate, br');

            if ('connection' in navigator && (navigator as any).connection) {
                const connection = (navigator as any).connection;
                headers = headers.set('Save-Data', connection.saveData ? '1' : '0');
            }
        } else {
            const cacheMaxAge = Math.floor((this.cacheConfig.defaultTTL || 300000) / 1000);
            headers = headers.set('Cache-Control', `public, max-age=${cacheMaxAge}`);
            headers = headers.set('X-Requested-With', 'Angular-SSR');
            headers = headers.set('X-Service', this.serviceName);
        }

        return headers;
    }

    private handleError<T>(operation = 'operation', result?: T) {
        return (error: HttpErrorResponse): Observable<T> => {
            let errorMessage = '';
            let shouldRetry = false;

            if (error.error instanceof ErrorEvent) {
                errorMessage = `Client error: ${error.error.message}`;
            } else {
                errorMessage = `Server error: ${error.status} - ${error.message}`;
                shouldRetry = error.status >= 500 || error.status === 0;
            }

            const logData = {
                service: this.serviceName,
                operation,
                error: errorMessage,
                status: error.status,
                url: error.url,
                route: this.routeContext, // 🔥 Include route context in error logs
                shouldRetry,
                timestamp: new Date().toISOString()
            };

            if (this.isBrowser) {
                console.error(`${this.serviceName} Error:`, logData);
            } else {
                console.error(`[SSR] ${this.serviceName} Error:`, JSON.stringify(logData));
            }


            return of(result as T);
        };
    }


    protected log(message: string, level: 'info' | 'warn' | 'error' = 'info'): void {
        const prefix = this.isBrowser ? this.serviceName : `${this.serviceName}[SSR]`;
        const timestamp = new Date().toISOString();
        const routeInfo = this.routeContext ? ` [${this.routeContext}]` : '';
        const logMessage = `[${timestamp}] ${prefix}${routeInfo}: ${message}`;

        switch (level) {
            case 'warn':
                console.warn(logMessage);
                break;
            case 'error':
                console.error(logMessage);
                break;
            default:
                if (!environment.production) {
                    console.log(logMessage);
                }
        }
    }
}