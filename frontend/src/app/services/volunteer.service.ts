import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

import { GlobalService } from './global.service';
import { CacheConfig } from '../shared/models/request.interface';
import { EndpointType } from '../shared/enums/EndpointType';
import {
    VolunteerExperience,
    VolunteerSkill,
    VolunteerStats,
    Responsibility
} from '../shared/models/volunteer.interface';

@Injectable({
    providedIn: 'root'
})
export class VolunteerService extends GlobalService {
    protected readonly serviceName = 'VolunteerService';
    protected readonly serviceApiUrl = `${this.apiUrl}/volunteer`;

    // Configurări cache specifice pentru Volunteer
    protected readonly cacheConfig: CacheConfig = {
        defaultTTL: 900000, // 15 minute pentru volunteer (date relativ stabile)
        maxCacheSize: 10,
        enablePrefetch: true,
        cleanupInterval: 180000, // 3 minute
        prefetchDelay: 4000, // 4 secunde delay
        avgEntrySize: 1280, // 1.25KB per entry
        expectedHitRate: 0.87 // 87% hit rate
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
     * Get all volunteer experiences
     */
    getVolunteerExperiences(): Observable<VolunteerExperience[]> {
        return this.makeRequest<VolunteerExperience[]>(
            EndpointType.VOLUNTEER_EXPERIENCES,
            `${this.serviceApiUrl}/experiences`
        );
    }

    /**
     * Get all volunteer skills
     */
    getVolunteerSkills(): Observable<VolunteerSkill[]> {
        return this.makeRequest<VolunteerSkill[]>(
            EndpointType.VOLUNTEER_SKILLS,
            `${this.serviceApiUrl}/skills`
        );
    }

    /**
     * Get volunteer statistics
     */
    getVolunteerStats(): Observable<VolunteerStats> {
        const defaultStats: VolunteerStats = {
            totalYears: 0,
            organizations: 0,
            projectsCoordinated: 0,
            eventsOrganized: 0
        };

        return this.makeRequest<VolunteerStats>(
            EndpointType.VOLUNTEER_STATS,
            `${this.serviceApiUrl}/stats`,
            defaultStats
        );
    }

    /**
     * Refreshează toate datele volunteer
     */
    refreshAllVolunteerData(): Observable<{
        experiences: VolunteerExperience[];
        skills: VolunteerSkill[];
        stats: VolunteerStats;
    }> {
        this.invalidateCache();

        return forkJoin({
            experiences: this.getVolunteerExperiences().pipe(
                catchError(error => {
                    this.log(`Failed to refresh volunteer experiences: ${error.message}`, 'warn');
                    return of([]);
                })
            ),
            skills: this.getVolunteerSkills().pipe(
                catchError(error => {
                    this.log(`Failed to refresh volunteer skills: ${error.message}`, 'warn');
                    return of([]);
                })
            ),
            stats: this.getVolunteerStats().pipe(
                catchError(error => {
                    this.log(`Failed to refresh volunteer stats: ${error.message}`, 'warn');
                    return of({
                        totalYears: 0,
                        organizations: 0,
                        projectsCoordinated: 0,
                        eventsOrganized: 0
                    });
                })
            )
        }).pipe(
            tap(data => {
                const totalItems = data.experiences.length + data.skills.length + 1; // +1 pentru stats
                this.log(`Successfully refreshed all volunteer data: ${totalItems} total items loaded`);
            }),
            catchError(error => {
                this.log(`Critical error during refresh volunteer data: ${error.message}`, 'error');
                return of({
                    experiences: [],
                    skills: [],
                    stats: { totalYears: 0, organizations: 0, projectsCoordinated: 0, eventsOrganized: 0 }
                });
            })
        );
    }

    // ========================
    // UTILITY METHODS SPECIFICE VOLUNTEER
    // ========================

    /**
     * Filtrează experiențele volunteer după criterii
     */
    getFilteredExperiences(
        status?: string,
        type?: string,
        organization?: string
    ): Observable<VolunteerExperience[]> {
        return this.getVolunteerExperiences().pipe(
            map(experiences => {
                return experiences.filter(exp => {
                    if (status && exp.status !== status) return false;
                    if (type && exp.type !== type) return false;
                    if (organization && !exp.organization.toLowerCase().includes(organization.toLowerCase())) return false;
                    return true;
                });
            })
        );
    }

    /**
     * Obține skill-urile active volunteer
     */
    getActiveVolunteerSkills(): Observable<VolunteerSkill[]> {
        return this.getVolunteerSkills().pipe(
            map(skills => skills.filter(skill => skill.isActive))
        );
    }

    /**
     * Obține skill-urile după categorie
     */
    getSkillsByCategory(category: string): Observable<VolunteerSkill[]> {
        return this.getVolunteerSkills().pipe(
            map(skills => skills.filter(skill =>
                skill.category.toLowerCase() === category.toLowerCase()
            ))
        );
    }

    /**
     * Calculează statistici avansate
     */
    getAdvancedStats(): Observable<{
        basic: VolunteerStats;
        averageSkillLevel: number;
        topSkillCategories: { category: string; count: number; avgLevel: number }[];
        experiencesByType: { type: string; count: number }[];
        skillDistribution: { active: number; inactive: number };
    }> {
        return forkJoin({
            stats: this.getVolunteerStats(),
            skills: this.getVolunteerSkills(),
            experiences: this.getVolunteerExperiences()
        }).pipe(
            map(({ stats, skills, experiences }) => {
                // Calculează media skill-urilor
                const averageSkillLevel = skills.length > 0
                    ? skills.reduce((sum, skill) => sum + skill.level, 0) / skills.length
                    : 0;

                // Grupează skill-urile după categorie
                const categoryMap = new Map<string, { count: number; totalLevel: number }>();
                skills.forEach(skill => {
                    const existing = categoryMap.get(skill.category) || { count: 0, totalLevel: 0 };
                    categoryMap.set(skill.category, {
                        count: existing.count + 1,
                        totalLevel: existing.totalLevel + skill.level
                    });
                });

                const topSkillCategories = Array.from(categoryMap.entries()).map(([category, data]) => ({
                    category,
                    count: data.count,
                    avgLevel: data.totalLevel / data.count
                })).sort((a, b) => b.count - a.count);

                // Grupează experiențele după tip
                const typeMap = new Map<string, number>();
                experiences.forEach(exp => {
                    typeMap.set(exp.type, (typeMap.get(exp.type) || 0) + 1);
                });

                const experiencesByType = Array.from(typeMap.entries()).map(([type, count]) => ({
                    type,
                    count
                })).sort((a, b) => b.count - a.count);

                // Distribuția skill-urilor
                const activeSkills = skills.filter(skill => skill.isActive).length;
                const inactiveSkills = skills.length - activeSkills;

                return {
                    basic: stats,
                    averageSkillLevel: Math.round(averageSkillLevel * 10) / 10,
                    topSkillCategories,
                    experiencesByType,
                    skillDistribution: { active: activeSkills, inactive: inactiveSkills }
                };
            })
        );
    }

    // ========================
    // ABSTRACT METHODS IMPLEMENTATION
    // ========================

    /**
     * Warmup cache cu date esențiale (optimizat pentru SSR)
     */
    warmupCache(): void {
        if (!this.isBrowser) {
            this.prefetchEssentialData();
        }
    }

    /**
     * Prefetch pentru datele esențiale de volunteer
     */
    protected prefetchEssentialData(): void {
        if (!this.cacheConfig.enablePrefetch) return;

        const essentialEndpoints = [
            EndpointType.VOLUNTEER_EXPERIENCES,
            EndpointType.VOLUNTEER_STATS
        ];

        essentialEndpoints.forEach(endpoint => {
            switch (endpoint) {
                case EndpointType.VOLUNTEER_EXPERIENCES:
                    this.getVolunteerExperiences().subscribe();
                    break;
                case EndpointType.VOLUNTEER_STATS:
                    this.getVolunteerStats().subscribe();
                    break;
            }
        });

        this.log('Essential volunteer data prefetch initiated');
    }

    /**
     * Validare și transformare specifică pentru datele volunteer
     */
    protected validateAndTransformData<T>(data: any, endpoint: EndpointType): T {
        if (!data) {
            throw new Error(`No data received for ${endpoint}`);
        }

        // Validări specifice per endpoint
        switch (endpoint) {
            case EndpointType.VOLUNTEER_STATS:
                return this.validateVolunteerStats(data) as T;
            case EndpointType.VOLUNTEER_EXPERIENCES:
                return this.validateVolunteerExperiences(data) as T;
            case EndpointType.VOLUNTEER_SKILLS:
                return this.validateVolunteerSkills(data) as T;
            default:
                return data;
        }
    }

    // ========================
    // PRIVATE VALIDATION METHODS
    // ========================

    private validateVolunteerStats(data: any): VolunteerStats {
        const defaults: VolunteerStats = {
            totalYears: 0,
            organizations: 0,
            projectsCoordinated: 0,
            eventsOrganized: 0
        };

        return {
            totalYears: this.validateNumber(data.totalYears, defaults.totalYears),
            organizations: this.validateNumber(data.organizations, defaults.organizations),
            projectsCoordinated: this.validateNumber(data.projectsCoordinated, defaults.projectsCoordinated),
            eventsOrganized: this.validateNumber(data.eventsOrganized, defaults.eventsOrganized)
        };
    }

    private validateVolunteerExperiences(data: any[]): VolunteerExperience[] {
        if (!Array.isArray(data)) return [];

        return data.filter(item =>
            item &&
            item.id &&
            item.organization &&
            item.role &&
            Array.isArray(item.responsibilities) &&
            Array.isArray(item.achievements) &&
            Array.isArray(item.skillsGained)
        ).map(item => ({
            ...item,
            responsibilities: this.validateResponsibilities(item.responsibilities)
        }));
    }

    private validateResponsibilities(responsibilities: any[]): Responsibility[] {
        if (!Array.isArray(responsibilities)) return [];

        return responsibilities.filter(resp =>
            resp &&
            resp.id &&
            resp.description &&
            typeof resp.sortOrder === 'number'
        );
    }

    private validateVolunteerSkills(data: any[]): VolunteerSkill[] {
        if (!Array.isArray(data)) return [];

        return data.filter(item =>
            item &&
            item.name &&
            item.category &&
            typeof item.level === 'number' &&
            item.level >= 0 &&
            item.level <= 100 &&
            typeof item.yearsOfExperience === 'number' &&
            item.yearsOfExperience >= 0 &&
            typeof item.isActive === 'boolean' &&
            Array.isArray(item.organizations)
        );
    }
}