import { Component, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Code, Layers, Star, TrendingUp, Users, Calendar, Target, Award, BarChart3, Zap } from 'lucide-angular';
import { Project, ProjectsStats, ProjectCategoryDistribution, StatCard, TechStat, ProjectExperience } from '../../shared/models/project.interface';
import { ComplexityLevel } from '../../shared/enums/ComplexityLevel';
import { ProjectStatus } from '../../shared/enums/ProjectStatus';

@Component({
  selector: 'app-project-stats',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './project-stats.component.html',
  styleUrls: ['./project-stats.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush // CRITICAL: Prevent unnecessary change detection
})
export class ProjectStatsComponent implements OnChanges {

  // ========================
  // INPUTS FROM PARENT
  // ========================
  @Input() projectStats: ProjectsStats = {
    technologies: 0,
    totalProjects: 0,
    liveProjects: 0
  };
  @Input() projectExperience: ProjectExperience = {
    yearsActive: 0,
    firstProjectYear: 0,
    latestProjectYear: 0,
    avgComplexity: 'N/A',
    avgComplexityLabel: 'N/A',
    successRate: 0,
    formattedSuccessRate: '0%',
    deployedProjects: 0,
    totalProjects: 0,
    liveProjects: 0,
    experienceLevel: 'N/A'
  };
  @Input() categoryDistribution: readonly ProjectCategoryDistribution[] = []; // Make readonly
  @Input() allProjects: readonly Project[] = []; // Make readonly
  @Input() isLoading = false;
  @Input() hasError = false;

  // ========================
  // LUCIDE ICONS (READONLY TO PREVENT MUTATIONS)
  // ========================
  readonly codeIcon = Code;
  readonly layersIcon = Layers;
  readonly starIcon = Star;
  readonly trendingUpIcon = TrendingUp;
  readonly usersIcon = Users;
  readonly calendarIcon = Calendar;
  readonly targetIcon = Target;
  readonly awardIcon = Award;
  readonly barChartIcon = BarChart3;
  readonly zapIcon = Zap;

  // ========================
  // COMPUTED DATA (IMMUTABLE)
  // ========================
  private _statCards: readonly StatCard[] = [];
  private _complexityDistribution: readonly { level: string; count: number; percentage: number }[] = [];
  private _topTechnologies: readonly TechStat[] = [];
  private _yearlyDistribution: readonly { year: string; count: number }[] = [];

  // Getters to prevent direct mutation
  get statCards(): readonly StatCard[] { return this._statCards; }
  get complexityDistribution(): readonly { level: string; count: number; percentage: number }[] { return this._complexityDistribution; }
  get topTechnologies(): readonly TechStat[] { return this._topTechnologies; }
  get yearlyDistribution(): readonly { year: string; count: number }[] { return this._yearlyDistribution; }

  // Cache for expensive computations
  private _lastProjectsHash = '';
  private _lastStatsHash = '';

  ngOnChanges(changes: SimpleChanges): void {
    // Only recalculate if inputs actually changed
    let shouldRecalculate = false;

    if (changes['allProjects'] && changes['allProjects'].currentValue !== changes['allProjects'].previousValue) {
      const newHash = this.hashProjects(this.allProjects);
      if (newHash !== this._lastProjectsHash) {
        this._lastProjectsHash = newHash;
        shouldRecalculate = true;
      }
    }

    if (changes['projectStats'] && changes['projectStats'].currentValue !== changes['projectStats'].previousValue) {
      const newHash = this.hashStats(this.projectStats);
      if (newHash !== this._lastStatsHash) {
        this._lastStatsHash = newHash;
        shouldRecalculate = true;
      }
    }

    if (changes['categoryDistribution'] || changes['projectExperience']) {
      shouldRecalculate = true;
    }

    if (shouldRecalculate) {
      this.calculateDisplayStats();
    }
  }

  get projectCategoriesDistribution() {
    console.log("Este ceva" + this.categoryDistribution[0].category);
    return this.categoryDistribution;

  }

  // Hash functions to detect actual changes
  private hashProjects(projects: readonly Project[]): string {
    return `${projects.length}-${projects.map(p => p.id).join(',')}-${projects.map(p => p.complexity).join(',')}`;
  }

  private hashStats(stats: ProjectsStats): string {
    return `${stats.totalProjects}-${stats.technologies}-${stats.liveProjects}`;
  }

  private calculateDisplayStats(): void {
    // Create new immutable arrays instead of modifying existing ones
    this._statCards = Object.freeze(this.buildStatCards());
    this._topTechnologies = Object.freeze(this.calculateTechStats());
    this._complexityDistribution = Object.freeze(this.calculateComplexityStats());
    this._yearlyDistribution = Object.freeze(this.calculateYearlyDistribution());
  }

  // ========================
  // STAT CARDS CALCULATION (PURE FUNCTIONS)
  // ========================

  private buildStatCards(): StatCard[] {
    return [
      {
        id: 'featured',
        title: 'Featured Work',
        value: this.projectExperience.liveProjects,
        icon: this.starIcon,
        color: 'text-yellow-600 dark:text-yellow-400',
        bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
        description: 'Highlighted achievements'
      },
      {
        id: 'success-rate',
        title: 'Success Rate',
        value: this.projectExperience.formattedSuccessRate,
        icon: this.targetIcon,
        color: 'text-emerald-600 dark:text-emerald-400',
        bgColor: 'bg-emerald-100 dark:bg-emerald-900/20',
        description: 'Projects completed successfully'
      },
      {
        id: 'experience',
        title: 'Years Active',
        value: this.projectExperience.yearsActive,
        icon: this.calendarIcon,
        color: 'text-indigo-600 dark:text-indigo-400',
        bgColor: 'bg-indigo-100 dark:bg-indigo-900/20',
        description: 'Years of development experience'
      }
    ];
  }

  // Pure function - no mutations
  formatedPercentage(percentage: number): string {
    return `${percentage.toFixed(2)}%`;
  }

  // Pure function
  getSuccessRate(): number {
    if (!this.allProjects.length) return 0;

    const completedProjects = this.allProjects.filter(project =>
      project.status === ProjectStatus.PRODUCTION ||
      project.status === ProjectStatus.MAINTENANCE
    );

    return Math.round((completedProjects.length / this.allProjects.length) * 100);
  }

  // Pure function
  getTotalYearsActive(): number {
    if (!this.allProjects.length) return 0;

    const years = this.allProjects
      .map(p => Number(p.year))
      .filter(year => !isNaN(year) && year > 0);

    if (years.length === 0) return 0;

    const minYear = Math.min(...years);
    const currentYear = new Date().getFullYear();
    return Math.max(1, currentYear - minYear + 1);
  }

  // ========================
  // TECHNOLOGY STATS (PURE FUNCTION)
  // ========================

  private calculateTechStats(): TechStat[] {
    const techCount = new Map<string, number>();

    this.allProjects.forEach(project => {
      project.technologies?.forEach(tech => {
        const normalizedTech = tech.trim();
        techCount.set(normalizedTech, (techCount.get(normalizedTech) || 0) + 1);
      });
    });

    const totalTechUsage = Array.from(techCount.values()).reduce((sum, count) => sum + count, 0);

    return Array.from(techCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, count]) => ({
        name,
        count,
        percentage: Math.round((count / totalTechUsage) * 100)
      }));
  }

  // ========================
  // COMPLEXITY STATS (PURE FUNCTION)
  // ========================

  private calculateComplexityStats(): { level: string; count: number; percentage: number }[] {
    if (!this.allProjects.length) {
      return [
        { level: 'beginner', count: 0, percentage: 0 },
        { level: 'intermediate', count: 0, percentage: 0 },
        { level: 'advanced', count: 0, percentage: 0 }
      ];
    }

    const complexityCount = { beginner: 0, intermediate: 0, advanced: 0 };

    this.allProjects.forEach(project => {
      switch (project.complexity) {
        case ComplexityLevel.BEGINNER:
          complexityCount.beginner += 1;
          break;
        case ComplexityLevel.INTERMEDIATE:
          complexityCount.intermediate += 1;
          break;
        case ComplexityLevel.ADVANCED:
          complexityCount.advanced += 1;
          break;
      }
    });

    const totalProjects = this.allProjects.length;

    return [
      {
        level: 'beginner',
        count: complexityCount.beginner,
        percentage: Math.round((complexityCount.beginner / totalProjects) * 100)
      },
      {
        level: 'intermediate',
        count: complexityCount.intermediate,
        percentage: Math.round((complexityCount.intermediate / totalProjects) * 100)
      },
      {
        level: 'advanced',
        count: complexityCount.advanced,
        percentage: Math.round((complexityCount.advanced / totalProjects) * 100)
      }
    ];
  }

  // ========================
  // YEARLY DISTRIBUTION (PURE FUNCTION)
  // ========================

  private calculateYearlyDistribution(): { year: string; count: number }[] {
    if (!this.allProjects.length) {
      return [];
    }

    const yearCount = new Map<string, number>();

    this.allProjects.forEach(project => {
      const year = String(project.year);
      yearCount.set(year, (yearCount.get(year) || 0) + 1);
    });

    return Array.from(yearCount.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([year, count]) => ({ year, count }));
  }

  // ========================
  // COMPUTED PROPERTIES (CACHED)
  // ========================

  private _cachedAverageComplexity: string | null = null;
  private _cachedMostUsedTechnology: string | null = null;
  private _cachedProjectsPerYear: number | null = null;

  get averageComplexity(): string {
    if (this._cachedAverageComplexity !== null) return this._cachedAverageComplexity;

    if (!this.allProjects.length) {
      this._cachedAverageComplexity = 'N/A';
      return this._cachedAverageComplexity;
    }

    const complexityValues = {
      [ComplexityLevel.BEGINNER]: 1,
      [ComplexityLevel.INTERMEDIATE]: 2,
      [ComplexityLevel.ADVANCED]: 3
    };

    const totalComplexity = this.allProjects.reduce((sum, project) => {
      return sum + (complexityValues[project.complexity] || 0);
    }, 0);

    const average = totalComplexity / this.allProjects.length;

    if (average <= 1.5) this._cachedAverageComplexity = 'Beginner';
    else if (average <= 2.5) this._cachedAverageComplexity = 'Intermediate';
    else this._cachedAverageComplexity = 'Advanced';

    return this._cachedAverageComplexity;
  }

  get mostUsedTechnology(): string {
    if (this._cachedMostUsedTechnology !== null) return this._cachedMostUsedTechnology;

    if (!this.topTechnologies.length) {
      this._cachedMostUsedTechnology = 'N/A';
      return this._cachedMostUsedTechnology;
    }

    this._cachedMostUsedTechnology = this.topTechnologies[0].name;
    return this._cachedMostUsedTechnology;
  }

  get projectsPerYear(): number {
    if (this._cachedProjectsPerYear !== null) return this._cachedProjectsPerYear;

    const years = this.getTotalYearsActive();
    if (years === 0) {
      this._cachedProjectsPerYear = 0;
      return this._cachedProjectsPerYear;
    }

    this._cachedProjectsPerYear = Math.round((this.projectStats.totalProjects || 0) / years * 10) / 10;
    return this._cachedProjectsPerYear;
  }

  get hasData(): boolean {
    return this.allProjects.length > 0 || this.projectStats.totalProjects > 0;
  }

  // ========================
  // HELPER METHODS (PURE FUNCTIONS)
  // ========================

  getComplexityColor(level: string): string {
    const colors = {
      'beginner': 'text-green-600 dark:text-green-400',
      'intermediate': 'text-yellow-600 dark:text-yellow-400',
      'advanced': 'text-red-600 dark:text-red-400'
    };
    return colors[level as keyof typeof colors] || 'text-gray-600 dark:text-gray-400';
  }

  getComplexityBgColor(level: string): string {
    const colors = {
      'beginner': 'bg-green-100 dark:bg-green-900/20',
      'intermediate': 'bg-yellow-100 dark:bg-yellow-900/20',
      'advanced': 'bg-red-100 dark:bg-red-900/20'
    };
    return colors[level as keyof typeof colors] || 'bg-gray-100 dark:bg-gray-900/20';
  }

  getTechBarWidth(percentage: number): string {
    return `${Math.max(percentage, 5)}%`; // Minimum 5% for visibility
  }

  // ========================
  // PERFORMANCE HELPERS (PREVENT UNNECESSARY RE-RENDERS)
  // ========================

  trackByStatCard(index: number, stat: StatCard): string {
    return stat.id;
  }

  trackByTech(index: number, tech: TechStat): string {
    return tech.name;
  }

  trackByCategory(index: number, category: ProjectCategoryDistribution): string {
    return category.category;
  }

  trackByComplexity(index: number, complexity: { level: string; count: number; percentage: number }): string {
    return complexity.level;
  }

  trackByYear(index: number, year: { year: string; count: number }): string {
    return year.year;
  }

  // ========================
  // CACHE INVALIDATION
  // ========================

  private invalidateCache(): void {
    this._cachedAverageComplexity = null;
    this._cachedMostUsedTechnology = null;
    this._cachedProjectsPerYear = null;
  }
}