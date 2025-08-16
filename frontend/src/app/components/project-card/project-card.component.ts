import { Component, Input, Output, EventEmitter, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Project } from '../../shared/models/project.interface';

@Component({
  selector: 'app-project-card',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.css'
})
export class ProjectCardComponent {
  @Input() project!: Project;
  @Input() variant: 'default' | 'featured' | 'compact' = 'default';
  @Input() showFullDescription = false;
  @Output() viewDetails = new EventEmitter<Project>();
  @Output() demoClick = new EventEmitter<Project>();
  @Output() githubClick = new EventEmitter<Project>();

  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  onViewDetails() {
    this.viewDetails.emit(this.project);
  }

  onDemoClick(event: Event): void {
    event.stopPropagation();
    if (this.isBrowser && this.project.demoUrl) {
      try {
        window.open(this.project.demoUrl, '_blank', 'noopener,noreferrer');
      } catch (error) {
        console.warn('Failed to open demo URL:', error);
      }
    }
    this.demoClick.emit(this.project);
  }

  onGithubClick(event: Event): void {
    event.stopPropagation();
    if (this.isBrowser && this.project.githubUrl) {
      try {
        window.open(this.project.githubUrl, '_blank', 'noopener,noreferrer');
      } catch (error) {
        console.warn('Failed to open GitHub URL:', error);
      }
    }
    this.githubClick.emit(this.project);
  }

  getStatusColor(status: string): string {
    const colors = {
      'production': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'development': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'concept': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
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
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    ];

    return colors[index % colors.length]
  }

  getCardClasses(): string {
    const baseClasses = 'group relative bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer overflow-hidden';

    const variantClasses = {
      'default': 'h-auto',
      'featured': 'h-auto border-2 border-blue-500 dark:border-blue-400',
      'compact': 'h-80'
    };

    return `${baseClasses} ${variantClasses[this.variant]}`;

  }

  getDescriptionText(): string {
    if (this.showFullDescription || this.variant === 'featured') {
      return this.project.longDescription || this.project.description;
    }

    const maxLength = this.variant === 'compact' ? 80 : 120;
    const description = this.project.description;

    if (description.length <= maxLength) {
      return description;
    }

    return description.substring(0, maxLength).trim() + '...';
  }


  getVisibleTechnologies(): string[] {
    const maxTech = this.variant === 'compact' ? 4 : 6;
    return this.project.technologies.slice(0, maxTech);
  }

  getHiddenTechCount(): number {
    const maxTech = this.variant === 'compact' ? 4 : 6;
    return Math.max(0, this.project.technologies.length - maxTech);
  }

  trackByTech(index: number, tech: string): string {
    return tech;
  }

  get isInBrowser(): boolean {
    return this.isBrowser;
  }

  get hasPreviewImage(): boolean {
    return !!(this.project.images && this.project.images.length > 0);
  }


  get previewImage(): string {
    return this.project.images?.[0] || '';
  }
}
