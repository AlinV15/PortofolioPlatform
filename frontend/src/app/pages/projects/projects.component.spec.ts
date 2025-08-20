// Pure Jest tests for ProjectsComponent logic (without Angular testing utilities)
import { of, throwError, Subject } from 'rxjs';

// Mock the component class (without Angular decorators)
class MockProjectsComponent {
    // Properties
    allProjects: any[] = [];
    projectStats = { technologies: 0, totalProjects: 0, liveProjects: 0 };
    categoryDistribution: any[] = [];
    topTechnologies: string[] = [];
    projectExperience: any = {
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

    isLoading = false;
    hasError = false;
    errorMessage = '';
    activeFilter = 'all';
    viewMode = 'grid';
    searchTerm = '';
    selectedProject: any = null;

    private destroy$ = new Subject<void>();
    private isBrowser = true;
    private isHydrated = false;

    // Mock services
    private dataService: any;
    private routingService: any;
    private cdr: any;

    constructor(dataService: any, routingService: any, cdr: any) {
        this.dataService = dataService;
        this.routingService = routingService;
        this.cdr = cdr;
    }

    // Component methods
    ngOnInit(): void {
        this.loadAllDataFromDataService();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    ngAfterViewInit(): void {
        if (this.isBrowser) {
            setTimeout(() => this.completeHydration(), 0);
        }
    }

    private loadAllDataFromDataService(): void {
        this.isLoading = true;
        this.hasError = false;

        this.dataService.loadAllData().subscribe({
            next: (allData: any) => {
                this.allProjects = allData.projects.projects;
                this.projectStats = allData.projects.projectStats;
                this.categoryDistribution = allData.projects.categories;
                this.topTechnologies = allData.projects.technologies;
                this.projectExperience = allData.projects.projectExperience;
                this.isLoading = false;
            },
            error: (error: any) => {
                this.hasError = true;
                this.errorMessage = 'Failed to load projects data';
                this.isLoading = false;
            }
        });
    }

    retryLoadAllData(): void {
        this.loadAllDataFromDataService();
    }

    get hasProjects(): boolean {
        return this.allProjects.length > 0;
    }

    get canInteract(): boolean {
        return this.isBrowser && this.isHydrated;
    }

    get hasSelectedProject(): boolean {
        return this.selectedProject !== null;
    }

    get canNavigateProjects(): boolean {
        return this.allProjects.length > 1;
    }

    get currentProjectIndex(): number {
        if (!this.selectedProject || !this.allProjects.length) return -1;
        return this.allProjects.findIndex(p => p.id === this.selectedProject.id);
    }

    get isFirstProject(): boolean {
        return this.currentProjectIndex === 0;
    }

    get isLastProject(): boolean {
        return this.currentProjectIndex === this.allProjects.length - 1;
    }

    private completeHydration(): void {
        this.isHydrated = true;
        this.cdr.markForCheck();
    }

    async onFilterChange(filter: string): Promise<void> {
        if (!this.isBrowser || this.activeFilter === filter) return;
        this.activeFilter = filter;
        this.routingService.updateQueryParams({
            filter: filter !== 'all' ? filter : null
        }, { replaceUrl: true, preserveScroll: true });
        this.cdr.markForCheck();
    }

    async onViewModeChange(mode: string): Promise<void> {
        if (!this.isBrowser || this.viewMode === mode) return;
        this.viewMode = mode;
        this.routingService.updateQueryParams({
            view: mode !== 'grid' ? mode : null
        }, { replaceUrl: true, preserveScroll: true });
        this.cdr.markForCheck();
    }

    async onProjectSelect(project: any): Promise<void> {
        if (this.selectedProject?.id === project.id) return;
        this.selectedProject = { ...project };
        this.cdr.markForCheck();
    }

    async onCloseProjectDetails(): Promise<void> {
        if (!this.selectedProject) return;
        this.selectedProject = null;
        this.cdr.markForCheck();
    }

    async onNextProject(): Promise<void> {
        if (!this.canNavigateProjects || !this.selectedProject) return;
        const currentIndex = this.currentProjectIndex;
        const newProject = currentIndex < this.allProjects.length - 1
            ? this.allProjects[currentIndex + 1]
            : this.allProjects[0];
        this.selectedProject = { ...newProject };
        this.cdr.markForCheck();
    }

    async onPreviousProject(): Promise<void> {
        if (!this.canNavigateProjects || !this.selectedProject) return;
        const currentIndex = this.currentProjectIndex;
        const newProject = currentIndex > 0
            ? this.allProjects[currentIndex - 1]
            : this.allProjects[this.allProjects.length - 1];
        this.selectedProject = { ...newProject };
        this.cdr.markForCheck();
    }

    onDemoClick(project: any): void {
        if (!this.isBrowser) return;
        console.log('Demo clicked for:', project.title);
    }

    onGithubClick(project: any): void {
        if (!this.isBrowser) return;
        console.log('GitHub clicked for:', project.title);
    }

    trackByProject(index: number, project: any): string {
        return project.id;
    }
}

// Mock data
const mockProject = {
    id: '1',
    title: 'Test Portfolio App',
    description: 'A comprehensive portfolio application',
    technologies: ['Angular', 'TypeScript', 'Spring Boot'],
    category: 'web',
    status: 'PRODUCTION',
    featured: true
};

const mockAllData = {
    projects: {
        projects: [mockProject],
        projectStats: { technologies: 15, totalProjects: 10, liveProjects: 8 },
        categories: [{ category: 'web', projectCount: 8, percentage: 80, formatedPercentage: '80%' }],
        technologies: ['Angular', 'React', 'Vue'],
        projectExperience: {
            yearsActive: 4,
            firstProjectYear: 2020,
            latestProjectYear: 2024,
            avgComplexity: 'advanced',
            avgComplexityLabel: 'Advanced',
            successRate: 92,
            formattedSuccessRate: '92%',
            deployedProjects: 10,
            totalProjects: 12,
            liveProjects: 10,
            experienceLevel: 'Senior Developer'
        }
    }
};

describe('ProjectsComponent Logic Tests', () => {
    let component: MockProjectsComponent;
    let dataService: any;
    let routingService: any;
    let cdr: any;

    beforeEach(() => {
        // Create mocks
        dataService = {
            loadAllData: jest.fn().mockReturnValue(of(mockAllData))
        };
        routingService = {
            updateQueryParams: jest.fn()
        };
        cdr = {
            markForCheck: jest.fn()
        };

        // Create component
        component = new MockProjectsComponent(dataService, routingService, cdr);
    });

    // Basic tests
    it('should create component', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize with correct default values', () => {
        expect(component.allProjects).toEqual([]);
        expect(component.isLoading).toBe(false);
        expect(component.activeFilter).toBe('all');
        expect(component.viewMode).toBe('grid');
        expect(component.selectedProject).toBe(null);
    });

    it('should load data successfully on ngOnInit', () => {
        component.ngOnInit();

        expect(dataService.loadAllData).toHaveBeenCalled();
        expect(component.allProjects).toEqual([mockProject]);
        expect(component.isLoading).toBe(false);
        expect(component.hasError).toBe(false);
    });

    it('should handle data loading errors', () => {
        dataService.loadAllData.mockReturnValue(throwError(() => new Error('Network error')));

        component.ngOnInit();

        expect(component.hasError).toBe(true);
        expect(component.errorMessage).toBe('Failed to load projects data');
        expect(component.isLoading).toBe(false);
    });

    it('should retry loading data', () => {
        component.retryLoadAllData();
        expect(dataService.loadAllData).toHaveBeenCalled();
    });

    it('should return correct hasProjects value', () => {
        component.ngOnInit();
        expect(component.hasProjects).toBe(true);

        component.allProjects = [];
        expect(component.hasProjects).toBe(false);
    });

    it('should return correct canInteract value', () => {
        component['isHydrated'] = true;
        expect(component.canInteract).toBe(true);

        component['isHydrated'] = false;
        expect(component.canInteract).toBe(false);
    });

    it('should change filter and update query params', async () => {
        await component.onFilterChange('web');

        expect(component.activeFilter).toBe('web');
        expect(routingService.updateQueryParams).toHaveBeenCalledWith(
            { filter: 'web' },
            { replaceUrl: true, preserveScroll: true }
        );
    });

    it('should not change filter if same as current', async () => {
        component.activeFilter = 'web';
        routingService.updateQueryParams.mockClear();

        await component.onFilterChange('web');

        expect(routingService.updateQueryParams).not.toHaveBeenCalled();
    });

    it('should change view mode', async () => {
        await component.onViewModeChange('list');

        expect(component.viewMode).toBe('list');
        expect(routingService.updateQueryParams).toHaveBeenCalled();
    });

    it('should select project', async () => {
        await component.onProjectSelect(mockProject);

        expect(component.selectedProject).toEqual(mockProject);
        expect(cdr.markForCheck).toHaveBeenCalled();
    });

    it('should close project details', async () => {
        component.selectedProject = mockProject;

        await component.onCloseProjectDetails();

        expect(component.selectedProject).toBe(null);
        expect(cdr.markForCheck).toHaveBeenCalled();
    });

    it('should navigate to next project', async () => {
        const projects = [
            { ...mockProject, id: '1' },
            { ...mockProject, id: '2' }
        ];
        component.allProjects = projects;
        component.selectedProject = projects[0];

        await component.onNextProject();

        expect(component.selectedProject?.id).toBe('2');
    });

    it('should wrap to first project when at last', async () => {
        const projects = [
            { ...mockProject, id: '1' },
            { ...mockProject, id: '2' }
        ];
        component.allProjects = projects;
        component.selectedProject = projects[1];

        await component.onNextProject();

        expect(component.selectedProject?.id).toBe('1');
    });

    it('should log demo click', () => {
        jest.spyOn(console, 'log').mockImplementation(() => { });

        component.onDemoClick(mockProject);

        expect(console.log).toHaveBeenCalledWith('Demo clicked for:', mockProject.title);
        jest.restoreAllMocks();
    });

    it('should log github click', () => {
        jest.spyOn(console, 'log').mockImplementation(() => { });

        component.onGithubClick(mockProject);

        expect(console.log).toHaveBeenCalledWith('GitHub clicked for:', mockProject.title);
        jest.restoreAllMocks();
    });

    it('should track projects by id', () => {
        const result = component.trackByProject(0, mockProject);
        expect(result).toBe(mockProject.id);
    });

    it('should handle hydration', (done) => {
        component['isHydrated'] = false;

        component.ngAfterViewInit();

        setTimeout(() => {
            expect(component['isHydrated']).toBe(true);
            expect(cdr.markForCheck).toHaveBeenCalled();
            done();
        }, 10);
    });

    it('should clean up on destroy', () => {
        jest.spyOn(component['destroy$'], 'next');
        jest.spyOn(component['destroy$'], 'complete');

        component.ngOnDestroy();

        expect(component['destroy$'].next).toHaveBeenCalled();
        expect(component['destroy$'].complete).toHaveBeenCalled();
    });
});