// services/data.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, forkJoin, BehaviorSubject } from 'rxjs';
import { map, tap, shareReplay, catchError } from 'rxjs/operators';

// Import all existing services
import { PersonalService } from './personal.service';
import { ProjectService } from './projects.service';
import { EducationService } from './education.service';
import { SkillsService } from './skills.service';
import { TechnologiesService } from './technologies.service';
import { TimelineService } from './timeline.service';
import { VolunteerService } from './volunteer.service';
import { ContactService } from './contact.service';
import { CertificateService } from './certificate.service';
import { IconHelperService } from './icon-helper.service';

// Import all interfaces
import {
    Achievement, FutureGoal, Highlight, Hobby, Interest, KeyStats,
    PersonalityTrait, Value
} from '../shared/models/personal.interface';
import {
    Project, FeaturedProject, ProjectsStats, ProjectCategoryDistribution,
    ProjectExperience
} from '../shared/models/project.interface';
import {
    AcademicProject, CurrentLearning, Education, EducationStats,
    LearningMilestone, LearningProgress
} from '../shared/models/education.interface';
import {
    Skill, SkillCategory, SkillStats, TopSkill, FeaturedSkill
} from '../shared/models/skill.interface';
import {
    Technology, TechStats, TechCategory
} from '../shared/models/technology.interface';
import {
    TimelineItem, TimelineMilestone, TimelineStats
} from '../shared/models/timeline.interface';
import {
    VolunteerExperience, VolunteerSkill, VolunteerStats
} from '../shared/models/volunteer.interface';
import {
    ContactInfo, ContactLocation
} from '../shared/models/contact.interface';
import {
    Certificate, CertificateStats, CertificateCategory
} from '../shared/models/certificate.interface';

// ========================
// CENTRALIZED DATA INTERFACES
// ========================

export interface PersonalData {
    highlights: Highlight[];
    achievements: Achievement[];
    values: Value[];
    hobbies: Hobby[];
    futureGoals: FutureGoal[];
    interests: Interest[];
    personalityTraits: PersonalityTrait[];
    keyStats: KeyStats;
}

export interface ProjectData {
    projects: Project[];
    featuredProjects: FeaturedProject[];
    projectStats: ProjectsStats;
    categories: ProjectCategoryDistribution[];
    technologies: string[];
    projectExperience: ProjectExperience;
}

export interface EducationData {
    education: Education[];
    currentLearning: CurrentLearning[];
    learningMilestones: LearningMilestone[];
    learningProgress: LearningProgress[];
    educationStats: EducationStats;
    academicProjects: AcademicProject[];
}

export interface SkillData {
    skills: Skill[];
    topSkills: TopSkill[];
    featuredSkills: FeaturedSkill[];
    skillsCategories: SkillCategory[];
    skillsStats: SkillStats;
}

export interface TechnologyData {
    technologies: Technology[];
    techCategories: TechCategory[];
    techStats: TechStats;
}

export interface TimelineData {
    timelineItems: TimelineItem[];
    timelineMilestones: TimelineMilestone[];
    timelineStats: TimelineStats;
}

export interface VolunteerData {
    experiences: VolunteerExperience[];
    skills: VolunteerSkill[];
    stats: VolunteerStats;
}

export interface ContactData {
    info: ContactInfo;
    location: ContactLocation;
}

export interface CertificateData {
    certificates: Certificate[];
    categories: CertificateCategory[];
    stats: CertificateStats;
}

export interface AllPortfolioData {
    personal: PersonalData;
    projects: ProjectData;
    education: EducationData;
    skills: SkillData;
    technologies: TechnologyData;
    timeline: TimelineData;
    volunteer: VolunteerData;
    contact: ContactData;
    certificates: CertificateData;
}

// ========================
// LOADING STATES INTERFACES
// ========================

export interface LoadingStates {
    personal: boolean;
    projects: boolean;
    education: boolean;
    skills: boolean;
    technologies: boolean;
    timeline: boolean;
    volunteer: boolean;
    contact: boolean;
    certificates: boolean;
}

export interface ErrorStates {
    personal: string | null;
    projects: string | null;
    education: string | null;
    skills: string | null;
    technologies: string | null;
    timeline: string | null;
    volunteer: string | null;
    contact: string | null;
    certificates: string | null;
}

@Injectable({
    providedIn: 'root'
})
export class DataService {
    private readonly isBrowser: boolean;

    // ========================
    // BEHAVIORAL SUBJECTS FOR STATE MANAGEMENT
    // ========================

    private readonly allData$ = new BehaviorSubject<AllPortfolioData | null>(null);
    private readonly loadingStates$ = new BehaviorSubject<LoadingStates>({
        personal: false,
        projects: false,
        education: false,
        skills: false,
        technologies: false,
        timeline: false,
        volunteer: false,
        contact: false,
        certificates: false
    });
    private readonly errorStates$ = new BehaviorSubject<ErrorStates>({
        personal: null,
        projects: null,
        education: null,
        skills: null,
        technologies: null,
        timeline: null,
        volunteer: null,
        contact: null,
        certificates: null
    });

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private personalService: PersonalService,
        private projectService: ProjectService,
        private educationService: EducationService,
        private skillsService: SkillsService,
        private technologiesService: TechnologiesService,
        private timelineService: TimelineService,
        private volunteerService: VolunteerService,
        private contactService: ContactService,
        private certificateService: CertificateService,
        private iconHelperService: IconHelperService
    ) {
        this.isBrowser = isPlatformBrowser(this.platformId);
    }

    // ========================
    // PUBLIC OBSERVABLE GETTERS
    // ========================

    getAllData(): Observable<AllPortfolioData | null> {
        return this.allData$.asObservable();
    }

    getLoadingStates(): Observable<LoadingStates> {
        return this.loadingStates$.asObservable();
    }

    getErrorStates(): Observable<ErrorStates> {
        return this.errorStates$.asObservable();
    }

    isAnyDataLoading(): Observable<boolean> {
        return this.loadingStates$.pipe(
            map(states => Object.values(states).some(loading => loading))
        );
    }

    hasAnyError(): Observable<boolean> {
        return this.errorStates$.pipe(
            map(states => Object.values(states).some(error => error !== null))
        );
    }

    // ========================
    // INDIVIDUAL DATA SECTION GETTERS
    // ========================

    getPersonalData(): Observable<PersonalData | null> {
        return this.allData$.pipe(
            map(data => data?.personal || null)
        );
    }

    getProjectData(): Observable<ProjectData | null> {
        return this.allData$.pipe(
            map(data => data?.projects || null)
        );
    }

    getEducationData(): Observable<EducationData | null> {
        return this.allData$.pipe(
            map(data => data?.education || null)
        );
    }

    getSkillData(): Observable<SkillData | null> {
        return this.allData$.pipe(
            map(data => data?.skills || null)
        );
    }

    getTechnologyData(): Observable<TechnologyData | null> {
        return this.allData$.pipe(
            map(data => data?.technologies || null)
        );
    }

    getTimelineData(): Observable<TimelineData | null> {
        return this.allData$.pipe(
            map(data => data?.timeline || null)
        );
    }

    getVolunteerData(): Observable<VolunteerData | null> {
        return this.allData$.pipe(
            map(data => data?.volunteer || null)
        );
    }

    getContactData(): Observable<ContactData | null> {
        return this.allData$.pipe(
            map(data => data?.contact || null)
        );
    }

    getCertificateData(): Observable<CertificateData | null> {
        return this.allData$.pipe(
            map(data => data?.certificates || null)
        );
    }

    // ========================
    // SPECIFIC DATA GETTERS (for backward compatibility)
    // ========================

    // Personal data getters
    getHighlights(): Observable<Highlight[]> {
        return this.getPersonalData().pipe(map(data => data?.highlights || []));
    }

    getAchievements(): Observable<Achievement[]> {
        return this.getPersonalData().pipe(map(data => data?.achievements || []));
    }

    getValues(): Observable<Value[]> {
        return this.getPersonalData().pipe(map(data => data?.values || []));
    }

    getHobbies(): Observable<Hobby[]> {
        return this.getPersonalData().pipe(map(data => data?.hobbies || []));
    }

    getFutureGoals(): Observable<FutureGoal[]> {
        return this.getPersonalData().pipe(map(data => data?.futureGoals || []));
    }

    getInterests(): Observable<Interest[]> {
        return this.getPersonalData().pipe(map(data => data?.interests || []));
    }

    getPersonalityTraits(): Observable<PersonalityTrait[]> {
        return this.getPersonalData().pipe(map(data => data?.personalityTraits || []));
    }

    getKeyStats(): Observable<KeyStats> {
        return this.getPersonalData().pipe(
            map(data => data?.keyStats || { technologies: 0, projects: 0, certificates: 0, educationYears: 0 })
        );
    }

    // Project data getters
    getAllProjects(): Observable<Project[]> {
        return this.getProjectData().pipe(map(data => data?.projects || []));
    }

    getFeaturedProjects(): Observable<FeaturedProject[]> {
        return this.getProjectData().pipe(map(data => data?.featuredProjects || []));
    }

    getProjectStats(): Observable<ProjectsStats> {
        return this.getProjectData().pipe(
            map(data => data?.projectStats || { technologies: 0, totalProjects: 0, liveProjects: 0 })
        );
    }

    getProjectCategories(): Observable<ProjectCategoryDistribution[]> {
        console.log(this.getProjectData().pipe(map(data => data?.categories || [])));
        return this.getProjectData().pipe(map(data => data?.categories || []));
    }

    getTopTechnologies(): Observable<string[]> {
        return this.getProjectData().pipe(map(data => data?.technologies || []));
    }

    getProjectExperience(): Observable<ProjectExperience> {
        return this.getProjectData().pipe(
            map(data => data?.projectExperience || {
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
            })
        );
    }

    // Education data getters
    getAllEducation(): Observable<Education[]> {
        return this.getEducationData().pipe(map(data => data?.education || []));
    }

    getCurrentLearning(): Observable<CurrentLearning[]> {
        return this.getEducationData().pipe(map(data => data?.currentLearning || []));
    }

    getLearningMilestones(): Observable<LearningMilestone[]> {
        return this.getEducationData().pipe(map(data => data?.learningMilestones || []));
    }

    getLearningProgress(): Observable<LearningProgress[]> {
        return this.getEducationData().pipe(map(data => data?.learningProgress || []));
    }

    getEducationStats(): Observable<EducationStats> {
        return this.getEducationData().pipe(
            map(data => data?.educationStats || {
                totalCourses: 0,
                currentYear: "0",
                specialization: "",
                focusAreas: [],
                languages: []
            })
        );
    }

    getAcademicProjects(): Observable<AcademicProject[]> {
        return this.getEducationData().pipe(map(data => data?.academicProjects || []));
    }

    // Skills data getters
    getAllSkills(): Observable<Skill[]> {
        return this.getSkillData().pipe(map(data => data?.skills || []));
    }

    getTopSkills(): Observable<TopSkill[]> {
        return this.getSkillData().pipe(map(data => data?.topSkills || []));
    }

    getFeaturedSkills(): Observable<FeaturedSkill[]> {
        return this.getSkillData().pipe(map(data => data?.featuredSkills || []));
    }

    getSkillsCategories(): Observable<SkillCategory[]> {
        return this.getSkillData().pipe(map(data => data?.skillsCategories || []));
    }

    getSkillsStats(): Observable<SkillStats> {
        return this.getSkillData().pipe(
            map(data => data?.skillsStats || {
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
                avgProficiencyLabel: "0 %"
            })
        );
    }

    // Technology data getters
    getAllTechnologies(): Observable<Technology[]> {
        return this.getTechnologyData().pipe(map(data => data?.technologies || []));
    }

    getTechCategories(): Observable<TechCategory[]> {
        return this.getTechnologyData().pipe(map(data => data?.techCategories || []));
    }

    getTechStats(): Observable<TechStats> {
        return this.getTechnologyData().pipe(
            map(data => data?.techStats || {
                totalTechnologies: 0,
                trendingCount: 0,
                averagePopularityScore: 0,
                categoryDistribution: { distribution: new Map() },
                recentlyReleasedCount: 0,
                mostPopularCategory: "",
                trendingPercentage: 0
            })
        );
    }

    // Timeline data getters
    getTimelineItems(): Observable<TimelineItem[]> {
        return this.getTimelineData().pipe(map(data => data?.timelineItems || []));
    }

    getTimelineMilestones(): Observable<TimelineMilestone[]> {
        return this.getTimelineData().pipe(map(data => data?.timelineMilestones || []));
    }

    getTimelineStats(): Observable<TimelineStats> {
        return this.getTimelineData().pipe(
            map(data => data?.timelineStats || { "Major Milestones": "0", " Achievements": "0" })
        );
    }

    // Volunteer data getters
    getVolunteerExperiences(): Observable<VolunteerExperience[]> {
        return this.getVolunteerData().pipe(map(data => data?.experiences || []));
    }

    getVolunteerSkills(): Observable<VolunteerSkill[]> {
        return this.getVolunteerData().pipe(map(data => data?.skills || []));
    }

    getVolunteerStats(): Observable<VolunteerStats> {
        return this.getVolunteerData().pipe(
            map(data => data?.stats || { totalYears: 0, organizations: 0, projectsCoordinated: 0, eventsOrganized: 0 })
        );
    }

    // Contact data getters
    getContactInfo(): Observable<ContactInfo> {
        return this.getContactData().pipe(
            map(data => data?.info || { email: '', phone: '', location: '', github: '', linkedin: '' })
        );
    }

    getContactLocation(): Observable<ContactLocation> {
        return this.getContactData().pipe(
            map(data => data?.location || {
                name: '', address: '', city: '', country: '',
                coordinates: { lat: 0, lng: 0 }, timezone: '', workingHours: ''
            })
        );
    }

    // Certificate data getters
    getCertificates(): Observable<Certificate[]> {
        return this.getCertificateData().pipe(map(data => data?.certificates || []));
    }

    getCertificateCategories(): Observable<CertificateCategory[]> {
        return this.getCertificateData().pipe(map(data => data?.categories || []));
    }

    getCertificateStats(): Observable<CertificateStats> {
        return this.getCertificateData().pipe(
            map(data => data?.stats || {
                totalCertificates: 0,
                verifiedCount: 0,
                averageRelevanceScore: 0,
                providerDistribution: new Map(),
                expiringCount: 0,
                featuredCount: 0,
                highRelevanceCount: 0,
                featuredPercentage: 0,
                verificationRate: 0,
                topProvider: ''
            })
        );
    }

    // ========================
    // DATA LOADING METHODS
    // ========================

    /**
     * Load all portfolio data from all services
     */
    loadAllData(forceRefresh: boolean = false): Observable<AllPortfolioData> {
        if (!forceRefresh && this.allData$.value) {
            return this.allData$.asObservable().pipe(map(data => data!));
        }

        this.setAllLoadingStates(true);
        this.clearAllErrors();


        return forkJoin({
            personal: this.loadPersonalData(),
            projects: this.loadProjectData(),
            education: this.loadEducationData(),
            skills: this.loadSkillData(),
            technologies: this.loadTechnologyData(),
            timeline: this.loadTimelineData(),
            volunteer: this.loadVolunteerData(),
            contact: this.loadContactData(),
            certificates: this.loadCertificateData()
        }).pipe(
            tap(data => {
                this.allData$.next(data);
                this.setAllLoadingStates(false);
                console.log('📦 All portfolio data loaded successfully');
            }),
            catchError(error => {
                console.error('❌ Error loading portfolio data:', error);
                this.setAllLoadingStates(false);
                throw error;
            }),
            shareReplay(1)
        );
    }

    /**
     * Refresh specific data section
     */
    refreshSection(section: keyof AllPortfolioData): Observable<any> {
        this.setLoadingState(section, true);
        this.setErrorState(section, null);

        let refresh$: Observable<any>;

        switch (section) {
            case 'personal':
                refresh$ = this.loadPersonalData();
                break;
            case 'projects':
                refresh$ = this.loadProjectData();
                break;
            case 'education':
                refresh$ = this.loadEducationData();
                break;
            case 'skills':
                refresh$ = this.loadSkillData();
                break;
            case 'technologies':
                refresh$ = this.loadTechnologyData();
                break;
            case 'timeline':
                refresh$ = this.loadTimelineData();
                break;
            case 'volunteer':
                refresh$ = this.loadVolunteerData();
                break;
            case 'contact':
                refresh$ = this.loadContactData();
                break;
            case 'certificates':
                refresh$ = this.loadCertificateData();
                break;
            default:
                throw new Error(`Unknown section: ${section}`);
        }

        return refresh$.pipe(
            tap(data => {
                const currentData = this.allData$.value;
                if (currentData) {
                    this.allData$.next({ ...currentData, [section]: data });
                }
                this.setLoadingState(section, false);
            }),
            catchError(error => {
                this.setErrorState(section, error.message);
                this.setLoadingState(section, false);
                throw error;
            })
        );
    }

    /**
     * Force refresh all data
     */
    forceRefreshAll(): Observable<AllPortfolioData> {
        this.allData$.next(null);
        return this.loadAllData(true);
    }

    /**
     * Clear cache for route changes (delegated to individual services)
     */
    clearCacheForRouteChange(): void {
        this.personalService.forceRefreshOnRouteChange();
        this.projectService.forceRefreshOnRouteChange();
        this.educationService.forceRefreshOnRouteChange();
        this.skillsService.forceRefreshOnRouteChange();
        this.technologiesService.forceRefreshOnRouteChange();
        this.timelineService.forceRefreshOnRouteChange();
        this.volunteerService.forceRefreshOnRouteChange();
        this.contactService.forceRefreshOnRouteChange();
        this.certificateService.forceRefreshOnRouteChange();

        // Clear local cache
        this.allData$.next(null);
        this.clearAllErrors();
    }

    // ========================
    // PRIVATE DATA LOADING METHODS
    // ========================

    private loadPersonalData(): Observable<PersonalData> {
        return this.personalService.refreshAllPersonalData().pipe(
            map(data => ({
                highlights: this.processPersonalIcons(data.highlights),
                achievements: this.processPersonalIcons(data.achievements),
                values: this.processPersonalIcons(data.values),
                hobbies: this.processLucideIcons(data.hobbies),
                futureGoals: this.processPersonalIcons(data.futureGoals),
                interests: this.processLucideIcons(data.interests),
                personalityTraits: this.processLucideIcons(data.personalityTraits),
                keyStats: data.keyStats
            })),
            catchError(error => {
                this.setErrorState('personal', error.message);
                throw error;
            })
        );
    }

    private loadProjectData(): Observable<ProjectData> {

        return this.projectService.refreshAllProjectData().pipe(
            catchError(error => {
                this.setErrorState('projects', error.message);
                throw error;
            })
        );
    }

    private loadEducationData(): Observable<EducationData> {
        return this.educationService.refreshAllEducationData().pipe(
            map(data => ({
                // FIXED: Education data uses Lucide icons
                education: this.processLucideIcons(data.education),
                currentLearning: this.processLucideIcons(data.currentLearning),
                learningMilestones: data.learningMilestones,
                learningProgress: data.learningProgress,
                educationStats: data.educationStats,
                academicProjects: this.processLucideIcons(data.academicProjects)
            })),
            catchError(error => {
                this.setErrorState('education', error.message);
                throw error;
            })
        );
    }

    private loadSkillData(): Observable<SkillData> {
        return this.skillsService.refreshAllSkillsData().pipe(
            map(data => ({
                skills: data.skills,
                topSkills: data.topSkills,
                featuredSkills: data.featuredSkills,
                skillsCategories: this.processLucideIcons(data.skillsCategories),
                skillsStats: data.skillsStats
            })),
            catchError(error => {
                this.setErrorState('skills', error.message);
                throw error;
            })
        );
    }

    private loadTechnologyData(): Observable<TechnologyData> {
        return this.technologiesService.refreshAllTechData().pipe(
            map(data => ({
                technologies: this.processLucideIcons(data.technologies),
                techCategories: this.processLucideIcons(data.technologiesCategories),
                techStats: data.techStats
            })),
            catchError(error => {
                this.setErrorState('technologies', error.message);
                throw error;
            })
        );
    }

    private loadTimelineData(): Observable<TimelineData> {
        return forkJoin({
            timelineItems: this.timelineService.getAllTimelineItems(),
            timelineMilestones: this.timelineService.getAllTimelineMilestones(),
            timelineStats: this.timelineService.getTimelineStats()
        }).pipe(
            map(data => ({
                timelineItems: this.processLucideIcons(data.timelineItems),
                timelineMilestones: this.processLucideIcons(data.timelineMilestones),
                timelineStats: data.timelineStats
            })),
            catchError(error => {
                this.setErrorState('timeline', error.message);
                throw error;
            })
        );
    }

    private loadVolunteerData(): Observable<VolunteerData> {
        return this.volunteerService.refreshAllVolunteerData().pipe(
            map(data => ({
                experiences: this.processLucideIcons(data.experiences),
                skills: data.skills,
                stats: data.stats
            })),
            catchError(error => {
                this.setErrorState('volunteer', error.message);
                throw error;
            })
        );
    }

    private loadContactData(): Observable<ContactData> {
        return this.contactService.refreshAllContactData().pipe(
            catchError(error => {
                this.setErrorState('contact', error.message);
                throw error;
            })
        );
    }

    private loadCertificateData(): Observable<CertificateData> {
        return this.certificateService.refreshAllCertificateData().pipe(
            map(data => ({
                certificates: this.processLucideIcons(data.certificates),
                categories: this.processLucideIcons(data.categories),
                stats: data.stats
            })),
            catchError(error => {
                this.setErrorState('certificates', error.message);
                throw error;
            })
        );
    }

    // ========================
    // UTILITY METHODS
    // ========================

    /**
     * Process icons for Personal data (uses FontAwesome)
     */
    private processPersonalIcons<T extends { icon?: any }>(items: T[]): T[] {
        return items.map(item => ({
            ...item,
            icon: typeof item.icon === 'string'
                ? this.iconHelperService.stringToFontAwesome(item.icon)
                : item.icon
        }));
    }

    /**
     * Process icons for Education/Skills/Tech/Timeline data (uses Lucide)
     */
    private processLucideIcons<T extends { icon?: any }>(items: T[]): T[] {
        return items.map(item => ({
            ...item,
            icon: typeof item.icon === 'string'
                ? this.iconHelperService.stringToLucide(item.icon)
                : item.icon
        }));
    }

    private setLoadingState(section: keyof LoadingStates, loading: boolean): void {
        const currentStates = this.loadingStates$.value;
        this.loadingStates$.next({ ...currentStates, [section]: loading });
    }

    private setAllLoadingStates(loading: boolean): void {
        const states: LoadingStates = {
            personal: loading,
            projects: loading,
            education: loading,
            skills: loading,
            technologies: loading,
            timeline: loading,
            volunteer: loading,
            contact: loading,
            certificates: loading
        };
        this.loadingStates$.next(states);
    }

    private setErrorState(section: keyof ErrorStates, error: string | null): void {
        const currentStates = this.errorStates$.value;
        this.errorStates$.next({ ...currentStates, [section]: error });
    }

    private clearAllErrors(): void {
        const states: ErrorStates = {
            personal: null,
            projects: null,
            education: null,
            skills: null,
            technologies: null,
            timeline: null,
            volunteer: null,
            contact: null,
            certificates: null
        };
        this.errorStates$.next(states);
    }

    // ========================
    // DATA QUERIES AND UTILITIES
    // ========================

    /**
     * Check if all data is loaded
     */
    isDataLoaded(): Observable<boolean> {
        return this.allData$.pipe(
            map(data => data !== null)
        );
    }

    /**
     * Get data loading progress (0-100)
     */
    getLoadingProgress(): Observable<number> {
        return this.loadingStates$.pipe(
            map(states => {
                const totalSections = Object.keys(states).length;
                const loadedSections = Object.values(states).filter(loading => !loading).length;
                return Math.round((loadedSections / totalSections) * 100);
            })
        );
    }

}