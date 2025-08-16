import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, Rocket, Briefcase, Zap, Heart, Trophy, Laptop, BarChart3, Users, GraduationCap, Award } from 'lucide-angular';

// Services
import { IconHelperService } from '../../services/icon-helper.service';

// Interfaces
import {
  Achievement,
  Highlight,
  KeyStats,
  Value,
  PersonalityTrait
} from '../../shared/models/personal.interface';
import {
  Education,
  EducationStats,
  Language
} from '../../shared/models/education.interface';
import {
  ContactInfo,
  ContactLocation
} from '../../shared/models/contact.interface';
import { Technology } from '../../shared/models/technology.interface';
import { Certificate } from '../../shared/models/certificate.interface';

// Enums
import { AchievementType } from '../../shared/enums/AchievementType';
import { HighlightType } from '../../shared/enums/HighlightType';
import { ImportanceLevel } from '../../shared/enums/ImportanceLevel';
import { SkillStats } from '../../shared/models/skill.interface';

export interface AboutData {
  // Personal data
  highlights: Highlight[];
  achievements: Achievement[];
  values: Value[];
  personalityTraits: PersonalityTrait[];
  keyStats: KeyStats;

  // Education data
  education: Education[];
  educationStats: EducationStats;

  // Contact data
  contactInfo: ContactInfo;
  contactLocation: ContactLocation;

  // Additional context data
  technologies?: Technology[];
  certificates?: Certificate[];
}

interface ProcessedStat {
  value: string;
  label: string;
  icon: any;
  description: string;
  color: string;
}

interface StoryHighlights {
  currentRole: string;
  location: string;
  education: string;
  passion: string;
  goal: string;
  experience: string;
  specialization: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit, OnChanges {

  // Input from parent component (HomeComponent)
  @Input() aboutData: AboutData | null = null;

  // Register Lucide icons
  readonly Rocket = Rocket;
  readonly Briefcase = Briefcase;
  readonly Zap = Zap;
  readonly Heart = Heart;
  readonly Trophy = Trophy;
  readonly Laptop = Laptop;
  readonly BarChart3 = BarChart3;
  readonly Users = Users;
  readonly GraduationCap = GraduationCap;
  readonly Award = Award;

  // Component data
  highlights: Highlight[] = [];
  achievements: Achievement[] = [];
  values: Value[] = [];
  personalityTraits: PersonalityTrait[] = [];
  keyStats: KeyStats = {
    technologies: 0,
    projects: 0,
    certificates: 0,
    educationYears: 0
  };

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
    avgProficiencyLabel: "",
  }

  education: Education[] = [];
  educationStats: EducationStats = {
    totalCourses: 0,
    currentYear: "0",
    specialization: "",
    focusAreas: [],
    languages: []
  };

  contactInfo: ContactInfo = {
    email: '',
    phone: '',
    location: '',
    github: '',
    linkedin: ''
  };

  contactLocation: ContactLocation = {
    name: '',
    address: '',
    city: '',
    country: '',
    coordinates: { lat: 0, lng: 0 },
    timezone: '',
    workingHours: ''
  };

  // Processed data for display
  processedStats: ProcessedStat[] = [];
  featuredAchievements: Achievement[] = [];
  topHighlights: Highlight[] = [];
  storyHighlights: StoryHighlights = {
    currentRole: '',
    location: '',
    education: '',
    passion: '',
    goal: '',
    experience: '',
    specialization: ''
  };

  // Display limits
  maxAchievementsToShow = 4;
  maxHighlightsToShow = 3;
  maxValuesToShow = 6;

  // Enums for template access
  readonly AchievementType = AchievementType;
  readonly HighlightType = HighlightType;
  readonly ImportanceLevel = ImportanceLevel;

  constructor(private iconHelperService: IconHelperService) { }

  ngOnInit(): void {
    this.initializeAboutData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['aboutData'] && this.aboutData) {
      this.initializeAboutData();
    }
  }

  /**
   * Initialize about data from parent component input
   */
  private initializeAboutData(): void {
    if (!this.aboutData) return;

    // Set main data
    this.highlights = this.aboutData.highlights || [];
    this.achievements = this.aboutData.achievements || [];
    this.values = this.aboutData.values || [];
    this.personalityTraits = this.aboutData.personalityTraits || [];
    this.keyStats = this.aboutData.keyStats || this.getDefaultKeyStats();
    this.education = this.aboutData.education || [];
    this.educationStats = this.aboutData.educationStats || this.getDefaultEducationStats();
    this.contactInfo = this.aboutData.contactInfo || this.getDefaultContactInfo();
    this.contactLocation = this.aboutData.contactLocation || this.getDefaultContactLocation();

    // Process data for display
    this.processStatsForDisplay();
    this.processFeaturedContent();
    this.generateStoryHighlights();
  }

  /**
   * Process key stats into display format
   */
  private processStatsForDisplay(): void {
    this.processedStats = [
      {
        value: this.keyStats.projects.toString(),
        label: this.keyStats.projects === 1 ? 'Project Completed' : 'Projects Completed',
        icon: this.Rocket,
        description: 'Full-stack applications built and deployed',
        color: 'text-blue-600'
      },
      {
        value: this.calculateExperienceYears(),
        label: 'Years Learning',
        icon: this.Briefcase,
        description: 'Continuous learning and development',
        color: 'text-green-600'
      },
      {
        value: this.keyStats.technologies.toString() + '+',
        label: 'Technologies',
        icon: this.Zap,
        description: 'Programming languages and frameworks mastered',
        color: 'text-purple-600'
      },
      {
        value: '100%',
        label: 'Passion Driven',
        icon: this.Heart,
        description: 'Committed to excellence and continuous improvement',
        color: 'text-red-600'
      }
    ];
  }

  /**
   * Process featured content for display
   */
  private processFeaturedContent(): void {
    // Sort and limit achievements
    this.featuredAchievements = this.achievements
      .sort((a, b) => {
        // Sort by type priority and date
        const typeOrder = this.getAchievementTypePriority(a.type) - this.getAchievementTypePriority(b.type);
        if (typeOrder !== 0) return typeOrder;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      })
      .slice(0, this.maxAchievementsToShow);

    // Sort and limit highlights
    this.topHighlights = this.highlights
      .sort((a, b) => {
        // Sort by priority level
        const priorityOrder = this.getPriorityLevelOrder(a.priorityLevel) - this.getPriorityLevelOrder(b.priorityLevel);
        if (priorityOrder !== 0) return priorityOrder;
        return a.title.localeCompare(b.title);
      })
      .slice(0, this.maxHighlightsToShow);
  }

  /**
   * Generate story highlights from available data
   */
  private generateStoryHighlights(): void {
    const currentEducation = this.education.find(edu => edu.status === 'ongoing') || this.education[0];

    this.storyHighlights = {
      currentRole: 'Full-Stack Developer & System Development and Business Information Systems Student',
      location: this.contactLocation.city && this.contactLocation.country
        ? `${this.contactLocation.city}, ${this.contactLocation.country}`
        : this.contactInfo.location || 'Iași, Romania',
      education: currentEducation
        ? `${currentEducation.degree} at ${currentEducation.institution}`
        : this.educationStats.specialization || 'System Development and Business Information Systems',
      passion: this.getPassionDescription(),
      goal: this.getGoalDescription(),
      experience: `${this.calculateExperienceYears()} years of learning and building`,
      specialization: this.educationStats.specialization || 'Full-stack development and modern web technologies'
    };
  }

  /**
   * Calculate experience years dynamically
   */
  private calculateExperienceYears(): string {
    const startYear = 2022; // When started learning programming
    const currentYear = new Date().getFullYear();
    const years = currentYear - startYear + 1;
    return years.toString();
  }

  /**
   * Get passion description from values/personality traits
   */
  private getPassionDescription(): string {
    if (this.values.length > 0) {
      const topValue = this.values.find(v => v.importanceLevel === ImportanceLevel.HIGH) || this.values[0];
      return `passionate about ${topValue.title.toLowerCase()} and continuous learning`;
    }
    return 'building modern web applications and solving complex technical challenges';
  }

  /**
   * Get goal description from achievements/education
   */
  private getGoalDescription(): string {
    const techAchievements = this.achievements.filter(a =>
      a.type === AchievementType.TECHNICAL || a.type === AchievementType.PROJECT
    );

    if (techAchievements.length > 0) {
      return 'creating innovative digital solutions that make a difference';
    }
    return 'building scalable applications and contributing to open source';
  }

  /**
   * Get achievement type priority for sorting
   */
  private getAchievementTypePriority(type: AchievementType): number {
    const priority = {
      [AchievementType.CERTIFICATION]: 1,
      [AchievementType.TECHNICAL]: 2,
      [AchievementType.PROJECT]: 3,
      [AchievementType.LEADERSHIP]: 4,
      [AchievementType.ACADEMIC]: 5,
      [AchievementType.PROFESSIONAL]: 6,
      [AchievementType.VOLUNTEER]: 7,
      [AchievementType.AWARD]: 8,
      [AchievementType.RECOGNITION]: 9,
      [AchievementType.RESEARCH]: 10,
      [AchievementType.PUBLICATION]: 11,
      [AchievementType.PATENT]: 12,
      [AchievementType.COMPETITION]: 13,
      [AchievementType.HOBBY]: 14
    };
    return priority[type] || 15;
  }

  /**
   * Get priority level order for sorting
   */
  private getPriorityLevelOrder(priority: any): number {
    if (priority === 'HIGH' || priority === ImportanceLevel.HIGH) return 1;
    if (priority === 'MEDIUM' || priority === ImportanceLevel.MEDIUM) return 2;
    if (priority === 'LOW' || priority === ImportanceLevel.LOW) return 3;
    return 4;
  }

  /**
   * Get icon for achievement type
   */
  getAchievementIcon(achievement: Achievement): any {
    if (typeof achievement.icon === 'string') {
      return this.iconHelperService.stringToLucide(achievement.icon);
    }
    return achievement.icon || this.Trophy;
  }

  /**
   * Get icon for highlight
   */
  getHighlightIcon(highlight: Highlight): any {
    if (typeof highlight.icon === 'string') {
      return this.iconHelperService.stringToLucide(highlight.icon);
    }
    return highlight.icon || this.Rocket;
  }

  /**
   * Get icon for value
   */
  getValueIcon(value: Value): any {
    if (typeof value.icon === 'string') {
      return this.iconHelperService.stringToLucide(value.icon);
    }
    return value.icon || this.Heart;
  }

  /**
   * Get icon for personality trait
   */
  getPersonalityTraitIcon(trait: PersonalityTrait): any {
    if (typeof trait.icon === 'string') {
      return this.iconHelperService.stringToLucide(trait.icon);
    }
    return trait.icon || this.Users;
  }

  /**
   * Get achievement type badge color
   */
  getAchievementTypeBadgeColor(type: AchievementType): string {
    const colors = {
      [AchievementType.CERTIFICATION]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      [AchievementType.TECHNICAL]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      [AchievementType.PROJECT]: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      [AchievementType.LEADERSHIP]: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      [AchievementType.ACADEMIC]: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
      [AchievementType.PROFESSIONAL]: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      [AchievementType.VOLUNTEER]: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
      [AchievementType.AWARD]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      [AchievementType.RECOGNITION]: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
      [AchievementType.RESEARCH]: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300',
      [AchievementType.PUBLICATION]: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
      [AchievementType.PATENT]: 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-300',
      [AchievementType.COMPETITION]: 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300',
      [AchievementType.HOBBY]: 'bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-300'
    };
    return colors[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }

  /**
   * Get highlight type badge color
   */
  getHighlightTypeBadgeColor(type: HighlightType): string {
    const colors = {
      [HighlightType.ACHIEVEMENT]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      [HighlightType.SKILL]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      [HighlightType.EXPERIENCE]: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      [HighlightType.RECOGNITION]: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
    };
    return colors[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }

  /**
   * Get importance level badge color
   */
  getImportanceBadgeColor(importance: ImportanceLevel): string {
    const colors = {
      [ImportanceLevel.HIGH]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      [ImportanceLevel.MEDIUM]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      [ImportanceLevel.LOW]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    };
    return colors[importance] || colors[ImportanceLevel.MEDIUM];
  }

  /**
   * Format achievement date
   */
  formatAchievementDate(date: string): string {
    try {
      const dateObj = new Date(date);
      return dateObj.getFullYear().toString();
    } catch {
      return date;
    }
  }

  /**
   * Get current academic year
   */
  getCurrentAcademicYear(): string {
    return this.educationStats.currentYear || '3rd';
  }

  /**
   * Get current technologies from additional context
   */
  getCurrentTechnologies(): { name: string; color: string }[] {
    if (!this.aboutData?.technologies) {
      return [
        { name: 'Angular', color: 'red' },
        { name: 'React & Next.js', color: 'blue' },
        { name: 'TypeScript', color: 'blue' },
        { name: 'JavaScript', color: 'yellow' },
        { name: 'C# & Java', color: 'purple' },
        { name: 'PostgreSQL', color: 'indigo' },
        { name: 'MongoDB', color: 'green' },
        { name: 'Prisma', color: 'indigo' }
      ];
    }

    return this.aboutData.technologies.slice(0, 8).map(tech => ({
      name: tech.name,
      color: this.getTechColorFromHex(tech.color)
    }));
  }

  /**
   * Convert hex color to color name for CSS classes
   */
  private getTechColorFromHex(hexColor: string): string {
    // Simple mapping - you might want to make this more sophisticated
    if (hexColor.includes('f') || hexColor.includes('F')) return 'red';
    if (hexColor.includes('0') || hexColor.includes('1')) return 'blue';
    if (hexColor.includes('2') || hexColor.includes('3')) return 'green';
    if (hexColor.includes('4') || hexColor.includes('5')) return 'yellow';
    if (hexColor.includes('6') || hexColor.includes('7')) return 'purple';
    if (hexColor.includes('8') || hexColor.includes('9')) return 'indigo';
    return 'blue';
  }

  /**
   * Get technology color classes
   */
  getTechColorClasses(color: string): string {
    const colorMap: { [key: string]: string } = {
      'red': 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200',
      'blue': 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
      'green': 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
      'purple': 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200',
      'yellow': 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
      'indigo': 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200'
    };
    return colorMap[color] || colorMap['blue'];
  }

  /**
   * Track by functions for performance
   */
  trackByStat(index: number, stat: ProcessedStat): string {
    return stat.label;
  }

  trackByAchievement(index: number, achievement: Achievement): string {
    return achievement.id;
  }

  trackByHighlight(index: number, highlight: Highlight): string {
    return highlight.id;
  }

  trackByValue(index: number, value: Value): string {
    return value.id;
  }

  trackByTechnology(index: number, tech: any): string {
    return tech.name;
  }

  trackByPersonalityTrait(index: number, trait: PersonalityTrait): string {
    return trait.id;
  }

  /**
   * Event handlers for analytics/navigation
   */
  onLearnMoreClick(): void {
    console.log('Navigate to detailed About page');
    // Analytics tracking could go here
    // Example: this.analytics.track('about_learn_more_clicked');
  }

  onViewProjectsClick(): void {
    console.log('Navigate to Projects page');
    // Analytics tracking could go here
    // Example: this.analytics.track('about_view_projects_clicked');
  }

  onStartConversationClick(): void {
    console.log('Navigate to Contact page');
    // Analytics tracking could go here
    // Example: this.analytics.track('about_start_conversation_clicked');
  }

  onAchievementClick(achievement: Achievement): void {
    console.log(`Achievement clicked: ${achievement.title}`);
    if (achievement.url) {
      window.open(achievement.url, '_blank');
    }
  }

  /**
   * Check if has data
   */
  hasAboutData(): boolean {
    return this.aboutData !== null;
  }

  /**
   * Get limited values for display
   */
  getDisplayedValues(): Value[] {
    return this.values
      .sort((a, b) => this.getPriorityLevelOrder(a.importanceLevel) - this.getPriorityLevelOrder(b.importanceLevel))
      .slice(0, this.maxValuesToShow);
  }

  /**
   * Get personality traits for display
   */
  getDisplayedPersonalityTraits(): PersonalityTrait[] {
    return this.personalityTraits.slice(0, 6); // Limit to 6 traits
  }

  /**
   * Default data methods
   */
  private getDefaultKeyStats(): KeyStats {
    return { technologies: 0, projects: 0, certificates: 0, educationYears: 0 };
  }

  private getDefaultEducationStats(): EducationStats {
    return { totalCourses: 0, currentYear: "0", specialization: "", focusAreas: [], languages: [] };
  }

  private getDefaultContactInfo(): ContactInfo {
    return { email: '', phone: '', location: '', github: '', linkedin: '' };
  }

  private getDefaultContactLocation(): ContactLocation {
    return { name: '', address: '', city: '', country: '', coordinates: { lat: 0, lng: 0 }, timezone: '', workingHours: '' };
  }
}