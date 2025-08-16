import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { GlobalService } from './global.service';
import { CacheConfig } from '../shared/models/request.interface';
import { EndpointType } from '../shared/enums/EndpointType';

import { FeaturedSkill, Skill, SkillCategory, SkillStats, TopSkill } from '../shared/models/skill.interface';

@Injectable({
    providedIn: 'root'
})
export class SkillsService extends GlobalService {
    protected readonly serviceName = 'SkillsService';
    protected readonly serviceApiUrl = `${this.apiUrl}/skills`;


    // Cache configuration for skills
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
     * Get all skills
     */
    getAllSkills(): Observable<Skill[]> {
        return this.makeRequest<Skill[]>(
            EndpointType.SKILLS,
            `${this.serviceApiUrl}`
        );
    }

    /**
     * Get top skills
     */
    getTopSkills(): Observable<TopSkill[]> {
        return this.makeRequest<TopSkill[]>(
            EndpointType.TOP_SKILLS,
            `${this.serviceApiUrl}/top`
        );
    }

    /**
     * Get all skills categories
     */
    getAllSkillsCategories(): Observable<SkillCategory[]> {
        return this.makeRequest<SkillCategory[]>(
            EndpointType.SKILLS_CATEGORIES,
            `${this.apiUrl}/featured-skills/categories`
        );
    }

    /**
     * Get all featured skills
     */
    getAllFeaturedSkills(): Observable<FeaturedSkill[]> {
        return this.makeRequest<FeaturedSkill[]>(
            EndpointType.FEATURED_SKILLS,
            `${this.apiUrl}/featured-skills`
        );
    }

    /**
     * Get skills statistics
     */
    getSkillsStats(): Observable<SkillStats> {
        const defaultStats: SkillStats = {
            description: "Nothing for now",
            projectsText: "0",
            technologiesText: "0",
            yearsCoding: "0",
            projects: "0",
            certifications: "0",
            avgProficiency: "0",
            yearsCodingLabel: "0 years",
            projectsLabel: "0 projects",
            certificationsLabel: "0 certifications",
            avgProficiencyLabel: "0 %",
        };

        return this.makeRequest<SkillStats>(
            EndpointType.SKILLS_STATS,
            `${this.serviceApiUrl}/stats`,
            defaultStats
        );
    }



    /**
     * Refresh all data
     */
    refreshAllSkillsData(): Observable<{
        skills: Skill[];
        skillsCategories: SkillCategory[];
        topSkills: TopSkill[];
        featuredSkills: FeaturedSkill[];
        skillsStats: SkillStats;

    }> {
        this.invalidateCache();

        return forkJoin({
            skills: this.getAllSkills().pipe(
                catchError(error => {
                    this.log(`Failed to refresh all skills: ${error.message}`, 'warn');
                    return of([]);
                })
            ),
            topSkills: this.getTopSkills().pipe(
                catchError(error => {
                    this.log(`Failed to refresh top skills: ${error.message}`, 'warn');
                    return of([]);
                })
            ),
            featuredSkills: this.getAllFeaturedSkills().pipe(
                catchError(error => {
                    this.log(`Failed to refresh featured skills: ${error.message}`, 'warn');
                    return of([]);
                })
            ),
            skillsCategories: this.getAllSkillsCategories().pipe(
                catchError(error => {
                    this.log(`Failed to refresh skills categories: ${error.message}`, 'warn');
                    return of([]);
                })
            ),
            skillsStats: this.getSkillsStats().pipe(
                catchError(error => {
                    this.log(`Failed to refresh skills stats: ${error.message}`, 'warn');
                    return of({
                        description: "Nothing for now",
                        projectsText: "0",
                        technologiesText: "0",
                        yearsCoding: "0",
                        projects: "0",
                        certifications: "0",
                        avgProficiency: "0",
                        yearsCodingLabel: "0 years",
                        projectsLabel: "0 projects",
                        certificationsLabel: "0 certifications",
                        avgProficiencyLabel: "0 %",
                    });
                })
            )
        }).pipe(
            tap(data => {
                const totalItems = Object.values(data).reduce((acc, curr) => {
                    return acc + (Array.isArray(curr) ? curr.length : 1);
                }, 0);
                this.log(`Successfully refreshed all skills data: ${totalItems} total items loaded`);
            }),
            catchError(error => {
                this.log(`Critical error during refresh skills data: ${error.message}`, 'error');
                return of({
                    skills: [],
                    topSkills: [],
                    featuredSkills: [],
                    skillsCategories: [],
                    skillsStats: {
                        description: "Nothing for now",
                        projectsText: "0",
                        technologiesText: "0",
                        yearsCoding: "0",
                        projects: "0",
                        certifications: "0",
                        avgProficiency: "0",
                        yearsCodingLabel: "0 years",
                        projectsLabel: "0 projects",
                        certificationsLabel: "0 certifications",
                        avgProficiencyLabel: "0 %",
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
     * Prefetch for essential skills data
     */
    protected prefetchEssentialData(): void {
        if (!this.cacheConfig.enablePrefetch) return;

        const essentialEndpoints = [
            EndpointType.SKILLS,
            EndpointType.SKILLS_STATS,
            EndpointType.SKILLS_CATEGORIES
        ];

        essentialEndpoints.forEach(endpoint => {
            switch (endpoint) {
                case EndpointType.SKILLS:
                    this.getAllSkills().subscribe();
                    break;
                case EndpointType.SKILLS_STATS:
                    this.getSkillsStats().subscribe();
                    break;
                case EndpointType.SKILLS_CATEGORIES:
                    this.getAllSkillsCategories().subscribe();
                    break;
            }
        });

        this.log('Essential skills data prefetch initiated');
    }

    /**
     * Validation and transformation for skills data
     */
    protected validateAndTransformData<T>(data: any, endpoint: EndpointType): T {
        if (!data) {
            throw new Error(`No data received for ${endpoint}`);
        }

        // Validări specifice per endpoint
        switch (endpoint) {
            case EndpointType.SKILLS_STATS:
                return this.validateSkillsStats(data) as T;
            case EndpointType.SKILLS_CATEGORIES:
                return this.validateSkillsCategories(data) as T;
            case EndpointType.SKILLS:
                return this.validateSkills(data) as T;
            case EndpointType.FEATURED_SKILLS:
                return this.validateFeaturedSkills(data) as T;
            case EndpointType.TOP_SKILLS:
                return this.validateTopSkills(data) as T;
            default:
                return Array.isArray(data) ? data.filter(item => item && item.id) as T : data;
        }
    }

    // ========================
    // PRIVATE VALIDATION METHODS
    // ========================

    private validateSkillsStats(data: any): SkillStats {
        const defaults: SkillStats = {
            description: "Nothing for now",
            projectsText: "0",
            technologiesText: "0",
            yearsCoding: "0",
            projects: "0",
            certifications: "0",
            avgProficiency: "0",
            yearsCodingLabel: "0 years",
            projectsLabel: "0 projects",
            certificationsLabel: "0 certifications",
            avgProficiencyLabel: "0 %",
        };

        return {
            description: data.description || defaults.description,
            projectsText: data.projectsText || defaults.projectsText,
            technologiesText: data.technologiesText || defaults.technologiesText,
            yearsCoding: data.yearsCoding || defaults.yearsCoding,
            projects: data.projects || defaults.projects,
            certifications: data.certifications || defaults.certifications,
            avgProficiency: data.avgProficiency || defaults.avgProficiency,
            yearsCodingLabel: data.yearsCodingLabel || defaults.yearsCodingLabel,
            projectsLabel: data.projectsLabel || defaults.projectsLabel,
            certificationsLabel: data.certificationsLabel || defaults.certificationsLabel,
            avgProficiencyLabel: data.avgProficiencyLabel || defaults.avgProficiencyLabel,
        };
    }

    private validateSkills(data: any[]): Skill[] {
        if (!Array.isArray(data)) return [];

        return data.filter(item =>
            item &&
            item.id &&
            item.name &&
            typeof item.level === 'number' &&
            item.level >= 0 &&
            item.level <= 100
        ).map(item => ({
            ...item,
            level: Math.max(0, Math.min(100, Number(item.level)))
        }));
    }

    private validateTopSkills(data: any[]): TopSkill[] {
        if (!Array.isArray(data)) return [];

        return data.filter(item =>
            item &&
            item.id &&
            item.name &&
            typeof item.level === 'number' &&
            item.level >= 0 &&
            item.level <= 100 &&
            typeof item.projects === 'number' &&
            item.projects >= 0
        ).map(item => ({
            ...item,
            level: Math.max(0, Math.min(100, Number(item.level))),
            projects: Math.max(0, Number(item.projects))
        }));
    }

    private validateFeaturedSkills(data: any[]): FeaturedSkill[] {
        if (!Array.isArray(data)) return [];

        return data.filter(item =>
            item &&
            item.id &&
            item.name &&
            item.categoryName &&
            typeof item.level === 'number' &&
            item.level >= 0 &&
            item.level <= 100 &&
            typeof item.yearsOfExperience === 'number' &&
            item.yearsOfExperience >= 0

        ).map(item => ({
            ...item,
            level: Math.max(0, Math.min(100, Number(item.level))),
            yearOfExperience: Math.max(0, Number(item.yearOfExperience))
        }));
    }

    private validateSkillsCategories(data: any[]): SkillCategory[] {
        if (!Array.isArray(data)) return [];

        return data.filter(item =>
            item &&
            item.name
        ).map(item => ({
            ...item
        }));
    }

}