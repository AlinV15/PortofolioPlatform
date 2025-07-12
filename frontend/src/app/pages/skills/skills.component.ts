import { Component, OnInit, OnDestroy, HostListener, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import {
  LucideAngularModule,
  Code, Clock, Folder, Award, TrendingUp, Target, Star,
  Trophy, BookOpen, Home, Layers, Mail, Download, ArrowUp
} from 'lucide-angular';
import { SkillsHeroComponent } from '../../components/skills-hero/skills-hero.component';
import { Skill, SkillsCategoriesComponent } from '../../components/skills-categories/skills-categories.component';
import { TechnicalStackComponent, Technology } from '../../components/technical-stack/technical-stack.component';
import { Certification, CertificationsGridComponent } from '../../components/certifications-grid/certifications-grid.component';
import { SkillsTimelineComponent, TimelineMilestone } from '../../components/skills-timeline/skills-timeline.component';
import { PdfDownloadService } from '../../services/pdf-download.service';
import { HireMeComponent } from '../../components/hire-me/hire-me.component';
import { RouterModule } from '@angular/router';

// Import all skill components


export interface TopSkill {
  name: string;
  level: number;
  color: string;
}

export interface Achievement {
  title: string;
  date: string;
  type: 'certification' | 'project' | 'milestone';
}

export interface LearningProgress {
  skill: string;
  progress: number;
  color: string;
  targetDate: string;
}

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
  // Lucide Icons
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

  // Page state
  showBackToTop = false;
  activeSection = 'skills-hero';
  private isBrowser: boolean;
  private scrollTimeout?: number;

  // Page sections
  sections: PageSection[] = [
    { id: 'skills-hero', name: 'Overview' },
    { id: 'skills-categories', name: 'Categories' },
    { id: 'technical-stack', name: 'Technologies' },
    { id: 'certifications', name: 'Certifications' },
    { id: 'skills-timeline', name: 'Timeline' }
  ];

  // Summary statistics
  totalTechnologies = 15;
  yearsExperience = 3;
  totalProjects = 7;
  totalCertifications = 3;
  avgProficiency = 68;
  learningGoals = 3;

  // Data for child components
  allSkills: Skill[] = [];
  technologies: Technology[] = [];

  // Summary data
  topSkills: TopSkill[] = [
    { name: 'JavaScript', level: 75, color: '#F7DF1E' },
    { name: 'TypeScript', level: 70, color: '#3178C6' },
    { name: 'React', level: 65, color: '#61DAFB' },
    { name: 'Next.js', level: 70, color: '#000000' },
    { name: 'Problem Solving', level: 80, color: '#45B7D1' }
  ];

  recentAchievements: Achievement[] = [
    {
      title: 'Microsoft Dynamics AX Certification',
      date: 'January 2025',
      type: 'certification'
    },
    {
      title: 'Completed Restaurant Management App',
      date: 'December 2024',
      type: 'project'
    },
    {
      title: 'LEADERS Leadership Certificate',
      date: 'December 2023',
      type: 'certification'
    },
    {
      title: 'Built E-commerce Platform',
      date: 'November 2024',
      type: 'project'
    },
    {
      title: 'Started Enterprise Development',
      date: 'March 2024',
      type: 'milestone'
    }
  ];

  currentLearning: LearningProgress[] = [
    {
      skill: 'Angular Framework',
      progress: 65,
      color: '#DD0031',
      targetDate: 'April 2025'
    },
    {
      skill: 'Java Spring Boot',
      progress: 45,
      color: '#6DB33F',
      targetDate: 'June 2025'
    },
    {
      skill: 'Cloud Architecture',
      progress: 20,
      color: '#FF9900',
      targetDate: 'August 2025'
    }
  ];

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object, private pdfService: PdfDownloadService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }



  ngOnInit(): void {
    if (this.isBrowser) {
      this.initializePageSections();
      this.updateActiveSection();
    }
  }

  ngOnDestroy(): void {
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }
  }

  // Scroll event listener
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

  // Section management
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

  // Navigation methods
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

  // Event handlers from child components
  onExploreSkills(): void {
    this.scrollToSection('skills-categories');
  }

  onCategorySelected(categoryId: string): void {
    // First scroll to technical stack to show relevant technologies
    this.scrollToSection('technical-stack');

    // Optional: Trigger category filter in technical stack
    // This would require communication with the technical stack component
  }

  onCertificationSelected(certification: Certification): void {
    // Handle certification selection - could open modal or navigate to detail view
    console.log('Certification selected:', certification);

    // Example: Open certification in new tab if URL available
    if (certification.certificateUrl && certification.certificateUrl !== '#') {
      window.open(certification.certificateUrl, '_blank');
    }
  }

  onViewAllCertifications(): void {
    // Navigate to dedicated certifications page or show expanded view
    console.log('View all certifications requested');
    // this.router.navigate(['/certifications']);
  }

  onMilestoneSelected(milestone: TimelineMilestone): void {
    // Handle milestone selection - could show more details or highlight related skills
    console.log('Milestone selected:', milestone);
  }

  onViewFullJourney(): void {
    // Navigate to detailed journey page or show expanded timeline
    console.log('View full journey requested');
    // this.router.navigate(['/journey']);
  }

  // Call to action handlers
  onViewProjects(): void {
    console.log('View projects requested');
    // Navigate to projects page
    // this.router.navigate(['/projects']);

    // Or open external portfolio
    // window.open('https://github.com/AlinV15', '_blank');
  }

  onContactMe(): void {
    if (this.hireMeComponent) {
      this.hireMeComponent.openModal();
    }
  }

  onDownloadResume(): void {
    this.pdfService.downloadPDF("CV_English.pdf", "cv-ciobanu-alin-viorel.pdf")
  }

  // Data management methods
  getTopSkillsFromAllCategories(): TopSkill[] {
    // Extract top skills from all skills data
    return this.allSkills
      .sort((a, b) => b.level - a.level)
      .slice(0, 5)
      .map(skill => ({
        name: skill.name,
        level: skill.level,
        color: skill.color
      }));
  }

  getCurrentLearningProgress(): LearningProgress[] {
    // This could be dynamically calculated or fetched from an API
    return this.currentLearning;
  }

  getRecentAchievements(): Achievement[] {
    // This could be fetched from a service or API
    return this.recentAchievements.slice(0, 5);
  }

  // Statistics calculation methods
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
    // This could be fetched from certification service
    return this.totalCertifications;
  }

  // Track by functions for ngFor optimization
  trackBySkill(index: number, skill: TopSkill): string {
    return skill.name;
  }

  trackByAchievement(index: number, achievement: Achievement): string {
    return achievement.title + achievement.date;
  }

  trackByLearning(index: number, learning: LearningProgress): string {
    return learning.skill;
  }

  trackBySection(index: number, section: PageSection): string {
    return section.id;
  }

  // Utility methods
  getProgressPercentage(current: number, total: number): number {
    return total > 0 ? Math.round((current / total) * 100) : 0;
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  }

  // Page analytics methods (for future implementation)
  trackPageView(): void {
    // Track page view analytics
    // this.analytics.trackPageView('skills-page');
  }

  trackSectionView(sectionId: string): void {
    // Track section view analytics
    // this.analytics.trackEvent('section-view', { section: sectionId });
  }

  trackCTAClick(action: string): void {
    // Track call-to-action clicks
    // this.analytics.trackEvent('cta-click', { action });
  }

  // Responsive design helpers
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

  // Performance optimization methods
  shouldShowSection(sectionId: string): boolean {
    // Implement lazy loading logic if needed
    return true;
  }

  preloadImages(): void {
    // Preload any important images for better UX
    if (!this.isBrowser) return;

    interface PreloadImage {
      src: string;
    }

    const images: string[] = [
      // Add any important image URLs here
    ];

    images.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }

  // Error handling
  handleError(error: any, context: string): void {
    console.error(`Error in ${context}:`, error);
    // Implement proper error handling/reporting
  }

  // Accessibility improvements
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

  // Future enhancements placeholders
  exportSkillsData(): void {
    // Export skills data as JSON/PDF
    const skillsData = {
      skills: this.allSkills,
      technologies: this.technologies,
      achievements: this.recentAchievements,
      currentLearning: this.currentLearning,
      statistics: {
        totalTechnologies: this.totalTechnologies,
        avgProficiency: this.avgProficiency,
        yearsExperience: this.yearsExperience
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
    // Implement sharing functionality
    if (navigator.share) {
      navigator.share({
        title: 'Alin Ciobanu - Technical Skills',
        text: 'Check out my technical skills and experience',
        url: window.location.href
      });
    }
  }

  printSkillsSummary(): void {
    // Trigger print-friendly version
    window.print();
  }
}