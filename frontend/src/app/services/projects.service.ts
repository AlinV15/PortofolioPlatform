import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { GlobalService } from './global.service';
import { CacheConfig } from '../shared/models/request.interface';
import { EndpointType } from '../shared/enums/EndpointType';
import {
    FeaturedProject,
    Project,
    ProjectCategoryDistribution,
    ProjectExperience,
    ProjectsStats
} from '../shared/models/project.interface';

@Injectable({
    providedIn: 'root'
})
export class ProjectService extends GlobalService {
    protected readonly serviceName = 'ProjectService';
    protected readonly serviceApiUrl = `${this.apiUrl}/projects`;

    // Cache configuration specific to Projects
    protected override readonly cacheConfig: CacheConfig = {
        defaultTTL: 600000,
        maxCacheSize: 20,
        enablePrefetch: true,
        cleanupInterval: 180000,
        prefetchDelay: 2000,
        avgEntrySize: 3072,
        expectedHitRate: 0.82
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
     * Get all projects
     */
    getAllProjects(): Observable<Project[]> {
        return this.makeRequest<Project[]>(
            EndpointType.PROJECTS,
            this.serviceApiUrl
        );
    }

    /**
     * Get featured projects
     */
    getFeaturedProjects(): Observable<FeaturedProject[]> {
        return this.makeRequest<FeaturedProject[]>(
            EndpointType.FEATURED_PROJECTS,
            `${this.apiUrl}/featured-projects`
        );
    }

    /**
     * Get project statistics
     */
    getProjectStats(): Observable<ProjectsStats> {
        const defaultStats: ProjectsStats = {
            technologies: 0,
            totalProjects: 0,
            liveProjects: 0
        };

        return this.makeRequest<ProjectsStats>(
            EndpointType.PROJECT_STATS,
            `${this.apiUrl}/project-stats`,
            defaultStats
        );
    }

    /**
     * Get top technologies
     */
    getTopTechnologies(): Observable<string[]> {
        return this.makeRequest<string[]>(
            EndpointType.TOP_TECHNOLOGIES,
            `${this.serviceApiUrl}/top-technologies`
        );
    }

    /**
     * Get category distribution
     */
    getCategoryDistribution(): Observable<ProjectCategoryDistribution[]> {
        console.log(this.serviceApiUrl + "/category-distribution")
        return this.makeRequest<ProjectCategoryDistribution[]>(
            EndpointType.CATEGORY_DISTRIBUTION,
            `${this.serviceApiUrl}/category-distribution`,
            [],
            true
        ).pipe(
            tap(data => console.log('Raw category data:', data)),
            catchError(error => {
                console.error('Category distribution error:', error);
                return of([]);
            })
        );
    }

    /**
     * Get project experience data
     */
    getProjectsExperience(): Observable<ProjectExperience> {
        const defaultExperience: ProjectExperience = {
            yearsActive: 0,
            firstProjectYear: 0,
            latestProjectYear: 0,
            avgComplexity: '',
            avgComplexityLabel: '',
            successRate: 0,
            formattedSuccessRate: '',
            deployedProjects: 0,
            totalProjects: 0,
            liveProjects: 0,
            experienceLevel: ''
        };

        return this.makeRequest<ProjectExperience>(
            EndpointType.PROJECT_EXPERIENCE,
            `${this.serviceApiUrl}/experience`,
            defaultExperience
        );
    }

    /**
     * Refresh all project data
     */
    refreshAllProjectData(): Observable<{
        projects: Project[];
        featuredProjects: FeaturedProject[];
        projectStats: ProjectsStats;
        categories: ProjectCategoryDistribution[];
        technologies: string[];
        projectExperience: ProjectExperience;
    }> {
        this.invalidateCache();


        return forkJoin({
            projects: this.getAllProjects().pipe(
                catchError(error => {
                    this.log(`Failed to refresh projects: ${error.message}`, 'warn');
                    return of([]);
                })
            ),
            featuredProjects: this.getFeaturedProjects().pipe(
                catchError(error => {
                    this.log(`Failed to refresh featured projects: ${error.message}`, 'warn');
                    return of([]);
                })
            ),
            projectStats: this.getProjectStats().pipe(
                catchError(error => {
                    this.log(`Failed to refresh project stats: ${error.message}`, 'warn');
                    return of({ technologies: 0, totalProjects: 0, liveProjects: 0 });
                })
            ),
            categories: this.getCategoryDistribution().pipe(
                catchError(error => {
                    this.log(`Failed to refresh categories: ${error.message}`, 'warn');
                    return of([]);
                })
            ),
            technologies: this.getTopTechnologies().pipe(
                catchError(error => {
                    this.log(`Failed to refresh technologies: ${error.message}`, 'warn');
                    return of([]);
                })
            ),
            projectExperience: this.getProjectsExperience().pipe(
                catchError(error => {
                    this.log(`Failed to refresh experience: ${error.message}`, 'warn');
                    return of({
                        yearsActive: 0,
                        firstProjectYear: 0,
                        latestProjectYear: 0,
                        avgComplexity: '',
                        avgComplexityLabel: '',
                        successRate: 0,
                        formattedSuccessRate: '',
                        deployedProjects: 0,
                        totalProjects: 0,
                        liveProjects: 0,
                        experienceLevel: ''
                    });
                })
            )
        }).pipe(
            tap(data => {
                const totalItems = Object.values(data).reduce((acc, curr) => {
                    return acc + (Array.isArray(curr) ? curr.length : 1);
                }, 0);
                this.log(`Successfully refreshed all project data: ${totalItems} total items loaded`);
            }),
            catchError(error => {
                this.log(`Critical error during refresh project data: ${error.message}`, 'error');
                return of({
                    projects: [],
                    featuredProjects: [],
                    projectStats: { technologies: 0, totalProjects: 0, liveProjects: 0 },
                    categories: [],
                    technologies: [],
                    projectExperience: {
                        yearsActive: 0,
                        firstProjectYear: 0,
                        latestProjectYear: 0,
                        avgComplexity: '',
                        avgComplexityLabel: '',
                        successRate: 0,
                        formattedSuccessRate: '',
                        deployedProjects: 0,
                        totalProjects: 0,
                        liveProjects: 0,
                        experienceLevel: ''
                    }
                });
            })
        );
    }

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
     * Prefetch essential project data
     */
    protected prefetchEssentialData(): void {
        if (!this.cacheConfig.enablePrefetch) return;

        const essentialEndpoints = [
            EndpointType.PROJECTS,
            EndpointType.PROJECT_STATS,
            EndpointType.FEATURED_PROJECTS
        ];

        essentialEndpoints.forEach(endpoint => {
            switch (endpoint) {
                case EndpointType.PROJECTS:
                    this.getAllProjects().subscribe();
                    break;
                case EndpointType.PROJECT_STATS:
                    this.getProjectStats().subscribe();
                    break;
                case EndpointType.FEATURED_PROJECTS:
                    this.getFeaturedProjects().subscribe();
                    break;
            }
        });

        this.log('Essential project data prefetch initiated');
    }

    /**
     * Validate and transform project data
     */
    protected validateAndTransformData<T>(data: any, endpoint: EndpointType): T {
        if (!data) {
            throw new Error(`No data received for ${endpoint}`);
        }


        // Validations specific per endpoint
        switch (endpoint) {
            case EndpointType.PROJECTS:
                return this.validateProjects(data) as T;
            case EndpointType.FEATURED_PROJECTS:
                return this.validateFeaturedProjects(data) as T;
            case EndpointType.PROJECT_STATS:
                return this.validateProjectStats(data) as T;
            case EndpointType.PROJECT_EXPERIENCE:
                return this.validateProjectExperience(data) as T;
            case EndpointType.TOP_TECHNOLOGIES:
                return this.validateTopTechnologies(data) as T;
            case EndpointType.CATEGORY_DISTRIBUTION:
                return this.validateCategoryDistribution(data) as T;
            default:
                return Array.isArray(data) ? data.filter(item => item && item.id) as T : data;
        }
    }

    // ========================
    // PRIVATE VALIDATION METHODS
    // ========================

    private validateProjects(data: any[]): Project[] {
        if (!Array.isArray(data)) return [];

        return data.filter(item =>
            item &&
            item.id &&
            item.title
        ).map(item => ({
            ...item,
            // Ensure required fields exist
            id: item.id || '',
            title: item.title || 'Untitled Project',
            description: item.description || '',
            technologies: Array.isArray(item.technologies) ? item.technologies : [],
            category: item.category || 'other',
            status: item.status || 'completed',
            // Ensure URLs are valid
            demoUrl: this.sanitizeUrl(item.demoUrl),
            githubUrl: this.sanitizeUrl(item.githubUrl) || '',
            // Process images for SSR
            images: Array.isArray(item.images) ? item.images : []
        }));
    }

    private validateFeaturedProjects(data: any[]): FeaturedProject[] {
        if (!Array.isArray(data)) return [];

        return data.filter(item =>
            item &&
            item.id &&
            item.title
        ).map(item => ({
            ...item,
            title: item.title || 'Untitled Project',
            description: item.description || '',
            technologies: Array.isArray(item.technologies) ? item.technologies : [],
            demoUrl: this.sanitizeUrl(item.demoUrl),
            githubUrl: this.sanitizeUrl(item.githubUrl)
        }));
    }

    private validateProjectStats(data: any): ProjectsStats {
        const defaults: ProjectsStats = {
            technologies: 0,
            totalProjects: 0,
            liveProjects: 0
        };

        return {
            technologies: this.validateNumber(data.technologies, defaults.technologies),
            totalProjects: this.validateNumber(data.totalProjects, defaults.totalProjects),
            liveProjects: this.validateNumber(data.liveProjects, defaults.liveProjects)
        };
    }

    private validateProjectExperience(data: any): ProjectExperience {
        const defaults: ProjectExperience = {
            yearsActive: 0,
            firstProjectYear: 0,
            latestProjectYear: 0,
            avgComplexity: '',
            avgComplexityLabel: '',
            successRate: 0,
            formattedSuccessRate: '',
            deployedProjects: 0,
            totalProjects: 0,
            liveProjects: 0,
            experienceLevel: ''
        };

        return {
            yearsActive: this.validateNumber(data.yearsActive, defaults.yearsActive),
            firstProjectYear: this.validateNumber(data.firstProjectYear, defaults.firstProjectYear),
            latestProjectYear: this.validateNumber(data.latestProjectYear, defaults.latestProjectYear),
            avgComplexity: data.avgComplexity || defaults.avgComplexity,
            avgComplexityLabel: data.avgComplexityLabel || defaults.avgComplexityLabel,
            successRate: this.validateNumber(data.successRate, defaults.successRate),
            formattedSuccessRate: data.formattedSuccessRate || defaults.formattedSuccessRate,
            deployedProjects: this.validateNumber(data.deployedProjects, defaults.deployedProjects),
            totalProjects: this.validateNumber(data.totalProjects, defaults.totalProjects),
            liveProjects: this.validateNumber(data.liveProjects, defaults.liveProjects),
            experienceLevel: data.experienceLevel || defaults.experienceLevel
        };
    }

    private validateTopTechnologies(data: any[]): string[] {
        if (!Array.isArray(data)) return [];
        return data.filter(item => typeof item === 'string' && item.trim().length > 0);
    }

    private validateCategoryDistribution(data: any[]): ProjectCategoryDistribution[] {
        console.log('Raw data from server:', data);
        if (!Array.isArray(data)) return [];
        return data.filter(item =>
            item &&
            item.category &&
            typeof item.projectCount === 'number'
        );
    }
}