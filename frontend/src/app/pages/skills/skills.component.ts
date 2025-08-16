import { Component, OnInit, OnDestroy, HostListener, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import {
  LucideAngularModule,
  Code, Clock, Folder, Award, TrendingUp, Target, Star,
  Trophy, BookOpen, Home, Layers, Mail, Download, ArrowUp
} from 'lucide-angular';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

// Components
import { SkillsHeroComponent } from '../../components/skills-hero/skills-hero.component';
import { SkillsCategoriesComponent } from '../../components/skills-categories/skills-categories.component';
import { TechnicalStackComponent } from '../../components/technical-stack/technical-stack.component';
import { CertificationsGridComponent } from '../../components/certifications-grid/certifications-grid.component';
import { SkillsTimelineComponent } from '../../components/skills-timeline/skills-timeline.component';
import { HireMeComponent } from '../../components/hire-me/hire-me.component';
import { RouterModule } from '@angular/router';

// UPDATED: Replace individual services with DataService
import { DataService } from '../../services/data.service';
import { PdfDownloadService } from '../../services/pdf-download.service';

// Models and Interfaces - keep existing imports
import { Skill, SkillCategory, SkillStats, TopSkill, FeaturedSkill } from '../../shared/models/skill.interface';
import { Technology, TechStats, TechCategory } from '../../shared/models/technology.interface';
import { Certificate, CertificateStats, CertificateCategory } from '../../shared/models/certificate.interface';
import { CurrentLearning, LearningProgress, AcademicProject } from '../../shared/models/education.interface';
import { Achievement, FutureGoal } from '../../shared/models/personal.interface';
import { TimelineMilestone, TimelineStats } from '../../shared/models/timeline.interface';

export interface PageSection {
  id: string;
  name: string;
  element?: HTMLElement;
}

@Component({
  selector: 'app-skills-page',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    SkillsHeroComponent,
    SkillsCategoriesComponent,
    TechnicalStackComponent,
    CertificationsGridComponent,
    SkillsTimelineComponent,
    HireMeComponent,
    RouterModule
  ],
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css']
})
export class SkillsComponent implements OnInit, OnDestroy {

  @ViewChild(HireMeComponent) hireMeComponent!: HireMeComponent;

  private destroy$ = new Subject<void>();

  // Lucide Icons - keep existing
  readonly codeIcon = Code;
  readonly clockIcon = Clock;
  readonly folderIcon = Folder;
  readonly awardIcon = Award;
  readonly trendingUpIcon = TrendingUp;
  readonly targetIcon = Target;
  readonly starIcon = Star;
  readonly trophyIcon = Trophy;
  readonly bookOpenIcon = BookOpen;
  readonly homeIcon = Home;
  readonly layersIcon = Layers;
  readonly mailIcon = Mail;
  readonly downloadIcon = Download;
  readonly arrowUpIcon = ArrowUp;

  // Page state - keep existing
  showBackToTop = false;
  activeSection = 'skills-hero';
  private isBrowser: boolean;
  private scrollTimeout?: number;

  // Page sections - keep existing
  sections: PageSection[] = [
    { id: 'skills-hero', name: 'Overview' },
    { id: 'skills-categories', name: 'Categories' },
    { id: 'technical-stack', name: 'Technologies' },
    { id: 'certifications', name: 'Certifications' },
    { id: 'skills-timeline', name: 'Timeline' }
  ];

  // Skills Data - keep existing properties with same defaults
  allSkills: Skill[] = [];
  topSkills: TopSkill[] = [];
  featuredSkills: FeaturedSkill[] = [];
  skillsCategories: SkillCategory[] = [];
  skillsStats: SkillStats = {
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

  // Technologies Data - keep existing
  technologies: Technology[] = [];
  techCategories: TechCategory[] = [];
  techStats: TechStats = {
    totalTechnologies: 0,
    trendingCount: 0,
    averagePopularityScore: 0,
    categoryDistribution: {
      distribution: new Map<string, number>()
    },
    recentlyReleasedCount: 0,
    mostPopularCategory: "",
    trendingPercentage: 0
  };

  // Certificates Data - keep existing
  certificates: Certificate[] = [];
  certificateCategories: CertificateCategory[] = [];
  certificateStats: CertificateStats = {
    totalCertificates: 0,
    verifiedCount: 0,
    averageRelevanceScore: 0,
    providerDistribution: new Map<string, number>(),
    expiringCount: 0,
    featuredCount: 0,
    highRelevanceCount: 0,
    featuredPercentage: 0,
    verificationRate: 0,
    topProvider: ""
  };

  // Education Data - keep existing
  currentLearningHero: CurrentLearning[] = [];
  learningProgress: LearningProgress[] = [];
  academicProjects: AcademicProject[] = [];

  // Personal Data - keep existing
  recentAchievements: Achievement[] = [];
  futureGoal: FutureGoal[] = [];

  // Timeline Data - keep existing
  timelineMilestones: TimelineMilestone[] = [];
  timelineStats: TimelineStats = {
    "Major Milestones": "0",
    " Achievements": "0"
  };

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private pdfService: PdfDownloadService,
    // UPDATED: Replace all individual services with DataService
    private dataService: DataService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    // UPDATED: Replace loadAllData with DataService
    this.loadAllDataFromDataService();

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      console.log('🔄 Route changed - reloading data');
      this.loadAllDataFromDataService();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }
  }

  /**
   * UPDATED: Load all required data from DataService instead of individual services
   */
  private loadAllDataFromDataService(): void {
    // Load all data from DataService
    this.dataService.loadAllData()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (allData) => {
          // Skills Data
          this.allSkills = allData.skills.skills;
          this.topSkills = allData.skills.topSkills;
          this.featuredSkills = allData.skills.featuredSkills;
          this.skillsCategories = allData.skills.skillsCategories;
          this.skillsStats = allData.skills.skillsStats;

          // Technologies Data
          this.technologies = allData.technologies.technologies;
          this.techCategories = allData.technologies.techCategories;
          this.techStats = allData.technologies.techStats;

          // Certificates Data
          this.certificates = allData.certificates.certificates;
          this.certificateCategories = allData.certificates.categories;
          this.certificateStats = allData.certificates.stats;

          // Education Data
          this.currentLearningHero = allData.education.currentLearning;
          this.learningProgress = allData.education.learningProgress;
          this.academicProjects = allData.education.academicProjects;

          // Personal Data
          this.recentAchievements = allData.personal.achievements.slice(0, 5); // Get recent achievements
          this.futureGoal = allData.personal.futureGoals;

          // Timeline Data
          this.timelineMilestones = allData.timeline.timelineMilestones;
          this.timelineStats = allData.timeline.timelineStats;

          console.log('✅ All skills page data loaded from DataService');
        },
        error: (error) => {
          console.error('❌ Error loading skills data from DataService:', error);
        }
      });
  }

  // Keep all existing methods unchanged - just the data loading strategy changed above

  // Scroll event listener - UNCHANGED
  @HostListener('window:scroll', ['$event'])
  onWindowScroll(): void {
    if (!this.isBrowser) return;

    // Show/hide back to top button
    this.showBackToTop = window.pageYOffset > 300;

    // Update active section with debouncing
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }

    this.scrollTimeout = window.setTimeout(() => {
      this.updateActiveSection();
    }, 100);
  }

  // Section management - UNCHANGED
  private initializePageSections(): void {
    this.sections.forEach(section => {
      const element = document.getElementById(section.id);
      if (element) {
        section.element = element;
      }
    });
  }

  private updateActiveSection(): void {
    if (!this.isBrowser) return;

    const scrollPosition = window.pageYOffset + 100; // Offset for better UX

    // Find the section that's currently in view
    for (let i = this.sections.length - 1; i >= 0; i--) {
      const section = this.sections[i];
      if (section.element) {
        const offsetTop = section.element.offsetTop;
        if (scrollPosition >= offsetTop) {
          this.activeSection = section.id;
          break;
        }
      }
    }
  }

  // Navigation methods - UNCHANGED
  scrollToSection(sectionId: string): void {
    if (!this.isBrowser) return;

    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80; // Account for fixed header
      const elementPosition = element.offsetTop;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }

  scrollToTop(): void {
    if (!this.isBrowser) return;

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  // Event handlers from child components - UNCHANGED
  onExploreSkills(): void {
    this.scrollToSection('skills-categories');
  }

  onTechClick(technology: Technology): void {
    console.log('Technology clicked:', technology);
    // Could show technology details or filter related content
  }

  onViewAllCertifications(): void {
    console.log('View all certifications requested');
    // Could navigate to dedicated certifications page
  }

  onMilestoneSelected(milestone: TimelineMilestone): void {
    console.log('Milestone selected:', milestone);
  }

  onViewFullJourney(): void {
    console.log('View full journey requested');
    // Could navigate to detailed timeline page
  }

  // Call to action handlers - UNCHANGED
  onViewProjects(): void {
    console.log('View projects requested');
    // Navigate to projects page when implemented
  }

  onContactMe(): void {
    if (this.hireMeComponent) {
      this.hireMeComponent.openModal();
    }
  }

  onDownloadResume(): void {
    this.pdfService.downloadPDF("CV_English.pdf", "cv-ciobanu-alin-viorel.pdf");
  }

  // Data management methods for child components - UNCHANGED
  getTopSkillsFromAllCategories(): TopSkill[] {
    return this.topSkills.slice(0, 5);
  }

  getCurrentLearningProgress(): LearningProgress[] {
    return this.learningProgress;
  }

  getRecentAchievements(): Achievement[] {
    return this.recentAchievements;
  }

  getFeaturedCertifications(): Certificate[] {
    return this.certificates.filter(cert => cert.featured);
  }

  getRecentMilestones(): TimelineMilestone[] {
    return this.timelineMilestones.slice(0, 6);
  }

  // Statistics calculation methods - UNCHANGED
  calculateTotalTechnologies(): number {
    return this.technologies.length;
  }

  calculateAvgProficiency(): number {
    if (this.allSkills.length === 0) return 0;
    const total = this.allSkills.reduce((sum, skill) => sum + skill.level, 0);
    return Math.round(total / this.allSkills.length);
  }

  getActiveSkillsCount(): number {
    return this.allSkills.filter(skill => skill.level > 0).length;
  }

  getCertificationsCount(): number {
    return this.certificates.length;
  }

  getTotalProjectsCount(): number {
    return this.academicProjects.length;
  }

  // Track by functions for ngFor optimization - UNCHANGED
  trackBySkill(index: number, skill: TopSkill): string {
    return skill.name;
  }

  trackByAchievement(index: number, achievement: Achievement): string {
    return achievement.id;
  }

  trackByLearning(index: number, learning: LearningProgress): string {
    return learning.id;
  }

  trackBySection(index: number, section: PageSection): string {
    return section.id;
  }

  trackByCertificate(index: number, certificate: Certificate): string {
    return certificate.id;
  }

  trackByMilestone(index: number, milestone: TimelineMilestone): string {
    return milestone.id;
  }

  // Utility methods - UNCHANGED
  getProgressPercentage(current: number, total: number): number {
    return total > 0 ? Math.round((current / total) * 100) : 0;
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  }

  // Responsive design helpers - UNCHANGED
  isMobile(): boolean {
    if (!this.isBrowser) return false;
    return window.innerWidth < 768;
  }

  isTablet(): boolean {
    if (!this.isBrowser) return false;
    return window.innerWidth >= 768 && window.innerWidth < 1024;
  }

  isDesktop(): boolean {
    if (!this.isBrowser) return false;
    return window.innerWidth >= 1024;
  }

  // Error handling - UNCHANGED
  handleError(error: any, context: string): void {
    console.error(`Error in ${context}:`, error);
  }

  // Accessibility improvements - UNCHANGED
  announcePageChange(message: string): void {
    if (!this.isBrowser) return;

    // Create or update aria-live region for screen readers
    let announcer = document.getElementById('page-announcer');
    if (!announcer) {
      announcer = document.createElement('div');
      announcer.id = 'page-announcer';
      announcer.setAttribute('aria-live', 'polite');
      announcer.setAttribute('aria-atomic', 'true');
      announcer.style.position = 'absolute';
      announcer.style.left = '-9999px';
      document.body.appendChild(announcer);
    }

    announcer.textContent = message;
  }

  // Export functionality - UNCHANGED
  exportSkillsData(): void {
    const skillsData = {
      skills: this.allSkills,
      technologies: this.technologies,
      certificates: this.certificates,
      achievements: this.recentAchievements,
      currentLearning: this.currentLearningHero,
      statistics: {
        totalTechnologies: this.calculateTotalTechnologies(),
        avgProficiency: this.calculateAvgProficiency(),
        totalCertifications: this.getCertificationsCount(),
        totalProjects: this.getTotalProjectsCount()
      },
      exportDate: new Date().toISOString()
    };

    // Download as JSON
    const dataStr = JSON.stringify(skillsData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'skills-data.json';
    link.click();
    URL.revokeObjectURL(url);
  }

  shareSkillsPage(): void {
    if (navigator.share) {
      navigator.share({
        title: 'Alin Ciobanu - Technical Skills',
        text: 'Check out my technical skills and experience',
        url: window.location.href
      });
    }
  }

  printSkillsSummary(): void {
    window.print();
  }
}