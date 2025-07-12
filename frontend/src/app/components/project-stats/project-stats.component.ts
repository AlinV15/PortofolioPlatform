import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Code, Layers, Star, TrendingUp, Users, Calendar, Target, Award } from 'lucide-angular';
import { Project } from '../../../interfaces/project.interface';

interface ProjectStat {
  id: string;
  label: string;
  value: string | number;
  icon: any;
  color: string;
  bgColor: string;
  description: string;
}

@Component({
  selector: 'app-project-stats',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './project-stats.component.html',
  styleUrls: ['./project-stats.component.css']
})
export class ProjectStatsComponent implements OnInit, OnChanges {
  @Input() projects: Project[] = [];
  @Input() filteredProjects: Project[] = [];

  // Add this property to your component class
  public successRate: number = 0; // Set a default value or compute as

  // Lucide Icons
  readonly codeIcon = Code;
  readonly layersIcon = Layers;
  readonly starIcon = Star;
  readonly trendingUpIcon = TrendingUp;
  readonly usersIcon = Users;
  readonly calendarIcon = Calendar;
  readonly targetIcon = Target;
  readonly awardIcon = Award;

  stats: ProjectStat[] = [];

  ngOnInit(): void {
    this.calculateStats();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['projects'] || changes['filteredProjects']) {
      this.calculateStats();
    }
  }

  private calculateStats(): void {
    const projectsToAnalyze = this.projects.length > 0 ? this.projects : [];

    this.stats = [
      {
        id: 'applications',
        label: 'Applications',
        value: this.getTotalApplications(projectsToAnalyze),
        icon: this.layersIcon,
        color: 'text-blue-600 dark:text-blue-400',
        bgColor: 'bg-blue-100 dark:bg-blue-900/20',
        description: 'Total projects built'
      },
      {
        id: 'technologies',
        label: 'Technologies',
        value: this.getTotalTechnologies(projectsToAnalyze),
        icon: this.codeIcon,
        color: 'text-green-600 dark:text-green-400',
        bgColor: 'bg-green-100 dark:bg-green-900/20',
        description: 'Different tech stacks used'
      },
      {
        id: 'featured',
        label: 'Featured',
        value: this.getFeaturedCount(projectsToAnalyze),
        icon: this.starIcon,
        color: 'text-yellow-600 dark:text-yellow-400',
        bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
        description: 'Highlighted projects'
      },
      {
        id: 'production',
        label: 'Live Apps',
        value: this.getProductionCount(projectsToAnalyze),
        icon: this.trendingUpIcon,
        color: 'text-purple-600 dark:text-purple-400',
        bgColor: 'bg-purple-100 dark:bg-purple-900/20',
        description: 'Applications in production'
      }
    ];
  }

  private getTotalApplications(projects: Project[]): string {
    const count = projects.length;
    return count > 0 ? `${count}+` : '0';
  }

  private getTotalTechnologies(projects: Project[]): string {
    const allTechnologies = new Set<string>();

    projects.forEach(project => {
      project.technologies?.forEach(tech => {
        allTechnologies.add(tech.toLowerCase());
      });
    });

    const count = allTechnologies.size;
    return count > 0 ? `${count}+` : '0';
  }

  private getFeaturedCount(projects: Project[]): string {
    const count = projects.filter(project => project.featured).length;
    return count > 0 ? `${count}+` : '0';
  }

  private getProductionCount(projects: Project[]): string {
    const count = projects.filter(project => project.status === 'production').length;
    return count > 0 ? `${count}+` : '0';
  }

  // Additional stats getters pentru utilizare în template
  get totalYearsActive(): number {
    if (!this.projects.length) return 0;

    const years = this.projects.map(p => Number(p.year)).filter(year => !isNaN(year));
    if (years.length === 0) return 0;

    const minYear = Math.min(...years);
    const currentYear = new Date().getFullYear();
    return currentYear - minYear + 1;
  }

  get averageComplexity(): string {
    if (!this.projects.length) return 'N/A';

    const complexityValues = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 };
    const totalComplexity = this.projects.reduce((sum, project) => {
      return sum + (complexityValues[project.complexity as keyof typeof complexityValues] || 0);
    }, 0);

    const average = totalComplexity / this.projects.length;

    if (average <= 1.5) return 'Beginner';
    if (average <= 2.5) return 'Intermediate';
    return 'Advanced';
  }

  get topTechnologies(): string[] {
    const techCount = new Map<string, number>();

    this.projects.forEach(project => {
      project.technologies?.forEach(tech => {
        const normalizedTech = tech.trim();
        techCount.set(normalizedTech, (techCount.get(normalizedTech) || 0) + 1);
      });
    });

    return Array.from(techCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([tech]) => tech);
  }

  get categoryDistribution(): { category: string; count: number; percentage: number }[] {
    if (!this.projects.length) return [];

    const categoryCount = new Map<string, number>();

    this.projects.forEach(project => {
      const category = project.category || 'other';
      categoryCount.set(category, (categoryCount.get(category) || 0) + 1);
    });

    const total = this.projects.length;

    return Array.from(categoryCount.entries())
      .map(([category, count]) => ({
        category: category.charAt(0).toUpperCase() + category.slice(1),
        count,
        percentage: Math.round((count / total) * 100)
      }))
      .sort((a, b) => b.count - a.count);
  }

  // Track by function pentru *ngFor
  trackByStat(index: number, stat: ProjectStat): string {
    return stat.id;
  }

  trackByTech(index: number, tech: string): string {
    return tech;
  }

  trackByCategory(index: number, category: any): string {
    return category.category;
  }
}