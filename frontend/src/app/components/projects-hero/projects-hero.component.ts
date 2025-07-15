import { Component, OnInit, Output, EventEmitter, Inject, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

interface ProjectStats {
  totalProjects: number;
  technologies: number;
  liveProjects: number;
}

interface FilterOption {
  id: string;
  label: string;
  count: number;
  active: boolean;
}

@Component({
  selector: 'app-projects-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects-hero.component.html',
  styleUrls: ['./projects-hero.component.css']
})
export class ProjectsHeroComponent implements OnInit, AfterViewInit {
  @Output() filterChange = new EventEmitter<string>();
  @Output() viewModeChange = new EventEmitter<'grid' | 'list'>();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  // Project statistics
  projectStats: ProjectStats = {
    totalProjects: 7,
    technologies: 12,
    liveProjects: 4,
  };

  // Filter options
  filterOptions: FilterOption[] = [
    { id: 'all', label: 'All Projects', count: 7, active: true },
    { id: 'ecommerce', label: 'E-commerce', count: 1, active: false },
    { id: 'management', label: 'Management', count: 2, active: false },
    { id: 'crud', label: 'CRUD Apps', count: 1, active: false },
    { id: 'collaboration', label: 'Collaborative', count: 2, active: false },
    { id: 'portfolio', label: 'Portfolio', count: 1, active: false }
  ];

  // Technology highlights
  techHighlights: string[] = [
    'Next.js', 'React', 'Angular', 'TypeScript',
    'MongoDB', 'PostgreSQL', 'Prisma', 'Node.js'
  ];

  // Current view mode
  currentViewMode: 'grid' | 'list' = 'grid';

  // Active filter
  activeFilter = 'all';

  // SSR compatibility flags
  private isBrowser = false;

  ngOnInit(): void {
    // Check if running in browser
    this.isBrowser = isPlatformBrowser(this.platformId);

    if (this.isBrowser) {
      // Browser-only initialization
      this.animateStats();
    }
  }

  ngAfterViewInit(): void {
    // Only run browser-specific code after view initialization
    if (this.isBrowser) {
      this.setupBrowserFeatures();
    }
  }

  // Filter projects
  onFilterClick(filterId: string): void {
    // Update active filter
    this.filterOptions.forEach(option => {
      option.active = option.id === filterId;
    });

    this.activeFilter = filterId;
    this.filterChange.emit(filterId);

    // Only log in browser environment
    if (this.isBrowser) {
      console.log(`Filter changed to: ${filterId}`);
    }
  }

  // Toggle view mode
  onViewModeToggle(mode: 'grid' | 'list'): void {
    this.currentViewMode = mode;
    this.viewModeChange.emit(mode);

    // Only log in browser environment
    if (this.isBrowser) {
      console.log(`View mode changed to: ${mode}`);
    }
  }

  // Get active filter
  getActiveFilter(): FilterOption {
    return this.filterOptions.find(option => option.active) || this.filterOptions[0];
  }

  // SSR-safe scroll to projects
  onScrollToProjects(): void {
    // Only execute in browser environment
    if (!this.isBrowser) {
      return;
    }

    try {
      const projectsSection = document.getElementById('projects-grid');
      if (projectsSection) {
        projectsSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    } catch (error) {
      // Silent fail for SSR compatibility
      if (this.isBrowser) {
        console.warn('Scroll to projects failed:', error);
      }
    }
  }

  // Animate statistics (browser-only)
  private animateStats(): void {
    if (!this.isBrowser) {
      return;
    }

    // Use setTimeout safely in browser
    setTimeout(() => {
      // Stats animation implementation
      const statElements = document.querySelectorAll('.stat-number');
      statElements.forEach((element, index) => {
        if (element) {
          element.classList.add('animate-in');
        }
      });
    }, 100);
  }

  // Setup browser-specific features
  private setupBrowserFeatures(): void {
    if (!this.isBrowser) {
      return;
    }

    // Initialize any browser-only features here
    // Like event listeners, animations, etc.
    try {
      // Example: Setup intersection observer for animations
      this.setupIntersectionObserver();
    } catch (error) {
      console.warn('Browser features setup failed:', error);
    }
  }

  // SSR-safe intersection observer
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

    // Observe elements safely
    setTimeout(() => {
      const animatedElements = document.querySelectorAll('.animate-on-scroll');
      animatedElements.forEach((element) => {
        if (element) {
          observer.observe(element);
        }
      });
    }, 100);
  }

  // Get filter badge color
  getFilterBadgeColor(filterId: string): string {
    const colors = {
      'all': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'ecommerce': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'management': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'crud': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'collaboration': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
      'portfolio': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300'
    };

    return colors[filterId as keyof typeof colors] || colors['all'];
  }

  // Get technology badge color (rotating colors)
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

  // Check if browser for template
  get isInBrowser(): boolean {
    return this.isBrowser;
  }

  // Track by functions for performance
  trackByFilter(index: number, filter: FilterOption): string {
    return filter.id;
  }

  trackByTech(index: number, tech: string): string {
    return tech;
  }
}