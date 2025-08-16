import { Component, Input, OnInit, OnDestroy, Inject, PLATFORM_ID, Output, EventEmitter } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  LucideAngularModule,
  Monitor, Server, Settings, Users, Code, Database, Globe,
  Smartphone, Palette, Zap, Target, Award, TrendingUp, Star
} from 'lucide-angular';
import { Subject } from 'rxjs';

// Services
import { PdfDownloadService } from '../../services/pdf-download.service';
import { IconHelperService } from '../../services/icon-helper.service';

// Models and Interfaces  
import { Skill, SkillCategory } from '../../shared/models/skill.interface';

@Component({
  selector: 'app-skills-categories',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './skills-categories.component.html',
  styleUrls: ['./skills-categories.component.css']
})
export class SkillsCategoriesComponent implements OnInit, OnDestroy {
  // Input data from parent component
  @Input() skills: Skill[] = [];
  @Input() skillCategories: SkillCategory[] = [];
  @Input() showAnimations: boolean = true;
  @Input() autoRotateCategories: boolean = false;

  // Output events
  @Output() categorySelected = new EventEmitter<string>();

  private destroy$ = new Subject<void>();
  private animationTimeouts: any[] = [];
  private rotationTimer?: any;
  private isBrowser: boolean;

  // Lucide Icons
  readonly monitorIcon = Monitor;
  readonly serverIcon = Server;
  readonly settingsIcon = Settings;
  readonly usersIcon = Users;
  readonly codeIcon = Code;
  readonly databaseIcon = Database;
  readonly globeIcon = Globe;
  readonly smartphoneIcon = Smartphone;
  readonly paletteIcon = Palette;
  readonly zapIcon = Zap;
  readonly targetIcon = Target;
  readonly awardIcon = Award;
  readonly trendingUpIcon = TrendingUp;
  readonly starIcon = Star;

  // LayersIcon for save implementing of icons
  layersIcon = Code;

  // Active category state
  activeCategory: SkillCategory | null = null;

  // Color management for categories (since SkillCategory doesn't have color property)
  private readonly availableColors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
    '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
  ];
  private usedColors = new Set<string>();
  private categoryColors = new Map<string, string>();

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private pdfService: PdfDownloadService,
    private iconHelper: IconHelperService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    // Initialize colors for categories
    this.initializeCategoryColors();

    // Set initial active category
    if (this.skillCategories.length > 0) {
      this.activeCategory = this.skillCategories[0];
    }

    if (this.showAnimations && this.isBrowser) {
      this.startProgressAnimations();
    }

    if (this.autoRotateCategories && this.isBrowser) {
      this.startCategoryRotation();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    this.clearAnimationTimeouts();
    if (this.rotationTimer) {
      clearInterval(this.rotationTimer);
    }
  }

  /**
   * Initialize colors for skill categories
   */
  private initializeCategoryColors(): void {
    this.skillCategories.forEach(category => {
      if (!this.categoryColors.has(category.name)) {
        const color = this.getUnusedColor();
        this.categoryColors.set(category.name, color);
        this.usedColors.add(color);
      }
    });
  }

  /**
   * Get an unused color from available colors
   */
  private getUnusedColor(): string {
    const unusedColors = this.availableColors.filter(color => !this.usedColors.has(color));
    if (unusedColors.length > 0) {
      return unusedColors[0];
    }
    // If all colors are used, reset and start over
    this.usedColors.clear();
    return this.availableColors[0];
  }

  /**
   * Get color for a specific category
   */
  getCategoryColor(categoryName: string): string {
    return this.categoryColors.get(categoryName) || this.availableColors[0];
  }

  // Category management
  setActiveCategory(categoryName: string): void {

    const category = this.skillCategories.find(cat => cat.name === categoryName);
    if (category) {
      this.activeCategory = category;
      this.categorySelected.emit(categoryName);

      if (this.showAnimations && this.isBrowser) {
        this.startProgressAnimations();
      }
    }
  }

  setActiveCategoryByObject(category: SkillCategory): void {
    this.activeCategory = category;
    this.categorySelected.emit(category.name);

    if (this.showAnimations && this.isBrowser) {
      this.startProgressAnimations();
    }
  }

  getSkillsByCategory(category: SkillCategory): Skill[] {
    return this.skills.filter(skill => skill.category === category.name);
  }

  getActiveSkills(): Skill[] {
    return this.activeCategory ? this.getSkillsByCategory(this.activeCategory) : [];
  }

  getActiveCategoryInfo(): SkillCategory | null {
    return this.activeCategory;
  }

  // Animation methods
  private startProgressAnimations(): void {
    this.clearAnimationTimeouts();

    const activeSkills = this.getActiveSkills();
    activeSkills.forEach((skill, index) => {
      const timeout = setTimeout(() => {
        this.animateProgressBar(skill.id);
      }, index * 150); // Stagger animations

      this.animationTimeouts.push(timeout);
    });
  }

  private animateProgressBar(skillId: string): void {
    if (!this.isBrowser) return;

    const progressBar = document.querySelector(`[data-skill-id="${skillId}"] .progress-fill`);
    if (progressBar instanceof HTMLElement) {
      progressBar.style.width = '0%';

      setTimeout(() => {
        const skill = this.skills.find(s => s.id === skillId);
        if (skill) {
          progressBar.style.width = `${skill.level}%`;
        }
      }, 50);
    }
  }

  private clearAnimationTimeouts(): void {
    this.animationTimeouts.forEach(timeout => clearTimeout(timeout));
    this.animationTimeouts = [];
  }

  private startCategoryRotation(): void {
    let currentIndex = 0;
    this.rotationTimer = setInterval(() => {
      if (this.skillCategories.length > 0) {
        currentIndex = (currentIndex + 1) % this.skillCategories.length;
        this.setActiveCategory(this.skillCategories[currentIndex].name);
      }
    }, 8000); // Change category every 8 seconds
  }

  // Utility methods
  getProficiencyColor(proficiency: string): string {
    const colors = {
      'beginner': 'text-yellow-600 dark:text-yellow-400',
      'intermediate': 'text-blue-600 dark:text-blue-400',
      'advanced': 'text-green-600 dark:text-green-400',
      'expert': 'text-purple-600 dark:text-purple-400'
    };
    return colors[proficiency.toLowerCase() as keyof typeof colors] || 'text-gray-600 dark:text-gray-400';
  }

  getProficiencyBadgeColor(proficiency: string): string {
    const colors = {
      'beginner': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'intermediate': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'advanced': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'expert': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
    };
    return colors[proficiency.toLowerCase() as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }

  getProgressBarColor(level: number): string {
    if (level >= 80) return 'bg-gradient-to-r from-green-500 to-emerald-500';
    if (level >= 60) return 'bg-gradient-to-r from-blue-500 to-cyan-500';
    if (level >= 40) return 'bg-gradient-to-r from-yellow-500 to-orange-500';
    return 'bg-gradient-to-r from-gray-400 to-gray-500';
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
   * Get proficiency icon based on level
   */
  getProficiencyIcon(proficiency: string): any {
    switch (proficiency.toLowerCase()) {
      case 'expert': return this.awardIcon;
      case 'advanced': return this.starIcon;
      case 'intermediate': return this.trendingUpIcon;
      case 'beginner': return this.targetIcon;
      default: return this.codeIcon;
    }
  }

  /**
   * Calculate category statistics
   */
  getCategoryStats(category: SkillCategory): {
    total: number;
    avgLevel: number;
    maxLevel: number;
    minLevel: number;
    expertCount: number;
    advancedCount: number;
  } {
    const categorySkills = this.getSkillsByCategory(category);
    const total = categorySkills.length;

    if (total === 0) {
      return { total: 0, avgLevel: 0, maxLevel: 0, minLevel: 0, expertCount: 0, advancedCount: 0 };
    }

    const levels = categorySkills.map(s => s.level);
    const avgLevel = Math.round(levels.reduce((sum, level) => sum + level, 0) / total);
    const maxLevel = Math.max(...levels);
    const minLevel = Math.min(...levels);

    const expertCount = categorySkills.filter(s => s.proficiency?.toLowerCase() === 'expert').length;
    const advancedCount = categorySkills.filter(s => s.proficiency?.toLowerCase() === 'advanced').length;

    return { total, avgLevel, maxLevel, minLevel, expertCount, advancedCount };
  }

  /**
   * Get skills sorted by level for a category
   */
  getCategorySortedSkills(category: SkillCategory): Skill[] {
    return this.getSkillsByCategory(category)
      .sort((a, b) => b.level - a.level);
  }

  /**
   * Get top skills for a category
   */
  getCategoryTopSkills(category: SkillCategory, limit: number = 5): Skill[] {
    return this.getCategorySortedSkills(category).slice(0, limit);
  }

  /**
   * Check if category has expert level skills
   */
  categoryHasExpertSkills(category: SkillCategory): boolean {
    return this.getSkillsByCategory(category)
      .some(skill => skill.proficiency?.toLowerCase() === 'expert');
  }

  /**
   * Get category completion percentage (skills above 70%)
   */
  getCategoryCompletion(category: SkillCategory): number {
    const categorySkills = this.getSkillsByCategory(category);
    if (categorySkills.length === 0) return 0;

    const completedSkills = categorySkills.filter(skill => skill.level >= 70).length;
    return Math.round((completedSkills / categorySkills.length) * 100);
  }

  // Track by functions for *ngFor
  trackByCategory(index: number, category: SkillCategory): string {
    return category.name;
  }

  trackBySkill(index: number, skill: Skill): string {
    return skill.id;
  }

  // Download resume functionality
  downloadResume(): void {
    this.pdfService.downloadPDF("CV_English.pdf", "cv-ciobanu-alin-viorel.pdf");
  }

  /**
   * Get skills with projects for a category
   */
  getCategorySkillsWithProjects(category: SkillCategory): Skill[] {
    return this.getSkillsByCategory(category).filter(skill => skill.projects > 0);
  }

  /**
   * Get average years of experience for a category
   */
  getCategoryAvgExperience(category: SkillCategory): number {
    const categorySkills = this.getSkillsByCategory(category);
    if (categorySkills.length === 0) return 0;

    const totalExperience = categorySkills.reduce((sum, skill) => sum + skill.yearsOfExperience, 0);
    return Math.round((totalExperience / categorySkills.length) * 10) / 10;
  }

  /**
   * Format years of experience for display
   */
  formatExperience(years: number): string {
    if (years === 0) return 'New';
    if (years < 1) return '< 1 year';
    if (years === 1) return '1 year';
    return `${years} years`;
  }

  /**
   * Get skill level label
   */
  getSkillLevelLabel(level: number): string {
    if (level >= 90) return 'Expert';
    if (level >= 75) return 'Advanced';
    if (level >= 50) return 'Intermediate';
    if (level >= 25) return 'Beginner';
    return 'Learning';
  }

  /**
   * Check if all categories are loaded
   */
  get categoriesLoaded(): boolean {
    return this.skillCategories.length > 0 && this.skills.length > 0;
  }

  /**
   * Get total skills count across all categories
   */
  get totalSkillsCount(): number {
    return this.skills.length;
  }

  /**
   * Get overall average skill level
   */
  get overallAvgLevel(): number {
    if (this.skills.length === 0) return 0;
    const total = this.skills.reduce((sum, skill) => sum + skill.level, 0);
    return Math.round(total / this.skills.length);
  }
}