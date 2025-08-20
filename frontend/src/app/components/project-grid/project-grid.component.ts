import { Component, Input, Output, EventEmitter, Inject, PLATFORM_ID, OnChanges, SimpleChanges, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Project, ViewMode } from '../../shared/models/project.interface';

@Component({
  selector: 'app-project-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-grid.component.html',
  styleUrls: ['./project-grid.component.css']
})
export class ProjectGridComponent implements OnChanges, AfterViewInit, OnDestroy {

  // ========================
  // INPUTS FROM PARENT
  // ========================
  @Input() allProjects: Project[] = [];
  @Input() activeFilter = 'all';
  @Input() viewMode: ViewMode = 'grid';
  @Input() searchTerm = '';

  // ========================
  // OUTPUTS TO PARENT
  // ========================
  @Output() projectSelect = new EventEmitter<Project>();

  // ========================
  // COMPONENT STATE
  // ========================

  // Filtered and displayed projects
  filteredProjects: Project[] = [];
  displayedProjects: Project[] = [];

  // Pagination
  currentPage = 1;
  projectsPerPage = 6;
  totalPages = 0;

  // Browser detection for SSR
  private isBrowser = false;

  // Intersection observer for animations
  private intersectionObserver?: IntersectionObserver;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngAfterViewInit(): void {
    // Only run browser-specific code after view init
    if (this.isBrowser) {
      this.setupBrowserFeatures();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // React to data changes from parent
    if (changes['allProjects']) {
      console.log('Projects data updated:', this.allProjects.length, 'projects');
      this.initializeProjects();
    }

    // React to filter changes
    if (changes['activeFilter'] || changes['searchTerm']) {
      console.log('Filter changed - activeFilter:', this.activeFilter, 'searchTerm:', this.searchTerm);
      this.filterProjects();
    }

    // React to view mode changes
    if (changes['viewMode']) {
      console.log('View mode changed to:', this.viewMode);
      this.updateProjectsPerPage();
    }
  }

  ngOnDestroy(): void {
    // Cleanup intersection observer
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  }

  // ========================
  // PROJECT FILTERING & PAGINATION
  // ========================

  private initializeProjects(): void {
    // Initialize filtered projects with all projects
    this.filteredProjects = [...this.allProjects];
    this.filterProjects();


  }

  private filterProjects(): void {
    // Start with all projects
    let filtered = [...this.allProjects];

    // Apply category filter
    if (this.activeFilter !== 'all') {
      filtered = filtered.filter(project => {
        if (!project.category) return false;

        // Case-insensitive exact match
        if (project.category.toLowerCase() === this.activeFilter.toLowerCase()) {
          return true;
        }

        // Flexible matching for category variations
        return this.matchesCategory(project.category, this.activeFilter);
      });
    }

    // Apply search filter
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchLower) ||
        project.description.toLowerCase().includes(searchLower) ||
        (project.longDescription && project.longDescription.toLowerCase().includes(searchLower)) ||
        project.technologies.some((tech: string) => tech.toLowerCase().includes(searchLower)) ||
        project.tags.some((tag: string) => tag.toLowerCase().includes(searchLower)) ||
        (project.category && project.category.toLowerCase().includes(searchLower))
      );
    }

    // Update filtered projects and reset pagination
    this.filteredProjects = filtered;
    this.currentPage = 1;
    this.updatePagination();


  }

  private matchesCategory(projectCategory: string, filterCategory: string): boolean {
    const projectCat = projectCategory.toLowerCase();
    const filterCat = filterCategory.toLowerCase();

    // Category mappings for flexible matching
    const categoryMappings: { [key: string]: string[] } = {
      'ecommerce': ['e-commerce', 'ecommerce', 'shop', 'store', 'commerce'],
      'management': ['management', 'admin', 'dashboard', 'crm', 'system'],
      'crud': ['crud', 'crud apps', 'basic', 'simple'],
      'collaboration': ['collaborative', 'collaboration', 'team', 'social', 'chat'],
      'portfolio': ['portfolio', 'personal', 'showcase', 'resume'],
      'webapp': ['webapp', 'web app', 'web application', 'application'],
      'mobile': ['mobile', 'mobile app', 'react native', 'flutter', 'ios', 'android'],
      'api': ['api', 'rest api', 'graphql', 'backend', 'service'],
      'fullstack': ['fullstack', 'full stack', 'full-stack'],
      'frontend': ['frontend', 'front end', 'front-end', 'client'],
      'backend': ['backend', 'back end', 'back-end', 'server']
    };

    // Check if project category matches any variations of the filter category
    const possibleCategories = categoryMappings[filterCat] || [filterCat];
    return possibleCategories.some(cat =>
      projectCat.includes(cat) || cat.includes(projectCat)
    );
  }

  private updateProjectsPerPage(): void {
    // Adjust items per page based on view mode
    this.projectsPerPage = this.viewMode === 'list' ? 4 : 6;
    this.updatePagination();

    // Re-setup intersection observer for new layout
    if (this.isBrowser) {
      setTimeout(() => this.setupIntersectionObserver(), 100);
    }
  }

  private updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredProjects.length / this.projectsPerPage);
    this.updateDisplayedProjects();
  }

  private updateDisplayedProjects(): void {
    const startIndex = (this.currentPage - 1) * this.projectsPerPage;
    const endIndex = startIndex + this.projectsPerPage;
    this.displayedProjects = this.filteredProjects.slice(startIndex, endIndex);
  }

  // ========================
  // EVENT HANDLERS
  // ========================

  onProjectClick(project: Project): void {
    // Emit project selection to parent
    this.projectSelect.emit(project);

  }

  onDemoClick(event: Event, project: Project): void {
    event.stopPropagation();

    if (!this.isBrowser || !project.demoUrl) {
      return;
    }

    try {
      window.open(project.demoUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      if (this.isBrowser) {
        console.warn('Demo link failed:', error);
      }
    }
  }

  onGithubClick(event: Event, project: Project): void {
    event.stopPropagation();

    if (!this.isBrowser || !project.githubUrl) {
      return;
    }

    try {
      window.open(project.githubUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      if (this.isBrowser) {
        console.warn('GitHub link failed:', error);
      }
    }
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateDisplayedProjects();

      // Smooth scroll to top of grid
      if (this.isBrowser) {
        try {
          const gridElement = document.getElementById('projects-grid');
          if (gridElement) {
            gridElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        } catch (error) {
          // Silent fail for SSR compatibility
        }
      }
    }
  }

  // ========================
  // BROWSER FEATURES
  // ========================

  private setupBrowserFeatures(): void {
    if (!this.isBrowser) return;

    try {
      this.setupIntersectionObserver();
    } catch (error) {
      console.warn('Browser features setup failed:', error);
    }
  }

  private setupIntersectionObserver(): void {
    if (!this.isBrowser || typeof IntersectionObserver === 'undefined') {
      return;
    }

    // Disconnect existing observer
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }

    // Create new intersection observer
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    // Observe project cards with a small delay to ensure DOM is ready
    setTimeout(() => {
      if (this.isBrowser && this.intersectionObserver) {
        const projectCards = document.querySelectorAll('.project-card, .project-list-item');
        projectCards.forEach((card) => {
          if (card) {
            this.intersectionObserver!.observe(card);
          }
        });
      }
    }, 100);
  }

  // ========================
  // PAGINATION HELPERS
  // ========================

  getPaginationRange(): number[] {
    const range: number[] = [];
    const maxVisible = 5;

    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    return range;
  }

  // ========================
  // STYLING HELPERS
  // ========================

  getStatusBadgeClass(status: string): string {
    const classes = {
      'production': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'development': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'testing': 'bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-300',
      'maintenance': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'planning': 'bg-neutral-100 text-neutral-800 dark:bg-neutral-900 dark:text-neutral-300',
      'archived': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
      'concept': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    };
    return classes[status as keyof typeof classes] || classes['concept'];
  }

  getComplexityBadgeClass(complexity: string): string {
    const classes = {
      'beginner': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'intermediate': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'advanced': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    };
    return classes[complexity as keyof typeof classes] || classes['intermediate'];
  }

  getTechBadgeColor(index: number): string {
    const colors = [
      'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-700',
      'bg-green-50 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-700',
      'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900 dark:text-purple-300 dark:border-purple-700',
      'bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-900 dark:text-pink-300 dark:border-pink-700',
      'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900 dark:text-indigo-300 dark:border-indigo-700',
      'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:border-yellow-700',
      'bg-red-50 text-red-700 border-red-200 dark:bg-red-900 dark:text-red-300 dark:border-red-700',
      'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-900 dark:text-teal-300 dark:border-teal-700'
    ];
    return colors[index % colors.length];
  }

  // ========================
  // COMPUTED PROPERTIES
  // ========================

  get hasProjects(): boolean {
    return this.displayedProjects.length > 0;
  }

  get hasFilteredProjects(): boolean {
    return this.filteredProjects.length > 0;
  }

  get hasMultiplePages(): boolean {
    return this.totalPages > 1;
  }

  get isFirstPage(): boolean {
    return this.currentPage === 1;
  }

  get isLastPage(): boolean {
    return this.currentPage === this.totalPages;
  }

  get isInBrowser(): boolean {
    return this.isBrowser;
  }

  get noProjectsMessage(): string {
    if (this.activeFilter !== 'all' || this.searchTerm.trim()) {
      return 'No projects found matching the current search criteria.';
    }
    return 'No projects available to display.';
  }

  get showPagination(): boolean {
    return this.hasFilteredProjects && this.hasMultiplePages;
  }

  get totalProjectsCount(): number {
    return this.allProjects.length;
  }

  get filteredProjectsCount(): number {
    return this.filteredProjects.length;
  }

  get displayedProjectsCount(): number {
    return this.displayedProjects.length;
  }

  // ========================
  // PERFORMANCE HELPERS
  // ========================

  trackByProject(index: number, project: Project): string {
    return project.id;
  }

  trackByTechnology(index: number, tech: string): string {
    return tech;
  }

  trackByFeature(index: number, feature: string): string {
    return feature;
  }

  trackByTag(index: number, tag: string): string {
    return tag;
  }

  trackByPage(index: number, page: number): number {
    return page;
  }

  getToProjectNumber(): number {
    return Math.min(this.currentPage * this.projectsPerPage, this.filteredProjectsCount);
  }

} 