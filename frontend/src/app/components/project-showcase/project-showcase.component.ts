import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  LucideAngularModule,
  Star, ExternalLink, Github, Eye, ChevronLeft, ChevronRight,
  Rocket, Wrench, Lightbulb, Calendar, Clock, Users, Code, Zap, Award
} from 'lucide-angular';
import { Project } from '../../../interfaces/project.interface';

@Component({
  selector: 'app-project-showcase',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './project-showcase.component.html',
  styleUrls: ['./project-showcase.component.css']
})
export class ProjectShowcaseComponent implements OnInit, OnDestroy {
  @Input() projects: Project[] = [];
  @Input() autoSlide: boolean = true;
  @Input() slideInterval: number = 5000; // 5 seconds
  @Output() projectSelect = new EventEmitter<Project>();
  @Output() demoClick = new EventEmitter<Project>();
  @Output() githubClick = new EventEmitter<Project>();

  // Lucide Icons
  readonly starIcon = Star;
  readonly externalLinkIcon = ExternalLink;
  readonly githubIcon = Github;
  readonly eyeIcon = Eye;
  readonly chevronLeftIcon = ChevronLeft;
  readonly chevronRightIcon = ChevronRight;
  readonly rocketIcon = Rocket;
  readonly wrenchIcon = Wrench;
  readonly lightbulbIcon = Lightbulb;
  readonly calendarIcon = Calendar;
  readonly clockIcon = Clock;
  readonly usersIcon = Users;
  readonly codeIcon = Code;
  readonly zapIcon = Zap;
  readonly awardIcon = Award;

  currentSlide = 0;
  private slideTimer?: any;
  private isBrowser: boolean;
  isPlaying = true;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.autoSlide && this.isBrowser) {
      this.startAutoSlide();
    }
  }

  ngOnDestroy(): void {
    this.stopAutoSlide();
  }

  get featuredProjects(): Project[] {
    return this.projects.filter(project => project.featured);
  }

  get currentProject(): Project | null {
    const featured = this.featuredProjects;
    return featured.length > 0 ? featured[this.currentSlide] : null;
  }

  get hasMultipleProjects(): boolean {
    return this.featuredProjects.length > 1;
  }

  // Carousel controls
  nextSlide(): void {
    if (this.featuredProjects.length === 0) return;

    this.currentSlide = (this.currentSlide + 1) % this.featuredProjects.length;
    this.resetAutoSlide();
  }

  previousSlide(): void {
    if (this.featuredProjects.length === 0) return;

    this.currentSlide = this.currentSlide === 0
      ? this.featuredProjects.length - 1
      : this.currentSlide - 1;
    this.resetAutoSlide();
  }

  goToSlide(index: number): void {
    if (index >= 0 && index < this.featuredProjects.length) {
      this.currentSlide = index;
      this.resetAutoSlide();
    }
  }

  // Auto slide functionality
  private startAutoSlide(): void {
    if (!this.isBrowser || this.featuredProjects.length <= 1) return;

    this.slideTimer = setInterval(() => {
      if (this.isPlaying) {
        this.nextSlide();
      }
    }, this.slideInterval);
  }

  private stopAutoSlide(): void {
    if (this.slideTimer) {
      clearInterval(this.slideTimer);
      this.slideTimer = null;
    }
  }

  private resetAutoSlide(): void {
    if (this.autoSlide && this.isBrowser) {
      this.stopAutoSlide();
      this.startAutoSlide();
    }
  }

  toggleAutoSlide(): void {
    this.isPlaying = !this.isPlaying;
    if (!this.isPlaying) {
      this.stopAutoSlide();
    } else if (this.autoSlide) {
      this.startAutoSlide();
    }
  }

  // Event handlers
  onProjectSelect(project: Project): void {
    this.projectSelect.emit(project);
  }

  onDemoClick(project: Project, event: Event): void {
    event.stopPropagation();
    this.demoClick.emit(project);

    if (this.isBrowser && project.demoUrl) {
      window.open(project.demoUrl, '_blank', 'noopener,noreferrer');
    }
  }

  onGithubClick(project: Project, event: Event): void {
    event.stopPropagation();
    this.githubClick.emit(project);

    if (this.isBrowser && project.githubUrl) {
      window.open(project.githubUrl, '_blank', 'noopener,noreferrer');
    }
  }

  // Utility methods
  getStatusIcon(status: string): any {
    const icons = {
      'production': this.rocketIcon,
      'development': this.wrenchIcon,
      'concept': this.lightbulbIcon
    };
    return icons[status as keyof typeof icons] || this.wrenchIcon;
  }

  getStatusColor(status: string): string {
    const colors = {
      'production': 'text-green-500',
      'development': 'text-yellow-500',
      'concept': 'text-gray-500'
    };
    return colors[status as keyof typeof colors] || 'text-gray-500';
  }

  getComplexityColor(complexity: string): string {
    const colors = {
      'beginner': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'intermediate': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'advanced': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    };
    return colors[complexity as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }

  getTechBadgeColor(index: number): string {
    const colors = [
      'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
      'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
    ];
    return colors[index % colors.length];
  }

  formatDevelopmentTime(time: string): string {
    // Convert development time to a more readable format
    return time.replace(/(\d+)\s*(month|week|day)s?/gi, (match, num, unit) => {
      const units = {
        'month': 'mo',
        'week': 'wk',
        'day': 'd'
      };
      return `${num}${units[unit.toLowerCase() as keyof typeof units]}`;
    });
  }

  getProjectAge(year: number): string {
    const currentYear = new Date().getFullYear();
    const age = currentYear - year;

    if (age === 0) return 'This year';
    if (age === 1) return '1 year ago';
    return `${age} years ago`;
  }

  // Track by functions
  trackByProject(index: number, project: Project): string {
    return project.id;
  }

  trackByTech(index: number, tech: string): string {
    return tech;
  }

  trackByFeature(index: number, feature: string): string {
    return feature;
  }

  // Keyboard navigation
  onKeyDown(event: KeyboardEvent): void {
    if (!this.isBrowser) return;

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        this.previousSlide();
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.nextSlide();
        break;
      case ' ':
        event.preventDefault();
        this.toggleAutoSlide();
        break;
      case 'Enter':
        if (this.currentProject) {
          event.preventDefault();
          this.onProjectSelect(this.currentProject);
        }
        break;
    }
  }
}