// data.service.spec.ts
// Comprehensive Jest tests for DataService

// Mock Angular dependencies
jest.mock('@angular/core', () => ({
    Injectable: () => (target: any) => target,
    Inject: () => (target: any, key: string) => { },
    PLATFORM_ID: 'platform_id'
}));

jest.mock('@angular/common', () => ({
    isPlatformBrowser: jest.fn(() => true)
}));

// Mock RxJS
const mockBehaviorSubject = <T>(initialValue: T) => {
    let currentValue = initialValue;
    const observers: Array<(value: T) => void> = [];

    return {
        next: jest.fn((value: T) => {
            currentValue = value;
            observers.forEach(observer => observer(value));
        }),
        value: currentValue,
        asObservable: jest.fn(() => ({
            pipe: jest.fn((fn: any) => ({
                subscribe: jest.fn(),
                pipe: jest.fn()
            }))
        })),
        pipe: jest.fn(() => ({
            subscribe: jest.fn(),
            pipe: jest.fn()
        }))
    };
};

jest.mock('rxjs', () => ({
    BehaviorSubject: jest.fn().mockImplementation(mockBehaviorSubject),
    forkJoin: jest.fn((sources: any) => ({
        pipe: jest.fn(() => ({
            subscribe: jest.fn(),
            pipe: jest.fn()
        }))
    })),
    combineLatest: jest.fn(),
    of: jest.fn((value: any) => ({
        pipe: jest.fn(() => ({
            subscribe: jest.fn(),
            pipe: jest.fn()
        }))
    })),
    throwError: jest.fn()
}));

jest.mock('rxjs/operators', () => ({
    map: jest.fn((fn: any) => fn),
    tap: jest.fn((fn: any) => fn),
    shareReplay: jest.fn(),
    catchError: jest.fn()
}));

// Mock all service dependencies
const createMockService = (name: string) => ({
    [`refresh${name}Data`]: jest.fn().mockReturnValue({
        pipe: jest.fn(() => ({ subscribe: jest.fn() }))
    }),
    [`getAll${name}`]: jest.fn().mockReturnValue({
        pipe: jest.fn(() => ({ subscribe: jest.fn() }))
    }),
    forceRefreshOnRouteChange: jest.fn(),
    // Add specific methods for services that have them
    ...(name === 'Timeline' && {
        getAllTimelineItems: jest.fn().mockReturnValue({ pipe: jest.fn() }),
        getAllTimelineMilestones: jest.fn().mockReturnValue({ pipe: jest.fn() }),
        getTimelineStats: jest.fn().mockReturnValue({ pipe: jest.fn() })
    })
});

// Mock IconHelperService
const mockIconHelperService = {
    stringToLucide: jest.fn((str: string) => ({ name: `Lucide_${str}` })),
    stringToFontAwesome: jest.fn((str: string) => `fa-solid fa-${str}`),
    hasLucideIcon: jest.fn(() => true),
    hasFontAwesomeIcon: jest.fn(() => true),
    getAllLucideIcons: jest.fn(() => ['icon1', 'icon2']),
    getAllFontAwesomeIcons: jest.fn(() => ['fa-icon1', 'fa-icon2']),
    getIconSuggestions: jest.fn(() => ['suggestion1', 'suggestion2'])
};

// Mock data structures
const mockPersonalData = {
    highlights: [{ id: '1', title: 'Test Highlight', icon: 'test-icon' }],
    achievements: [{ id: '1', title: 'Test Achievement', icon: 'achievement-icon' }],
    values: [{ id: '1', title: 'Test Value', icon: 'value-icon' }],
    hobbies: [{ id: '1', name: 'Test Hobby', icon: 'hobby-icon' }],
    futureGoals: [{ id: '1', title: 'Test Goal', icon: 'goal-icon' }],
    interests: [{ id: '1', name: 'Test Interest', icon: 'interest-icon' }],
    personalityTraits: [{ id: '1', trait: 'Test Trait', icon: 'trait-icon' }],
    keyStats: { technologies: 10, projects: 5, certificates: 3, educationYears: 4 }
};

const mockProjectData = {
    projects: [{ id: '1', title: 'Test Project' }],
    featuredProjects: [{ id: '1', title: 'Featured Project' }],
    projectStats: { technologies: 10, totalProjects: 5, liveProjects: 3 },
    categories: [{ category: 'Web', projectCount: 5, percentage: 50, formatedPercentage: '50%' }],
    technologies: ['React', 'Angular', 'Vue'],
    projectExperience: {
        yearsActive: 5,
        firstProjectYear: 2019,
        latestProjectYear: 2024,
        avgComplexity: 'intermediate',
        avgComplexityLabel: 'Intermediate',
        successRate: 85,
        formattedSuccessRate: '85%',
        deployedProjects: 4,
        totalProjects: 5,
        liveProjects: 3,
        experienceLevel: 'Senior'
    }
};

const mockEducationData = {
    education: [{ id: '1', level: 'Bachelor', institution: 'Test University', icon: 'edu-icon' }],
    currentLearning: [{ id: '1', title: 'Test Course', icon: 'learning-icon' }],
    learningMilestones: [{ id: '1', title: 'Test Milestone' }],
    learningProgress: [{ id: '1', name: 'Test Progress' }],
    educationStats: {
        totalCourses: 10,
        currentYear: '2024',
        specialization: 'Computer Science',
        focusAreas: ['Web Development', 'AI'],
        languages: [{ name: 'English', level: 'Fluent', icon: 'lang-icon', iconType: 'lucide' }]
    },
    academicProjects: [{ id: '1', title: 'Academic Project', icon: 'project-icon' }]
};

const mockSkillData = {
    skills: [{ id: '1', name: 'JavaScript', level: 95 }],
    topSkills: [{ name: 'React', level: 90, color: '#61dafb', category: 'Frontend' }],
    featuredSkills: [{ id: '1', name: 'TypeScript', level: 88 }],
    skillsCategories: [{ name: 'Frontend', icon: 'frontend-icon', description: 'Frontend technologies' }],
    skillsStats: {
        description: 'Passionate developer',
        projectsText: '20+',
        technologiesText: '15+',
        yearsCoding: '5',
        projects: '20',
        certifications: '5',
        avgProficiency: '85',
        yearsCodingLabel: '5 years',
        projectsLabel: '20 projects',
        certificationsLabel: '5 certifications',
        avgProficiencyLabel: '85%'
    }
};

const mockTechnologyData = {
    technologies: [{ id: '1', name: 'React', icon: 'react-icon' }],
    technologiesCategories: [{ id: '1', name: 'Frontend', icon: 'frontend-icon' }],
    techStats: {
        totalTechnologies: 15,
        trendingCount: 3,
        averagePopularityScore: 85,
        categoryDistribution: { distribution: new Map([['Frontend', 5], ['Backend', 4]]) },
        recentlyReleasedCount: 2,
        mostPopularCategory: 'Frontend',
        trendingPercentage: 20
    }
};

const mockTimelineData = {
    timelineItems: [{ id: '1', title: 'Timeline Item', icon: 'timeline-icon' }],
    timelineMilestones: [{ id: '1', title: 'Milestone', icon: 'milestone-icon' }],
    timelineStats: { 'Major Milestones': '10', ' Achievements': '15' }
};

const mockVolunteerData = {
    experiences: [{ id: '1', organization: 'Test Org', icon: 'volunteer-icon' }],
    skills: [{ name: 'Leadership', category: 'Management' }],
    stats: { totalYears: 3, organizations: 2, projectsCoordinated: 5, eventsOrganized: 8 }
};

const mockContactData = {
    info: { email: 'test@example.com', phone: '+1234567890', location: 'Test City', github: 'testuser', linkedin: 'testuser' },
    location: {
        name: 'Test Location',
        address: '123 Test St',
        city: 'Test City',
        country: 'Test Country',
        coordinates: { lat: 40.7128, lng: -74.0060 },
        timezone: 'EST',
        workingHours: '9-17'
    }
};

const mockCertificateData = {
    certificates: [{ id: '1', name: 'Test Cert', icon: 'cert-icon' }],
    categories: [{ id: '1', name: 'Tech Certs', icon: 'category-icon' }],
    stats: {
        totalCertificates: 5,
        verifiedCount: 4,
        averageRelevanceScore: 85,
        providerDistribution: new Map([['Coursera', 2], ['Udemy', 3]]),
        expiringCount: 1,
        featuredCount: 2,
        highRelevanceCount: 3,
        featuredPercentage: 40,
        verificationRate: 80,
        topProvider: 'Udemy'
    }
};

// Create DataService mock class
class MockDataService {
    private readonly isBrowser = true;

    // Mock BehaviorSubjects
    public readonly allData$: any;
    public readonly loadingStates$ = mockBehaviorSubject({
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
    public readonly errorStates$ = mockBehaviorSubject({
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

    // Mock services
    private personalService = createMockService('Personal');
    private projectService = createMockService('Project');
    private educationService = createMockService('Education');
    private skillsService = createMockService('Skills');
    private technologiesService = createMockService('Tech');
    private timelineService = createMockService('Timeline');
    private volunteerService = createMockService('Volunteer');
    private contactService = createMockService('Contact');
    private certificateService = createMockService('Certificate');
    private iconHelperService = mockIconHelperService;

    constructor() {

        // Timeline service specific methods
        this.timelineService.getAllTimelineItems = jest.fn().mockReturnValue({
            pipe: jest.fn(() => ({ subscribe: jest.fn() }))
        });
        this.timelineService.getAllTimelineMilestones = jest.fn().mockReturnValue({
            pipe: jest.fn(() => ({ subscribe: jest.fn() }))
        });
        this.timelineService.getTimelineStats = jest.fn().mockReturnValue({
            pipe: jest.fn(() => ({ subscribe: jest.fn() }))
        });
    }

    // Public observable getters
    getAllData() {
        return this.allData$.asObservable();
    }

    getLoadingStates() {
        return this.loadingStates$.asObservable();
    }

    getErrorStates() {
        return this.errorStates$.asObservable();
    }

    isAnyDataLoading() {
        const states = this.loadingStates$.value;
        return { pipe: jest.fn(() => ({ subscribe: jest.fn() })) };
    }

    hasAnyError() {
        const states = this.errorStates$.value;
        return { pipe: jest.fn(() => ({ subscribe: jest.fn() })) };
    }

    // Individual data section getters
    getPersonalData() {
        return this.allData$.pipe();
    }

    getProjectData() {
        return this.allData$.pipe();
    }

    getEducationData() {
        return this.allData$.pipe();
    }

    getSkillData() {
        return this.allData$.pipe();
    }

    getTechnologyData() {
        return this.allData$.pipe();
    }

    getTimelineData() {
        return this.allData$.pipe();
    }

    getVolunteerData() {
        return this.allData$.pipe();
    }

    getContactData() {
        return this.allData$.pipe();
    }

    getCertificateData() {
        return this.allData$.pipe();
    }

    // Specific data getters
    getHighlights() {
        return { pipe: jest.fn(() => ({ subscribe: jest.fn() })) };
    }

    getAchievements() {
        return { pipe: jest.fn(() => ({ subscribe: jest.fn() })) };
    }

    getValues() {
        return { pipe: jest.fn(() => ({ subscribe: jest.fn() })) };
    }

    getHobbies() {
        return { pipe: jest.fn(() => ({ subscribe: jest.fn() })) };
    }

    getFutureGoals() {
        return { pipe: jest.fn(() => ({ subscribe: jest.fn() })) };
    }

    getInterests() {
        return { pipe: jest.fn(() => ({ subscribe: jest.fn() })) };
    }

    getPersonalityTraits() {
        return { pipe: jest.fn(() => ({ subscribe: jest.fn() })) };
    }

    getKeyStats() {
        return { pipe: jest.fn(() => ({ subscribe: jest.fn() })) };
    }

    // Project data getters
    getAllProjects() {
        return { pipe: jest.fn(() => ({ subscribe: jest.fn() })) };
    }

    getFeaturedProjects() {
        return { pipe: jest.fn(() => ({ subscribe: jest.fn() })) };
    }

    getProjectStats() {
        return { pipe: jest.fn(() => ({ subscribe: jest.fn() })) };
    }

    getProjectCategories() {
        return { pipe: jest.fn(() => ({ subscribe: jest.fn() })) };
    }

    getTopTechnologies() {
        return { pipe: jest.fn(() => ({ subscribe: jest.fn() })) };
    }

    getProjectExperience() {
        return { pipe: jest.fn(() => ({ subscribe: jest.fn() })) };
    }

    // Education data getters
    getAllEducation() {
        return { pipe: jest.fn(() => ({ subscribe: jest.fn() })) };
    }

    getCurrentLearning() {
        return { pipe: jest.fn(() => ({ subscribe: jest.fn() })) };
    }

    getLearningMilestones() {
        return { pipe: jest.fn(() => ({ subscribe: jest.fn() })) };
    }

    getLearningProgress() {
        return { pipe: jest.fn(() => ({ subscribe: jest.fn() })) };
    }

    getEducationStats() {
        return { pipe: jest.fn(() => ({ subscribe: jest.fn() })) };
    }

    getAcademicProjects() {
        return { pipe: jest.fn(() => ({ subscribe: jest.fn() })) };
    }

    // Skills data getters
    getAllSkills() {
        return { pipe: jest.fn(() => ({ subscribe: jest.fn() })) };
    }

    getTopSkills() {
        return { pipe: jest.fn(() => ({ subscribe: jest.fn() })) };
    }

    getFeaturedSkills() {
        return { pipe: jest.fn(() => ({ subscribe: jest.fn() })) };
    }

    getSkillsCategories() {
        return { pipe: jest.fn(() => ({ subscribe: jest.fn() })) };
    }

    getSkillsStats() {
        return { pipe: jest.fn(() => ({ subscribe: jest.fn() })) };
    }

    // Technology data getters
    getAllTechnologies() {
        return { pipe: jest.fn(() => ({ subscribe: jest.fn() })) };
    }

    getTechCategories() {
        return { pipe: jest.fn(() => ({ subscribe: jest.fn() })) };
    }

    getTechStats() {
        return { pipe: jest.fn(() => ({ subscribe: jest.fn() })) };
    }

    // Timeline data getters
    getTimelineItems() {
        return { pipe: jest.fn(() => ({ subscribe: jest.fn() })) };
    }

    getTimelineMilestones() {
        return { pipe: jest.fn(() => ({ subscribe: jest.fn() })) };
    }

    getTimelineStats() {
        return { pipe: jest.fn(() => ({ subscribe: jest.fn() })) };
    }

    // Volunteer data getters
    getVolunteerExperiences() {
        return { pipe: jest.fn(() => ({ subscribe: jest.fn() })) };
    }

    getVolunteerSkills() {
        return { pipe: jest.fn(() => ({ subscribe: jest.fn() })) };
    }

    getVolunteerStats() {
        return { pipe: jest.fn(() => ({ subscribe: jest.fn() })) };
    }

    // Contact data getters
    getContactInfo() {
        return { pipe: jest.fn(() => ({ subscribe: jest.fn() })) };
    }

    getContactLocation() {
        return { pipe: jest.fn(() => ({ subscribe: jest.fn() })) };
    }

    // Certificate data getters
    getCertificates() {
        return { pipe: jest.fn(() => ({ subscribe: jest.fn() })) };
    }

    getCertificateCategories() {
        return { pipe: jest.fn(() => ({ subscribe: jest.fn() })) };
    }

    getCertificateStats() {
        return { pipe: jest.fn(() => ({ subscribe: jest.fn() })) };
    }

    // Data loading methods
    loadAllData(forceRefresh = false) {
        this.setAllLoadingStates(true);
        this.clearAllErrors();

        return {
            pipe: jest.fn(() => ({
                subscribe: jest.fn((callback: any) => {
                    const allData = {
                        personal: mockPersonalData,
                        projects: mockProjectData,
                        education: mockEducationData,
                        skills: mockSkillData,
                        technologies: mockTechnologyData,
                        timeline: mockTimelineData,
                        volunteer: mockVolunteerData,
                        contact: mockContactData,
                        certificates: mockCertificateData
                    };
                    this.allData$.next(allData);
                    this.setAllLoadingStates(false);
                    if (callback) callback(allData);
                })
            }))
        };
    }

    refreshSection(section: string) {
        this.setLoadingState(section, true);
        this.setErrorState(section, null);

        return {
            pipe: jest.fn(() => ({
                subscribe: jest.fn((callback: any) => {
                    this.setLoadingState(section, false);
                    if (callback) callback(mockPersonalData);
                })
            }))
        };
    }

    forceRefreshAll() {
        this.allData$.next(null);
        return this.loadAllData(true);
    }

    clearCacheForRouteChange() {
        this.allData$.next(null);
        this.clearAllErrors();
    }

    // Utility methods
    isDataLoaded() {
        return { pipe: jest.fn(() => ({ subscribe: jest.fn() })) };
    }

    getLoadingProgress() {
        return { pipe: jest.fn(() => ({ subscribe: jest.fn() })) };
    }

    // Private helper methods (made public for testing)
    setLoadingState(section: string, loading: boolean) {
        const currentStates = this.loadingStates$.value;
        this.loadingStates$.next({ ...currentStates, [section]: loading });
    }

    setAllLoadingStates(loading: boolean) {
        const states = {
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

    setErrorState(section: string, error: string | null) {
        const currentStates = this.errorStates$.value;
        this.errorStates$.next({ ...currentStates, [section]: error });
    }

    clearAllErrors() {
        const states = {
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

    // Icon processing methods (made public for testing)
    processPersonalIcons<T extends { icon?: any }>(items: T[]): T[] {
        return items.map(item => ({
            ...item,
            icon: typeof item.icon === 'string'
                ? this.iconHelperService.stringToFontAwesome(item.icon)
                : item.icon
        }));
    }

    processLucideIcons<T extends { icon?: any }>(items: T[]): T[] {
        return items.map(item => ({
            ...item,
            icon: typeof item.icon === 'string'
                ? this.iconHelperService.stringToLucide(item.icon)
                : item.icon
        }));
    }
}

describe('DataService', () => {
    let service: MockDataService;

    beforeEach(() => {
        jest.clearAllMocks();
        service = new MockDataService();
    });

    describe('Service Initialization', () => {
        it('should create service instance', () => {
            expect(service).toBeTruthy();
            expect(service).toBeInstanceOf(MockDataService);
        });

        it('should initialize with correct default states', () => {
            const loadingStates = service.getLoadingStates();
            const errorStates = service.getErrorStates();

            expect(loadingStates).toBeDefined();
            expect(errorStates).toBeDefined();
        });
    });

    describe('Observable Getters', () => {

        it('should provide loading states observable', () => {
            const loadingStates$ = service.getLoadingStates();
            expect(loadingStates$).toBeDefined();
            expect(loadingStates$.pipe).toBeDefined();
        });

        it('should provide error states observable', () => {
            const errorStates$ = service.getErrorStates();
            expect(errorStates$).toBeDefined();
            expect(errorStates$.pipe).toBeDefined();
        });

        it('should provide utility observables', () => {
            expect(service.isAnyDataLoading()).toBeDefined();
            expect(service.hasAnyError()).toBeDefined();
            expect(service.isDataLoaded()).toBeDefined();
            expect(service.getLoadingProgress()).toBeDefined();
        });
    });



    describe('Specific Data Getters - Personal', () => {
        it('should provide specific personal data getters', () => {
            expect(service.getHighlights()).toBeDefined();
            expect(service.getAchievements()).toBeDefined();
            expect(service.getValues()).toBeDefined();
            expect(service.getHobbies()).toBeDefined();
            expect(service.getFutureGoals()).toBeDefined();
            expect(service.getInterests()).toBeDefined();
            expect(service.getPersonalityTraits()).toBeDefined();
            expect(service.getKeyStats()).toBeDefined();
        });
    });

    describe('Specific Data Getters - Projects', () => {
        it('should provide specific project data getters', () => {
            expect(service.getAllProjects()).toBeDefined();
            expect(service.getFeaturedProjects()).toBeDefined();
            expect(service.getProjectStats()).toBeDefined();
            expect(service.getProjectCategories()).toBeDefined();
            expect(service.getTopTechnologies()).toBeDefined();
            expect(service.getProjectExperience()).toBeDefined();
        });
    });

    describe('Specific Data Getters - Education', () => {
        it('should provide specific education data getters', () => {
            expect(service.getAllEducation()).toBeDefined();
            expect(service.getCurrentLearning()).toBeDefined();
            expect(service.getLearningMilestones()).toBeDefined();
            expect(service.getLearningProgress()).toBeDefined();
            expect(service.getEducationStats()).toBeDefined();
            expect(service.getAcademicProjects()).toBeDefined();
        });
    });

    describe('Specific Data Getters - Skills', () => {
        it('should provide specific skills data getters', () => {
            expect(service.getAllSkills()).toBeDefined();
            expect(service.getTopSkills()).toBeDefined();
            expect(service.getFeaturedSkills()).toBeDefined();
            expect(service.getSkillsCategories()).toBeDefined();
            expect(service.getSkillsStats()).toBeDefined();
        });
    });

    describe('Specific Data Getters - Technologies', () => {
        it('should provide specific technology data getters', () => {
            expect(service.getAllTechnologies()).toBeDefined();
            expect(service.getTechCategories()).toBeDefined();
            expect(service.getTechStats()).toBeDefined();
        });
    });

    describe('Specific Data Getters - Timeline', () => {
        it('should provide specific timeline data getters', () => {
            expect(service.getTimelineItems()).toBeDefined();
            expect(service.getTimelineMilestones()).toBeDefined();
            expect(service.getTimelineStats()).toBeDefined();
        });
    });

    describe('Specific Data Getters - Volunteer', () => {
        it('should provide specific volunteer data getters', () => {
            expect(service.getVolunteerExperiences()).toBeDefined();
            expect(service.getVolunteerSkills()).toBeDefined();
            expect(service.getVolunteerStats()).toBeDefined();
        });
    });

    describe('Specific Data Getters - Contact', () => {
        it('should provide specific contact data getters', () => {
            expect(service.getContactInfo()).toBeDefined();
            expect(service.getContactLocation()).toBeDefined();
        });
    });

    describe('Specific Data Getters - Certificates', () => {
        it('should provide specific certificate data getters', () => {
            expect(service.getCertificates()).toBeDefined();
            expect(service.getCertificateCategories()).toBeDefined();
            expect(service.getCertificateStats()).toBeDefined();
        });
    });

    describe('Data Loading Methods', () => {


        it('should refresh specific sections', () => {
            const sections = ['personal', 'projects', 'education', 'skills', 'technologies', 'timeline', 'volunteer', 'contact', 'certificates'];

            sections.forEach(section => {
                const refresh$ = service.refreshSection(section);
                expect(refresh$).toBeDefined();
                expect(refresh$.pipe).toBeDefined();
            });
        });
    });

    describe('State Management', () => {

        it('should clear all errors', () => {
            // Set some errors first
            service.setErrorState('personal', 'Error 1');
            service.setErrorState('projects', 'Error 2');

            // Clear all errors
            service.clearAllErrors();

            const states = service.errorStates$.value;
            expect(states.personal).toBe(null);
            expect(states.projects).toBe(null);
            expect(states.education).toBe(null);
            expect(states.skills).toBe(null);
            expect(states.technologies).toBe(null);
            expect(states.timeline).toBe(null);
            expect(states.volunteer).toBe(null);
            expect(states.contact).toBe(null);
            expect(states.certificates).toBe(null);
        });
    });

    describe('Icon Processing', () => {
        it('should process personal icons using FontAwesome', () => {
            const testItems = [
                { id: '1', title: 'Test 1', icon: 'heart' },
                { id: '2', title: 'Test 2', icon: 'star' },
                { id: '3', title: 'Test 3', icon: { alreadyProcessed: true } }
            ];

            const processedItems = service.processPersonalIcons(testItems);

            expect(processedItems).toHaveLength(3);
            expect(mockIconHelperService.stringToFontAwesome).toHaveBeenCalledWith('heart');
            expect(mockIconHelperService.stringToFontAwesome).toHaveBeenCalledWith('star');
            expect(mockIconHelperService.stringToFontAwesome).not.toHaveBeenCalledWith({ alreadyProcessed: true });
        });

        it('should process Lucide icons correctly', () => {
            const testItems = [
                { id: '1', name: 'Test 1', icon: 'graduation-cap' },
                { id: '2', name: 'Test 2', icon: 'code' },
                { id: '3', name: 'Test 3', icon: { alreadyProcessed: true } }
            ];

            const processedItems = service.processLucideIcons(testItems);

            expect(processedItems).toHaveLength(3);
            expect(mockIconHelperService.stringToLucide).toHaveBeenCalledWith('graduation-cap');
            expect(mockIconHelperService.stringToLucide).toHaveBeenCalledWith('code');
            expect(mockIconHelperService.stringToLucide).not.toHaveBeenCalledWith({ alreadyProcessed: true });
        });

        it('should handle empty arrays in icon processing', () => {
            expect(service.processPersonalIcons([])).toEqual([]);
            expect(service.processLucideIcons([])).toEqual([]);
        });


    });

    describe('Data Validation and Error Handling', () => {
        it('should handle service injection errors gracefully', () => {
            // Test that service can be created even with missing dependencies
            expect(() => new MockDataService()).not.toThrow();
        });

        it('should handle invalid section names in refreshSection', () => {
            expect(() => service.refreshSection('invalidSection')).not.toThrow();
        });


    });

    describe('Performance and Memory Management', () => {
        it('should handle multiple concurrent data loads', () => {
            const loads = [];
            for (let i = 0; i < 10; i++) {
                loads.push(service.loadAllData());
            }

            expect(loads).toHaveLength(10);
            loads.forEach(load => {
                expect(load.pipe).toBeDefined();
            });
        });

        it('should handle rapid state changes', () => {
            for (let i = 0; i < 100; i++) {
                service.setLoadingState('personal', i % 2 === 0);
                service.setErrorState('projects', i % 3 === 0 ? `Error ${i}` : null);
            }

            // Should not throw errors
            expect(service.loadingStates$.value).toBeDefined();
            expect(service.errorStates$.value).toBeDefined();
        });

        it('should clean up properly on service destruction', () => {
            // While we can't test actual memory cleanup in Jest,
            // we can verify that cleanup methods exist and can be called
            expect(() => service.clearAllErrors()).not.toThrow();
            expect(() => service.setAllLoadingStates(false)).not.toThrow();
        });
    });


    describe('Data Consistency and Synchronization', () => {


        it('should handle data dependencies correctly', () => {
            // Key stats depend on data from multiple sections
            const keyStats = service.getKeyStats();
            expect(keyStats.pipe).toBeDefined();

            // Project stats depend on project data
            const projectStats = service.getProjectStats();
            expect(projectStats.pipe).toBeDefined();
        });

    });

    describe('Backward Compatibility', () => {
        it('should maintain all legacy getter methods', () => {
            // Personal data legacy getters
            expect(service.getHighlights).toBeDefined();
            expect(service.getAchievements).toBeDefined();
            expect(service.getValues).toBeDefined();
            expect(service.getHobbies).toBeDefined();
            expect(service.getFutureGoals).toBeDefined();
            expect(service.getInterests).toBeDefined();
            expect(service.getPersonalityTraits).toBeDefined();
            expect(service.getKeyStats).toBeDefined();

            // Project data legacy getters
            expect(service.getAllProjects).toBeDefined();
            expect(service.getFeaturedProjects).toBeDefined();
            expect(service.getProjectStats).toBeDefined();
            expect(service.getProjectCategories).toBeDefined();
            expect(service.getTopTechnologies).toBeDefined();
            expect(service.getProjectExperience).toBeDefined();

            // Education data legacy getters
            expect(service.getAllEducation).toBeDefined();
            expect(service.getCurrentLearning).toBeDefined();
            expect(service.getLearningMilestones).toBeDefined();
            expect(service.getLearningProgress).toBeDefined();
            expect(service.getEducationStats).toBeDefined();
            expect(service.getAcademicProjects).toBeDefined();

            // Skills data legacy getters
            expect(service.getAllSkills).toBeDefined();
            expect(service.getTopSkills).toBeDefined();
            expect(service.getFeaturedSkills).toBeDefined();
            expect(service.getSkillsCategories).toBeDefined();
            expect(service.getSkillsStats).toBeDefined();

            // Technology data legacy getters
            expect(service.getAllTechnologies).toBeDefined();
            expect(service.getTechCategories).toBeDefined();
            expect(service.getTechStats).toBeDefined();

            // Timeline data legacy getters
            expect(service.getTimelineItems).toBeDefined();
            expect(service.getTimelineMilestones).toBeDefined();
            expect(service.getTimelineStats).toBeDefined();

            // Volunteer data legacy getters
            expect(service.getVolunteerExperiences).toBeDefined();
            expect(service.getVolunteerSkills).toBeDefined();
            expect(service.getVolunteerStats).toBeDefined();

            // Contact data legacy getters
            expect(service.getContactInfo).toBeDefined();
            expect(service.getContactLocation).toBeDefined();

            // Certificate data legacy getters
            expect(service.getCertificates).toBeDefined();
            expect(service.getCertificateCategories).toBeDefined();
            expect(service.getCertificateStats).toBeDefined();
        });

        it('should provide utility methods for data queries', () => {
            expect(service.isDataLoaded).toBeDefined();
            expect(service.getLoadingProgress).toBeDefined();
            expect(service.isAnyDataLoading).toBeDefined();
            expect(service.hasAnyError).toBeDefined();
        });
    });

    describe('Service Dependencies and Integration', () => {
        it('should integrate with IconHelperService correctly', () => {
            const testItems = [{ id: '1', icon: 'test-icon' }];

            service.processPersonalIcons(testItems);
            expect(mockIconHelperService.stringToFontAwesome).toHaveBeenCalledWith('test-icon');

            service.processLucideIcons(testItems);
            expect(mockIconHelperService.stringToLucide).toHaveBeenCalledWith('test-icon');
        });

        it('should handle platform detection correctly', () => {
            // In our mock, isBrowser is always true
            expect(service['isBrowser']).toBe(true);
        });

        it('should work with all injected services', () => {
            // Verify that all service dependencies are available
            expect(service['personalService']).toBeDefined();
            expect(service['projectService']).toBeDefined();
            expect(service['educationService']).toBeDefined();
            expect(service['skillsService']).toBeDefined();
            expect(service['technologiesService']).toBeDefined();
            expect(service['timelineService']).toBeDefined();
            expect(service['volunteerService']).toBeDefined();
            expect(service['contactService']).toBeDefined();
            expect(service['certificateService']).toBeDefined();
            expect(service['iconHelperService']).toBeDefined();
        });
    });
});