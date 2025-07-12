import { Component, OnInit, Input, Output, EventEmitter, Inject, PLATFORM_ID, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Project, ViewMode } from '../../../interfaces/project.interface';

@Component({
  selector: 'app-project-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-grid.component.html',
  styleUrls: ['./project-grid.component.css']
})
export class ProjectGridComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() activeFilter = 'all';
  @Input() viewMode: ViewMode = 'grid';
  @Input() searchTerm = '';
  @Output() projectSelect = new EventEmitter<Project>();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  // All projects data based on your CV
  allProjects: Project[] = [
    {
      id: 'flowering-stories',
      title: 'FloweringStories E-commerce App',
      description: 'Full-stack e-commerce platform with modern TypeScript implementation, featuring product catalog, shopping cart, and user management.',
      longDescription: 'A comprehensive e-commerce solution built with Next.js and MongoDB, featuring a complete product catalog system, shopping cart functionality, user authentication, and order management. The platform demonstrates modern web development practices with TypeScript for type safety and optimal performance.',
      technologies: ['Next.js', 'MongoDB', 'TypeScript', 'Tailwind CSS', 'Stripe'],
      category: 'ecommerce',
      status: 'production',
      featured: true,
      images: ['/assets/projects/flowering-stories-1.jpg', '/assets/projects/flowering-stories-2.jpg'],
      demoUrl: 'https://flowering-stories.vercel.app',
      githubUrl: 'https://github.com/AlinV15/FloweringStoriesApp---ecommerce-app',
      features: [
        'Product catalog with categories and filters',
        'Shopping cart and checkout system',
        'User authentication and profiles',
        'Payment integration with Stripe',
        'Responsive design for all devices',
        'Admin dashboard for product management'
      ],
      challenges: [
        'Implementing secure payment processing',
        'Optimizing database queries for large product catalogs',
        'Creating responsive design for complex layouts'
      ],
      developmentTime: '4 months',
      complexity: 'advanced',
      metrics: {
        users: 150,
        performance: 'A+ (95/100)',
        codeQuality: 'A',
        lines: 8500,
        commits: 127
      },
      tags: ['Full-Stack', 'E-commerce', 'TypeScript', 'Production'],
      year: '2024'
    },
    {
      id: 'restaurant-management',
      title: 'Restaurant Management Application',
      description: 'Complex web application for restaurant inventory management and operations with full-stack implementation using Next.js, Prisma, and PostgreSQL.',
      longDescription: 'A sophisticated restaurant management system that handles inventory tracking, consumption monitoring, order processing, and supply chain management. Built with modern technologies to provide a seamless experience for restaurant operations.',
      technologies: ['Next.js', 'Prisma', 'PostgreSQL', 'TypeScript', 'React', 'Tailwind CSS'],
      category: 'management',
      status: 'production',
      featured: true,
      images: ['/assets/projects/restaurant-mgmt-1.jpg', '/assets/projects/restaurant-mgmt-2.jpg'],
      demoUrl: 'https://restaurant-mgmt-demo.vercel.app',
      githubUrl: 'https://github.com/AlinV15/Restaurant-management-App-using-Next.js-Prisma-and-PostgreSQL',
      features: [
        'Inventory tracking and management',
        'Consumption monitoring and analytics',
        'Order processing system',
        'Supply chain management',
        'Admin dashboard with real-time data',
        'Staff management and role-based access'
      ],
      challenges: [
        'Real-time inventory updates',
        'Complex database relationships',
        'Performance optimization for large datasets'
      ],
      developmentTime: '5 months',
      complexity: 'advanced',
      metrics: {
        performance: 'A (92/100)',
        codeQuality: 'A+',
        lines: 12000,
        commits: 156
      },
      tags: ['Management', 'Full-Stack', 'PostgreSQL', 'Enterprise'],
      year: '2024'
    },
    {
      id: 'quotez-app',
      title: 'QuotezApp - Quote Management Platform',
      description: 'CRUD application with React, Express, and MongoDB for creating, viewing, editing, and deleting quotes with personal collections.',
      longDescription: 'A comprehensive quote management platform that allows users to create, organize, and manage personal quote collections. Features full CRUD operations with a clean, intuitive interface and robust backend API.',
      technologies: ['React', 'Express.js', 'MongoDB', 'Node.js', 'CSS3', 'JWT'],
      category: 'crud',
      status: 'production',
      featured: false,
      images: ['/assets/projects/quotez-app-1.jpg', '/assets/projects/quotez-app-2.jpg'],
      demoUrl: 'https://quotez-app-demo.netlify.app',
      githubUrl: 'https://github.com/AlinV15/QuotezApp',
      features: [
        'Complete CRUD operations for quotes',
        'Personal collections and categories',
        'User authentication and authorization',
        'Search and filter functionality',
        'Responsive design',
        'RESTful API implementation'
      ],
      challenges: [
        'Implementing efficient search algorithms',
        'Managing state across multiple components',
        'Creating intuitive user experience'
      ],
      developmentTime: '3 months',
      complexity: 'intermediate',
      metrics: {
        performance: 'A- (88/100)',
        codeQuality: 'A',
        lines: 6500,
        commits: 89
      },
      tags: ['CRUD', 'React', 'API', 'Authentication'],
      year: '2024'
    },
    {
      id: 'todo-kanban',
      title: 'Todo Application with Kanban',
      description: 'Task management and kanban application with user authentication and personal task organization built with Next.js and MongoDB.',
      longDescription: 'A modern task management application featuring kanban boards, user authentication, and personal task organization. Designed to help users efficiently manage their workflow and increase productivity.',
      technologies: ['Next.js', 'MongoDB', 'React', 'Tailwind CSS', 'TypeScript'],
      category: 'management',
      status: 'production',
      featured: false,
      images: ['/assets/projects/todo-app-1.jpg', '/assets/projects/todo-app-2.jpg'],
      demoUrl: 'https://todo-kanban-demo.vercel.app',
      githubUrl: 'https://github.com/AlinV15/Todo-App-with-Next.js',
      features: [
        'Kanban board interface',
        'Task creation and management',
        'User authentication',
        'Drag and drop functionality',
        'Progress tracking',
        'Mobile-responsive design'
      ],
      challenges: [
        'Implementing smooth drag and drop',
        'Real-time updates without page refresh',
        'Optimizing for mobile touch interactions'
      ],
      developmentTime: '2 months',
      complexity: 'intermediate',
      metrics: {
        performance: 'A (90/100)',
        codeQuality: 'A-',
        lines: 4200,
        commits: 67
      },
      tags: ['Productivity', 'Kanban', 'Next.js', 'TypeScript'],
      year: '2024'
    },
    {
      id: 'roomie-finder',
      title: 'RoomieFinder Student Platform',
      description: 'Student roommate matching application with user management, roommate matching, and room management features using Next.js, Prisma, and PostgreSQL.',
      longDescription: 'A specialized platform designed to help students find compatible roommates and manage shared living spaces. Features intelligent matching algorithms and comprehensive room management tools.',
      technologies: ['Next.js', 'Prisma', 'PostgreSQL', 'TypeScript', 'React', 'Tailwind CSS'],
      category: 'collaboration',
      status: 'development',
      featured: true,
      images: ['/assets/projects/roomie-finder-1.jpg', '/assets/projects/roomie-finder-2.jpg'],
      githubUrl: 'https://github.com/AlinV15/Roomie-app',
      features: [
        'User authentication and profiles',
        'Roommate matching algorithm',
        'Room and property management',
        'Communication tools',
        'Preference matching system',
        'Review and rating system'
      ],
      challenges: [
        'Creating effective matching algorithms',
        'Ensuring user safety and privacy',
        'Building trust between users'
      ],
      developmentTime: '4 months',
      complexity: 'advanced',
      metrics: {
        codeQuality: 'A',
        lines: 9800,
        commits: 134
      },
      tags: ['Social', 'Matching', 'Students', 'Collaboration'],
      year: '2024'
    },
    {
      id: 'angular-collaborative',
      title: 'Angular Collaborative Project',
      description: 'University collaborative project demonstrating Angular framework competency with team development experience and version control.',
      longDescription: 'A comprehensive Angular application developed as part of university coursework, showcasing modern Angular development practices, component architecture, and collaborative development workflows.',
      technologies: ['Angular', 'TypeScript', 'HTML5', 'CSS3', 'Git', 'RxJS'],
      category: 'collaboration',
      status: 'production',
      featured: false,
      images: ['/assets/projects/angular-project-1.jpg', '/assets/projects/angular-project-2.jpg'],
      githubUrl: 'https://github.com/AlinV15/Proiect-Web-App-with-Angular',
      features: [
        'Component-based architecture',
        'Reactive forms implementation',
        'Service integration',
        'Routing and navigation',
        'Team collaboration workflows',
        'Version control with Git'
      ],
      challenges: [
        'Coordinating work among team members',
        'Maintaining code consistency',
        'Implementing Angular best practices'
      ],
      developmentTime: '3 months',
      complexity: 'intermediate',
      metrics: {
        codeQuality: 'A-',
        lines: 5500,
        commits: 78
      },
      tags: ['Angular', 'Team Project', 'University', 'Collaboration'],
      year: '2024'
    },
    {
      id: 'personal-portfolio',
      title: 'Personal Portfolio Website',
      description: 'Interactive personal portfolio showcasing creative web development skills with custom animations and responsive design implementation.',
      longDescription: 'A modern, interactive portfolio website built from scratch to showcase web development skills and projects. Features custom animations, responsive design, and optimized performance.',
      technologies: ['HTML5', 'CSS3', 'JavaScript', 'SCSS', 'Responsive Design'],
      category: 'portfolio',
      status: 'production',
      featured: false,
      images: ['/assets/projects/portfolio-1.jpg', '/assets/projects/portfolio-2.jpg'],
      demoUrl: 'https://alinv-portfolio.netlify.app',
      githubUrl: 'https://github.com/AlinV15/MyWebsite',
      features: [
        'Custom CSS animations',
        'Responsive design for all devices',
        'Interactive UI elements',
        'Performance optimized',
        'SEO friendly structure',
        'Cross-browser compatibility'
      ],
      challenges: [
        'Creating smooth CSS animations',
        'Ensuring cross-browser compatibility',
        'Optimizing loading performance'
      ],
      developmentTime: '2 months',
      complexity: 'beginner',
      metrics: {
        performance: 'A+ (97/100)',
        codeQuality: 'A',
        lines: 2800,
        commits: 45
      },
      tags: ['Portfolio', 'Vanilla JS', 'CSS Animations', 'Responsive'],
      year: '2023'
    }
  ];

  // Filtered and sorted projects
  filteredProjects: Project[] = [];
  displayedProjects: Project[] = [];

  // Loading and pagination
  isLoading = false;
  currentPage = 1;
  projectsPerPage = 6;
  totalPages = 0;

  // Browser detection for SSR
  private isBrowser = false;

  ngOnInit(): void {
    // SSR-safe browser detection
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.initializeProjects();
  }

  ngAfterViewInit(): void {
    // Only run browser-specific code after view init
    if (this.isBrowser) {
      this.setupBrowserFeatures();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['activeFilter'] || changes['searchTerm']) {
      this.filterProjects();
    }
    if (changes['viewMode']) {
      this.updateProjectsPerPage();
    }
  }

  // Initialize projects
  private initializeProjects(): void {
    this.filteredProjects = [...this.allProjects];
    this.filterProjects();
  }

  // Setup browser-only features
  private setupBrowserFeatures(): void {
    if (!this.isBrowser) return;

    try {
      // Setup intersection observer for animations
      this.setupIntersectionObserver();
    } catch (error) {
      // Silent fail for SSR compatibility
      if (this.isBrowser) {
        console.warn('Browser features setup failed:', error);
      }
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
            entry.target.classList.add('animate-in');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    // Safely observe elements
    setTimeout(() => {
      if (this.isBrowser) {
        const projectCards = document.querySelectorAll('.project-card, .project-list-item');
        projectCards.forEach((card) => {
          if (card) {
            observer.observe(card);
          }
        });
      }
    }, 100);
  }

  // Filter projects based on active filter and search term
  private filterProjects(): void {
    this.isLoading = true;

    // Apply category filter
    let filtered = this.allProjects;

    if (this.activeFilter !== 'all') {
      filtered = filtered.filter(project => project.category === this.activeFilter);
    }

    // Apply search filter
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchLower) ||
        project.description.toLowerCase().includes(searchLower) ||
        project.technologies.some((tech: string) => tech.toLowerCase().includes(searchLower)) ||
        project.tags.some((tag: string) => tag.toLowerCase().includes(searchLower))
      );
    }

    this.filteredProjects = filtered;
    this.currentPage = 1;
    this.updatePagination();

    // Simulate loading for better UX
    setTimeout(() => {
      this.isLoading = false;
    }, 300);
  }

  // Update projects per page based on view mode
  private updateProjectsPerPage(): void {
    this.projectsPerPage = this.viewMode === 'list' ? 4 : 6;
    this.updatePagination();
  }

  // Update pagination
  private updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredProjects.length / this.projectsPerPage);
    this.updateDisplayedProjects();
  }

  // Update displayed projects for current page
  private updateDisplayedProjects(): void {
    const startIndex = (this.currentPage - 1) * this.projectsPerPage;
    const endIndex = startIndex + this.projectsPerPage;
    this.displayedProjects = this.filteredProjects.slice(startIndex, endIndex);
  }

  // Handle project selection
  onProjectClick(project: Project): void {
    this.projectSelect.emit(project);

    if (this.isBrowser) {
      console.log('Project selected:', project.title);
    }
  }

  // SSR-safe external link handlers
  onDemoClick(event: Event, project: Project): void {
    event.stopPropagation();

    if (!this.isBrowser || !project.demoUrl) {
      return;
    }

    try {
      window.open(project.demoUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      // Fallback for SSR
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
      // Fallback for SSR
      if (this.isBrowser) {
        console.warn('GitHub link failed:', error);
      }
    }
  }

  // SSR-safe pagination methods
  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateDisplayedProjects();

      // SSR-safe scroll to top of grid
      if (this.isBrowser) {
        try {
          const gridElement = document.getElementById('projects-grid');
          if (gridElement) {
            gridElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        } catch (error) {
          // Silent fail for SSR
        }
      }
    }
  }

  // Get pagination range
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

  // Get status badge classes
  getStatusBadgeClass(status: string): string {
    const classes = {
      'production': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'development': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'concept': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    };
    return classes[status as keyof typeof classes] || classes['concept'];
  }

  // Get complexity badge classes
  getComplexityBadgeClass(complexity: string): string {
    const classes = {
      'beginner': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'intermediate': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'advanced': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    };
    return classes[complexity as keyof typeof classes] || classes['intermediate'];
  }

  // Get technology badge color
  getTechBadgeColor(index: number): string {
    const colors = [
      'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-700',
      'bg-green-50 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-700',
      'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900 dark:text-purple-300 dark:border-purple-700',
      'bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-900 dark:text-pink-300 dark:border-pink-700',
      'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900 dark:text-indigo-300 dark:border-indigo-700'
    ];
    return colors[index % colors.length];
  }

  // Track by functions for performance
  trackByProject(index: number, project: Project): string {
    return project.id;
  }

  trackByTechnology(index: number, tech: string): string {
    return tech;
  }

  trackByFeature(index: number, feature: string): string {
    return feature;
  }

  trackByPage(index: number, page: number): number {
    return page;
  }

  // Getters for template
  get hasProjects(): boolean {
    return this.displayedProjects.length > 0;
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

  // SSR-safe browser check for template
  get isInBrowser(): boolean {
    return this.isBrowser;
  }
}
