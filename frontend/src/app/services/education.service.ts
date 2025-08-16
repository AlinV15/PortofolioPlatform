import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { GlobalService } from './global.service';
import { CacheConfig } from '../shared/models/request.interface';
import { EndpointType } from '../shared/enums/EndpointType';
import {
    AcademicProject,
    CurrentLearning,
    Education,
    EducationStats,
    LearningMilestone,
    LearningProgress
} from '../shared/models/education.interface';

@Injectable({
    providedIn: 'root'
})
export class EducationService extends GlobalService {
    protected readonly serviceName = 'EducationService';
    protected readonly serviceApiUrl = `${this.apiUrl}/education`;

    // Configurări cache specifice pentru Education
    protected readonly cacheConfig: CacheConfig = {
        defaultTTL: 600000, // 10 minute pentru educație (date mai stabile)
        maxCacheSize: 15,
        enablePrefetch: true,
        cleanupInterval: 240000, // 4 minute
        prefetchDelay: 3000, // 3 secunde - delay mai mare pentru educație
        avgEntrySize: 1536, // 1.5KB per entry (educație are date mai complexe)
        expectedHitRate: 0.88 // 88% hit rate pentru date stabile
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
     * Get all education levels
     */
    getAllEducation(): Observable<Education[]> {
        return this.makeRequest<Education[]>(
            EndpointType.EDUCATION,
            `${this.serviceApiUrl}`
        );
    }

    /**
     * Get current learning subjects
     */
    getAllCurrentLearningSubjects(): Observable<CurrentLearning[]> {
        return this.makeRequest<CurrentLearning[]>(
            EndpointType.CURRENT_LEARNING,
            `${this.apiUrl}/current-learning`
        );
    }

    /**
     * Get all learning milestones
     */
    getAllLearningMilestones(): Observable<LearningMilestone[]> {
        return this.makeRequest<LearningMilestone[]>(
            EndpointType.LEARNING_MILESTONES,
            `${this.apiUrl}/learning-milestones`
        );
    }

    /**
     * Get learning progress for each subject
     */
    getEachLearningProgress(): Observable<LearningProgress[]> {
        return this.makeRequest<LearningProgress[]>(
            EndpointType.LEARNING_PROGRESS,
            `${this.apiUrl}/learning-progress`
        );
    }

    /**
     * Get education statistics
     */
    getEducationStats(): Observable<EducationStats> {
        const defaultStats: EducationStats = {
            totalCourses: 4,
            currentYear: "3",
            specialization: "Computer Science Economics",
            focusAreas: [
                "Web Application",
                "Portfolio"
            ],
            languages: [
                {
                    name: "English",
                    level: "B1-B2",
                    icon: "🇬🇧",
                    iconType: "emoji"
                }
            ]
        };

        return this.makeRequest<EducationStats>(
            EndpointType.EDUCATION_STATS,
            `${this.serviceApiUrl}/stats`,
            defaultStats
        );
    }

    /**
     * Get all academic projects
     */
    getAcademicProjects(): Observable<AcademicProject[]> {
        return this.makeRequest<AcademicProject[]>(
            EndpointType.ACADEMIC_PROJECTS,
            `${this.serviceApiUrl}/projects`
        );
    }

    /**
     * Refreshează toate datele educaționale
     */
    refreshAllEducationData(): Observable<{
        education: Education[];
        currentLearning: CurrentLearning[];
        learningMilestones: LearningMilestone[];
        learningProgress: LearningProgress[];
        educationStats: EducationStats;
        academicProjects: AcademicProject[];
    }> {
        this.invalidateCache();

        return forkJoin({
            education: this.getAllEducation().pipe(
                catchError(error => {
                    this.log(`Failed to refresh education: ${error.message}`, 'warn');
                    return of([]);
                })
            ),
            currentLearning: this.getAllCurrentLearningSubjects().pipe(
                catchError(error => {
                    this.log(`Failed to refresh current learning: ${error.message}`, 'warn');
                    return of([]);
                })
            ),
            learningMilestones: this.getAllLearningMilestones().pipe(
                catchError(error => {
                    this.log(`Failed to refresh learning milestones: ${error.message}`, 'warn');
                    return of([]);
                })
            ),
            learningProgress: this.getEachLearningProgress().pipe(
                catchError(error => {
                    this.log(`Failed to refresh learning progress: ${error.message}`, 'warn');
                    return of([]);
                })
            ),
            educationStats: this.getEducationStats().pipe(
                catchError(error => {
                    this.log(`Failed to refresh education stats: ${error.message}`, 'warn');
                    return of({
                        totalCourses: 0,
                        currentYear: "0",
                        specialization: "",
                        focusAreas: [],
                        languages: []
                    });
                })
            ),
            academicProjects: this.getAcademicProjects().pipe(
                catchError(error => {
                    this.log(`Failed to refresh academic projects: ${error.message}`, 'warn');
                    return of([]);
                })
            )
        }).pipe(
            tap(data => {
                const totalItems = Object.values(data).reduce((acc, curr) => {
                    return acc + (Array.isArray(curr) ? curr.length : 1);
                }, 0);
                this.log(`Successfully refreshed all education data: ${totalItems} total items loaded`);
            }),
            catchError(error => {
                this.log(`Critical error during refresh education data: ${error.message}`, 'error');
                return of({
                    education: [],
                    currentLearning: [],
                    learningMilestones: [],
                    learningProgress: [],
                    educationStats: { totalCourses: 0, currentYear: "0", specialization: "", focusAreas: [], languages: [] },
                    academicProjects: []
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
     * Warmup cache cu date esențiale (optimizat pentru SSR)
     */
    warmupCache(): void {
        if (!this.isBrowser) {
            this.prefetchEssentialData();
        }
    }

    /**
     * Prefetch pentru datele esențiale de educație
     */
    protected prefetchEssentialData(): void {
        if (!this.cacheConfig.enablePrefetch) return;

        const essentialEndpoints = [
            EndpointType.EDUCATION,
            EndpointType.EDUCATION_STATS,
            EndpointType.CURRENT_LEARNING
        ];

        essentialEndpoints.forEach(endpoint => {
            switch (endpoint) {
                case EndpointType.EDUCATION:
                    this.getAllEducation().subscribe();
                    break;
                case EndpointType.EDUCATION_STATS:
                    this.getEducationStats().subscribe();
                    break;
                case EndpointType.CURRENT_LEARNING:
                    this.getAllCurrentLearningSubjects().subscribe();
                    break;
            }
        });

        this.log('Essential education data prefetch initiated');
    }

    /**
     * Validare și transformare specifică pentru datele educaționale
     */
    protected validateAndTransformData<T>(data: any, endpoint: EndpointType): T {
        if (!data) {
            throw new Error(`No data received for ${endpoint}`);
        }

        // Validări specifice per endpoint
        switch (endpoint) {
            case EndpointType.EDUCATION_STATS:
                return this.validateEducationStats(data) as T;
            case EndpointType.CURRENT_LEARNING:
                return this.validateCurrentLearning(data) as T;
            case EndpointType.LEARNING_PROGRESS:
                return this.validateLearningProgress(data) as T;
            case EndpointType.ACADEMIC_PROJECTS:
                return this.validateAcademicProjects(data) as T;
            case EndpointType.EDUCATION:
                return this.validateEducation(data) as T;
            case EndpointType.LEARNING_MILESTONES:
                return this.validateLearningMilestones(data) as T;
            default:
                return Array.isArray(data) ? data.filter(item => item && item.id) as T : data;
        }
    }

    // ========================
    // PRIVATE VALIDATION METHODS
    // ========================

    private validateEducationStats(data: any): EducationStats {
        const defaults: EducationStats = {
            totalCourses: 4,
            currentYear: "3",
            specialization: "Computer Science Economics",
            focusAreas: ["Web Application", "Portfolio"],
            languages: [
                {
                    name: "English",
                    level: "B1-B2",
                    icon: "🇬🇧",
                    iconType: "emoji"
                }
            ]
        };

        return {
            totalCourses: this.validateNumber(data.totalCourses, defaults.totalCourses),
            currentYear: data.currentYear || defaults.currentYear,
            specialization: data.specialization || defaults.specialization,
            focusAreas: Array.isArray(data.focusAreas) ? data.focusAreas : defaults.focusAreas,
            languages: Array.isArray(data.languages) ? data.languages : defaults.languages
        };
    }

    private validateCurrentLearning(data: any[]): CurrentLearning[] {
        if (!Array.isArray(data)) return [];

        return data.filter(item =>
            item &&
            item.id &&
            item.title &&
            typeof item.progress === 'number' &&
            item.progress >= 0 &&
            item.progress <= 100
        ).map(item => ({
            ...item,
            progress: Math.max(0, Math.min(100, Number(item.progress)))
        }));
    }

    private validateLearningProgress(data: any[]): LearningProgress[] {
        if (!Array.isArray(data)) return [];

        return data.filter(item =>
            item &&
            item.id &&
            item.name &&
            typeof item.progress === 'number' &&
            item.progress >= 0 &&
            item.progress <= 100 &&
            typeof item.timeSpent === 'number' &&
            item.timeSpent >= 0
        ).map(item => ({
            ...item,
            progress: Math.max(0, Math.min(100, Number(item.progress))),
            timeSpent: Math.max(0, Number(item.timeSpent))
        }));
    }

    private validateAcademicProjects(data: any[]): AcademicProject[] {
        if (!Array.isArray(data)) return [];

        return data.filter(item =>
            item &&
            item.id &&
            item.title &&
            item.courseName &&
            Array.isArray(item.technologies)
        ).map(item => ({
            ...item,
            githubLink: this.sanitizeUrl(item.githubLink),
            duration: this.validateNumber(item.duration, 0),
            technologies: Array.isArray(item.technologies) ? item.technologies : []
        }));
    }

    private validateEducation(data: any[]): Education[] {
        if (!Array.isArray(data)) return [];

        return data.filter(item =>
            item &&
            item.id &&
            item.level &&
            item.institution &&
            item.degree
        ).map(item => ({
            ...item,
            achievements: Array.isArray(item.achievements) ? item.achievements : [],
            relevantCourses: Array.isArray(item.relevantCourses) ? item.relevantCourses : [],
            highlights: Array.isArray(item.highlights) ? item.highlights : []
        }));
    }

    private validateLearningMilestones(data: any[]): LearningMilestone[] {
        if (!Array.isArray(data)) return [];

        return data.filter(item =>
            item &&
            item.id &&
            item.title &&
            item.year &&
            item.description
        ).map(item => ({
            ...item,
            technologies: Array.isArray(item.technologies) ? item.technologies : []
        }));
    }
}