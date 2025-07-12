import { Component, OnInit } from '@angular/core';
import { ProjectsHeroComponent } from '../../components/projects-hero/projects-hero.component';
import { ProjectGridComponent } from '../../components/project-grid/project-grid.component';
import { Project, ViewMode } from '../../../interfaces/project.interface';
import { ProjectDetailsComponent } from '../../components/project-details/project-details.component';
import { ProjectStatsComponent } from '../../components/project-stats/project-stats.component';
import { ProjectShowcaseComponent } from '../../components/project-showcase/project-showcase.component';

@Component({
  selector: 'app-projects',
  imports: [ProjectsHeroComponent, ProjectGridComponent, ProjectDetailsComponent, ProjectStatsComponent, ProjectShowcaseComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent implements OnInit {

  activeFilter = 'all';
  viewMode: ViewMode = 'grid';

  // State pentru project details
  selectedProject: Project | null = null;
  allProjects: Project[] = [];

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    // Date actualizate conform interfața ta:
    this.allProjects = [
      {
        id: 'ecommerce-app',
        title: 'E-commerce Application',
        description: 'Full-stack e-commerce platform with modern TypeScript implementation',
        longDescription: 'A comprehensive e-commerce solution built with Next.js and MongoDB, featuring product catalog, shopping cart, user management, and secure payment processing. Demonstrates proficiency in modern web development practices with TypeScript implementation.',
        technologies: ['Next.js', 'TypeScript', 'MongoDB', 'TailwindCSS', 'Stripe', 'React'],
        category: 'ecommerce',
        status: 'production',
        featured: true,
        images: [
          '/assets/projects/ecommerce/home.png',
          '/assets/projects/ecommerce/products.png',
          '/assets/projects/ecommerce/cart.png',
          '/assets/projects/ecommerce/checkout.png'
        ],
        demoUrl: 'https://flowering-stories.vercel.app',
        githubUrl: 'https://github.com/AlinV15/FloweringStoriesApp---ecommerce-app',
        features: [
          'Product catalog with search and filtering',
          'Shopping cart and checkout system',
          'User authentication and profiles',
          'Admin dashboard for inventory management',
          'Responsive design for all devices',
          'Secure payment processing with Stripe'
        ],
        challenges: [
          'Implementing secure payment processing with Stripe API',
          'Optimizing database queries for large product catalogs',
          'Creating responsive design that works across all devices',
          'Managing complex state between cart and user sessions'
        ],
        developmentTime: '3 months',
        complexity: 'intermediate',
        metrics: {
          users: 150,
          performance: '92/100',
          codeQuality: 'A',
          lines: 8500,
          commits: 127
        },
        tags: ['full-stack', 'e-commerce', 'payment-integration', 'responsive', 'mongodb'],
        year: 2024
      },
      {
        id: 'restaurant-management',
        title: 'Restaurant Management App',
        description: 'Complex web application for restaurant inventory and operations management',
        longDescription: 'A comprehensive restaurant management system built with Next.js, Prisma, and PostgreSQL. Features include inventory tracking, order processing, supply chain management, and detailed analytics dashboard for restaurant operations.',
        technologies: ['Next.js', 'Prisma', 'PostgreSQL', 'TypeScript', 'Chart.js', 'React'],
        category: 'management',
        status: 'production',
        featured: true,
        images: [
          '/assets/projects/restaurant/dashboard.png',
          '/assets/projects/restaurant/inventory.png',
          '/assets/projects/restaurant/orders.png',
          '/assets/projects/restaurant/analytics.png'
        ],
        demoUrl: 'https://restaurant-mgmt.vercel.app',
        githubUrl: 'https://github.com/AlinV15/Restaurant-management-App-using-Next.js-Prisma-and-PostgreSQL',
        features: [
          'Real-time inventory tracking and management',
          'Order management and processing system',
          'Supply chain optimization tools',
          'Analytics and reporting dashboard',
          'Multi-user role management',
          'Automated low-stock alerts'
        ],
        challenges: [
          'Designing efficient database schema for complex relationships',
          'Implementing real-time updates for inventory changes',
          'Creating intuitive UX for restaurant staff with varying tech skills',
          'Optimizing performance for high-frequency data updates'
        ],
        developmentTime: '4 months',
        complexity: 'advanced',
        metrics: {
          users: 25,
          performance: '89/100',
          codeQuality: 'A+',
          lines: 12300,
          commits: 189
        },
        tags: ['management', 'real-time', 'analytics', 'postgresql', 'prisma'],
        year: 2024
      },
      {
        id: 'quotez-app',
        title: 'QuotezApp - Quote Management Platform',
        description: 'CRUD operations for quotes with personalized collections and full-stack implementation',
        longDescription: 'A full-stack quote management platform allowing users to create, view, edit, and delete quotes with personalized collections. Built with React, Express, and MongoDB, featuring user authentication and social sharing capabilities.',
        technologies: ['React', 'Express.js', 'MongoDB', 'Node.js', 'JavaScript', 'CSS3'],
        category: 'crud',
        status: 'development',
        featured: false,
        images: [
          '/assets/projects/quotez/home.png',
          '/assets/projects/quotez/collections.png',
          '/assets/projects/quotez/editor.png'
        ],
        githubUrl: 'https://github.com/AlinV15/QuotezApp',
        features: [
          'Create and manage personal quote collections',
          'Advanced search and filtering functionality',
          'User authentication and authorization',
          'Social sharing capabilities',
          'Responsive design for mobile and desktop'
        ],
        challenges: [
          'Implementing efficient search across large quote databases',
          'Designing intuitive collection management interface',
          'Handling user authentication and session management'
        ],
        developmentTime: '2 months',
        complexity: 'intermediate',
        metrics: {
          users: 45,
          performance: '85/100',
          codeQuality: 'B+',
          lines: 6200,
          commits: 78
        },
        tags: ['crud', 'collections', 'search', 'authentication', 'responsive'],
        year: 2023
      },
      {
        id: 'todo-app',
        title: 'Todo Application',
        description: 'Task management application with Kanban functionality and user authentication',
        longDescription: 'A modern task management application built with Next.js and MongoDB, featuring Kanban-style organization, drag-and-drop functionality, user authentication, and real-time updates for efficient personal task management.',
        technologies: ['Next.js', 'MongoDB', 'JavaScript', 'CSS3', 'React'],
        category: 'frontend',
        status: 'production',
        featured: false,
        images: [
          '/assets/projects/todo/kanban.png',
          '/assets/projects/todo/tasks.png',
          '/assets/projects/todo/mobile.png'
        ],
        demoUrl: 'https://todo-nextjs-alin.vercel.app',
        githubUrl: 'https://github.com/AlinV15/Todo-App-with-Next.js',
        features: [
          'Kanban-style task organization',
          'Drag and drop functionality',
          'User authentication and profiles',
          'Real-time task updates',
          'Mobile-responsive design'
        ],
        challenges: [
          'Implementing smooth drag-and-drop interactions',
          'Managing real-time state synchronization',
          'Creating intuitive mobile touch interactions'
        ],
        developmentTime: '1 month',
        complexity: 'beginner',
        metrics: {
          users: 89,
          performance: '91/100',
          codeQuality: 'A-',
          lines: 3400,
          commits: 42
        },
        tags: ['kanban', 'drag-drop', 'real-time', 'mobile-friendly'],
        year: 2023
      },
      {
        id: 'angular-web-app',
        title: 'Angular Web Application',
        description: 'University collaborative project demonstrating Angular framework proficiency',
        longDescription: 'A collaborative university project showcasing Angular framework capabilities, built with TypeScript and modern Angular practices. Demonstrates component-based architecture, routing, service integration, and team development workflows.',
        technologies: ['Angular', 'TypeScript', 'HTML5', 'CSS3', 'RxJS'],
        category: 'collaboration',
        status: 'concept',
        featured: false,
        images: [
          '/assets/projects/angular/dashboard.png',
          '/assets/projects/angular/components.png'
        ],
        githubUrl: 'https://github.com/AlinV15/Proiect-Web-App-with-Angular',
        features: [
          'Component-based architecture',
          'Advanced routing and navigation',
          'Service integration and dependency injection',
          'Responsive design implementation',
          'Team collaboration workflows'
        ],
        challenges: [
          'Learning Angular framework from scratch',
          'Coordinating development work across team members',
          'Implementing complex component communication patterns'
        ],
        developmentTime: '2 months',
        complexity: 'intermediate',
        metrics: {
          codeQuality: 'B',
          lines: 5600,
          commits: 156
        },
        tags: ['angular', 'typescript', 'team-project', 'university', 'components'],
        year: 2023
      },
      {
        id: 'roomie-finder',
        title: 'RoomieFinder Application',
        description: 'User management project for students seeking roommates',
        longDescription: 'A specialized platform designed for students to find compatible roommates, featuring comprehensive user profiles, intelligent matching algorithms, room listing management, and integrated messaging system for seamless communication.',
        technologies: ['Next.js', 'Prisma', 'PostgreSQL', 'TypeScript', 'TailwindCSS'],
        category: 'fullstack',
        status: 'development',
        featured: false,
        images: [
          '/assets/projects/roomie/profiles.png',
          '/assets/projects/roomie/matching.png',
          '/assets/projects/roomie/messages.png'
        ],
        githubUrl: 'https://github.com/AlinV15/Roomie-app',
        features: [
          'Comprehensive user profile management',
          'Intelligent roommate matching algorithm',
          'Room listing and advanced search',
          'Integrated messaging system',
          'Preference-based filtering',
          'Student verification system'
        ],
        challenges: [
          'Designing effective matching algorithms for compatibility',
          'Creating secure messaging system with privacy controls',
          'Implementing complex filtering and search functionality'
        ],
        developmentTime: '2 months',
        complexity: 'intermediate',
        metrics: {
          users: 67,
          performance: '87/100',
          codeQuality: 'A-',
          lines: 7800,
          commits: 94
        },
        tags: ['matching', 'social', 'students', 'messaging', 'algorithm'],
        year: 2024
      },
      {
        id: 'portfolio-website',
        title: 'Personal Portfolio Website',
        description: 'Interactive personal website showcasing creative web development skills',
        longDescription: 'A custom-built portfolio website featuring interactive animations, responsive design, and creative web development showcase. Built with vanilla JavaScript and GSAP for smooth animations, demonstrating creative problem-solving and attention to detail.',
        technologies: ['HTML5', 'CSS3', 'JavaScript', 'GSAP', 'Sass'],
        category: 'portfolio',
        status: 'production',
        featured: true,
        images: [
          '/assets/projects/portfolio/home.png',
          '/assets/projects/portfolio/projects.png',
          '/assets/projects/portfolio/about.png'
        ],
        demoUrl: 'https://alinciobanu.dev',
        githubUrl: 'https://github.com/AlinV15/MyWebsite',
        features: [
          'Custom animations and micro-interactions',
          'Fully responsive design',
          'Performance optimized loading',
          'SEO friendly structure',
          'Interactive project showcase',
          'Smooth scrolling and transitions'
        ],
        challenges: [
          'Creating smooth animations without impacting performance',
          'Designing engaging user interactions',
          'Optimizing for various screen sizes and devices'
        ],
        developmentTime: '3 weeks',
        complexity: 'beginner',
        metrics: {
          users: 234,
          performance: '96/100',
          codeQuality: 'A',
          lines: 2800,
          commits: 67
        },
        tags: ['portfolio', 'animations', 'creative', 'performance', 'seo'],
        year: 2023
      }
    ];
  }

  // Filter logic
  onFilterChange(filter: string) {
    this.activeFilter = filter;
  }

  onViewModeChange(mode: ViewMode) {
    this.viewMode = mode;
  }

  get filteredProjects(): Project[] {
    if (this.activeFilter === 'all') {
      return this.allProjects;
    }

    return this.allProjects.filter(project => {
      switch (this.activeFilter) {
        case 'featured':
          return project.featured;
        case 'ecommerce':
          return project.category === 'ecommerce';
        case 'management':
          return project.category === 'management';
        case 'crud':
          return project.category === 'crud';
        case 'portfolio':
          return project.category === 'portfolio';
        case 'collaboration':
          return project.category === 'collaboration';
        case 'fullstack':
          return project.category === 'fullstack';
        case 'frontend':
          return project.category === 'frontend';
        case 'backend':
          return project.category === 'backend';
        case 'production':
          return project.status === 'production';
        case 'development':
          return project.status === 'development';
        case 'concept':
          return project.status === 'concept';
        case 'beginner':
          return project.complexity === 'beginner';
        case 'intermediate':
          return project.complexity === 'intermediate';
        case 'advanced':
          return project.complexity === 'advanced';
        // Filter by technology
        case 'react':
          return project.technologies.some(tech => tech.toLowerCase().includes('react'));
        case 'angular':
          return project.technologies.some(tech => tech.toLowerCase().includes('angular'));
        case 'nextjs':
          return project.technologies.some(tech => tech.toLowerCase().includes('next'));
        case 'typescript':
          return project.technologies.some(tech => tech.toLowerCase().includes('typescript'));
        case 'mongodb':
          return project.technologies.some(tech => tech.toLowerCase().includes('mongodb'));
        case 'postgresql':
          return project.technologies.some(tech => tech.toLowerCase().includes('postgresql'));
        default:
          return true;
      }
    });
  }

  // Project selection handlers
  onProjectSelect(project: Project) {
    this.selectedProject = project;
  }

  onDemoClick(project: Project) {
    // Optional: track analytics or additional logic
    console.log('Demo clicked for:', project.title);
  }

  onGithubClick(project: Project) {
    // Optional: track analytics or additional logic
    console.log('GitHub clicked for:', project.title);
  }

  // Project details modal handlers
  onCloseProjectDetails() {
    this.selectedProject = null;
  }

  onPreviousProject() {
    if (!this.selectedProject || !this.allProjects.length) return;

    const currentIndex = this.allProjects.findIndex(p => p.id === this.selectedProject!.id);
    if (currentIndex > 0) {
      this.selectedProject = this.allProjects[currentIndex - 1];
    }
  }

  onNextProject() {
    if (!this.selectedProject || !this.allProjects.length) return;

    const currentIndex = this.allProjects.findIndex(p => p.id === this.selectedProject!.id);
    if (currentIndex < this.allProjects.length - 1) {
      this.selectedProject = this.allProjects[currentIndex + 1];
    }
  }
}