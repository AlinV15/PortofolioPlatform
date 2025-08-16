import { Observable } from "rxjs";

export interface CacheEntry<T> {
    data: Observable<T>;
    timestamp: number;
    ttl: number;
}

export interface CacheConfig {
    defaultTTL: number;
    maxCacheSize: number;
    enablePrefetch: boolean;
    cleanupInterval?: number,    // opțional - 3 min default
    prefetchDelay?: number,      // opțional - 2s default
    avgEntrySize?: number,       // opțional - 1KB default
    expectedHitRate?: number
}

export interface RequestConfig {
    timeout: number;
    retryCount: number;
    cacheTTL?: number;
    bypassCache?: boolean;
}