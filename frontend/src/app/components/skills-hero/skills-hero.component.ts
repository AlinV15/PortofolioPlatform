import { Component, OnInit, OnDestroy, Output, EventEmitter, Inject, PLATFORM_ID, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import * as Chart from 'chart.js';

import {
  LucideAngularModule,
  Code, Star, Layers, Target, TrendingUp, BarChart3,
  Award, Database, Wrench, Globe, Smartphone, Cloud,
  ArrowRight, Rocket, ChevronDown
} from 'lucide-angular';

export interface CoreSkill {
  id: string;
  name: string;
  level: number;
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  experience: string;
  color: string;
  tags: string[];
  projects: number;
}

export interface SkillCategory {
  id: string;
  name: string;
  skillCount: number;
  avgLevel: number;
  color: string;
  bgColor: string;
  icon: any;
  trending: number;
  description: string;
}

export interface LearningProgress {
  id: string;
  name: string;
  progress: number;
  color: string;
  timeSpent: number;
  eta: string;
  description: string;
}

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

  // Animation control
  animateProgress = false;
  private animationTimeout?: number;

  // Hero Stats (din CV)
  yearsExperience = 3;
  totalProjects = 7;
  certificationCount = 3;
  totalTechnologies = 15;
  avgSkillLevel = 68;

  // Core Skills (bazate pe CV)
  coreSkills: CoreSkill[] = [
    {
      id: 'javascript',
      name: 'JavaScript',
      level: 75,
      proficiency: 'intermediate',
      experience: '2+ years',
      color: '#F7DF1E',
      tags: ['ES6+', 'Async/Await', 'DOM', 'APIs'],
      projects: 7
    },
    {
      id: 'typescript',
      name: 'TypeScript',
      level: 70,
      proficiency: 'intermediate',
      experience: '1.5 years',
      color: '#3178C6',
      tags: ['Type Safety', 'Interfaces', 'Generics'],
      projects: 5
    },
    {
      id: 'react',
      name: 'React',
      level: 65,
      proficiency: 'intermediate',
      experience: '1.5 years',
      color: '#61DAFB',
      tags: ['Hooks', 'Context', 'JSX', 'Components'],
      projects: 4
    },
    {
      id: 'nextjs',
      name: 'Next.js',
      level: 70,
      proficiency: 'intermediate',
      experience: '1.5 years',
      color: '#000000',
      tags: ['SSR', 'SSG', 'API Routes', 'Performance'],
      projects: 4
    },
    {
      id: 'nodejs',
      name: 'Node.js',
      level: 60,
      proficiency: 'intermediate',
      experience: '1.5 years',
      color: '#339933',
      tags: ['Express', 'REST APIs', 'NPM', 'Backend'],
      projects: 3
    },
    {
      id: 'mongodb',
      name: 'MongoDB',
      level: 55,
      proficiency: 'beginner',
      experience: '1 year',
      color: '#47A248',
      tags: ['NoSQL', 'Documents', 'Mongoose', 'Atlas'],
      projects: 4
    }
  ];

  // Skill Categories
  skillCategories: SkillCategory[] = [
    {
      id: 'programming',
      name: 'Programming',
      skillCount: 5,
      avgLevel: 72,
      color: '#3B82F6',
      bgColor: 'bg-blue-500/10',
      icon: this.codeIcon,
      trending: 2,
      description: 'Core programming languages'
    },
    {
      id: 'frameworks',
      name: 'Frameworks',
      skillCount: 4,
      avgLevel: 68,
      color: '#8B5CF6',
      bgColor: 'bg-purple-500/10',
      icon: this.layersIcon,
      trending: 3,
      description: 'Modern development frameworks'
    },
    {
      id: 'databases',
      name: 'Databases',
      skillCount: 3,
      avgLevel: 55,
      color: '#10B981',
      bgColor: 'bg-green-500/10',
      icon: this.databaseIcon,
      trending: 1,
      description: 'Data storage and management'
    },
    {
      id: 'tools',
      name: 'Dev Tools',
      skillCount: 6,
      avgLevel: 75,
      color: '#F59E0B',
      bgColor: 'bg-yellow-500/10',
      icon: this.wrenchIcon,
      trending: 2,
      description: 'Development and productivity tools'
    },
    {
      id: 'concepts',
      name: 'Concepts',
      skillCount: 5,
      avgLevel: 65,
      color: '#EF4444',
      bgColor: 'bg-red-500/10',
      icon: this.targetIcon,
      trending: 1,
      description: 'Software development principles'
    },
    {
      id: 'methodologies',
      name: 'Methods',
      skillCount: 2,
      avgLevel: 60,
      color: '#6366F1',
      bgColor: 'bg-indigo-500/10',
      icon: this.chartIcon,
      trending: 0,
      description: 'Project management approaches'
    }
  ];

  // Currently Learning (din CV)
  currentLearning: LearningProgress[] = [
    {
      id: 'angular',
      name: 'Angular',
      progress: 55,
      color: '#DD0031',
      timeSpent: 120,
      eta: '2 months',
      description: 'Enterprise framework for scalable applications'
    },
    {
      id: 'java',
      name: 'Java',
      progress: 45,
      color: '#ED8B00',
      timeSpent: 80,
      eta: '3 months',
      description: 'Object-oriented programming for enterprise'
    },
    {
      id: 'spring-boot',
      name: 'Spring Boot',
      progress: 30,
      color: '#6DB33F',
      timeSpent: 40,
      eta: '4 months',
      description: 'Java framework for microservices'
    }
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
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
    if (this.animationTimeout) {
      clearTimeout(this.animationTimeout);
    }
    if (this.radarChart) {
      this.radarChart.destroy();
    }
  }

  private createRadarChart(): void {
    if (!this.isBrowser || !this.radarCanvas) return;

    const ctx = this.radarCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    // Data pentru radar chart
    const labels = this.skillCategories.map(cat => cat.name);
    const data = this.skillCategories.map(cat => cat.avgLevel);
    const colors = this.skillCategories.map(cat => cat.color);

    this.radarChart = new Chart.Chart(ctx, {
      type: 'radar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Current Skills',
          data: data,
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
          data: [85, 80, 75, 85, 80, 75], // Target levels
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
            callbacks: {
              label: (context) => {
                const category = this.skillCategories[context.dataIndex];
                return `${context.dataset.label}: ${context.parsed.r}% (${category.skillCount} skills)`;
              }
            }
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
        interaction: {
          intersect: false,
          mode: 'point'
        },
        onHover: (event, elements) => {
          if (elements.length > 0) {
            const categoryIndex = elements[0].index;
            this.onCategoryClick(this.skillCategories[categoryIndex]);
          }
        }
      }
    });
  }

  // Event handlers
  onExploreSkills(): void {
    this.exploreSkills.emit();
  }

  onCategoryClick(category: SkillCategory): void {
    this.categorySelected.emit(category.id);
  }

  // Utility methods
  getProficiencyIcon(proficiency: string): any {
    switch (proficiency) {
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
    return colors[proficiency as keyof typeof colors] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  }

  getProficiencyLevel(level: number): string {
    if (level >= 80) return 'expert';
    if (level >= 65) return 'advanced';
    if (level >= 45) return 'intermediate';
    return 'beginner';
  }

  getSkillTrendStatus(skill: CoreSkill): 'trending' | 'stable' | 'learning' {
    if (skill.projects >= 4) return 'trending';
    if (skill.level < 50) return 'learning';
    return 'stable';
  }

  // Track by functions for ngFor optimization
  trackBySkill(index: number, skill: CoreSkill): string {
    return skill.id;
  }

  trackByCategory(index: number, category: SkillCategory): string {
    return category.id;
  }

  trackByLearning(index: number, learning: LearningProgress): string {
    return learning.id;
  }

  trackByString(index: number, item: string): string {
    return item;
  }

  // Additional computed properties
  get topSkills(): CoreSkill[] {
    return this.coreSkills
      .sort((a, b) => b.level - a.level)
      .slice(0, 3);
  }

  get recentlyUsedSkills(): CoreSkill[] {
    return this.coreSkills
      .filter(skill => skill.projects > 0)
      .sort((a, b) => b.projects - a.projects);
  }

  get skillsInProgress(): CoreSkill[] {
    return this.coreSkills.filter(skill => skill.level < 70);
  }

  get totalHoursLearning(): number {
    return this.currentLearning.reduce((total, learning) => total + learning.timeSpent, 0);
  }

  get completionRate(): number {
    const totalProgress = this.currentLearning.reduce((sum, learning) => sum + learning.progress, 0);
    return Math.round(totalProgress / this.currentLearning.length);
  }

  // Animation methods
  startProgressAnimation(): void {
    this.animateProgress = false;
    setTimeout(() => {
      this.animateProgress = true;
    }, 100);
  }

  // Category interaction methods
  getCategorySkills(categoryId: string): CoreSkill[] {
    // This would normally filter skills by category
    // For now, return relevant skills based on category
    switch (categoryId) {
      case 'programming':
        return this.coreSkills.filter(skill =>
          ['javascript', 'typescript'].includes(skill.id));
      case 'frameworks':
        return this.coreSkills.filter(skill =>
          ['react', 'nextjs', 'angular'].includes(skill.id));
      case 'databases':
        return this.coreSkills.filter(skill =>
          ['mongodb', 'postgresql', 'prisma'].includes(skill.id));
      default:
        return this.coreSkills;
    }
  }

  // Progress calculation methods
  calculateOverallProgress(): number {
    const totalSkills = this.coreSkills.length;
    const totalLevel = this.coreSkills.reduce((sum, skill) => sum + skill.level, 0);
    return Math.round(totalLevel / totalSkills);
  }

  getCategoryProgress(categoryId: string): number {
    const categorySkills = this.getCategorySkills(categoryId);
    if (categorySkills.length === 0) return 0;

    const totalLevel = categorySkills.reduce((sum, skill) => sum + skill.level, 0);
    return Math.round(totalLevel / categorySkills.length);
  }
}