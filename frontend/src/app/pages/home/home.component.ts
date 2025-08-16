import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil, tap, catchError, filter } from 'rxjs/operators';

import { HeroComponent } from '../../components/hero/hero.component';
import { ProjectsComponent } from '../../components/projects/projects.component';
import { SkillsComponent } from '../../components/skills/skills.component';
import { AboutComponent } from '../../components/about/about.component';
import { CallToActionComponent } from '../../components/call-to-action/call-to-action.component';

// Import the new DataService and interfaces
import {
  DataService,
  AllPortfolioData,
  LoadingStates,
  ErrorStates
} from '../../services/data.service';

// Keep existing interfaces for backward compatibility
import {
  Achievement,
  Highlight,
  KeyStats,
  Value,
  Hobby,
  FutureGoal,
  Interest,
  PersonalityTrait
} from '../../shared/models/personal.interface';
import { Project, FeaturedProject, ProjectsStats } from '../../shared/models/project.interface';
import {
  Education,
  CurrentLearning,
  LearningMilestone,
  LearningProgress,
  EducationStats,
  AcademicProject
} from '../../shared/models/education.interface';
import {
  Skill,
  TopSkill,
  FeaturedSkill,
  SkillCategory,
  SkillStats
} from '../../shared/models/skill.interface';
import { Technology, TechCategory, TechStats } from '../../shared/models/technology.interface';
import {
  TimelineItem,
  TimelineMilestone,
  TimelineStats
} from '../../shared/models/timeline.interface';
import {
  VolunteerExperience,
  VolunteerSkill,
  VolunteerStats
} from '../../shared/models/volunteer.interface';
import { ContactInfo, ContactLocation } from '../../shared/models/contact.interface';
import { Certificate, CertificateCategory, CertificateStats } from '../../shared/models/certificate.interface';
import { NavigationEnd, Router } from '@angular/router';

// Keep the existing HomePageData interface for compatibility
export interface HomePageData {
  // Personal data
  highlights: Highlight[];
  achievements: Achievement[];
  values: Value[];
  hobbies: Hobby[];
  futureGoals: FutureGoal[];
  interests: Interest[];
  personalityTraits: PersonalityTrait[];
  keyStats: KeyStats;

  // Projects data
  projects: Project[];
  featuredProjects: FeaturedProject[];
  projectStats: ProjectsStats;

  // Education data
  education: Education[];
  currentLearning: CurrentLearning[];
  learningMilestones: LearningMilestone[];
  learningProgress: LearningProgress[];
  educationStats: EducationStats;
  academicProjects: AcademicProject[];

  // Skills data
  skills: Skill[];
  topSkills: TopSkill[];
  featuredSkills: FeaturedSkill[];
  skillsCategories: SkillCategory[];
  skillsStats: SkillStats;

  // Technologies data
  technologies: Technology[];
  techCategories: TechCategory[];
  techStats: TechStats;

  // Timeline data
  timelineItems: TimelineItem[];
  timelineMilestones: TimelineMilestone[];
  timelineStats: TimelineStats;

  // Volunteer data
  volunteerExperiences: VolunteerExperience[];
  volunteerSkills: VolunteerSkill[];
  volunteerStats: VolunteerStats;

  // Contact data
  contactInfo: ContactInfo;
  contactLocation: ContactLocation;

  // Certificate data
  certificates: Certificate[];
  certificateCategories: CertificateCategory[];
  certificateStats: CertificateStats;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeroComponent,
    ProjectsComponent,
    SkillsComponent,
    AboutComponent,
    CallToActionComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // ========================
  // DATA STATE PROPERTIES
  // ========================

  // All data from DataService - this becomes the single source of truth
  allPortfolioData: AllPortfolioData | null = null;

  // Legacy homeData for backward compatibility with existing template
  homeData: HomePageData | null = null;

  // Loading and error states from DataService
  loadingStates: LoadingStates = {
    personal: false,
    projects: false,
    education: false,
    skills: false,
    technologies: false,
    timeline: false,
    volunteer: false,
    contact: false,
    certificates: false
  };

  errorStates: ErrorStates = {
    personal: null,
    projects: null,
    education: null,
    skills: null,
    technologies: null,
    timeline: null,
    volunteer: null,
    contact: null,
    certificates: null
  };

  // Computed properties for template
  hasDataError = false;
  isAnyDataLoading = false;

  constructor(
    private router: Router,
    private dataService: DataService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.initializeDataSubscriptions();
    this.loadAllHomeData();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      console.log('🔄 Route changed - reloading data');
      this.loadAllHomeData();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ========================
  // DATA LOADING METHODS
  // ========================

  /**
   * Initialize all data subscriptions from DataService
   */
  private initializeDataSubscriptions(): void {
    // Subscribe to all portfolio data
    this.dataService.getAllData()
      .pipe(
        takeUntil(this.destroy$),
        filter(data => data !== null),
        tap(data => {
          this.allPortfolioData = data;
          this.homeData = this.transformToLegacyFormat(data);
          this.hasDataError = false;
          this.cdr.markForCheck();
        }),
        catchError(error => {
          console.error('Error loading portfolio data:', error);
          this.hasDataError = true;
          this.cdr.markForCheck();
          throw error;
        })
      )
      .subscribe();

    // Subscribe to loading states
    this.dataService.getLoadingStates()
      .pipe(
        takeUntil(this.destroy$),
        tap(states => {
          this.loadingStates = states;
          this.isAnyDataLoading = Object.values(states).some(loading => loading);
          this.cdr.markForCheck();
        })
      )
      .subscribe();

    // Subscribe to error states
    this.dataService.getErrorStates()
      .pipe(
        takeUntil(this.destroy$),
        tap(states => {
          this.errorStates = states;
          this.hasDataError = Object.values(states).some(error => error !== null);
          this.cdr.markForCheck();
        })
      )
      .subscribe();

    // Subscribe to data loading status
    this.dataService.isAnyDataLoading()
      .pipe(
        takeUntil(this.destroy$),
        tap(loading => {
          this.isAnyDataLoading = loading;
          this.cdr.markForCheck();
        })
      )
      .subscribe();
  }

  /**
   * Load all home data using DataService
   */
  private loadAllHomeData(): void {
    console.log('Loading home page data using DataService...');

    this.dataService.loadAllData()
      .pipe(
        takeUntil(this.destroy$),
        tap(data => {
          console.log('✅ All home data loaded successfully via DataService');
          this.updateSEOWithData(data);
        }),
        catchError(error => {
          console.error('❌ Error loading home data via DataService:', error);
          this.hasDataError = true;
          this.cdr.markForCheck();
          throw error;
        })
      )
      .subscribe();
  }

  /**
   * Transform AllPortfolioData to legacy HomePageData format for existing templates
   */
  private transformToLegacyFormat(data: AllPortfolioData): HomePageData {
    return {
      // Personal data
      highlights: data.personal.highlights,
      achievements: data.personal.achievements,
      values: data.personal.values,
      hobbies: data.personal.hobbies,
      futureGoals: data.personal.futureGoals,
      interests: data.personal.interests,
      personalityTraits: data.personal.personalityTraits,
      keyStats: data.personal.keyStats,

      // Projects data
      projects: data.projects.projects,
      featuredProjects: data.projects.featuredProjects,
      projectStats: data.projects.projectStats,

      // Education data
      education: data.education.education,
      currentLearning: data.education.currentLearning,
      learningMilestones: data.education.learningMilestones,
      learningProgress: data.education.learningProgress,
      educationStats: data.education.educationStats,
      academicProjects: data.education.academicProjects,

      // Skills data
      skills: data.skills.skills,
      topSkills: data.skills.topSkills,
      featuredSkills: data.skills.featuredSkills,
      skillsCategories: data.skills.skillsCategories,
      skillsStats: data.skills.skillsStats,

      // Technologies data
      technologies: data.technologies.technologies,
      techCategories: data.technologies.techCategories,
      techStats: data.technologies.techStats,

      // Timeline data
      timelineItems: data.timeline.timelineItems,
      timelineMilestones: data.timeline.timelineMilestones,
      timelineStats: data.timeline.timelineStats,

      // Volunteer data
      volunteerExperiences: data.volunteer.experiences,
      volunteerSkills: data.volunteer.skills,
      volunteerStats: data.volunteer.stats,

      // Contact data
      contactInfo: data.contact.info,
      contactLocation: data.contact.location,

      // Certificate data
      certificates: data.certificates.certificates,
      certificateCategories: data.certificates.categories,
      certificateStats: data.certificates.stats
    };
  }

  // ========================
  // LEGACY GETTER METHODS (for backward compatibility with existing template)
  // ========================

  /**
   * Get personal data for template - maintains existing API
   */
  getPersonalData() {
    if (!this.allPortfolioData) {
      return {
        highlights: [],
        achievements: [],
        values: [],
        hobbies: [],
        futureGoals: [],
        interests: [],
        personalityTraits: [],
        keyStats: { technologies: 0, projects: 0, certificates: 0, educationYears: 0 }
      };
    }

    return {
      highlights: this.allPortfolioData.personal.highlights,
      achievements: this.allPortfolioData.personal.achievements,
      values: this.allPortfolioData.personal.values,
      hobbies: this.allPortfolioData.personal.hobbies,
      futureGoals: this.allPortfolioData.personal.futureGoals,
      interests: this.allPortfolioData.personal.interests,
      personalityTraits: this.allPortfolioData.personal.personalityTraits,
      keyStats: this.allPortfolioData.personal.keyStats
    };
  }

  /**
   * Get projects data for template - maintains existing API
   */
  getProjectsData() {
    if (!this.allPortfolioData) {
      return {
        projects: [],
        featuredProjects: [],
        projectStats: { technologies: 0, totalProjects: 0, liveProjects: 0 }
      };
    }

    return {
      projects: this.allPortfolioData.projects.projects,
      featuredProjects: this.allPortfolioData.projects.featuredProjects,
      projectStats: this.allPortfolioData.projects.projectStats
    };
  }

  /**
   * Get skills data for template - maintains existing API
   */
  getSkillsData() {
    if (!this.allPortfolioData) {
      return {
        skills: [],
        topSkills: [],
        featuredSkills: [],
        skillsCategories: [],
        skillsStats: {
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
        }
      };
    }

    return {
      skills: this.allPortfolioData.skills.skills,
      topSkills: this.allPortfolioData.skills.topSkills,
      featuredSkills: this.allPortfolioData.skills.featuredSkills,
      skillsCategories: this.allPortfolioData.skills.skillsCategories,
      skillsStats: this.allPortfolioData.skills.skillsStats
    };
  }

  /**
   * Get education data for template - maintains existing API
   */
  getEducationData() {
    if (!this.allPortfolioData) {
      return {
        education: [],
        currentLearning: [],
        learningMilestones: [],
        learningProgress: [],
        educationStats: { totalCourses: 0, currentYear: "0", specialization: "", focusAreas: [], languages: [] },
        academicProjects: []
      };
    }

    return {
      education: this.allPortfolioData.education.education,
      currentLearning: this.allPortfolioData.education.currentLearning,
      learningMilestones: this.allPortfolioData.education.learningMilestones,
      learningProgress: this.allPortfolioData.education.learningProgress,
      educationStats: this.allPortfolioData.education.educationStats,
      academicProjects: this.allPortfolioData.education.academicProjects
    };
  }

  /**
   * Get technologies data for template - maintains existing API
   */
  getTechnologiesData() {
    if (!this.allPortfolioData) {
      return {
        technologies: [],
        techCategories: [],
        techStats: {
          totalTechnologies: 0,
          trendingCount: 0,
          averagePopularityScore: 0,
          categoryDistribution: { distribution: new Map() },
          recentlyReleasedCount: 0,
          mostPopularCategory: "",
          trendingPercentage: 0
        }
      };
    }

    return {
      technologies: this.allPortfolioData.technologies.technologies,
      techCategories: this.allPortfolioData.technologies.techCategories,
      techStats: this.allPortfolioData.technologies.techStats
    };
  }


  // ========================
  // SEO AND UTILITY METHODS
  // ========================

  /**
   * Update SEO with data - enhanced version
   */
  private updateSEOWithData(data: AllPortfolioData): void {
    if (!data.projects.projects.length) return;

    const projectCount = data.projects.projects.length;
    const technologies = data.projects.technologies.slice(0, 5).join(', ');
    const totalSkills = data.skills.skills.length;
    const totalCerts = data.certificates.certificates.length;

    // You can implement SEO updates here
    console.log(`SEO Update: ${projectCount} projects, ${totalSkills} skills, ${totalCerts} certificates`);
    console.log(`Top technologies: ${technologies}`);
  }

  /**
   * Utility: Check if specific section is loading
   */
  isSectionLoading(section: keyof LoadingStates): boolean {
    return this.loadingStates[section];
  }

  /**
   * Utility: Check if specific section has error
   */
  getSectionError(section: keyof ErrorStates): string | null {
    return this.errorStates[section];
  }

  /**
   * Utility: Get loading progress percentage
   */
  getLoadingProgress() {
    return this.dataService.getLoadingProgress();
  }

  /**
   * Utility: Retry loading specific section
   */
  retrySection(section: keyof AllPortfolioData): void {
    this.dataService.refreshSection(section).subscribe({
      next: () => console.log(`✅ ${section} section refreshed successfully`),
      error: (error) => console.error(`❌ Error refreshing ${section}:`, error)
    });
  }

  /**
   * Utility: Force refresh all data
   */
  forceRefreshAll(): void {
    this.dataService.forceRefreshAll().subscribe({
      next: () => console.log('✅ All data force refreshed successfully'),
      error: (error) => console.error('❌ Error force refreshing all data:', error)
    });
  }



  // ========================
  // LEGACY METHODS (maintained for compatibility)
  // ========================

  /**
   * Legacy method - maintained for compatibility
   */
  isProduction(): boolean {
    return false; // Replace with actual environment check
  }

  /**
   * Legacy scroll to top method
   */
  scrollToTop(): void {
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    }
  }

  // ========================
  // DATA MONITORING METHODS (new capabilities)
  // ========================



  /**
   * Check if all critical data is loaded
   */
  isCriticalDataLoaded(): boolean {
    return !!(
      this.allPortfolioData?.personal.keyStats &&
      this.allPortfolioData?.projects.projects.length > 0 &&
      this.allPortfolioData?.skills.skills.length > 0
    );
  }

  /**
   * Get data completeness percentage
   */
  getDataCompleteness(): number {
    if (!this.allPortfolioData) return 0;

    const sections = [
      this.allPortfolioData.personal.highlights.length > 0,
      this.allPortfolioData.projects.projects.length > 0,
      this.allPortfolioData.skills.skills.length > 0,
      this.allPortfolioData.technologies.technologies.length > 0,
      this.allPortfolioData.certificates.certificates.length > 0,
      this.allPortfolioData.education.education.length > 0,
      this.allPortfolioData.volunteer.experiences.length > 0,
      !!this.allPortfolioData.contact.info.email,
      this.allPortfolioData.timeline.timelineItems.length > 0
    ];

    const completeSections = sections.filter(Boolean).length;
    return Math.round((completeSections / sections.length) * 100);
  }
}