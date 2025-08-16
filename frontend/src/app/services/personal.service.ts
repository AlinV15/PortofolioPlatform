import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { GlobalService } from './global.service';
import { CacheConfig, RequestConfig } from '../shared/models/request.interface';
import { EndpointType } from '../shared/enums/EndpointType';
import {
    Achievement,
    FutureGoal,
    Highlight,
    Hobby,
    Interest,
    KeyStats,
    PersonalityTrait,
    Value
} from '../shared/models/personal.interface';

@Injectable({
    providedIn: 'root'
})
export class PersonalService extends GlobalService {
    protected readonly serviceName = 'PersonalService';
    protected readonly serviceApiUrl = `${this.apiUrl}/personal`;

    // Configurări cache specifice pentru Personal
    protected override readonly cacheConfig: CacheConfig = {
        defaultTTL: 300000, // 5 minute
        maxCacheSize: 20,
        enablePrefetch: true,
        cleanupInterval: 120000, // 2 minute
        prefetchDelay: 2000, // 2 secunde
        avgEntrySize: 1024, // 1KB per entry
        expectedHitRate: 0.85 // 85%
    };



    constructor(
        http: HttpClient,
        @Inject(PLATFORM_ID) platformId: Object
    ) {
        super(http, platformId);
        this.cacheConfig = {
            defaultTTL: 300000,
            maxCacheSize: 20,
            enablePrefetch: true,
            cleanupInterval: 120000,
            prefetchDelay: 2000,
            avgEntrySize: 1024,
            expectedHitRate: 0.85
        };
    }

    // ========================
    // PUBLIC API METHODS
    // ========================

    getAllHighlights(): Observable<Highlight[]> {
        return this.makeRequest<Highlight[]>(
            EndpointType.HIGHLIGHTS,
            `${this.serviceApiUrl}/highlights`
        );
    }

    getAllAchievements(): Observable<Achievement[]> {
        return this.makeRequest<Achievement[]>(
            EndpointType.ACHIEVEMENTS,
            `${this.apiUrl}/achievements`
        );
    }

    getAllValues(): Observable<Value[]> {
        return this.makeRequest<Value[]>(
            EndpointType.VALUES,
            `${this.serviceApiUrl}/values`
        );
    }

    getAllHobbies(): Observable<Hobby[]> {
        return this.makeRequest<Hobby[]>(
            EndpointType.HOBBIES,
            `${this.apiUrl}/hobbies`
        );
    }

    getFutureGoals(): Observable<FutureGoal[]> {
        return this.makeRequest<FutureGoal[]>(
            EndpointType.FUTURE_GOALS,
            `${this.apiUrl}/future-goals`
        );
    }

    getAllInterests(): Observable<Interest[]> {
        return this.makeRequest<Interest[]>(
            EndpointType.INTERESTS,
            `${this.apiUrl}/interests`
        );
    }

    getAllPersonalityTraits(): Observable<PersonalityTrait[]> {
        return this.makeRequest<PersonalityTrait[]>(
            EndpointType.PERSONALITY_TRAITS,
            `${this.apiUrl}/personality-trait`
        );
    }

    getPersonalStats(): Observable<KeyStats> {
        const defaultStats: KeyStats = {
            technologies: 0,
            projects: 0,
            certificates: 0,
            educationYears: 0
        };

        return this.makeRequest<KeyStats>(
            EndpointType.KEY_STATS,
            `${this.apiUrl}/key-statistics`,
            defaultStats
        );
    }

    /**
     * Refreshează toate datele personale
     */
    refreshAllPersonalData(): Observable<{
        highlights: Highlight[];
        achievements: Achievement[];
        values: Value[];
        hobbies: Hobby[];
        futureGoals: FutureGoal[];
        interests: Interest[];
        personalityTraits: PersonalityTrait[];
        keyStats: KeyStats;
    }> {
        this.invalidateCache();

        return forkJoin({
            highlights: this.getAllHighlights().pipe(
                catchError(error => {
                    this.log(`Failed to refresh highlights: ${error.message}`, 'warn');
                    return of([]);
                })
            ),
            achievements: this.getAllAchievements().pipe(
                catchError(error => {
                    this.log(`Failed to refresh achievements: ${error.message}`, 'warn');
                    return of([]);
                })
            ),
            values: this.getAllValues().pipe(
                catchError(error => {
                    this.log(`Failed to refresh values: ${error.message}`, 'warn');
                    return of([]);
                })
            ),
            hobbies: this.getAllHobbies().pipe(
                catchError(error => {
                    this.log(`Failed to refresh hobbies: ${error.message}`, 'warn');
                    return of([]);
                })
            ),
            futureGoals: this.getFutureGoals().pipe(
                catchError(error => {
                    this.log(`Failed to refresh future goals: ${error.message}`, 'warn');
                    return of([]);
                })
            ),
            interests: this.getAllInterests().pipe(
                catchError(error => {
                    this.log(`Failed to refresh interests: ${error.message}`, 'warn');
                    return of([]);
                })
            ),
            personalityTraits: this.getAllPersonalityTraits().pipe(
                catchError(error => {
                    this.log(`Failed to refresh personality traits: ${error.message}`, 'warn');
                    return of([]);
                })
            ),
            keyStats: this.getPersonalStats().pipe(
                catchError(error => {
                    this.log(`Failed to refresh key stats: ${error.message}`, 'warn');
                    return of({ technologies: 0, projects: 0, certificates: 0, educationYears: 0 });
                })
            )
        }).pipe(
            tap(data => {
                const totalItems = Object.values(data).reduce((acc, curr) => {
                    return acc + (Array.isArray(curr) ? curr.length : 1);
                }, 0);
                this.log(`Successfully refreshed all personal data: ${totalItems} total items loaded`);
            }),
            catchError(error => {
                this.log(`Critical error during refresh personal data: ${error.message}`, 'error');
                return of({
                    highlights: [],
                    achievements: [],
                    values: [],
                    hobbies: [],
                    futureGoals: [],
                    interests: [],
                    personalityTraits: [],
                    keyStats: { technologies: 0, projects: 0, certificates: 0, educationYears: 0 }
                });
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
     * Prefetch pentru datele esențiale de personal
     */
    protected prefetchEssentialData(): void {
        if (!this.cacheConfig.enablePrefetch) return;

        const essentialEndpoints = [
            EndpointType.HIGHLIGHTS,
            EndpointType.ACHIEVEMENTS,
            EndpointType.KEY_STATS
        ];

        essentialEndpoints.forEach(endpoint => {
            switch (endpoint) {
                case EndpointType.HIGHLIGHTS:
                    this.getAllHighlights().subscribe();
                    break;
                case EndpointType.ACHIEVEMENTS:
                    this.getAllAchievements().subscribe();
                    break;
                case EndpointType.KEY_STATS:
                    this.getPersonalStats().subscribe();
                    break;
            }
        });

        this.log('Essential personal data prefetch initiated');
    }

    /**
     * Validare și transformare specifică pentru datele personale
     */
    protected validateAndTransformData<T>(data: any, endpoint: EndpointType): T {
        if (!data) {
            throw new Error(`No data received for ${endpoint}`);
        }

        // Validări specifice per endpoint
        switch (endpoint) {
            case EndpointType.KEY_STATS:
                return this.validateKeyStats(data) as T;
            case EndpointType.HIGHLIGHTS:
                return this.validateHighlights(data) as T;
            case EndpointType.ACHIEVEMENTS:
                return this.validateAchievements(data) as T;
            case EndpointType.VALUES:
                return this.validateValues(data) as T;
            case EndpointType.HOBBIES:
                return this.validateHobbies(data) as T;
            case EndpointType.FUTURE_GOALS:
                return this.validateFutureGoals(data) as T;
            case EndpointType.INTERESTS:
                return this.validateInterests(data) as T;
            case EndpointType.PERSONALITY_TRAITS:
                return this.validatePersonalityTraits(data) as T;
            default:
                return Array.isArray(data) ? data.filter(item => item && item.id) as T : data;
        }
    }

    // ========================
    // PRIVATE VALIDATION METHODS
    // ========================

    private validateKeyStats(data: any): KeyStats {
        const defaults: KeyStats = {
            technologies: 0,
            projects: 0,
            certificates: 0,
            educationYears: 0
        };

        return {
            technologies: this.validateNumber(data.technologies, defaults.technologies),
            projects: this.validateNumber(data.projects, defaults.projects),
            certificates: this.validateNumber(data.certificates, defaults.certificates),
            educationYears: this.validateNumber(data.educationYears, defaults.educationYears)
        };
    }

    private validateHighlights(data: any[]): Highlight[] {
        if (!Array.isArray(data)) return [];

        return data.filter(item =>
            item &&
            item.id &&
            item.title &&
            item.description
        ).map(item => ({
            ...item,
            metrics: item.metrics || {},
            tags: Array.isArray(item.tags) ? item.tags : []
        }));
    }

    private validateAchievements(data: any[]): Achievement[] {
        if (!Array.isArray(data)) return [];

        return data.filter(item =>
            item &&
            item.id &&
            item.title &&
            item.description &&
            item.date
        ).map(item => ({
            ...item,
            skillsGained: Array.isArray(item.skillsGained) ? item.skillsGained : [],
            url: this.sanitizeUrl(item.url)
        }));
    }

    private validateValues(data: any[]): Value[] {
        if (!Array.isArray(data)) return [];

        return data.filter(item =>
            item &&
            item.id &&
            item.title &&
            item.description
        ).map(item => ({
            ...item,
            examples: Array.isArray(item.examples) ? item.examples : [],
            relatedSkills: Array.isArray(item.relatedSkills) ? item.relatedSkills : []
        }));
    }

    private validateHobbies(data: any[]): Hobby[] {
        if (!Array.isArray(data)) return [];

        return data.filter(item =>
            item &&
            item.id &&
            item.name &&
            item.description &&
            typeof item.yearsActive === 'number' &&
            item.yearsActive >= 0
        ).map(item => ({
            ...item,
            relatedSkills: Array.isArray(item.relatedSkills) ? item.relatedSkills : [],
            achievements: Array.isArray(item.achievements) ? item.achievements : [],
            equipment: Array.isArray(item.equipment) ? item.equipment : [],
            timePerWeek: this.validateNumber(item.timePerWeek, 0)
        }));
    }

    private validateFutureGoals(data: any[]): FutureGoal[] {
        if (!Array.isArray(data)) return [];

        return data.filter(item =>
            item &&
            item.id &&
            item.title &&
            item.description &&
            item.targetDate
        ).map(item => ({
            ...item,
            progress: item.progress ? Math.max(0, Math.min(100, Number(item.progress))) : undefined,
            milestones: Array.isArray(item.milestones) ? item.milestones.map((milestone: any) => ({
                ...milestone,
                completed: Boolean(milestone.completed)
            })) : []
        }));
    }

    private validateInterests(data: any[]): Interest[] {
        if (!Array.isArray(data)) return [];

        return data.filter(item =>
            item &&
            item.id &&
            item.name &&
            item.description
        ).map(item => ({
            ...item,
            recentDiscoveries: Array.isArray(item.recentDiscoveries) ? item.recentDiscoveries : []
        }));
    }

    private validatePersonalityTraits(data: any[]): PersonalityTrait[] {
        if (!Array.isArray(data)) return [];

        return data.filter(item =>
            item &&
            item.id &&
            item.trait &&
            item.description
        ).map(item => ({
            ...item,
            examples: Array.isArray(item.examples) ? item.examples : []
        }));
    }
}