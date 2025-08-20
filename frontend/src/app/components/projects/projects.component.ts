import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Interfaces
import {
  Project,
  FeaturedProject,
  ProjectsStats,
  ProjectCategoryDistribution
} from '../../shared/models/project.interface';
import { ProjectStatus } from '../../shared/enums/ProjectStatus';
import { ComplexityLevel } from '../../shared/enums/ComplexityLevel';

export interface ProjectsData {
  projects: Project[];
  featuredProjects: FeaturedProject[];
  projectStats: ProjectsStats;
}

@Component({
  selector: 'app-featured-projects',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit, OnChanges {

  // Input from parent component (HomeComponent)
  @Input() projectsData: ProjectsData | null = null;

  // Component data
  featuredProjects: FeaturedProject[] = [];
  allProjects: Project[] = [];
  projectStats: ProjectsStats = {
    technologies: 0,
    totalProjects: 0,
    liveProjects: 0
  };

  // Computed properties for display
  displayedProjects: FeaturedProject[] = [];
  maxProjectsToShow = 3; // Limit for home page display

  // Category distribution (computed from projects)
  categoryDistribution: ProjectCategoryDistribution[] = [];

  // Top technologies (computed from projects)
  topTechnologies: string[] = [];

  // Enums for template access
  readonly ProjectStatus = ProjectStatus;
  readonly ComplexityLevel = ComplexityLevel;

  ngOnInit(): void {
    this.initializeProjectsData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['projectsData'] && this.projectsData) {
      this.initializeProjectsData();
    }
  }

  /**
   * Initialize projects data from parent component input
   */
  private initializeProjectsData(): void {
    if (!this.projectsData) return;

    // Set main data
    this.featuredProjects = this.projectsData.featuredProjects || [];
    this.allProjects = this.projectsData.projects || [];
    this.projectStats = this.projectsData.projectStats || {
      technologies: 0,
      totalProjects: 0,
      liveProjects: 0
    };

    // Process featured projects for display
    this.processDisplayedProjects();

    // Calculate additional metrics
    this.calculateCategoryDistribution();
    this.calculateTopTechnologies();
  }

  /**
   * Process featured projects for home page display
   */
  private processDisplayedProjects(): void {
    // Sort featured projects by priority (featured first, then by year/date)
    this.displayedProjects = this.featuredProjects
      .sort((a, b) => {
        // Featured projects first
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;

        // Then by title alphabetically
        return a.title.localeCompare(b.title);
      })
      .slice(0, this.maxProjectsToShow);
  }

  /**
   * Calculate category distribution from all projects
   */
  private calculateCategoryDistribution(): void {
    const categoryCount = new Map<string, number>();
    const totalProjects = this.allProjects.length;

    // Count projects by category
    this.allProjects.forEach(project => {
      const category = project.category || 'Other';
      categoryCount.set(category, (categoryCount.get(category) || 0) + 1);
    });

    // Convert to distribution array
    this.categoryDistribution = Array.from(categoryCount.entries())
      .map(([category, count]) => ({
        category,
        projectCount: count,
        percentage: totalProjects > 0 ? (count / totalProjects) * 100 : 0,
        formatedPercentage: totalProjects > 0 ? `${Math.round((count / totalProjects) * 100)}%` : '0%'
      }))
      .sort((a, b) => b.projectCount - a.projectCount);
  }

  /**
   * Calculate top technologies from all projects
   */
  private calculateTopTechnologies(): void {
    const techCount = new Map<string, number>();

    // Count technology usage across all projects
    this.allProjects.forEach(project => {
      project.technologies?.forEach(tech => {
        techCount.set(tech, (techCount.get(tech) || 0) + 1);
      });
    });

    // Get top 10 most used technologies
    this.topTechnologies = Array.from(techCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([tech]) => tech);
  }

  /**
   * Get technology badge color for consistency
   */
  getTechBadgeColor(tech: string): string {
    const techColors: { [key: string]: string } = {
      // Frontend
      'Angular': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      'React': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'Vue': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'Next.js': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      'Nuxt.js': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',

      // Languages
      'TypeScript': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'JavaScript': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'Java': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      'Python': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'C#': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',

      // Backend
      'Spring Boot': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'Node.js': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'Express': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      'Express.js': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',

      // Databases
      'PostgreSQL': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
      'MongoDB': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'MySQL': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'Redis': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',

      // Styling
      'Tailwind CSS': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
      'TailwindCSS': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
      'CSS': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'SCSS': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
      'Bootstrap': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',

      // Tools & Others
      'Docker': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'Kubernetes': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'AWS': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      'Firebase': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'Vercel': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      'Netlify': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',

      // Communication & Real-time
      'Socket.io': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'WebSocket': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',

      // State Management
      'Redux': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'Zustand': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      'Pinia': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',

      // Build Tools
      'Webpack': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'Vite': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'Rollup': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    };

    return techColors[tech] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }

  /**
   * Get project status badge color
   */
  getStatusBadgeColor(status: ProjectStatus): string {
    const statusColors = {
      [ProjectStatus.PLANNING]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      [ProjectStatus.DEVELOPMENT]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      [ProjectStatus.TESTING]: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      [ProjectStatus.PRODUCTION]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      [ProjectStatus.MAINTENANCE]: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
      [ProjectStatus.ARCHIVED]: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    };

    return statusColors[status] || statusColors[ProjectStatus.DEVELOPMENT];
  }

  /**
   * Get complexity level badge color
   */
  getComplexityBadgeColor(complexity: ComplexityLevel): string {
    const complexityColors = {
      [ComplexityLevel.BEGINNER]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      [ComplexityLevel.INTERMEDIATE]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      [ComplexityLevel.ADVANCED]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    };

    return complexityColors[complexity] || complexityColors[ComplexityLevel.INTERMEDIATE];
  }

  /**
   * Format project year for display
   */
  formatProjectYear(year: number | string): string {
    return year.toString();
  }

  /**
   * Check if project has demo URL
   */
  hasLiveDemo(project: FeaturedProject): boolean {
    return !!(project.liveUrl && project.liveUrl.trim());
  }

  /**
   * Check if project has GitHub URL
   */
  hasGitHubRepo(project: FeaturedProject): boolean {
    return !!(project.githubUrl && project.githubUrl.trim());
  }

  /**
   * Get primary project color or fallback
   */
  getPrimaryColor(project: FeaturedProject): string {
    return project.primaryColor || '#3B82F6';
  }

  /**
   * Get secondary project color or generate from primary
   */
  getSecondaryColor(project: FeaturedProject): string {
    return project.secondaryColor || this.lightenColor(project.primaryColor || '#3B82F6');
  }

  /**
   * Lighten a hex color for secondary color generation
   */
  private lightenColor(color: string): string {
    // Simple color lightening - you might want to use a proper color library
    if (color.startsWith('#')) {
      const num = parseInt(color.slice(1), 16);
      const amt = 40;
      const R = (num >> 16) + amt;
      const G = (num >> 8 & 0x00FF) + amt;
      const B = (num & 0x0000FF) + amt;
      return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
        (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
        (B < 255 ? B < 1 ? 0 : B : 255))
        .toString(16)
        .slice(1);
    }
    return color;
  }

  /**
   * Track by function for performance optimization
   */
  trackByProject(index: number, project: FeaturedProject): string {
    return project.id;
  }

  /**
   * Track by function for technologies
   */
  trackByTechnology(index: number, tech: string): string {
    return tech;
  }


  /**
   * Handle demo link click
   */
  onDemoClick(project: FeaturedProject, event: Event): void {
    event.stopPropagation(); // Prevent project click

  }

  /**
   * Handle GitHub link click
   */
  onGitHubClick(project: FeaturedProject, event: Event): void {
    event.stopPropagation(); // Prevent project click
  }

  /**
   * Get total featured projects count
   */
  getFeaturedProjectsCount(): number {
    return this.featuredProjects.length;
  }

  /**
   * Check if we should show "View All Projects" link
   */
  shouldShowViewAllLink(): boolean {
    return this.featuredProjects.length > this.maxProjectsToShow;
  }

  /**
   * Get stats for display
   */
  getProjectsStats() {
    return {
      total: this.projectStats.totalProjects,
      live: this.projectStats.liveProjects,
      technologies: this.projectStats.technologies,
      featured: this.featuredProjects.length
    };
  }

  /**
   * Get top category for quick display
   */
  getTopCategory(): ProjectCategoryDistribution | null {
    return this.categoryDistribution.length > 0 ? this.categoryDistribution[0] : null;
  }

  /**
   * Get top technologies (limited for display)
   */
  getTopTechnologiesForDisplay(limit = 5): string[] {
    return this.topTechnologies.slice(0, limit);
  }
}