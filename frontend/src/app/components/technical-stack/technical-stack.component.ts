import { Component, Input, OnInit, OnDestroy, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  LucideAngularModule,
  Code, Layers, Zap, Star, TrendingUp, Calendar, Award,
  Monitor, Server, Database, Smartphone, Globe, Settings,
  CheckCircle, Clock, Users, Target, ArrowRight, Search,
  Grid, List
} from 'lucide-angular';
import { HireMeComponent } from '../hire-me/hire-me.component';


// ... toate interfețele rămân la fel ...
export interface Technology {
  id: string;
  name: string;
  category: TechCategory;
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  level: number;
  yearsOfExperience: number;
  projects: number;
  description: string;
  icon?: string;
  color: string;
  backgroundColor: string;
  features: string[];
  lastUsed: string;
  trending?: boolean;
  certification?: boolean;
  learning?: boolean;
}

export type TechCategory = 'frontend' | 'backend' | 'database' | 'tools' | 'mobile' | 'cloud';

export interface TechCategoryInfo {
  id: TechCategory;
  name: string;
  description: string;
  icon: any;
  color: string;
  bgColor: string;
}

export interface LearningMilestone {
  id: string;
  title: string;
  year: string;
  description: string;
  technologies: string[];
}

@Component({
  selector: 'app-technical-stack',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, HireMeComponent], // Adaugă HireMeComponent
  templateUrl: './technical-stack.component.html',
  styleUrls: ['./technical-stack.component.css']
})
export class TechnicalStackComponent implements OnInit, OnDestroy {
  @Input() technologies: Technology[] = [];
  @Input() showCategoryFilter: boolean = true;
  @Input() showSearch: boolean = true;
  @Input() animateOnScroll: boolean = true;
  @Input() gridLayout: 'dense' | 'uniform' = 'dense';

  // Reference la HireMeComponent
  @ViewChild(HireMeComponent) hireMeComponent!: HireMeComponent;

  // Toate iconițele rămân la fel...
  readonly codeIcon = Code;
  readonly layersIcon = Layers;
  readonly zapIcon = Zap;
  readonly starIcon = Star;
  readonly trendingUpIcon = TrendingUp;
  readonly calendarIcon = Calendar;
  readonly awardIcon = Award;
  readonly monitorIcon = Monitor;
  readonly serverIcon = Server;
  readonly databaseIcon = Database;
  readonly smartphoneIcon = Smartphone;
  readonly globeIcon = Globe;
  readonly settingsIcon = Settings;
  readonly checkCircleIcon = CheckCircle;
  readonly clockIcon = Clock;
  readonly usersIcon = Users;
  readonly targetIcon = Target;
  readonly arrowRightIcon = ArrowRight;
  readonly searchIcon = Search;
  readonly gridIcon = Grid;
  readonly listIcon = List;

  activeCategory: TechCategory | 'all' = 'all';
  searchTerm = '';
  sortBy: 'proficiency' | 'projects' | 'name' | 'recent' = 'proficiency';
  viewMode: 'grid' | 'list' = 'grid';
  private isBrowser: boolean;
  private intersectionObserver?: IntersectionObserver;

  // Toate datele rămân la fel...
  categories: TechCategoryInfo[] = [
    {
      id: 'frontend',
      name: 'Frontend',
      description: 'User interface and client-side technologies',
      icon: this.monitorIcon,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20'
    },
    {
      id: 'backend',
      name: 'Backend',
      description: 'Server-side and API development',
      icon: this.serverIcon,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/20'
    },
    {
      id: 'database',
      name: 'Database',
      description: 'Data storage and management systems',
      icon: this.databaseIcon,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20'
    },
    {
      id: 'tools',
      name: 'Tools',
      description: 'Development tools and productivity software',
      icon: this.settingsIcon,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20'
    },
    {
      id: 'mobile',
      name: 'Mobile',
      description: 'Mobile app development technologies',
      icon: this.smartphoneIcon,
      color: 'text-pink-600 dark:text-pink-400',
      bgColor: 'bg-pink-100 dark:bg-pink-900/20'
    },
    {
      id: 'cloud',
      name: 'Cloud',
      description: 'Cloud platforms and deployment services',
      icon: this.globeIcon,
      color: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-100 dark:bg-indigo-900/20'
    }
  ];

  // Toate tehnologiile default rămân la fel...
  defaultTechnologies: Technology[] = [
    // Frontend Technologies
    {
      id: 'javascript',
      name: 'JavaScript',
      category: 'frontend',
      proficiency: 'intermediate',
      level: 75,
      yearsOfExperience: 2,
      projects: 7,
      description: 'Modern ES6+ JavaScript for interactive web applications',
      color: '#F7DF1E',
      backgroundColor: 'rgba(247, 223, 30, 0.1)', // 🔥 Transparent!
      features: ['ES6+', 'Async/Await', 'DOM Manipulation', 'Event Handling'],
      lastUsed: '2024',
      trending: true
    },
    {
      id: 'typescript',
      name: 'TypeScript',
      category: 'frontend',
      proficiency: 'intermediate',
      level: 70,
      yearsOfExperience: 1.5,
      projects: 5,
      description: 'Type-safe JavaScript for scalable applications',
      color: '#3178C6',
      backgroundColor: 'rgba(49, 120, 198, 0.1)', // 🔥 Transparent!
      features: ['Static Typing', 'Interfaces', 'Generics', 'Type Guards'],
      lastUsed: '2024',
      trending: true
    },
    // ... adaugă toate tehnologiile cu backgroundColor transparent
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.technologies.length === 0) {
      this.technologies = this.defaultTechnologies;
    }

    if (this.animateOnScroll && this.isBrowser) {
      this.setupScrollAnimation();
    }
  }

  ngOnDestroy(): void {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  }

  // Toate metodele existente rămân la fel...
  setActiveCategory(category: TechCategory | 'all'): void {
    this.activeCategory = category;
  }

  onSearchChange(term: string): void {
    this.searchTerm = term;
  }

  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value;
  }

  setSortBy(sortBy: 'proficiency' | 'projects' | 'name' | 'recent'): void {
    this.sortBy = sortBy;
  }

  onSortChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.sortBy = target.value as 'proficiency' | 'projects' | 'name' | 'recent';
  }

  setViewMode(mode: 'grid' | 'list'): void {
    this.viewMode = mode;
  }

  onTechClick(tech: Technology): void {
    console.log('Technology clicked:', tech);
  }

  // 🔥 NOUA METODĂ - Deschide modalul Hire Me
  onContactClick(): void {
    console.log('Contact button clicked - opening Hire Me modal');
    // Deschide modalul prin ViewChild reference
    if (this.hireMeComponent) {
      this.hireMeComponent.openModal();
    }
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.activeCategory = 'all';
    this.sortBy = 'proficiency';
  }

  get filteredTechnologies(): Technology[] {
    let filtered = this.technologies;

    if (this.activeCategory !== 'all') {
      filtered = filtered.filter(tech => tech.category === this.activeCategory);
    }

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(tech =>
        tech.name.toLowerCase().includes(term) ||
        tech.description.toLowerCase().includes(term) ||
        tech.features.some(feature => feature.toLowerCase().includes(term))
      );
    }

    return filtered.sort((a, b) => {
      switch (this.sortBy) {
        case 'proficiency':
          return b.level - a.level;
        case 'projects':
          return b.projects - a.projects;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'recent':
          return b.yearsOfExperience - a.yearsOfExperience;
        default:
          return 0;
      }
    });
  }

  private setupScrollAnimation(): void {
    if (!this.isBrowser) return;

    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '50px'
    });
  }

  // Toate metodele utility rămân la fel...
  getProficiencyIcon(proficiency: string): any {
    switch (proficiency) {
      case 'expert': return this.awardIcon;
      case 'advanced': return this.starIcon;
      case 'intermediate': return this.trendingUpIcon;
      case 'beginner': return this.targetIcon;
      default: return this.codeIcon;
    }
  }

  getProficiencyColor(proficiency: string): string {
    const colors = {
      'expert': 'text-purple-600 dark:text-purple-400',
      'advanced': 'text-green-600 dark:text-green-400',
      'intermediate': 'text-blue-600 dark:text-blue-400',
      'beginner': 'text-yellow-600 dark:text-yellow-400'
    };
    return colors[proficiency as keyof typeof colors] || 'text-gray-600 dark:text-gray-400';
  }

  getProficiencyBadgeColor(proficiency: string): string {
    const colors = {
      'expert': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'advanced': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'intermediate': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'beginner': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
    };
    return colors[proficiency as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }

  getCardSize(tech: Technology): string {
    if (this.gridLayout === 'uniform') return 'col-span-1 row-span-1';

    if (tech.proficiency === 'expert' || tech.trending) {
      return 'col-span-2 row-span-2';
    }
    if (tech.proficiency === 'advanced' || tech.projects >= 4) {
      return 'col-span-2 row-span-1';
    }
    return 'col-span-1 row-span-1';
  }

  getRelativeTime(lastUsed: string): string {
    const currentYear = new Date().getFullYear();

    if (lastUsed.toLowerCase().includes('month')) {
      return lastUsed;
    }

    const usedYear = parseInt(lastUsed);
    if (isNaN(usedYear)) {
      return lastUsed;
    }

    if (usedYear === currentYear) return 'Currently using';
    if (currentYear - usedYear === 1) return '1 year ago';
    return `${currentYear - usedYear} years ago`;
  }

  // Track by functions
  trackByTech(index: number, tech: Technology): string {
    return tech.id;
  }

  trackByCategory(index: number, category: TechCategoryInfo): string {
    return category.id;
  }

  trackByFeature(index: number, feature: string): string {
    return feature;
  }

  trackByMilestone(index: number, milestone: LearningMilestone): string {
    return milestone.id;
  }

  trackByString(index: number, item: string): string {
    return item;
  }

  // Getter methods
  getAdvancedOrExpertCount(): number {
    return this.technologies.filter(t => t.proficiency === 'advanced' || t.proficiency === 'expert').length;
  }

  getCertificationCount(): number {
    return this.technologies.filter(t => t.certification).length;
  }

  getAvgProficiency(): number {
    if (this.technologies.length === 0) return 0;
    return Math.round(this.technologies.reduce((sum, t) => sum + t.level, 0) / this.technologies.length);
  }

  getTechnologiesByCategory(categoryId: TechCategory): Technology[] {
    return this.technologies.filter(t => t.category === categoryId).slice(0, 3);
  }

  getMoreTechnologiesCount(categoryId: TechCategory): number {
    const total = this.technologies.filter(t => t.category === categoryId).length;
    return Math.max(0, total - 3);
  }

  getTotalTechnologiesByCategory(categoryId: TechCategory): number {
    return this.technologies.filter(t => t.category === categoryId).length;
  }

  getAvgLevelByCategory(categoryId: TechCategory): number {
    const categoryTechs = this.technologies.filter(t => t.category === categoryId);
    if (categoryTechs.length === 0) return 0;
    return Math.round(categoryTechs.reduce((sum, t) => sum + t.level, 0) / categoryTechs.length);
  }
}