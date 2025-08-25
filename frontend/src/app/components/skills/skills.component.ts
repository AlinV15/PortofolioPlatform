import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, Palette, Server, Database, Code, Layers, Zap, Star, TrendingUp, BookCopy } from 'lucide-angular';
import { NO_ERRORS_SCHEMA } from '@angular/core';
// Services
import { IconHelperService } from '../../services/icon-helper.service';

// Interfaces
import {
  Skill,
  TopSkill,
  FeaturedSkill,
  SkillCategory,
  SkillStats
} from '../../shared/models/skill.interface';
import { TechCategory, Technology, TechStats } from '../../shared/models/technology.interface';
import { ProficiencyLevel } from '../../shared/enums/ProficiencyLevel';

export interface SkillsData {
  featuredSkills: FeaturedSkill[];
  skillsCategories: SkillCategory[];
  skillsStats: SkillStats;
  // Simplified to use only compatible data structures
}

export interface TechData {
  technologies: Technology[],
  techCategories: TechCategory[],
  techStats: TechStats
}

interface ProcessedSkillCategory {
  name: string;
  skills: FeaturedSkill[]; // Only use FeaturedSkill for compatibility
  icon: any;
  description: string;
  averageLevel: number;
  totalProjects: number;
}

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css'],
  schemas: [NO_ERRORS_SCHEMA]
})
export class SkillsComponent implements OnInit, OnChanges {

  // Input from parent component (HomeComponent)
  @Input() skillsData: SkillsData | null = null;
  @Input() techData: TechData | null = null;

  // Register Lucide icons for categories
  readonly Palette = Palette;
  readonly Server = Server;
  readonly Database = Database;
  readonly Code = Code;
  readonly Layers = Layers;
  readonly Zap = Zap;

  // Component data - simplified to use only FeaturedSkills
  featuredSkills: FeaturedSkill[] = [];
  skillsCategories: SkillCategory[] = [];
  skillsStats: SkillStats = {
    description: "Nothing for now",
    projectsText: "0",
    technologiesText: "0",
    yearsCoding: "0",
    projects: "0",
    certifications: "0",
    avgProficiency: "0",
    yearsCodingLabel: "0 years",
    projectsLabel: "0 projects",
    certificationsLabel: "0 certifications",
    avgProficiencyLabel: "0 %"
  };
  technologies: Technology[] = [];
  techCategories: TechCategory[] = [];
  techStats: TechStats = {
    totalTechnologies: 0,
    trendingCount: 0,
    averagePopularityScore: 0,
    categoryDistribution: { distribution: new Map<string, number>() },
    recentlyReleasedCount: 0,
    mostPopularCategory: "",
    trendingPercentage: 0,
  }


  // Processed data for display
  processedCategories: ProcessedSkillCategory[] = [];
  displayedSkills: FeaturedSkill[] = [];
  maxSkillsToShow = 9; // For home page display

  // Animation states
  animationTriggered = false;
  animatedSkills = new Set<string>();

  // Enums for template access
  readonly ProficiencyLevel = ProficiencyLevel;
  readonly star = Star;
  readonly trending = TrendingUp;
  readonly books = BookCopy;

  constructor(private iconHelperService: IconHelperService) { }

  ngOnInit(): void {
    this.initializeSkillsData();
    this.triggerAnimations();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['skillsData'] && this.skillsData) {
      this.initializeSkillsData();
    }
  }

  /**
   * Initialize skills data from parent component input
   */
  private initializeSkillsData(): void {
    if (!this.skillsData) return;

    // Set main data

    this.featuredSkills = this.skillsData.featuredSkills || [];
    this.skillsCategories = this.skillsData.skillsCategories || [];
    this.skillsStats = this.skillsData.skillsStats || this.getDefaultStats();


    this.processCategories();
  }
  /**
   * Process categories with associated skills
   */
  private processCategories(): void {
    this.processedCategories = this.skillsCategories.map(category => {
      // Find skills for this category
      const categorySkills = this.displayedSkills.filter((skill: any) => {
        if ('categoryName' in skill) {
          return skill.categoryName === category.name;
        }
        if ('category' in skill) {
          return skill.categoryName === category.name;
        }
        return false;
      });

      // Calculate metrics for category
      const averageLevel = categorySkills.length > 0
        ? categorySkills.reduce((sum, skill) => sum + skill.level, 0) / categorySkills.length
        : 0;

      const totalProjects = categorySkills.reduce((sum, skill) => {
        if ('projects' in skill && typeof skill.projects === 'number') {
          return sum + skill.projects;
        }
        if ('projects' in skill && Array.isArray(skill.projects)) {
          return sum + skill.projects.length;
        }
        return sum;
      }, 0);

      return {
        name: category.name,
        skills: categorySkills,
        icon: this.getCategoryIcon(category),
        description: category.description,
        averageLevel: Math.round(averageLevel),
        totalProjects
      };
    }).filter(category => category.skills.length > 0); // Only show categories with skills
  }

  /**
   * Get icon for category - handle both string and LucideIconData
   */
  getCategoryIcon(category: SkillCategory): any {
    if (typeof category.icon === 'string') {
      return this.iconHelperService.stringToLucide(category.icon);
    }
    return category.icon || this.Zap;
  }

  /**
   * Trigger animations after component loads
   */
  private triggerAnimations(): void {
    setTimeout(() => {
      this.animationTriggered = true;
      this.animateSkillBars();
    }, 500);
  }

  /**
   * Animate skill bars sequentially
   */
  private animateSkillBars(): void {
    this.displayedSkills.forEach((skill, index) => {
      setTimeout(() => {
        const skillId = this.getSkillId(skill);
        this.animatedSkills.add(skillId);
      }, index * 200);
    });
  }

  /**
   * Get unique skill identifier - simplified for FeaturedSkill
   */
  private getSkillId(skill: FeaturedSkill): string {
    return skill.id || skill.name;
  }

  /**
   * Get skill level class for styling
   */
  getSkillLevelClass(level: number): string {
    if (level >= 85) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    if (level >= 70) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    if (level >= 50) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  }

  /**
   * Get skill level text
   */
  getSkillLevelText(level: number): string {
    if (level >= 85) return 'Expert';
    if (level >= 70) return 'Advanced';
    if (level >= 50) return 'Intermediate';
    return 'Beginner';
  }

  /**
     * Get filtered featured skills categories
     */

  getFilteredFeaturedSkillsCategories(): SkillCategory[] {
    return this.skillsCategories.filter(category => this.getAllSkillOnCategory(category).length > 0);
  }

  /**
   * Get proficiency level text
   */
  getProficiencyText(proficiency: ProficiencyLevel | string): string {
    if (typeof proficiency === 'string') {
      return proficiency.charAt(0).toUpperCase() + proficiency.slice(1).toLowerCase();
    }
    return String(proficiency);
  }

  /**
   * Get progress bar width style with animation
   */
  getProgressWidth(skill: FeaturedSkill): { [key: string]: string } {
    const skillId = skill.id;
    //const isAnimated = this.animatedSkills.has(skillId);
    const color = this.getSkillColor(skill);

    return {
      'width': `${skill.level}%`,
      'background-color': color,
      'transition': 'width 1s ease-in-out'
    };
  }

  /**
   * Get skill color
   */
  getSkillColor(skill: FeaturedSkill): string {
    if ('color' in skill && skill.color) {
      return skill.color;
    }
    // Default color based on level
    if (skill.level >= 85) return '#10B981'; // Green
    if (skill.level >= 70) return '#3B82F6'; // Blue
    if (skill.level >= 50) return '#F59E0B'; // Yellow
    return '#6B7280'; // Gray
  }

  /**
   * Get years of experience text
   */
  getExperienceText(skill: Skill | TopSkill | FeaturedSkill): string {
    if ('yearsOfExperience' in skill && skill.yearsOfExperience) {
      const years = skill.yearsOfExperience;
      return years === 1 ? '1 year' : `${years} years`;
    }
    return 'New';
  }

  /**
   * Get project count text
   */
  getProjectsText(skill: Skill | TopSkill | FeaturedSkill): string {
    if ('projects' in skill) {
      if (typeof skill.projects === 'number') {
        return skill.projects === 1 ? '1 project' : `${skill.projects} projects`;
      }
      if (Array.isArray(skill.projects)) {
        const count = skill.projects.length;
        return count === 1 ? '1 project' : `${count} projects`;
      }
    }
    return '0 projects';
  }

  /**
   * Check if skill is featured - always true for FeaturedSkill
   */
  isSkillFeatured(skill: FeaturedSkill): boolean {
    return true; // All skills are featured in this simplified version
  }

  /**
   * Check if skill is trending - for FeaturedSkill
   */
  isSkillTrending(skill: FeaturedSkill): boolean {
    return skill.trending || false;
  }

  /**
   * Check if skill is currently being learned - for FeaturedSkill
   */
  isSkillLearning(skill: FeaturedSkill): boolean {
    return skill.learning || false;
  }

  /**
   * Get skill description - for FeaturedSkill
   */
  getSkillDescription(skill: FeaturedSkill): string {
    return skill.description || `${skill.level}% proficiency in ${skill.name}`;
  }

  /**
   * Track by functions for performance - for FeaturedSkill
   */
  trackBySkill(index: number, skill: FeaturedSkill): string {
    return skill.id;
  }

  trackByCategory(index: number, category: ProcessedSkillCategory): string {
    return category.name;
  }

  trackBySkillCategory(index: number, category: SkillCategory): string {
    return category.name;
  }

  /**
   * Handle skill click for detailed view - for FeaturedSkill
   */
  onSkillClick(skill: FeaturedSkill): void {
    console.log(`Skill clicked: ${skill.name}`);
    // Analytics tracking could go here
    // Example: this.analytics.track('skill_clicked', { skill_name: skill.name, skill_level: skill.level });
  }

  /**
   * Get category background color
   */
  getCategoryBgColor(category: SkillCategory): string {
    // Generate color based on category name or use default
    const colors = [
      'bg-blue-50 dark:bg-blue-900/20',
      'bg-green-50 dark:bg-green-900/20',
      'bg-purple-50 dark:bg-purple-900/20',
      'bg-orange-50 dark:bg-orange-900/20',
      'bg-pink-50 dark:bg-pink-900/20',
      'bg-indigo-50 dark:bg-indigo-900/20'
    ];
    const index = category.name.length % colors.length;
    return colors[index];
  }

  /**
   * Get category text color
   */
  getCategoryTextColor(category: SkillCategory): string {
    const colors = [
      'text-blue-700 dark:text-blue-300',
      'text-green-700 dark:text-green-300',
      'text-purple-700 dark:text-purple-300',
      'text-orange-700 dark:text-orange-300',
      'text-pink-700 dark:text-pink-300',
      'text-indigo-700 dark:text-indigo-300'
    ];
    const index = category.name.length % colors.length;
    return colors[index];
  }

  /**
   * Get total skills across all types
   */
  getTotalSkillsCount(): number {
    return new Set([
      ...this.featuredSkills.map(s => s.name)
    ]).size;
  }

  /**
   * Get average skill level
   */
  getAverageSkillLevel(): number {
    if (this.displayedSkills.length === 0) return 0;
    const total = this.displayedSkills.reduce((sum, skill) => sum + skill.level, 0);
    return Math.round(total / this.displayedSkills.length);
  }

  /**
   * Get highest skill level
   */
  getHighestSkillLevel(): number {
    if (this.techData) {
      if (this.techData.technologies.length === 0) return 0;
      return Math.max(...this.techData.technologies.map(skill => skill.level));
    }
    return 0;
  }

  /**
   * Get skills by proficiency level
   */
  getSkillsByProficiency(level: ProficiencyLevel): (Technology)[] {
    if (this.techData) {
      return this.techData.technologies.filter((tech: any) => {
        if ('proficiency' in tech) {
          return tech.proficiency === level;
        }
        // Fallback based on numeric level
        switch (level) {
          case ProficiencyLevel.EXPERT: return tech.level >= 85;
          case ProficiencyLevel.ADVANCED: return tech.level >= 70 && tech.level < 85;
          case ProficiencyLevel.INTERMEDIATE: return tech.level >= 50 && tech.level < 70;
          case ProficiencyLevel.BEGINNER: return tech.level < 50;
          default: return false;
        }
      });
    }
    return [];
  }

  /**
   * Default stats fallback
   */
  private getDefaultStats(): SkillStats {
    return {
      description: "Nothing for now",
      projectsText: "0",
      technologiesText: "0",
      yearsCoding: "0",
      projects: "0",
      certifications: "0",
      avgProficiency: "0",
      yearsCodingLabel: "0 years",
      projectsLabel: "0 projects",
      certificationsLabel: "0 certifications",
      avgProficiencyLabel: "0 %"
    };
  }

  /**
   * Check if skills data is loaded
   */
  hasSkillsData(): boolean {
    return this.skillsData !== null && (
      this.featuredSkills.length > 0
    );
  }


  getAllSkillOnCategory(category: SkillCategory): FeaturedSkill[] {
    return this.skillsData?.featuredSkills.filter(d => d.categoryName === category.name) || [];
  }


  getAverageLevelOnCategory(category: SkillCategory): number {
    const data = this.getAllSkillOnCategory(category);
    if (data.length === 0) return 0;
    const sum = data.reduce((acc: number, curr: FeaturedSkill) => acc + curr.level, 0);
    return Math.round(sum / data.length);
  }

  getAllProjectsOnCategory(category: SkillCategory): number {
    const data = this.getAllSkillOnCategory(category);
    if (data.length > 0) {
      return data.reduce((acc: number, curr: FeaturedSkill) => acc + curr.projects.length, 0);
    }
    return 0;
  }

  /**
   * Get skills stats for display
   */
  getSkillsStatsForDisplay() {
    return {
      description: this.skillsStats.description,
      yearsCoding: this.skillsStats.yearsCodingLabel,
      projects: this.skillsStats.projectsLabel,
      technologies: this.skillsStats.technologiesText,
      certifications: this.skillsStats.certificationsLabel,
      avgProficiency: this.skillsStats.avgProficiencyLabel
    };
  }
}