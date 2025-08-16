import { Component, Input, Output, EventEmitter, Inject, PLATFORM_ID, AfterViewInit, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ProjectsStats, ProjectCategoryDistribution } from '../../shared/models/project.interface';

interface FilterOption {
  id: string;
  label: string;
  count: number;
  active: boolean;
  percentage?: number;
}

@Component({
  selector: 'app-projects-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects-hero.component.html',
  styleUrls: ['./projects-hero.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush // CRITICAL: Prevent unnecessary change detection
})
export class ProjectsHeroComponent implements AfterViewInit, OnChanges {

  // ========================
  // INPUTS FROM PARENT (READONLY TO PREVENT MUTATIONS)
  // ========================
  @Input() projectStats: ProjectsStats = {
    technologies: 0,
    totalProjects: 0,
    liveProjects: 0
  };
  @Input() categoryDistribution: readonly ProjectCategoryDistribution[] = []; // Make readonly
  @Input() topTechnologies: readonly string[] = []; // Make readonly

  // Loading states from parent
  @Input() isLoadingStats = false;
  @Input() isLoadingCategories = false;
  @Input() isLoadingTechnologies = false;

  // Error states from parent
  @Input() hasStatsError = false;
  @Input() hasCategoriesError = false;
  @Input() hasTechnologiesError = false;

  // ========================
  // OUTPUTS TO PARENT
  // ========================
  @Output() filterChange = new EventEmitter<string>();
  @Output() viewModeChange = new EventEmitter<'grid' | 'list'>();
  @Output() retryStats = new EventEmitter<void>();
  @Output() retryCategories = new EventEmitter<void>();
  @Output() retryTechnologies = new EventEmitter<void>();

  // ========================
  // COMPONENT STATE (IMMUTABLE)
  // ========================

  // Filter options - computed from categoryDistribution (immutable)
  private _filterOptions: readonly FilterOption[] = [];
  get filterOptions(): readonly FilterOption[] { return this._filterOptions; }

  // Current view mode
  currentViewMode: 'grid' | 'list' = 'grid';

  // Active filter
  activeFilter = 'all';

  // SSR compatibility flags
  private isBrowser = false;

  // Cache to prevent unnecessary recalculations
  private _lastCategoryHash = '';
  private _lastStatsHash = '';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngAfterViewInit(): void {
    // Only run browser-specific code after view initialization
    if (this.isBrowser) {
      this.setupBrowserFeatures();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Only update filter options when categoryDistribution actually changes
    if (changes['categoryDistribution']) {
      const newHash = this.hashCategories(this.categoryDistribution);
      if (newHash !== this._lastCategoryHash) {
        this._lastCategoryHash = newHash;
        this.setupFilterOptions();
      }
    }

    // Only animate stats when they actually change
    if (changes['projectStats'] && this.isBrowser) {
      const newHash = this.hashStats(this.projectStats);
      if (newHash !== this._lastStatsHash) {
        this._lastStatsHash = newHash;
        setTimeout(() => this.animateStats(), 100);
      }
    }
  }

  // Hash functions to detect actual changes
  private hashCategories(categories: readonly ProjectCategoryDistribution[]): string {
    return categories.map(c => `${c.category}-${c.projectCount}-${c.percentage}`).join('|');
  }

  private hashStats(stats: ProjectsStats): string {
    return `${stats.totalProjects}-${stats.technologies}-${stats.liveProjects}`;
  }

  // ========================
  // FILTER SETUP (PURE FUNCTION)
  // ========================

  private setupFilterOptions(): void {
    const categories = [...this.categoryDistribution]; // Create a copy to avoid mutations

    if (categories.length === 0) {
      // Default filter when no categories available
      this._filterOptions = Object.freeze([
        {
          id: 'all',
          label: 'All Projects',
          count: this.projectStats.totalProjects || 0,
          active: true,
          percentage: 100
        }
      ]);
      return;
    }

    // Calculate total projects
    const totalProjects = categories.reduce((sum, cat) => sum + cat.projectCount, 0);

    // Create new immutable filter options array
    const newFilterOptions: FilterOption[] = [
      {
        id: 'all',
        label: 'All Projects',
        count: totalProjects,
        active: this.activeFilter === 'all',
        percentage: 100
      }
    ];

    // Add category options from backend data
    categories.forEach(category => {
      newFilterOptions.push({
        id: category.category.toLowerCase(),
        label: this.formatCategoryLabel(category.category),
        count: category.projectCount,
        active: this.activeFilter === category.category.toLowerCase(),
        percentage: category.percentage
      });
    });

    // Freeze the array to prevent mutations
    this._filterOptions = Object.freeze(newFilterOptions);

    console.log('Filter options updated:', this._filterOptions);
  }

  private formatCategoryLabel(category: string): string {
    // Transform category names for display (pure function)
    const labelMap: { [key: string]: string } = {
      'ecommerce': 'E-commerce',
      'management': 'Management',
      'crud': 'CRUD Apps',
      'collaboration': 'Collaborative',
      'portfolio': 'Portfolio',
      'webapp': 'Web Apps',
      'mobile': 'Mobile Apps',
      'api': 'APIs',
      'fullstack': 'Full Stack',
      'frontend': 'Frontend',
      'backend': 'Backend'
    };

    return labelMap[category.toLowerCase()] ||
      category.charAt(0).toUpperCase() + category.slice(1);
  }

  // ========================
  // EVENT HANDLERS (IMMUTABLE UPDATES)
  // ========================

  onFilterClick(filterId: string): void {
    // Prevent unnecessary updates if same filter
    if (this.activeFilter === filterId) return;

    // Update active filter locally
    this.activeFilter = filterId;

    // Create new immutable filter options array
    const newFilterOptions = this._filterOptions.map(option => ({
      ...option,
      active: option.id === filterId
    }));

    this._filterOptions = Object.freeze(newFilterOptions);

    // Emit to parent
    this.filterChange.emit(filterId);

    // Debug logging
    if (this.isBrowser) {
      console.log(`Filter changed to: "${filterId}"`);
    }
  }

  onViewModeToggle(mode: 'grid' | 'list'): void {
    // Prevent unnecessary updates if same mode
    if (this.currentViewMode === mode) return;

    this.currentViewMode = mode;

    // Emit to parent
    this.viewModeChange.emit(mode);

    if (this.isBrowser) {
      console.log(`View mode changed to: ${mode}`);
    }
  }

  // Retry handlers (pure functions - no state changes)
  onRetryStats(): void {
    this.retryStats.emit();
  }

  onRetryCategories(): void {
    this.retryCategories.emit();
  }

  onRetryTechnologies(): void {
    this.retryTechnologies.emit();
  }

  onRetryAll(): void {
    this.retryStats.emit();
    this.retryCategories.emit();
    this.retryTechnologies.emit();
  }

  // ========================
  // BROWSER FEATURES
  // ========================

  private setupBrowserFeatures(): void {
    if (!this.isBrowser) return;

    try {
      // Setup intersection observer for animations
      this.setupIntersectionObserver();
      // Animate stats if they're already loaded
      if (this.projectStats.totalProjects > 0) {
        this.animateStats();
      }
    } catch (error) {
      console.warn('Browser features setup failed:', error);
    }
  }

  private animateStats(): void {
    if (!this.isBrowser) return;

    setTimeout(() => {
      const statElements = document.querySelectorAll('.stat-number');
      statElements.forEach((element) => {
        if (element) {
          element.classList.add('animate-in');
        }
      });
    }, 100);
  }

  private setupIntersectionObserver(): void {
    if (!this.isBrowser || typeof IntersectionObserver === 'undefined') {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    // Observe animated elements
    setTimeout(() => {
      const animatedElements = document.querySelectorAll('.animate-on-scroll');
      animatedElements.forEach((element) => {
        if (element) {
          observer.observe(element);
        }
      });
    }, 100);
  }

  // SSR-safe scroll to projects
  onScrollToProjects(): void {
    if (!this.isBrowser) return;

    try {
      const projectsSection = document.getElementById('projects-grid');
      if (projectsSection) {
        projectsSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    } catch (error) {
      if (this.isBrowser) {
        console.warn('Scroll to projects failed:', error);
      }
    }
  }

  // ========================
  // COMPUTED PROPERTIES (CACHED)
  // ========================

  get isAnyDataLoading(): boolean {
    return this.isLoadingStats || this.isLoadingCategories || this.isLoadingTechnologies;
  }

  get hasAnyError(): boolean {
    return this.hasStatsError || this.hasCategoriesError || this.hasTechnologiesError;
  }

  get hasFilters(): boolean {
    return this._filterOptions.length > 1; // More than just "All Projects"
  }

  get hasTechnologies(): boolean {
    return this.topTechnologies.length > 0;
  }

  get hasStats(): boolean {
    return this.projectStats.totalProjects > 0;
  }

  get isInBrowser(): boolean {
    return this.isBrowser;
  }

  get activeFilterOption(): FilterOption | undefined {
    return this._filterOptions.find(option => option.active);
  }

  // ========================
  // STYLING HELPERS (PURE FUNCTIONS)
  // ========================

  getFilterBadgeColor(filterId: string): string {
    const colors = {
      'all': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'ecommerce': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'management': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'crud': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'collaboration': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
      'portfolio': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
      'webapp': 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300',
      'mobile': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      'api': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      'fullstack': 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-300',
      'frontend': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
      'backend': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300'
    };

    return colors[filterId as keyof typeof colors] || colors['all'];
  }

  getTechBadgeColor(index: number): string {
    const colors = [
      'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400',
      'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400',
      'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400',
      'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400',
      'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400',
      'bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-400',
      'bg-pink-100 text-pink-600 dark:bg-pink-900 dark:text-pink-400',
      'bg-teal-100 text-teal-600 dark:bg-teal-900 dark:text-teal-400'
    ];

    return colors[index % colors.length];
  }

  formatPercentage(value: number): string {
    return value ? `${value.toFixed(1)}%` : '0%';
  }

  // ========================
  // PERFORMANCE HELPERS (PREVENT UNNECESSARY RE-RENDERS)
  // ========================

  trackByFilter(index: number, filter: FilterOption): string {
    return filter.id;
  }

  trackByTech(index: number, tech: string): string {
    return tech;
  }
}