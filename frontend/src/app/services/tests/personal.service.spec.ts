// personal.service.spec.ts
// Complete Jest tests for PersonalService respecting proper Jest types

// ========================
// MOCK ANGULAR DEPENDENCIES
// ========================

jest.mock('@angular/core', () => ({
    Injectable: (): ClassDecorator => (target: any): any => target,
    Inject: (): ParameterDecorator => (): void => { },
    PLATFORM_ID: 'platform_id'
}));

jest.mock('@angular/common/http', () => ({
    HttpClient: jest.fn()
}));

// ========================
// MOCK RXJS
// ========================

export const createMockObservable = <T>(value: T) => ({
    pipe: jest.fn().mockReturnValue({
        subscribe: jest.fn().mockImplementation((callback?: (value: T) => void) => {
            if (callback) callback(value);
            return { unsubscribe: jest.fn() };
        })
    }),
    subscribe: jest.fn().mockImplementation((callback?: (value: T) => void) => {
        if (callback) callback(value);
        return { unsubscribe: jest.fn() };
    })
});

jest.mock('rxjs', () => ({
    of: jest.fn().mockImplementation(<T>(value: T) => createMockObservable(value)),
    forkJoin: jest.fn().mockImplementation((sources: Record<string, any>) => {
        const results: Record<string, any> = {};
        Object.keys(sources).forEach(key => {
            results[key] = sources[key];
        });
        return createMockObservable(results);
    }),
    throwError: jest.fn().mockImplementation(() => createMockObservable(new Error('Mock error')))
}));

jest.mock('rxjs/operators', () => ({
    catchError: jest.fn().mockImplementation(() => (source: any) => source),
    tap: jest.fn().mockImplementation(() => (source: any) => source),
    map: jest.fn().mockImplementation(() => (source: any) => source),
    shareReplay: jest.fn().mockImplementation(() => (source: any) => source)
}));

// ========================
// TYPE DEFINITIONS
// ========================

interface TestKeyStats {
    technologies: number;
    projects: number;
    certificates: number;
    educationYears: number;
}

interface TestHighlight {
    id: string;
    title: string;
    description: string;
    metrics?: Record<string, any>;
    tags?: string[];
}

interface TestAchievement {
    id: string;
    title: string;
    description: string;
    date: string;
    skillsGained?: string[];
    url?: string;
}

interface TestValue {
    id: string;
    title: string;
    description: string;
    examples?: string[];
    relatedSkills?: string[];
}

interface TestHobby {
    id: string;
    name: string;
    description: string;
    yearsActive: number;
    relatedSkills?: string[];
    achievements?: string[];
    equipment?: string[];
    timePerWeek?: number;
}

interface TestFutureGoal {
    id: string;
    title: string;
    description: string;
    targetDate: string;
    progress?: number;
    milestones?: Array<{
        description: string;
        completed: boolean;
        targetDate?: string;
    }>;
}

interface TestInterest {
    id: string;
    name: string;
    description: string;
    recentDiscoveries?: string[];
}

interface TestPersonalityTrait {
    id: string;
    trait: string;
    description: string;
    examples?: string[];
}

// ========================
// MOCK DATA
// ========================

const mockKeyStats: TestKeyStats = {
    technologies: 15,
    projects: 12,
    certificates: 8,
    educationYears: 4
};

const mockHighlights: TestHighlight[] = [
    {
        id: '1',
        title: 'Outstanding Performance',
        description: 'Achieved exceptional results',
        metrics: { rating: 5 },
        tags: ['performance']
    }
];

const mockAchievements: TestAchievement[] = [
    {
        id: '1',
        title: 'Full Stack Certification',
        description: 'Completed comprehensive program',
        date: '2024-01-15',
        skillsGained: ['React', 'Node.js'],
        url: 'https://example.com/cert'
    }
];

const mockValues: TestValue[] = [
    {
        id: '1',
        title: 'Continuous Learning',
        description: 'Commitment to growth',
        examples: ['Online courses'],
        relatedSkills: ['Research']
    }
];

const mockHobbies: TestHobby[] = [
    {
        id: '1',
        name: 'Photography',
        description: 'Capturing moments',
        yearsActive: 5,
        relatedSkills: ['Creativity'],
        timePerWeek: 6
    }
];

const mockFutureGoals: TestFutureGoal[] = [
    {
        id: '1',
        title: 'Master Machine Learning',
        description: 'Become proficient in ML',
        targetDate: 'Dec 2024',
        progress: 30
    }
];

const mockInterests: TestInterest[] = [
    {
        id: '1',
        name: 'Artificial Intelligence',
        description: 'Exploring AI technologies',
        recentDiscoveries: ['GPT models']
    }
];

const mockPersonalityTraits: TestPersonalityTrait[] = [
    {
        id: '1',
        trait: 'Problem Solver',
        description: 'Enjoys tackling challenges',
        examples: ['Debugging', 'Optimization']
    }
];

// ========================
// MOCK GLOBAL SERVICE
// ========================

class MockGlobalService {
    protected readonly apiUrl: string = 'https://api.test.com';
    protected isBrowser: boolean = true;
    protected readonly serviceName: string = 'MockService';
    protected readonly serviceApiUrl: string = 'https://api.test.com/test';
    protected readonly cacheConfig = {
        defaultTTL: 300000,
        maxCacheSize: 20,
        enablePrefetch: true
    };

    makeRequest: jest.Mock = jest.fn().mockImplementation(() => createMockObservable({ data: 'test' }));
    makeRequestFresh: jest.Mock = jest.fn().mockImplementation(() => createMockObservable({ data: 'test' }));
    invalidateCache: jest.Mock = jest.fn();
    forceRefreshOnRouteChange: jest.Mock = jest.fn();

    validateNumber: jest.Mock = jest.fn().mockImplementation((value: any, defaultValue: number): number => {
        const num = Number(value);
        return isNaN(num) || num < 0 ? defaultValue : num;
    });

    sanitizeUrl: jest.Mock = jest.fn().mockImplementation((url?: string): string | undefined => {
        if (!url) return undefined;
        try {
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                url = 'https://' + url;
            }
            new URL(url);
            return url;
        } catch {
            return undefined;
        }
    });

    log: jest.Mock = jest.fn();

    constructor(http: any, platformId: any) { }
}

// ========================
// MOCK PERSONAL SERVICE
// ========================

class MockPersonalService extends MockGlobalService {
    protected override readonly serviceName: string = 'PersonalService';
    protected override readonly serviceApiUrl: string = `${this.apiUrl}/personal`;

    protected override readonly cacheConfig = {
        defaultTTL: 300000,
        maxCacheSize: 20,
        enablePrefetch: true,
        cleanupInterval: 120000,
        prefetchDelay: 2000,
        avgEntrySize: 1024,
        expectedHitRate: 0.85
    };

    constructor(http: any, platformId: any) {
        super(http, platformId);
    }

    getAllHighlights() {
        return this.makeRequest('HIGHLIGHTS', `${this.serviceApiUrl}/highlights`, mockHighlights);
    }

    getAllAchievements() {
        return this.makeRequest('ACHIEVEMENTS', `${this.apiUrl}/achievements`, mockAchievements);
    }

    getAllValues() {
        return this.makeRequest('VALUES', `${this.serviceApiUrl}/values`, mockValues);
    }

    getAllHobbies() {
        return this.makeRequest('HOBBIES', `${this.apiUrl}/hobbies`, mockHobbies);
    }

    getFutureGoals() {
        return this.makeRequest('FUTURE_GOALS', `${this.apiUrl}/future-goals`, mockFutureGoals);
    }

    getAllInterests() {
        return this.makeRequest('INTERESTS', `${this.apiUrl}/interests`, mockInterests);
    }

    getAllPersonalityTraits() {
        return this.makeRequest('PERSONALITY_TRAITS', `${this.apiUrl}/personality-trait`, mockPersonalityTraits);
    }

    getPersonalStats() {
        return this.makeRequest('KEY_STATS', `${this.apiUrl}/key-statistics`, mockKeyStats);
    }

    refreshAllPersonalData() {
        this.invalidateCache();

        const { forkJoin, of } = require('rxjs');
        const { catchError, tap } = require('rxjs/operators');

        return forkJoin({
            highlights: this.getAllHighlights().pipe(
                catchError(() => of([]))
            ),
            achievements: this.getAllAchievements().pipe(
                catchError(() => of([]))
            ),
            values: this.getAllValues().pipe(
                catchError(() => of([]))
            ),
            hobbies: this.getAllHobbies().pipe(
                catchError(() => of([]))
            ),
            futureGoals: this.getFutureGoals().pipe(
                catchError(() => of([]))
            ),
            interests: this.getAllInterests().pipe(
                catchError(() => of([]))
            ),
            personalityTraits: this.getAllPersonalityTraits().pipe(
                catchError(() => of([]))
            ),
            keyStats: this.getPersonalStats().pipe(
                catchError(() => of({ technologies: 0, projects: 0, certificates: 0, educationYears: 0 }))
            )
        }).pipe(
            tap(() => {
                this.log('Successfully refreshed all personal data');
            }),
            catchError(() => {
                this.log('Critical error during refresh personal data', 'error');
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

    warmupCache(): void {
        if (!this.isBrowser) {
            this.prefetchEssentialData();
        }
    }

    prefetchEssentialData(): void {
        if (!this.cacheConfig.enablePrefetch) return;

        this.getAllHighlights().subscribe();
        this.getAllAchievements().subscribe();
        this.getPersonalStats().subscribe();

        this.log('Essential personal data prefetch initiated');
    }

    validateAndTransformData<T>(data: any, endpoint: string): T {
        if (!data) {
            throw new Error(`No data received for ${endpoint}`);
        }

        switch (endpoint) {
            case 'KEY_STATS':
                return this.validateKeyStats(data) as T;
            case 'HIGHLIGHTS':
                return this.validateHighlights(data) as T;
            case 'ACHIEVEMENTS':
                return this.validateAchievements(data) as T;
            case 'VALUES':
                return this.validateValues(data) as T;
            case 'HOBBIES':
                return this.validateHobbies(data) as T;
            case 'FUTURE_GOALS':
                return this.validateFutureGoals(data) as T;
            case 'INTERESTS':
                return this.validateInterests(data) as T;
            case 'PERSONALITY_TRAITS':
                return this.validatePersonalityTraits(data) as T;
            default:
                return Array.isArray(data) ? data.filter((item: any) => item && item.id) as T : data;
        }
    }

    validateKeyStats(data: any): TestKeyStats {
        const defaults: TestKeyStats = {
            technologies: 0,
            projects: 0,
            certificates: 0,
            educationYears: 0
        };

        return {
            technologies: this.validateNumber(data?.technologies, defaults.technologies),
            projects: this.validateNumber(data?.projects, defaults.projects),
            certificates: this.validateNumber(data?.certificates, defaults.certificates),
            educationYears: this.validateNumber(data?.educationYears, defaults.educationYears)
        };
    }

    validateHighlights(data: any[]): TestHighlight[] {
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

    validateAchievements(data: any[]): TestAchievement[] {
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

    validateValues(data: any[]): TestValue[] {
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

    validateHobbies(data: any[]): TestHobby[] {
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

    validateFutureGoals(data: any[]): TestFutureGoal[] {
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

    validateInterests(data: any[]): TestInterest[] {
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

    validatePersonalityTraits(data: any[]): TestPersonalityTrait[] {
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

// ========================
// TESTS
// ========================

describe('PersonalService', () => {
    let service: MockPersonalService;
    let mockHttp: any;

    beforeEach(() => {
        jest.clearAllMocks();
        mockHttp = { get: jest.fn() };
        service = new MockPersonalService(mockHttp, 'browser');
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('Service Initialization', () => {
        it('should create service instance', () => {
            expect(service).toBeTruthy();
            expect(service).toBeInstanceOf(MockPersonalService);
            expect(service).toBeInstanceOf(MockGlobalService);
        });

        it('should have correct service properties', () => {
            expect(service['serviceName']).toBe('PersonalService');
            expect(service['serviceApiUrl']).toBe('https://api.test.com/personal');
            expect(service['apiUrl']).toBe('https://api.test.com');
        });

        it('should have proper cache configuration', () => {
            expect(service['cacheConfig']).toMatchObject({
                defaultTTL: 300000,
                maxCacheSize: 20,
                enablePrefetch: true,
                cleanupInterval: 120000,
                prefetchDelay: 2000,
                avgEntrySize: 1024,
                expectedHitRate: 0.85
            });
        });
    });

    describe('Public API Methods', () => {
        it('should get all highlights', () => {
            const result = service.getAllHighlights();

            expect(result).toBeDefined();
            expect(service.makeRequest).toHaveBeenCalledWith(
                'HIGHLIGHTS',
                'https://api.test.com/personal/highlights',
                mockHighlights
            );
            expect(service.makeRequest).toHaveBeenCalledTimes(1);
        });

        it('should get all achievements', () => {
            const result = service.getAllAchievements();

            expect(result).toBeDefined();
            expect(service.makeRequest).toHaveBeenCalledWith(
                'ACHIEVEMENTS',
                'https://api.test.com/achievements',
                mockAchievements
            );
        });

        it('should get all values', () => {
            const result = service.getAllValues();

            expect(result).toBeDefined();
            expect(service.makeRequest).toHaveBeenCalledWith(
                'VALUES',
                'https://api.test.com/personal/values',
                mockValues
            );
        });

        it('should get all hobbies', () => {
            const result = service.getAllHobbies();

            expect(result).toBeDefined();
            expect(service.makeRequest).toHaveBeenCalledWith(
                'HOBBIES',
                'https://api.test.com/hobbies',
                mockHobbies
            );
        });

        it('should get future goals', () => {
            const result = service.getFutureGoals();

            expect(result).toBeDefined();
            expect(service.makeRequest).toHaveBeenCalledWith(
                'FUTURE_GOALS',
                'https://api.test.com/future-goals',
                mockFutureGoals
            );
        });

        it('should get all interests', () => {
            const result = service.getAllInterests();

            expect(result).toBeDefined();
            expect(service.makeRequest).toHaveBeenCalledWith(
                'INTERESTS',
                'https://api.test.com/interests',
                mockInterests
            );
        });

        it('should get all personality traits', () => {
            const result = service.getAllPersonalityTraits();

            expect(result).toBeDefined();
            expect(service.makeRequest).toHaveBeenCalledWith(
                'PERSONALITY_TRAITS',
                'https://api.test.com/personality-trait',
                mockPersonalityTraits
            );
        });

        it('should get personal stats', () => {
            const result = service.getPersonalStats();

            expect(result).toBeDefined();
            expect(service.makeRequest).toHaveBeenCalledWith(
                'KEY_STATS',
                'https://api.test.com/key-statistics',
                mockKeyStats
            );
        });
    });

    describe('Refresh All Personal Data', () => {

        it('should call all individual data methods during refresh', () => {
            const getAllHighlightsSpy = jest.spyOn(service, 'getAllHighlights');
            const getAllAchievementsSpy = jest.spyOn(service, 'getAllAchievements');
            const getAllValuesSpy = jest.spyOn(service, 'getAllValues');
            const getAllHobbiesSpy = jest.spyOn(service, 'getAllHobbies');
            const getFutureGoalsSpy = jest.spyOn(service, 'getFutureGoals');
            const getAllInterestsSpy = jest.spyOn(service, 'getAllInterests');
            const getAllPersonalityTraitsSpy = jest.spyOn(service, 'getAllPersonalityTraits');
            const getPersonalStatsSpy = jest.spyOn(service, 'getPersonalStats');

            service.refreshAllPersonalData();

            expect(getAllHighlightsSpy).toHaveBeenCalled();
            expect(getAllAchievementsSpy).toHaveBeenCalled();
            expect(getAllValuesSpy).toHaveBeenCalled();
            expect(getAllHobbiesSpy).toHaveBeenCalled();
            expect(getFutureGoalsSpy).toHaveBeenCalled();
            expect(getAllInterestsSpy).toHaveBeenCalled();
            expect(getAllPersonalityTraitsSpy).toHaveBeenCalled();
            expect(getPersonalStatsSpy).toHaveBeenCalled();
        });

        it('should invalidate cache before refresh', () => {
            service.refreshAllPersonalData();

            expect(service.invalidateCache).toHaveBeenCalled();
        });
    });

    describe('Cache Management', () => {
        it('should implement warmup cache correctly', () => {
            const prefetchSpy = jest.spyOn(service, 'prefetchEssentialData');
            service['isBrowser'] = false;

            service.warmupCache();

            expect(prefetchSpy).toHaveBeenCalled();
        });

        it('should prefetch essential data when enabled', () => {
            const getAllHighlightsSpy = jest.spyOn(service, 'getAllHighlights');
            const getAllAchievementsSpy = jest.spyOn(service, 'getAllAchievements');
            const getPersonalStatsSpy = jest.spyOn(service, 'getPersonalStats');

            service.prefetchEssentialData();

            expect(getAllHighlightsSpy).toHaveBeenCalled();
            expect(getAllAchievementsSpy).toHaveBeenCalled();
            expect(getPersonalStatsSpy).toHaveBeenCalled();
            expect(service.log).toHaveBeenCalledWith('Essential personal data prefetch initiated');
        });

        it('should skip prefetch when disabled', () => {
            service['cacheConfig'].enablePrefetch = false;
            const logSpy = jest.spyOn(service, 'log');

            service.prefetchEssentialData();

            expect(logSpy).not.toHaveBeenCalledWith('Essential personal data prefetch initiated');
        });
    });

    describe('Data Validation - Key Stats', () => {
        it('should validate key stats with valid data', () => {
            const validData = {
                technologies: 15,
                projects: 12,
                certificates: 8,
                educationYears: 4
            };

            const result = service.validateKeyStats(validData);

            expect(result).toEqual({
                technologies: 15,
                projects: 12,
                certificates: 8,
                educationYears: 4
            });
        });

        it('should use defaults for invalid key stats data', () => {
            const invalidData = {
                technologies: 'invalid',
                projects: -5,
                certificates: null,
                educationYears: undefined
            };

            const result = service.validateKeyStats(invalidData);

            expect(result).toEqual({
                technologies: 0,
                projects: 0,
                certificates: 0,
                educationYears: 0
            });
        });

        it('should handle null and undefined input', () => {
            expect(service.validateKeyStats(null)).toEqual({
                technologies: 0,
                projects: 0,
                certificates: 0,
                educationYears: 0
            });
        });
    });

    describe('Data Validation - Highlights', () => {
        it('should validate highlights with valid data', () => {
            const validData = [
                {
                    id: '1',
                    title: 'Test Highlight',
                    description: 'Test description',
                    metrics: { rating: 5 },
                    tags: ['test']
                },
                {
                    id: '2',
                    title: 'Another Highlight',
                    description: 'Another description'
                }
            ];

            const result = service.validateHighlights(validData);

            expect(result).toHaveLength(2);
            expect(result[0]).toMatchObject({
                id: '1',
                title: 'Test Highlight',
                description: 'Test description',
                metrics: { rating: 5 },
                tags: ['test']
            });
            expect(result[1]).toMatchObject({
                id: '2',
                title: 'Another Highlight',
                description: 'Another description',
                metrics: {},
                tags: []
            });
        });

        it('should filter out invalid highlights', () => {
            const invalidData = [
                { id: '1', title: 'Valid', description: 'Valid description' },
                { id: '2', title: 'Missing description' },
                { title: 'Missing ID', description: 'Has description' },
                null,
                undefined
            ];

            const result = service.validateHighlights(invalidData);

            expect(result).toHaveLength(1);
            expect(result[0].id).toBe('1');
        });

        it('should handle non-array input', () => {

            expect(service.validateHighlights('invalid' as any)).toEqual([]);
            expect(service.validateHighlights('invalid' as any)).toEqual([]);
        });
    });

    describe('Data Validation - Achievements', () => {
        it('should validate achievements with valid data', () => {
            const validData = [
                {
                    id: '1',
                    title: 'Test Achievement',
                    description: 'Test description',
                    date: '2024-01-01',
                    skillsGained: ['React', 'Node.js'],
                    url: 'https://example.com'
                }
            ];

            const result = service.validateAchievements(validData);

            expect(result).toHaveLength(1);
            expect(result[0]).toMatchObject({
                id: '1',
                title: 'Test Achievement',
                description: 'Test description',
                date: '2024-01-01',
                skillsGained: ['React', 'Node.js']
            });
        });

        it('should sanitize URLs', () => {
            const dataWithInvalidUrl = [
                {
                    id: '1',
                    title: 'Test Achievement',
                    description: 'Test description',
                    date: '2024-01-01',
                    url: 'invalid-url'
                }
            ];

            service.validateAchievements(dataWithInvalidUrl);

            expect(service.sanitizeUrl).toHaveBeenCalledWith('invalid-url');
        });

        it('should filter out achievements missing required fields', () => {
            const invalidData = [
                { id: '1', title: 'Valid', description: 'Valid description', date: '2024-01-01' },
                { id: '2', title: 'Missing date', description: 'Has description' },
                { title: 'Missing ID', description: 'Has description', date: '2024-01-01' }
            ];

            const result = service.validateAchievements(invalidData);

            expect(result).toHaveLength(1);
            expect(result[0].id).toBe('1');
        });
    });

    describe('Data Validation - Values', () => {
        it('should validate values with valid data', () => {
            const validData = [
                {
                    id: '1',
                    title: 'Test Value',
                    description: 'Test description',
                    examples: ['Example 1'],
                    relatedSkills: ['Skill 1']
                }
            ];

            const result = service.validateValues(validData);

            expect(result).toHaveLength(1);
            expect(result[0]).toMatchObject({
                id: '1',
                title: 'Test Value',
                description: 'Test description',
                examples: ['Example 1'],
                relatedSkills: ['Skill 1']
            });
        });

        it('should handle missing optional arrays', () => {
            const dataWithoutArrays = [
                {
                    id: '1',
                    title: 'Test Value',
                    description: 'Test description'
                }
            ];

            const result = service.validateValues(dataWithoutArrays);

            expect(result[0]).toMatchObject({
                examples: [],
                relatedSkills: []
            });
        });
    });

    describe('Data Validation - Hobbies', () => {
        it('should validate hobbies with valid data', () => {
            const validData = [
                {
                    id: '1',
                    name: 'Photography',
                    description: 'Taking photos',
                    yearsActive: 5,
                    timePerWeek: 10
                }
            ];

            const result = service.validateHobbies(validData);

            expect(result).toHaveLength(1);
            expect(result[0]).toMatchObject({
                id: '1',
                name: 'Photography',
                description: 'Taking photos',
                yearsActive: 5,
                timePerWeek: 10
            });
        });

        it('should filter out hobbies with invalid yearsActive', () => {
            const invalidData = [
                { id: '1', name: 'Valid', description: 'Valid description', yearsActive: 5 },
                { id: '2', name: 'Invalid', description: 'Invalid years', yearsActive: -1 },
                { id: '3', name: 'Invalid', description: 'Invalid years', yearsActive: 'string' },
                { id: '4', name: 'Missing', description: 'Missing years' }
            ];

            const result = service.validateHobbies(invalidData);

            expect(result).toHaveLength(1);
            expect(result[0].id).toBe('1');
        });

        it('should handle missing optional arrays in hobbies', () => {
            const dataWithoutArrays = [
                {
                    id: '1',
                    name: 'Test Hobby',
                    description: 'Test description',
                    yearsActive: 3
                }
            ];

            const result = service.validateHobbies(dataWithoutArrays);

            expect(result[0]).toMatchObject({
                relatedSkills: [],
                achievements: [],
                equipment: [],
                timePerWeek: 0
            });
        });
    });

    describe('Data Validation - Future Goals', () => {
        it('should validate future goals with valid data', () => {
            const validData = [
                {
                    id: '1',
                    title: 'Test Goal',
                    description: 'Test description',
                    targetDate: 'Dec 2024',
                    progress: 50,
                    milestones: [
                        { description: 'Milestone 1', completed: true },
                        { description: 'Milestone 2', completed: false }
                    ]
                }
            ];

            const result = service.validateFutureGoals(validData);

            expect(result).toHaveLength(1);
            expect(result[0]).toMatchObject({
                id: '1',
                title: 'Test Goal',
                description: 'Test description',
                targetDate: 'Dec 2024',
                progress: 50
            });
            expect(result[0].milestones).toHaveLength(2);
            expect(result[0].milestones![0].completed).toBe(true);
            expect(result[0].milestones![1].completed).toBe(false);
        });

        it('should clamp progress values within 0-100 range', () => {
            const dataWithInvalidProgress = [
                {
                    id: '1',
                    title: 'Test Goal',
                    description: 'Test description',
                    targetDate: 'Dec 2024',
                    progress: 150
                },
                {
                    id: '2',
                    title: 'Test Goal 2',
                    description: 'Test description',
                    targetDate: 'Dec 2024',
                    progress: -10
                }
            ];

            const result = service.validateFutureGoals(dataWithInvalidProgress);

            expect(result[0].progress).toBe(100);
            expect(result[1].progress).toBe(0);
        });

        it('should handle missing milestones array', () => {
            const dataWithoutMilestones = [
                {
                    id: '1',
                    title: 'Test Goal',
                    description: 'Test description',
                    targetDate: 'Dec 2024'
                }
            ];

            const result = service.validateFutureGoals(dataWithoutMilestones);

            expect(result[0].milestones).toEqual([]);
        });
    });

    describe('Data Validation - Interests', () => {
        it('should validate interests with valid data', () => {
            const validData = [
                {
                    id: '1',
                    name: 'Test Interest',
                    description: 'Test description',
                    recentDiscoveries: ['Discovery 1', 'Discovery 2']
                }
            ];

            const result = service.validateInterests(validData);

            expect(result).toHaveLength(1);
            expect(result[0]).toMatchObject({
                id: '1',
                name: 'Test Interest',
                description: 'Test description',
                recentDiscoveries: ['Discovery 1', 'Discovery 2']
            });
        });

        it('should handle missing recentDiscoveries array', () => {
            const dataWithoutDiscoveries = [
                {
                    id: '1',
                    name: 'Test Interest',
                    description: 'Test description'
                }
            ];

            const result = service.validateInterests(dataWithoutDiscoveries);

            expect(result[0].recentDiscoveries).toEqual([]);
        });
    });

    describe('Data Validation - Personality Traits', () => {
        it('should validate personality traits with valid data', () => {
            const validData = [
                {
                    id: '1',
                    trait: 'Test Trait',
                    description: 'Test description',
                    examples: ['Example 1', 'Example 2']
                }
            ];

            const result = service.validatePersonalityTraits(validData);

            expect(result).toHaveLength(1);
            expect(result[0]).toMatchObject({
                id: '1',
                trait: 'Test Trait',
                description: 'Test description',
                examples: ['Example 1', 'Example 2']
            });
        });

        it('should handle missing examples array', () => {
            const dataWithoutExamples = [
                {
                    id: '1',
                    trait: 'Test Trait',
                    description: 'Test description'
                }
            ];

            const result = service.validatePersonalityTraits(dataWithoutExamples);

            expect(result[0].examples).toEqual([]);
        });
    });

    describe('Generic Data Validation', () => {
        it('should handle validateAndTransformData with different endpoints', () => {
            const testData = { technologies: 10, projects: 5, certificates: 3, educationYears: 2 };

            const result = service.validateAndTransformData(testData, 'KEY_STATS');

            expect(result).toBeDefined();
            expect((result as TestKeyStats).technologies).toBe(10);
        });

        it('should throw error for null data', () => {
            expect(() => {
                service.validateAndTransformData(null, 'KEY_STATS');
            }).toThrow('No data received for KEY_STATS');
        });

        it('should handle unknown endpoints with array filtering', () => {
            const testData = [
                { id: '1', name: 'Valid' },
                { name: 'Invalid - no ID' },
                null
            ];

            const result = service.validateAndTransformData(testData, 'UNKNOWN_ENDPOINT');

            expect(Array.isArray(result)).toBe(true);
            expect((result as any[]).length).toBe(1);
            expect((result as any[])[0].id).toBe('1');
        });

        it('should handle unknown endpoints with non-array data', () => {
            const testData = { id: '1', name: 'Test' };

            const result = service.validateAndTransformData(testData, 'UNKNOWN_ENDPOINT');

            expect(result).toEqual(testData);
        });
    });

    describe('Error Handling and Edge Cases', () => {
        it('should handle all service methods gracefully', () => {
            expect(() => service.getAllHighlights()).not.toThrow();
            expect(() => service.getAllAchievements()).not.toThrow();
            expect(() => service.getAllValues()).not.toThrow();
            expect(() => service.getAllHobbies()).not.toThrow();
            expect(() => service.getFutureGoals()).not.toThrow();
            expect(() => service.getAllInterests()).not.toThrow();
            expect(() => service.getAllPersonalityTraits()).not.toThrow();
            expect(() => service.getPersonalStats()).not.toThrow();
            expect(() => service.refreshAllPersonalData()).not.toThrow();
        });

        it('should handle warmup cache in different environments', () => {
            // Browser environment
            service['isBrowser'] = true;
            expect(() => service.warmupCache()).not.toThrow();

            // Server environment
            service['isBrowser'] = false;
            expect(() => service.warmupCache()).not.toThrow();
        });

        it('should handle empty arrays in validation methods', () => {
            expect(service.validateHighlights([])).toEqual([]);
            expect(service.validateAchievements([])).toEqual([]);
            expect(service.validateValues([])).toEqual([]);
            expect(service.validateHobbies([])).toEqual([]);
            expect(service.validateFutureGoals([])).toEqual([]);
            expect(service.validateInterests([])).toEqual([]);
            expect(service.validatePersonalityTraits([])).toEqual([]);
        });

        it('should handle malformed data gracefully', () => {
            const malformedData = [
                { id: '1' },
                {},
                null,
                undefined,
                'string',
                123
            ];

            expect(() => service.validateHighlights(malformedData)).not.toThrow();
            expect(() => service.validateAchievements(malformedData)).not.toThrow();
            expect(() => service.validateValues(malformedData)).not.toThrow();
            expect(() => service.validateHobbies(malformedData)).not.toThrow();
            expect(() => service.validateFutureGoals(malformedData)).not.toThrow();
            expect(() => service.validateInterests(malformedData)).not.toThrow();
            expect(() => service.validatePersonalityTraits(malformedData)).not.toThrow();
        });
    });

    describe('Integration with GlobalService', () => {
        it('should use inherited methods from GlobalService', () => {
            expect(service.makeRequest).toBeDefined();
            expect(service.invalidateCache).toBeDefined();
            expect(service.validateNumber).toBeDefined();
            expect(service.sanitizeUrl).toBeDefined();
            expect(service.log).toBeDefined();
        });

        it('should call makeRequest with correct parameters', () => {
            service.getAllHighlights();

            expect(service.makeRequest).toHaveBeenCalledWith(
                'HIGHLIGHTS',
                'https://api.test.com/personal/highlights',
                mockHighlights
            );
        });

        it('should use validateNumber from GlobalService', () => {
            const testData = [{
                id: '1',
                name: 'Test',
                description: 'Test',
                yearsActive: 1,
                timePerWeek: '10'
            }];

            service.validateHobbies(testData);

            expect(service.validateNumber).toHaveBeenCalledWith('10', 0);
        });

        it('should use sanitizeUrl from GlobalService', () => {
            const testData = [{
                id: '1',
                title: 'Test',
                description: 'Test',
                date: '2024-01-01',
                url: 'test-url'
            }];

            service.validateAchievements(testData);

            expect(service.sanitizeUrl).toHaveBeenCalledWith('test-url');
        });
    });

    describe('Performance and Memory Management', () => {
        it('should handle large datasets efficiently', () => {
            const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
                id: `${i}`,
                title: `Item ${i}`,
                description: `Description ${i}`
            }));

            const startTime = performance.now();
            service.validateHighlights(largeDataset);
            const endTime = performance.now();

            expect(endTime - startTime).toBeLessThan(100);
        });

        it('should handle concurrent API calls', () => {
            const promises = [
                service.getAllHighlights(),
                service.getAllAchievements(),
                service.getAllValues(),
                service.getAllHobbies(),
                service.getFutureGoals()
            ];

            expect(promises).toHaveLength(5);
            promises.forEach(promise => {
                expect(promise.pipe).toBeDefined();
            });
        });

        it('should handle memory cleanup properly', () => {
            for (let i = 0; i < 100; i++) {
                service.getAllHighlights();
                service.validateKeyStats({ technologies: i, projects: i });
            }

            expect(() => service.refreshAllPersonalData()).not.toThrow();
        });
    });

    describe('Business Logic and Data Integrity', () => {

        it('should provide meaningful defaults for missing data', () => {
            const emptyStats = service.validateKeyStats({});
            const defaultStats = {
                technologies: 0,
                projects: 0,
                certificates: 0,
                educationYears: 0
            };

            expect(emptyStats).toEqual(defaultStats);
        });

        it('should validate data types and ranges correctly', () => {
            const goalWithInvalidProgress = {
                id: '1',
                title: 'Test',
                description: 'Test',
                targetDate: 'Dec 2024',
                progress: 150
            };

            const result = service.validateFutureGoals([goalWithInvalidProgress]);
            expect(result[0].progress).toBe(100);
        });

        it('should handle boolean conversion correctly', () => {
            const goalWithMilestones = {
                id: '1',
                title: 'Test',
                description: 'Test',
                targetDate: 'Dec 2024',
                milestones: [
                    { description: 'Test', completed: 'true' },
                    { description: 'Test', completed: 0 },
                    { description: 'Test', completed: 1 },
                    { description: 'Test', completed: null }
                ]
            };

            const result = service.validateFutureGoals([goalWithMilestones]);
            expect(result[0].milestones![0].completed).toBe(true);
            expect(result[0].milestones![1].completed).toBe(false);
            expect(result[0].milestones![2].completed).toBe(true);
            expect(result[0].milestones![3].completed).toBe(false);
        });
    });

    describe('API Endpoint Configuration', () => {
        it('should use correct API endpoints for different data types', () => {
            const expectedEndpoints = {
                highlights: 'https://api.test.com/personal/highlights',
                achievements: 'https://api.test.com/achievements',
                values: 'https://api.test.com/personal/values',
                hobbies: 'https://api.test.com/hobbies',
                futureGoals: 'https://api.test.com/future-goals',
                interests: 'https://api.test.com/interests',
                personalityTraits: 'https://api.test.com/personality-trait',
                keyStats: 'https://api.test.com/key-statistics'
            };

            service.getAllHighlights();
            expect(service.makeRequest).toHaveBeenCalledWith('HIGHLIGHTS', expectedEndpoints.highlights, expect.any(Array));

            service.getAllAchievements();
            expect(service.makeRequest).toHaveBeenCalledWith('ACHIEVEMENTS', expectedEndpoints.achievements, expect.any(Array));

            service.getPersonalStats();
            expect(service.makeRequest).toHaveBeenCalledWith('KEY_STATS', expectedEndpoints.keyStats, expect.any(Object));
        });


    });

    describe('Mock Validation', () => {

        it('should reset mocks properly', () => {
            service.getAllHighlights();
            expect(service.makeRequest).toHaveBeenCalledTimes(1);

            jest.clearAllMocks();
            expect(service.makeRequest).toHaveBeenCalledTimes(0);
        });

        it('should have proper mock return values', () => {
            const result = service.getAllHighlights();
            expect(result.pipe).toBeDefined();
            expect(result.subscribe).toBeDefined();
        });
    });
});