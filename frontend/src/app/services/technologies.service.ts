import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { GlobalService } from './global.service';
import { CacheConfig } from '../shared/models/request.interface';
import { EndpointType } from '../shared/enums/EndpointType';

import { TechCategory, Technology, TechStats } from '../shared/models/technology.interface';


@Injectable({
    providedIn: 'root'
})
export class TechnologiesService extends GlobalService {
    protected readonly serviceName = 'TechnologiesService';
    protected readonly serviceApiUrl = `${this.apiUrl}/core-technologies`;


    // Cache configuration for Technologies
    protected readonly cacheConfig: CacheConfig = {
        defaultTTL: 600000,
        maxCacheSize: 15,
        enablePrefetch: true,
        cleanupInterval: 240000,
        prefetchDelay: 3000,
        avgEntrySize: 1536,
        expectedHitRate: 0.88
    };

    constructor(
        http: HttpClient,
        @Inject(PLATFORM_ID) platformId: Object
    ) {
        super(http, platformId);
    }

    // ========================
    // PUBLIC API METHODS
    // ========================

    /**
     * Get all technologies
     * 
     *      
     * */
    getAllTechnologies(): Observable<Technology[]> {
        return this.makeRequest<Technology[]>(
            EndpointType.TECHNOLOGIES,
            `${this.serviceApiUrl}`
        );
    }

    /**
     * Get tech categories
     */
    getTechCategories(): Observable<TechCategory[]> {
        return this.makeRequest<TechCategory[]>(
            EndpointType.TOP_SKILLS,
            `${this.apiUrl}/tech-categories`
        );
    }



    /**
     * Get tech statistics
     */
    getTechStats(): Observable<TechStats> {
        const defaultStats: TechStats = {
            totalTechnologies: 20,
            trendingCount: 14,
            averagePopularityScore: 85.05,
            categoryDistribution: {
                distribution: new Map<string, number>([
                    ['Tools & Platforms', 6],
                    ['Databases', 3],
                    ['Programming Languages', 5],
                    ['Frameworks & Libraries', 6]
                ])
            },
            recentlyReleasedCount: 0,
            mostPopularCategory: "Tools & Platforms",
            trendingPercentage: 70.0
        };

        return this.makeRequest<TechStats>(
            EndpointType.TECHNOLOGIES_STATS,
            `${this.apiUrl}/tech-stats`,
            defaultStats
        );
    }



    /**
     * Refresh all data
     */
    refreshAllTechData(): Observable<{
        technologies: Technology[];
        technologiesCategories: TechCategory[];
        techStats: TechStats;

    }> {
        this.invalidateCache();

        return forkJoin({
            technologies: this.getAllTechnologies().pipe(
                catchError(error => {
                    this.log(`Failed to refresh technologies: ${error.message}`, 'warn');
                    return of([]);
                })
            ),

            technologiesCategories: this.getTechCategories().pipe(
                catchError(error => {
                    this.log(`Failed to refresh tech categories: ${error.message}`, 'warn');
                    return of([]);
                })
            ),
            techStats: this.getTechStats().pipe(
                catchError(error => {
                    this.log(`Failed to refresh tech stats: ${error.message}`, 'warn');
                    return of({
                        totalTechnologies: 20,
                        trendingCount: 14,
                        averagePopularityScore: 85.05,
                        categoryDistribution: {
                            distribution: new Map<string, number>([
                                ['Tools & Platforms', 6],
                                ['Databases', 3],
                                ['Programming Languages', 5],
                                ['Frameworks & Libraries', 6]
                            ])
                        },
                        recentlyReleasedCount: 0,
                        mostPopularCategory: "Tools & Platforms",
                        trendingPercentage: 70.0
                    });
                })
            )
        }).pipe(
            tap(data => {
                const totalItems = Object.values(data).reduce((acc, curr) => {
                    return acc + (Array.isArray(curr) ? curr.length : 1);
                }, 0);
                this.log(`Successfully refreshed all tech data: ${totalItems} total items loaded`);
            }),
            catchError(error => {
                this.log(`Critical error during refresh tech data: ${error.message}`, 'error');
                return of({
                    technologies: [],
                    technologiesCategories: [],
                    techStats: {
                        totalTechnologies: 20,
                        trendingCount: 14,
                        averagePopularityScore: 85.05,
                        categoryDistribution: {
                            distribution: new Map<string, number>([
                                ['Tools & Platforms', 6],
                                ['Databases', 3],
                                ['Programming Languages', 5],
                                ['Frameworks & Libraries', 6]
                            ])
                        },
                        recentlyReleasedCount: 0,
                        mostPopularCategory: "Tools & Platforms",
                        trendingPercentage: 70.0
                    }

                });
            })
        );
    }

    // ========================
    // UTILITY METHODS SPECIFICE EDUCATION
    // ========================



    // ========================
    // ABSTRACT METHODS IMPLEMENTATION
    // ========================

    /**
     * Warmup cache with essential data (SSR optimized)
     */
    warmupCache(): void {
        if (!this.isBrowser) {
            this.prefetchEssentialData();
        }
    }

    /**
     * Prefetch for essential tech data
     */
    protected prefetchEssentialData(): void {
        if (!this.cacheConfig.enablePrefetch) return;

        const essentialEndpoints = [
            EndpointType.TECHNOLOGIES,
            EndpointType.TECHNOLOGIES_STATS,
            EndpointType.TECHNOLOGIES_CATEGORIES
        ];

        essentialEndpoints.forEach(endpoint => {
            switch (endpoint) {
                case EndpointType.SKILLS:
                    this.getAllTechnologies().subscribe();
                    break;
                case EndpointType.SKILLS_STATS:
                    this.getTechStats().subscribe();
                    break;
                case EndpointType.SKILLS_CATEGORIES:
                    this.getTechCategories().subscribe();
                    break;
            }
        });

        this.log('Essential technologies data prefetch initiated');
    }

    /**
     * validate and transform all tech data
     */
    protected validateAndTransformData<T>(data: any, endpoint: EndpointType): T {
        if (!data) {
            throw new Error(`No data received for ${endpoint}`);
        }

        // Validări specifice per endpoint
        switch (endpoint) {
            case EndpointType.TECHNOLOGIES_STATS:
                return this.validateTechStats(data) as T;
            case EndpointType.TECHNOLOGIES_CATEGORIES:
                return this.validateTechCategories(data) as T;
            case EndpointType.TECHNOLOGIES:
                return this.validateTechnologies(data) as T;
            default:
                return Array.isArray(data) ? data.filter(item => item && item.id) as T : data;
        }
    }

    // ========================
    // PRIVATE VALIDATION METHODS
    // ========================

    private validateTechStats(data: any): TechStats {
        const defaults: TechStats = {
            totalTechnologies: 20,
            trendingCount: 14,
            averagePopularityScore: 85.05,
            categoryDistribution: {
                distribution: new Map<string, number>([
                    ['Tools & Platforms', 6],
                    ['Databases', 3],
                    ['Programming Languages', 5],
                    ['Frameworks & Libraries', 6]
                ])
            },
            recentlyReleasedCount: 0,
            mostPopularCategory: "Tools & Platforms",
            trendingPercentage: 70.0
        };

        return {
            totalTechnologies: this.validateNumber(data.totalTechnologies, defaults.totalTechnologies),
            trendingCount: this.validateNumber(data.trendingCount, defaults.trendingCount),
            averagePopularityScore: this.validateNumber(data.averagePopularityScore, defaults.averagePopularityScore),
            categoryDistribution: data.categoryDistribution || defaults.categoryDistribution,
            recentlyReleasedCount: this.validateNumber(data.recentlyReleasedCount, defaults.recentlyReleasedCount),
            mostPopularCategory: data.mostPopularCategory || defaults.mostPopularCategory,
            trendingPercentage: this.validateNumber(data.trendingPercentage, defaults.trendingPercentage),
        };
    }

    private validateTechnologies(data: any[]): Technology[] {
        if (!Array.isArray(data)) return [];

        return data.filter(item =>
            item &&
            item.id &&
            item.name &&
            typeof item.level === 'number' &&
            item.level >= 0 &&
            item.level <= 100 &&
            typeof item.yearsOfExperience === 'number' &&
            item.yearsOfExperience >= 0 &&
            item.yearsOfExperience <= 100
        ).map(item => ({
            ...item,
            level: Math.max(0, Math.min(100, Number(item.level))),
            yearsOfExperience: Math.max(0, Number(item.yearsOfExperience))
        }));
    }


    private validateTechCategories(data: any[]): TechCategory[] {
        if (!Array.isArray(data)) return [];

        return data.filter(item =>
            item &&
            item.name
        ).map(item => ({
            ...item
        }));
    }

}