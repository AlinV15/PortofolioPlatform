import { Component, Input, OnInit, OnDestroy, Inject, PLATFORM_ID, ViewChild, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  LucideAngularModule,
  Code, Layers, Zap, Star, TrendingUp, Calendar, Award,
  Monitor, Server, Database, Smartphone, Globe, Settings,
  CheckCircle, Clock, Users, Target, ArrowRight, Search,
  Grid, List
} from 'lucide-angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// Components and Services
import { HireMeComponent } from '../hire-me/hire-me.component';
import { IconHelperService } from '../../services/icon-helper.service';

// Models and Interfaces
import { TechCategory, Technology, TechStats } from '../../shared/models/technology.interface';

@Component({
  selector: 'app-technical-stack',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, HireMeComponent],
  templateUrl: './technical-stack.component.html',
  styleUrls: ['./technical-stack.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TechnicalStackComponent implements OnInit, OnDestroy {
  // Input data from parent component
  @Input() technologies: Technology[] = [];
  @Input() techCategories: TechCategory[] = [];
  @Input() techStats: TechStats = {
    totalTechnologies: 0,
    trendingCount: 0,
    averagePopularityScore: 0,
    categoryDistribution: { distribution: new Map<string, number>() },
    recentlyReleasedCount: 0,
    mostPopularCategory: "",
    trendingPercentage: 0
  };

  @Input() showCategoryFilter: boolean = true;
  @Input() showSearch: boolean = true;
  @Input() animateOnScroll: boolean = true;
  @Input() gridLayout: 'dense' | 'uniform' = 'dense';

  // Output events
  @Output() technologySelected = new EventEmitter<Technology>();
  @Output() categoryFilterChanged = new EventEmitter<string>();

  // Reference to HireMeComponent
  @ViewChild(HireMeComponent) hireMeComponent!: HireMeComponent;

  private destroy$ = new Subject<void>();
  private isBrowser: boolean;
  private intersectionObserver?: IntersectionObserver;

  // Lucide Icons
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

  // Component state
  activeCategory: string = 'all';
  searchTerm = '';
  sortBy: 'proficiency' | 'projects' | 'name' | 'recent' = 'proficiency';
  viewMode: 'grid' | 'list' = 'grid';

  // Create category name to ID mapping
  private categoryNameToIdMap = new Map<string, string>();
  private categoryIdToNameMap = new Map<string, string>();

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private iconHelper: IconHelperService,
    private cdr: ChangeDetectorRef
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.initializeCategoryMappings();

    if (this.animateOnScroll && this.isBrowser) {
      // Delay setup to avoid hydration issues
      setTimeout(() => {
        this.setupScrollAnimation();
      }, 100);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  }

  /**
   * Initialize category mappings to handle ID/name mismatches
   */
  private initializeCategoryMappings(): void {
    this.techCategories.forEach(category => {
      this.categoryIdToNameMap.set(category.id, category.name);
      this.categoryNameToIdMap.set(category.name, category.id);
    });
  }

  /**
   * Get category ID from name
   */
  private getCategoryIdFromName(categoryName: string): string {
    return this.categoryNameToIdMap.get(categoryName) || categoryName;
  }

  /**
   * Get category name from ID
   */
  private getCategoryNameFromId(categoryId: string): string {
    return this.categoryIdToNameMap.get(categoryId) || categoryId;
  }

  debugCategories(): void {
    console.log('=== DEBUG INFO ===');
    console.log('Active category:', this.activeCategory);
    console.log('Category mappings:', {
      nameToId: Array.from(this.categoryNameToIdMap.entries()),
      idToName: Array.from(this.categoryIdToNameMap.entries())
    });
    console.log('Technologies:', this.technologies.map(t => ({ name: t.name, category: t.category })));
    console.log('Tech categories:', this.techCategories.map(c => ({ id: c.id, name: c.name })));
    console.log('Filtered technologies count:', this.filteredTechnologies.length);
    console.log('=================');
  }

  // Category and filter management
  setActiveCategory(category: string): void {
    this.activeCategory = category;
    this.categoryFilterChanged.emit(category);
    this.cdr.markForCheck(); // Trigger change detection
  }

  onSearchChange(term: string): void {
    this.searchTerm = term;
    this.cdr.markForCheck();
  }

  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value;
    this.cdr.markForCheck();
  }

  setSortBy(sortBy: 'proficiency' | 'projects' | 'name' | 'recent'): void {
    this.sortBy = sortBy;
    this.cdr.markForCheck();
  }

  onSortChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.sortBy = target.value as 'proficiency' | 'projects' | 'name' | 'recent';
    this.cdr.markForCheck();
  }

  setViewMode(mode: 'grid' | 'list'): void {
    this.viewMode = mode;
    this.cdr.markForCheck();
  }

  onTechClick(tech: Technology): void {
    this.technologySelected.emit(tech);
  }

  onContactClick(): void {
    if (this.hireMeComponent) {
      this.hireMeComponent.openModal();
    }
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.activeCategory = 'all';
    this.sortBy = 'proficiency';
    this.cdr.markForCheck();
  }

  // Data filtering and sorting - FIXED
  get filteredTechnologies(): Technology[] {
    let filtered = [...this.technologies];

    // Filter by category - Handle both ID and name matching
    if (this.activeCategory !== 'all') {
      filtered = filtered.filter(tech => {
        // Try matching by category name directly
        if (tech.category === this.activeCategory) {
          return true;
        }

        // Try matching by converting category name to ID
        const categoryId = this.getCategoryIdFromName(tech.category);
        if (categoryId === this.activeCategory) {
          return true;
        }

        // Try matching by converting active category to name
        const categoryName = this.getCategoryNameFromId(this.activeCategory);
        if (tech.category === categoryName) {
          return true;
        }

        return false;
      });
    }

    // Filter by search term
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(tech =>
        tech.name.toLowerCase().includes(term) ||
        tech.description.toLowerCase().includes(term) ||
        tech.features.some(feature => feature.toLowerCase().includes(term)) ||
        tech.category.toLowerCase().includes(term)
      );
    }

    // Sort the filtered results
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

  // Setup scroll animations - Made SSR safe
  private setupScrollAnimation(): void {
    if (!this.isBrowser || typeof IntersectionObserver === 'undefined') {
      return;
    }

    try {
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

      // Observer setup would go here for specific elements
    } catch (error) {
      console.warn('IntersectionObserver setup failed:', error);
    }
  }

  // Utility methods for UI
  getProficiencyIcon(proficiency: string): any {
    switch (proficiency.toLowerCase()) {
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
    return colors[proficiency.toLowerCase() as keyof typeof colors] || 'text-gray-600 dark:text-gray-400';
  }

  getProficiencyBadgeColor(proficiency: string): string {
    const colors = {
      'expert': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'advanced': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'intermediate': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'beginner': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
    };
    return colors[proficiency.toLowerCase() as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }

  /**
   * Get technology icon using IconHelperService
   */
  getTechnologyIcon(technology: Technology): any {
    if (technology.icon) {
      return this.iconHelper.stringToLucide(technology.icon as string);
    }
    return this.codeIcon;
  }

  /**
   * Get category icon using IconHelperService
   */
  getCategoryIcon(category: TechCategory): any {
    if (category.icon) {
      return this.iconHelper.stringToLucide(category.icon as string);
    }
    return this.layersIcon;
  }

  // Statistics and analysis methods - FIXED
  getAdvancedOrExpertCount(): number {
    return this.technologies.filter(t =>
      t.proficiency === 'advanced' || t.proficiency === 'expert'
    ).length;
  }

  getCertificationCount(): number {
    return this.technologies.filter(t => t.certification).length;
  }

  getAvgProficiency(): number {
    if (this.technologies.length === 0) return 0;
    return Math.round(this.technologies.reduce((sum, t) => sum + t.level, 0) / this.technologies.length);
  }

  // FIXED: Handle category matching properly
  getTechnologiesByCategory(categoryId: string): Technology[] {
    const categoryName = this.getCategoryNameFromId(categoryId);
    return this.technologies
      .filter(t => t.category === categoryName || t.category === categoryId)
      .slice(0, 3);
  }

  getMoreTechnologiesCount(categoryId: string): number {
    const categoryName = this.getCategoryNameFromId(categoryId);
    const total = this.technologies.filter(t => t.category === categoryName || t.category === categoryId).length;
    return Math.max(0, total - 3);
  }

  getTotalTechnologiesByCategory(categoryId: string): number {
    const categoryName = this.getCategoryNameFromId(categoryId);
    return this.technologies.filter(t => t.category === categoryName || t.category === categoryId).length;
  }

  getAvgLevelByCategory(categoryId: string): number {
    const categoryName = this.getCategoryNameFromId(categoryId);
    const categoryTechs = this.technologies.filter(t => t.category === categoryName || t.category === categoryId);
    if (categoryTechs.length === 0) return 0;
    return Math.round(categoryTechs.reduce((sum, t) => sum + t.level, 0) / categoryTechs.length);
  }

  /**
   * Get category statistics - FIXED
   */
  getCategoryStats(categoryId: string): {
    total: number;
    avgLevel: number;
    expertCount: number;
    trendingCount: number;
  } {
    const categoryName = this.getCategoryNameFromId(categoryId);
    const categoryTechs = this.technologies.filter(t => t.category === categoryName || t.category === categoryId);
    const total = categoryTechs.length;

    if (total === 0) {
      return { total: 0, avgLevel: 0, expertCount: 0, trendingCount: 0 };
    }

    const avgLevel = Math.round(categoryTechs.reduce((sum, t) => sum + t.level, 0) / total);
    const expertCount = categoryTechs.filter(t => t.proficiency === 'expert').length;
    const trendingCount = categoryTechs.filter(t => t.trending).length;

    return { total, avgLevel, expertCount, trendingCount };
  }

  // Track by functions for ngFor optimization
  trackByTech(index: number, tech: Technology): string {
    return tech.id;
  }

  trackByCategory(index: number, category: TechCategory): string {
    return category.id;
  }

  trackByFeature(index: number, feature: string): string {
    return feature;
  }

  trackByString(index: number, item: string): string {
    return item;
  }

  // Additional utility methods
  getFilteredCount(category: string): number {
    if (category === 'all') return this.technologies.length;
    const categoryName = this.getCategoryNameFromId(category);
    return this.technologies.filter(tech => tech.category === categoryName || tech.category === category).length;
  }

  hasSearchResults(): boolean {
    return this.filteredTechnologies.length > 0;
  }

  getSearchResultsCount(): number {
    return this.filteredTechnologies.length;
  }

  isCategoryActive(categoryId: string): boolean {
    return this.activeCategory === categoryId;
  }

  formatLevel(level: number): string {
    return `${level}%`;
  }

  getExperienceLabel(years: number): string {
    if (years === 0) return 'New';
    if (years < 1) return '< 1 year';
    if (years === 1) return '1 year';
    return `${years} years`;
  }

  // Additional methods from original component...
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

  getRelativeTime(yearsOfExperience: number): string {
    if (yearsOfExperience === 0) return 'New to this';
    if (yearsOfExperience < 1) return 'Less than a year';
    if (yearsOfExperience === 1) return '1 year experience';
    return `${yearsOfExperience} years experience`;
  }

  getProgressColor(level: number): string {
    if (level >= 80) return 'bg-gradient-to-r from-green-500 to-emerald-500';
    if (level >= 60) return 'bg-gradient-to-r from-blue-500 to-cyan-500';
    if (level >= 40) return 'bg-gradient-to-r from-yellow-500 to-orange-500';
    return 'bg-gradient-to-r from-gray-400 to-gray-500';
  }

  getTechnologyStatus(tech: Technology): 'trending' | 'learning' | 'certified' | 'stable' {
    if (tech.trending) return 'trending';
    if (tech.learning) return 'learning';
    if (tech.certification) return 'certified';
    return 'stable';
  }

  getStatusColor(status: string): string {
    const colors = {
      'trending': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'learning': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'certified': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'stable': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    };
    return colors[status as keyof typeof colors] || colors.stable;
  }

  getTrendingTechnologies(): Technology[] {
    return this.technologies.filter(tech => tech.trending);
  }

  getLearningTechnologies(): Technology[] {
    return this.technologies.filter(tech => tech.learning);
  }

  getCertifiedTechnologies(): Technology[] {
    return this.technologies.filter(tech => tech.certification);
  }

  getMostUsedTechnologies(limit: number = 5): Technology[] {
    return [...this.technologies]
      .sort((a, b) => b.projects - a.projects)
      .slice(0, limit);
  }

  getNewestTechnologies(limit: number = 3): Technology[] {
    return [...this.technologies]
      .sort((a, b) => a.yearsOfExperience - b.yearsOfExperience)
      .slice(0, limit);
  }
}