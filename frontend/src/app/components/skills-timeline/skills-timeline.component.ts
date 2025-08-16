import { Component, OnInit, OnDestroy, Output, EventEmitter, ViewChild, Input, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
import {
  LucideAngularModule,
  Clock, List, Calendar, Play, Pause, Target, Code, Award,
  Rocket, BookOpen, ArrowRight, CheckCircle, GraduationCap,
  Users, Briefcase, Database, Globe, Smartphone, Settings,
  TrendingUp, Star, Zap, Sparkles, Heart, Coffee
} from 'lucide-angular';
import { Subject } from 'rxjs';

// Components and Services
import { HireMeComponent } from '../hire-me/hire-me.component';
import { IconHelperService } from '../../services/icon-helper.service';

// Models and Interfaces
import { TimelineMilestone, TimelineStats } from '../../shared/models/timeline.interface';
import { CurrentLearning, LearningProgress } from '../../shared/models/education.interface';
import { Achievement, FutureGoal } from '../../shared/models/personal.interface';
import { SkillStats } from '../../shared/models/skill.interface';

@Component({
  selector: 'app-skills-timeline',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, HireMeComponent],
  templateUrl: './skills-timeline.component.html',
  styleUrls: ['./skills-timeline.component.css'],
  animations: [
    trigger('slideIn', [
      state('in', style({ opacity: 1, transform: 'translateX(0)' })),
      transition('void => *', [
        style({ opacity: 0, transform: 'translateX(-50px)' }),
        animate('600ms ease-out')
      ])
    ]),
    trigger('bounceIn', [
      transition('void => *', [
        style({ opacity: 0, transform: 'scale(0.3)' }),
        animate('600ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
          style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ]),
    trigger('fadeInUp', [
      transition('void => *', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class SkillsTimelineComponent implements OnInit, OnDestroy {
  // Input data from parent component
  @Input() timelineMilestones: TimelineMilestone[] = [];
  @Input() timelineStats: TimelineStats = {
    "Major Milestones": "0",
    " Achievements": "0"
  };
  @Input() currentLearning: CurrentLearning[] = [];
  @Input() learningProgress: LearningProgress[] = [];
  @Input() recentAchievements: Achievement[] = [];
  @Input() futureGoal: FutureGoal[] = [];

  // skills stats
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
  }

  // Output events
  @Output() milestoneSelected = new EventEmitter<TimelineMilestone>();
  @Output() viewFullJourney = new EventEmitter<void>();

  // Reference to HireMeComponent
  @ViewChild(HireMeComponent) hireMeComponent!: HireMeComponent;

  private destroy$ = new Subject<void>();
  private isBrowser: boolean;

  // Lucide Icons
  readonly clockIcon = Clock;
  readonly listIcon = List;
  readonly calendarIcon = Calendar;
  readonly playIcon = Play;
  readonly pauseIcon = Pause;
  readonly targetIcon = Target;
  readonly codeIcon = Code;
  readonly awardIcon = Award;
  readonly rocketIcon = Rocket;
  readonly bookOpenIcon = BookOpen;
  readonly arrowRightIcon = ArrowRight;
  readonly checkCircleIcon = CheckCircle;
  readonly graduationCapIcon = GraduationCap;
  readonly usersIcon = Users;
  readonly briefcaseIcon = Briefcase;
  readonly databaseIcon = Database;
  readonly globeIcon = Globe;
  readonly smartphoneIcon = Smartphone;
  readonly settingsIcon = Settings;
  readonly trendingUpIcon = TrendingUp;
  readonly starIcon = Star;
  readonly zapIcon = Zap;
  readonly sparklesIcon = Sparkles;
  readonly heartIcon = Heart;
  readonly coffeeIcon = Coffee;

  // Component state
  timelineView: 'detailed' | 'compact' = 'detailed';
  isAnimating = false;
  animationState = 'in';
  currentYear = new Date().getFullYear();

  // FIXED: Use component state for animation instead of modifying milestone objects
  activeTimelineIndex: number = -1;
  private animationInterval?: ReturnType<typeof setInterval>;

  constructor(
    private iconHelper: IconHelperService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.sortMilestones();
    setTimeout(() => {
      this.animationState = 'in';
    }, 500);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    // FIXED: Proper cleanup
    this.stopAutoAnimation();
  }

  // View controls
  setTimelineView(view: 'detailed' | 'compact'): void {
    this.timelineView = view;
    // Reset animation when view changes
    if (this.isAnimating) {
      this.stopAutoAnimation();
      this.startAutoAnimation();
    }
  }

  // FIXED: Complete animation logic rewrite
  toggleAnimation(): void {
    this.isAnimating = !this.isAnimating;

    if (this.isAnimating) {
      this.startAutoAnimation();
    } else {
      this.stopAutoAnimation();
    }
  }

  // FIXED: Use activeTimelineIndex instead of modifying milestone objects
  private startAutoAnimation(): void {
    if (!this.isBrowser) return;

    const milestones = this.visibleMilestones;
    if (milestones.length === 0) return;

    let currentIndex = 0;

    // Set initial active milestone
    this.activeTimelineIndex = 0;

    this.animationInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % milestones.length;
      this.activeTimelineIndex = currentIndex;
    }, 2000);
  }

  // FIXED: Proper cleanup
  private stopAutoAnimation(): void {
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
      this.animationInterval = undefined;
    }

    // Reset active state
    this.activeTimelineIndex = -1;
  }

  // Data management
  get visibleMilestones(): TimelineMilestone[] {
    if (this.timelineView === 'compact') {
      return this.timelineMilestones.filter(m => m.importance === 'HIGH');
    }
    return this.timelineMilestones;
  }

  private sortMilestones(): void {
    this.timelineMilestones.sort((a, b) => {
      const yearA = parseInt(a.year.split('-')[0]);
      const yearB = parseInt(b.year.split('-')[0]);
      return yearA - yearB;
    });
  }

  // FIXED: Check if milestone is active using component state
  isMilestoneActive(milestone: TimelineMilestone, index: number): boolean {
    if (!this.isAnimating) {
      // When not animating, check if manually selected
      return false; // You can implement manual selection logic here if needed
    }

    // During animation, check against activeTimelineIndex
    return this.activeTimelineIndex === index;
  }

  // Icon helpers using IconHelperService
  getMilestoneIcon(milestone: TimelineMilestone): any {
    if (milestone.icon) {
      return this.iconHelper.stringToLucide(milestone.icon as string);
    }
    return this.starIcon;
  }

  getLearningIcon(learning: CurrentLearning | FutureGoal): any {
    if (learning.icon) {
      return this.iconHelper.stringToLucide(learning.icon as string);
    }
    return this.bookOpenIcon;
  }

  getAchievementIcon(achievement: Achievement): any {
    if (achievement.icon) {
      return this.iconHelper.stringToLucide(achievement.icon as string);
    }
    return this.awardIcon;
  }

  // Event handlers
  onMilestoneClick(milestone: TimelineMilestone, index: number): void {
    // Stop animation when user manually interacts
    if (this.isAnimating) {
      this.stopAutoAnimation();
      this.isAnimating = false;
    }

    this.milestoneSelected.emit(milestone);
  }

  onViewFullJourney(): void {
    this.viewFullJourney.emit();
  }

  onHireMeClick(): void {
    if (this.hireMeComponent) {
      this.hireMeComponent.openModal();
    }
  }

  // Animation helpers
  getAnimationDelay(index: number): string {
    return `${index * 200}ms`;
  }

  // Statistics calculations using real data
  getMilestonesInYear(year: string): TimelineMilestone[] {
    return this.timelineMilestones.filter(m => m.year.includes(year));
  }

  getTotalTechnologiesFromMilestones(): number {
    const allTechnologies = new Set<string>();
    this.timelineMilestones.forEach(milestone => {
      milestone.technologies?.forEach(tech => allTechnologies.add(tech));
    });
    return allTechnologies.size;
  }

  getTotalSkillsLearned(): number {
    // Calculate from achievements and milestones
    const skillsFromAchievements = this.recentAchievements
      .filter(achievement => achievement.skillsGained)
      .reduce((total, achievement) => total + (achievement.skillsGained?.length || 0), 0);

    return skillsFromAchievements;
  }

  getCategoryMilestones(category: string): TimelineMilestone[] {
    return this.timelineMilestones.filter(m => m.category === category);
  }

  getCurrentYearProgress(): number {
    const currentYearMilestones = this.getMilestonesInYear(this.currentYear.toString());
    if (currentYearMilestones.length === 0) return 0;

    const completedMilestones = currentYearMilestones.filter(m => !this.isMilestoneActive(m, 0));
    return Math.round((completedMilestones.length / currentYearMilestones.length) * 100);
  }

  getOverallLearningProgress(): number {
    if (this.currentLearning.length === 0) return 0;
    const totalProgress = this.currentLearning.reduce((sum, learning) => sum + learning.progress, 0);
    return Math.round(totalProgress / this.currentLearning.length);
  }

  // Enhanced statistics methods
  getMostProductiveYear(): string {
    const yearCounts = new Map<string, number>();

    this.timelineMilestones.forEach(milestone => {
      const year = milestone.year.split('-')[0];
      yearCounts.set(year, (yearCounts.get(year) || 0) + 1);
    });

    return Array.from(yearCounts.entries())
      .sort((a, b) => b[1] - a[1])[0]?.[0] || this.currentYear.toString();
  }

  getTechnologyEvolution(): string[] {
    const allTechs: string[] = [];
    this.timelineMilestones.forEach(milestone => {
      if (milestone.technologies) {
        allTechs.push(...milestone.technologies);
      }
    });
    return [...new Set(allTechs)];
  }

  getAchievementsByCategory(): Map<string, number> {
    const categoryCount = new Map<string, number>();

    this.recentAchievements.forEach(achievement => {
      const category = achievement.type;
      categoryCount.set(category, (categoryCount.get(category) || 0) + 1);
    });

    return categoryCount;
  }

  // Utility methods
  getMilestoneCardClass(milestone: TimelineMilestone, index: number): string {
    const baseClass = 'timeline-milestone';
    const importanceClass = `importance-${milestone.importance?.toLowerCase() || 'medium'}`;
    const activeClass = this.isMilestoneActive(milestone, index) ? 'active' : '';

    return `${baseClass} ${importanceClass} ${activeClass}`.trim();
  }

  getProgressColor(progress: number): string {
    if (progress >= 80) return '#10B981';
    if (progress >= 60) return '#F59E0B';
    if (progress >= 40) return '#EF4444';
    return '#6B7280';
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
   * Format date for timeline display
   */
  formatTimelineDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  }

  /**
   * Get milestone importance badge color
   */
  getImportanceBadgeColor(importance?: string): string {
    const colors = {
      'high': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      'medium': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'low': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    };
    return colors[(importance?.toLowerCase() as keyof typeof colors)] || colors['medium'];
  }

  // Track by functions for ngFor optimization
  trackByMilestone(index: number, milestone: TimelineMilestone): string {
    return milestone.id;
  }

  trackByCurrent(index: number, current: CurrentLearning): string {
    return current.id;
  }

  trackByProgress(index: number, progress: LearningProgress): string {
    return progress.id;
  }

  trackByGoal(index: number, goal: FutureGoal): string {
    return goal.id;
  }

  trackByAchievement(index: number, achievement: Achievement): string {
    return achievement.id;
  }

  trackByString(index: number, item: string): string {
    return item;
  }

  // Simple utility methods focused on core functionality
  get totalMilestones(): number {
    return this.timelineMilestones.length;
  }

  get totalAchievements(): number {
    return this.recentAchievements.length;
  }

  get activeLearningCount(): number {
    return this.currentLearning.filter(learning =>
      learning.status.toLowerCase().includes('progress')
    ).length;
  }

  get completedLearningCount(): number {
    return this.currentLearning.filter(learning =>
      learning.status.toLowerCase() === 'completed'
    ).length;
  }

  /**
   * Check if milestone is recent (within last year)
   */
  isMilestoneRecent(milestone: TimelineMilestone): boolean {
    const milestoneYear = parseInt(milestone.year.split('-')[0]);
    const currentYear = new Date().getFullYear();
    return (currentYear - milestoneYear) <= 1;
  }

  /**
   * Get years span of all milestones
   */
  getTimelineYearsSpan(): { start: number; end: number; total: number } {
    if (this.timelineMilestones.length === 0) {
      const currentYear = new Date().getFullYear();
      return { start: currentYear, end: currentYear, total: 0 };
    }

    const years = this.timelineMilestones.map(m => parseInt(m.year.split('-')[0]));
    const start = Math.min(...years);
    const end = Math.max(...years);

    return { start, end, total: end - start + 1 };
  }

  /**
   * Get average learning progress
   */
  getAverageLearningProgress(): number {
    if (this.learningProgress.length === 0) return 0;

    const totalProgress = this.learningProgress.reduce((sum, progress) => sum + progress.progress, 0);
    return Math.round(totalProgress / this.learningProgress.length);
  }

  /**
   * Get total learning time spent
   */
  getTotalLearningTimeSpent(): number {
    return this.learningProgress.reduce((total, progress) => total + progress.timeSpent, 0);
  }

  /**
   * Format hours for display
   */
  formatHours(hours: number): string {
    if (hours < 1) return '< 1h';
    if (hours < 24) return `${Math.round(hours)}h`;
    if (hours < 168) return `${Math.round(hours / 24)}d`;
    return `${Math.round(hours / 168)}w`;
  }
}