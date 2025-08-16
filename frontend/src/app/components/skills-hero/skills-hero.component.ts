import { Component, OnInit, OnDestroy, Output, EventEmitter, Inject, PLATFORM_ID, ViewChild, ElementRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import * as Chart from 'chart.js';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import {
  LucideAngularModule,
  Code, Star, Layers, Target, TrendingUp, BarChart3,
  Award, Database, Wrench, Globe, Smartphone, Cloud,
  ArrowRight, Rocket, ChevronDown,
  BookOpen
} from 'lucide-angular';

// Models and Interfaces
import { Skill, SkillCategory, SkillStats, TopSkill } from '../../shared/models/skill.interface';
import { CurrentLearning, LearningProgress } from '../../shared/models/education.interface';
import { Technology } from '../../shared/models/technology.interface';

// Services
import { IconHelperService } from '../../services/icon-helper.service';

@Component({
  selector: 'app-skills-hero',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './skills-hero.component.html',
  styleUrls: ['./skills-hero.component.css']
})
export class SkillsHeroComponent implements OnInit, OnDestroy {
  @ViewChild('radarCanvas', { static: false }) radarCanvas!: ElementRef<HTMLCanvasElement>;
  @Output() exploreSkills = new EventEmitter<void>();
  @Output() categorySelected = new EventEmitter<string>();

  // Input data from parent component
  @Input() skillsStats: SkillStats = {
    description: "",
    projectsText: "",
    technologiesText: "",
    yearsCoding: "",
    projects: "",
    certifications: "",
    avgProficiency: "",
    yearsCodingLabel: "",
    projectsLabel: "",
    certificationsLabel: "",
    avgProficiencyLabel: ""
  };

  @Input() coreSkills: Skill[] = [];
  @Input() topSkills: TopSkill[] = [];
  @Input() skillCategories: SkillCategory[] = [];
  @Input() currentLearning: CurrentLearning[] = [];
  @Input() learningProgress: LearningProgress[] = [];
  @Input() technologies: Technology[] = [];


  private destroy$ = new Subject<void>();
  private isBrowser: boolean;
  private radarChart?: Chart.Chart;

  // Lucide Icons
  readonly codeIcon = Code;
  readonly starIcon = Star;
  readonly layersIcon = Layers;
  readonly targetIcon = Target;
  readonly trendingUpIcon = TrendingUp;
  readonly chartIcon = BarChart3;
  readonly awardIcon = Award;
  readonly databaseIcon = Database;
  readonly wrenchIcon = Wrench;
  readonly globeIcon = Globe;
  readonly smartphoneIcon = Smartphone;
  readonly cloudIcon = Cloud;
  readonly arrowRightIcon = ArrowRight;
  readonly rocketIcon = Rocket;
  readonly chevronDownIcon = ChevronDown;
  readonly bookOpenIcon = BookOpen;

  colorPalette: string[] = [
    '#FF5733', '#33FF57', '#3357FF', '#F033FF', '#33FFF0',
    '#FF33A8', '#A833FF', '#33FFA8', '#FF8C33', '#338CFF',
    '#8C33FF', '#33FF8C', '#FF338C', '#33A8FF', '#A8FF33',
    '#FF33F0', '#F0FF33', '#33F0FF', '#FF5733', '#57FF33',
    '#5733FF', '#FF33A8', '#A833FF', '#33FFA8', '#FF338C',
    '#8CFF33', '#338CFF', '#FF8C33', '#33FF8C', '#8C33FF'
  ];

  takenColors = new Set<string>();


  // Animation control
  animateProgress = false;
  private animationTimeout?: number;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private iconHelper: IconHelperService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    // Register Chart.js components
    if (this.isBrowser) {
      Chart.Chart.register(
        Chart.RadialLinearScale,
        Chart.PointElement,
        Chart.LineElement,
        Chart.Filler,
        Chart.Tooltip,
        Chart.Legend,
        Chart.RadarController
      );

      // Start progress animations after component loads
      this.animationTimeout = window.setTimeout(() => {
        this.animateProgress = true;
        this.createRadarChart();
      }, 1000);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    if (this.animationTimeout) {
      clearTimeout(this.animationTimeout);
    }
    if (this.radarChart) {
      this.radarChart.destroy();
    }
  }

  private createRadarChart(): void {
    if (!this.isBrowser || !this.radarCanvas || this.skillCategories.length === 0) return;

    const ctx = this.radarCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    // Prepare data for radar chart based on skill categories
    const labels = this.skillCategories.map(cat => cat.name);
    const currentData = this.skillCategories.map(cat => this.calculateCategoryLevel(cat.name));
    const targetData = this.skillCategories.map(() => 90); // Target level for all categories
    const colors = this.skillCategories.map(() => this.getRandomUntakenColor() || '#3B82F6');

    this.radarChart = new Chart.Chart(ctx, {
      type: 'radar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Current Skills',
          data: currentData,
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderColor: 'rgba(59, 130, 246, 0.8)',
          borderWidth: 2,
          pointBackgroundColor: colors,
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
          fill: true
        }, {
          label: 'Target Skills',
          data: targetData,
          backgroundColor: 'rgba(147, 51, 234, 0.05)',
          borderColor: 'rgba(147, 51, 234, 0.3)',
          borderWidth: 1,
          borderDash: [5, 5],
          pointBackgroundColor: 'rgba(147, 51, 234, 0.5)',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 1,
          pointRadius: 3,
          fill: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 2000,
          easing: 'easeInOutCubic'
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#e5e7eb',
              font: {
                size: 12,
                family: 'Inter, sans-serif'
              },
              padding: 20,
              usePointStyle: true
            }
          },
          tooltip: {
            backgroundColor: 'rgba(17, 24, 39, 0.9)',
            titleColor: '#ffffff',
            bodyColor: '#e5e7eb',
            borderColor: 'rgba(59, 130, 246, 0.5)',
            borderWidth: 1,
            cornerRadius: 8,
            displayColors: true,
          }
        },
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            min: 0,
            ticks: {
              stepSize: 20,
              color: 'rgba(156, 163, 175, 0.6)',
              font: {
                size: 10
              },
              backdropColor: 'transparent'
            },
            grid: {
              color: 'rgba(156, 163, 175, 0.2)',
              lineWidth: 1
            },
            angleLines: {
              color: 'rgba(156, 163, 175, 0.2)',
              lineWidth: 1
            },
            pointLabels: {
              color: '#e5e7eb',
              font: {
                size: 12,
                weight: 'bold',
                family: 'Inter, sans-serif'
              }
            }
          }
        },

      }
    });
  }

  /**
   * Calculate average skill level for a category
   */
  calculateCategoryLevel(categoryName: string): number {
    const categorySkills = this.coreSkills.filter(skill => skill.category === categoryName);
    if (categorySkills.length === 0) return 0;

    const totalLevel = categorySkills.reduce((sum, skill) => sum + skill.level, 0);
    return Math.round(totalLevel / categorySkills.length);
  }

  /**
   * Get skills count for a specific category
   */
  getSkillsCountForCategory(categoryName: string): number {
    return this.coreSkills.filter(skill => skill.category === categoryName).length;
  }

  // Event handlers
  onExploreSkills(): void {
    this.exploreSkills.emit();
  }

  onCategoryClick(category: SkillCategory): void {
    this.categorySelected.emit(category.name);
  }

  // Utility methods
  getProficiencyIcon(proficiency: string): any {
    switch (proficiency.toLowerCase()) {
      case 'expert': return this.awardIcon;
      case 'advanced': return this.starIcon;
      case 'intermediate': return this.trendingUpIcon;
      case 'beginner': return this.targetIcon;
      default: return this.codeIcon;
    }
  }

  getProficiencyBadgeColor(proficiency: string): string {
    const colors = {
      'expert': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      'advanced': 'bg-green-500/20 text-green-300 border-green-500/30',
      'intermediate': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      'beginner': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
    };
    return colors[proficiency.toLowerCase() as keyof typeof colors] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  }

  getProficiencyLevel(level: number): string {
    if (level >= 80) return 'expert';
    if (level >= 65) return 'advanced';
    if (level >= 45) return 'intermediate';
    return 'beginner';
  }

  getSkillTrendStatus(skill: Skill): 'trending' | 'stable' | 'learning' {
    if (skill.projects >= 4) return 'trending';
    if (skill.level < 50) return 'learning';
    return 'stable';
  }

  /**
   * Get icon for category using IconHelperService
   */
  getCategoryIcon(category: SkillCategory): any {
    if (category.icon) {
      return this.iconHelper.stringToLucide(category.icon as string);
    }
    return this.layersIcon;
  }

  /**
   * Get icon for learning item using IconHelperService
   */
  getLearningIcon(learning: CurrentLearning): any {
    if (learning.icon) {
      return this.iconHelper.stringToLucide(learning.icon as string);
    }
    return this.bookOpenIcon;
  }

  // Track by functions for ngFor optimization
  trackBySkill(index: number, skill: Skill): string {
    return skill.id;
  }

  trackByTopSkill(index: number, skill: TopSkill): string {
    return skill.name;
  }

  trackByCategory(index: number, category: SkillCategory): string {
    return category.name;
  }

  trackByTechnology(index: number, technology: Technology): string {
    return technology.name;
  }

  trackByLearning(index: number, learning: CurrentLearning): string {
    return learning.id;
  }

  trackByLearningProgress(index: number, progress: LearningProgress): string {
    return progress.id;
  }

  get topTechnologiesForDisplay(): Technology[] {
    return this.technologies.sort((a: Technology, b: Technology) => b.projects - a.projects).slice(0, 6);
  }

  // Additional computed properties
  get topSkillsForDisplay(): TopSkill[] {
    return this.topSkills.slice(0, 5);
  }

  get recentlyUsedSkills(): Skill[] {
    return this.coreSkills
      .filter(skill => skill.projects > 0)
      .sort((a, b) => b.projects - a.projects)
      .slice(0, 8);
  }

  get skillsInProgress(): Skill[] {
    return this.coreSkills.filter(skill => skill.level < 70);
  }

  get totalHoursLearning(): number {
    return this.learningProgress.reduce((total, learning) => total + learning.timeSpent, 0);
  }

  get completionRate(): number {
    if (this.currentLearning.length === 0) return 0;
    const totalProgress = this.currentLearning.reduce((sum, learning) => sum + learning.progress, 0);
    return Math.round(totalProgress / this.currentLearning.length);
  }

  get mostUsedTechnologies(): Technology[] {
    return this.technologies
      .sort((a, b) => b.projects - a.projects)
      .slice(0, 6);
  }

  // Animation methods
  startProgressAnimation(): void {
    this.animateProgress = false;
    setTimeout(() => {
      this.animateProgress = true;
    }, 100);
  }

  // Category interaction methods
  getCategorySkills(categoryName: string): Skill[] {
    return this.coreSkills.filter(skill => skill.category === categoryName);
  }

  // Progress calculation methods
  calculateOverallProgress(): number {
    if (this.coreSkills.length === 0) return 0;
    const totalLevel = this.coreSkills.reduce((sum, skill) => sum + skill.level, 0);
    return Math.round(totalLevel / this.coreSkills.length);
  }

  getCategoryProgress(categoryName: string): number {
    const categorySkills = this.getCategorySkills(categoryName);
    if (categorySkills.length === 0) return 0;

    const totalLevel = categorySkills.reduce((sum, skill) => sum + skill.level, 0);
    return Math.round(totalLevel / categorySkills.length);
  }

  /**
   * Get learning status color
   */
  getLearningStatusColor(status: string): string {
    const statusColors = {
      'completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'in_progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'not_started': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
      'paused': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
    };
    return statusColors[status.toLowerCase() as keyof typeof statusColors] || statusColors['not_started'];
  }

  /**
   * Format learning status for display
   */
  formatLearningStatus(status: string): string {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  /**
   * Get progress color based on percentage
   */
  getProgressColor(progress: number): string {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-gray-400';
  }

  /**
   * Calculate years of experience from skills
   */
  getTotalYearsExperience(): number {
    if (this.coreSkills.length === 0) return 0;
    return Math.max(...this.coreSkills.map(skill => skill.yearsOfExperience));
  }

  /**
   * Get trending technologies count
   */
  getTrendingTechnologiesCount(): number {
    return this.technologies.filter(tech => tech.trending).length;
  }

  // Function to get a random color that hasn't been taken
  private getRandomUntakenColor(): string | null {
    // Filter out taken colors
    const availableColors = this.colorPalette.filter(color => !this.takenColors.has(color));

    if (availableColors.length === 0) {
      console.warn('All colors have been taken!');
      return null;
    }

    // Select a random color from available ones
    const randomIndex = Math.floor(Math.random() * availableColors.length);
    const selectedColor = availableColors[randomIndex];

    // Mark as taken
    this.takenColors.add(selectedColor);

    return selectedColor;
  }
}