import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, AfterViewInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { Subject, takeUntil, timer } from 'rxjs';
import { finalize, filter, take, tap, catchError } from 'rxjs/operators';

// Components
import { ProjectsHeroComponent } from '../../components/projects-hero/projects-hero.component';
import { ProjectGridComponent } from '../../components/project-grid/project-grid.component';
import { ProjectDetailsComponent } from '../../components/project-details/project-details.component';
import { ProjectStatsComponent } from '../../components/project-stats/project-stats.component';
import { ProjectShowcaseComponent } from '../../components/project-showcase/project-showcase.component';
import { CommonModule } from '@angular/common';

// Models & Services
import { Project, ViewMode, ProjectsStats, ProjectCategoryDistribution, ProjectExperience } from '../../shared/models/project.interface';
// UPDATED: Replace ProjectService and RoutingService with DataService
import { DataService } from '../../services/data.service';
import { RoutingService } from '../../services/routing.service';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    ProjectsHeroComponent,
    ProjectGridComponent,
    ProjectDetailsComponent,
    ProjectStatsComponent,
    ProjectShowcaseComponent,
    CommonModule
  ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0, transform: 'scale(0.95)' }))
      ])
    ])
  ]
})
export class ProjectsComponent implements OnInit, OnDestroy, AfterViewInit {
    private readonly destroy$ = new Subject<void>();
    private readonly isBrowser: boolean;
    private isHydrated = false;

    // SIMPLU: Proprietăți publice ca în Skills (fără private + getters)
    allProjects: Project[] = [];
    projectStats: ProjectsStats = {
        technologies: 0,
        totalProjects: 0,
        liveProjects: 0
    };
    categoryDistribution: ProjectCategoryDistribution[] = [];
    topTechnologies: string[] = [];
    projectExperience: ProjectExperience = {
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

    // SIMPLU: Basic loading/error flags (fără complex objects)
    isLoading = false;
    hasError = false;
    errorMessage = '';

    // SIMPLU: UI state
    activeFilter = 'all';
    viewMode: ViewMode = 'grid';
    searchTerm = '';
    selectedProject: Project | null = null;

    constructor(
        private router: Router,
        private readonly dataService: DataService,
        private readonly routingService: RoutingService,
        private readonly cdr: ChangeDetectorRef,
        @Inject(PLATFORM_ID) private readonly platformId: Object
    ) {
        this.isBrowser = isPlatformBrowser(this.platformId);
    }

    ngOnInit(): void {
        // EXACT CA SKILLS: Simplu și direct
        this.loadAllDataFromDataService();
        
        if (this.isBrowser) {
            this.router.events.pipe(
                filter(event => event instanceof NavigationEnd),
                takeUntil(this.destroy$)
            ).subscribe(() => {
                console.log('🔄 Route changed - reloading data');
                this.loadAllDataFromDataService(); // DIRECT CALL ca în Skills
            });
        }
    }

    ngAfterViewInit(): void {
        if (this.isBrowser) {
            timer(0).subscribe(() => this.completeHydration());
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    // SIMPLU: Exact ca în Skills - fără complicații
    private loadAllDataFromDataService(): void {
        this.isLoading = true;
        this.hasError = false;
        
        this.dataService.loadAllData()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (allData) => {
                    // DIRECT ASSIGNMENT ca în Skills - fără Object.freeze
                    this.allProjects = allData.projects.projects;
                    this.projectStats = allData.projects.projectStats;
                    this.categoryDistribution = allData.projects.categories;
                    this.topTechnologies = allData.projects.technologies;
                    this.projectExperience = allData.projects.projectExperience;
                    
                    this.isLoading = false;
                    console.log('✅ All projects page data loaded from DataService');
                },
                error: (error) => {
                    console.error('❌ Error loading projects data from DataService:', error);
                    this.hasError = true;
                    this.errorMessage = 'Failed to load projects data';
                    this.isLoading = false;
                }
            });
    }

    // SIMPLU: Retry fără complicații
    retryLoadAllData(): void {
        this.loadAllDataFromDataService();
    }

    // COMPUTED PROPERTIES: Simple getters fără cache manual
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
        return this.allProjects.findIndex(p => p.id === this.selectedProject!.id);
    }

    get isFirstProject(): boolean {
        return this.currentProjectIndex === 0;
    }

    get isLastProject(): boolean {
        return this.currentProjectIndex === this.allProjects.length - 1;
    }

    // HYDRATION: Simplu
    private completeHydration(): void {
        this.isHydrated = true;
        this.cdr.markForCheck();
    }

    // EVENT HANDLERS: Păstrează la fel
    async onFilterChange(filter: string): Promise<void> {
        if (!this.isBrowser || this.activeFilter === filter) return;
        this.activeFilter = filter;
        this.routingService.updateQueryParams({
            filter: filter !== 'all' ? filter : null
        }, { replaceUrl: true, preserveScroll: true });
        this.cdr.markForCheck();
    }

    async onViewModeChange(mode: ViewMode): Promise<void> {
        if (!this.isBrowser || this.viewMode === mode) return;
        this.viewMode = mode;
        this.routingService.updateQueryParams({
            view: mode !== 'grid' ? mode : null
        }, { replaceUrl: true, preserveScroll: true });
        this.cdr.markForCheck();
    }

    async onProjectSelect(project: Project): Promise<void> {
        if (this.selectedProject?.id === project.id) return;
        this.selectedProject = { ...project };
        if (this.isBrowser && document.body) {
            document.body.style.overflow = 'hidden';
        }
        this.cdr.markForCheck();
    }

    async onCloseProjectDetails(): Promise<void> {
        if (!this.selectedProject) return;
        this.selectedProject = null;
        if (this.isBrowser && document.body) {
            document.body.style.overflow = '';
        }
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

    async onNextProject(): Promise<void> {
        if (!this.canNavigateProjects || !this.selectedProject) return;
        const currentIndex = this.currentProjectIndex;
        const newProject = currentIndex < this.allProjects.length - 1
            ? this.allProjects[currentIndex + 1]
            : this.allProjects[0];
        this.selectedProject = { ...newProject };
        this.cdr.markForCheck();
    }

    onDemoClick(project: Project): void {
        if (!this.isBrowser) return;
        console.log('Demo clicked for:', project.title);
    }

    onGithubClick(project: Project): void {
        if (!this.isBrowser) return;
        console.log('GitHub clicked for:', project.title);
    }

    // UTILITY: Simple track by
    trackByProject(index: number, project: Project): string {
        return project.id;
    }
}