import { of, throwError } from 'rxjs';

// Import real interfaces from your codebase
import { Skill, SkillCategory, SkillStats, TopSkill, FeaturedSkill } from '../../shared/models/skill.interface';
import { Technology, TechStats, TechCategory } from '../../shared/models/technology.interface';
import { Certificate, CertificateStats, CertificateCategory } from '../../shared/models/certificate.interface';
import { CurrentLearning, LearningProgress, AcademicProject } from '../../shared/models/education.interface';
import { Achievement, FutureGoal } from '../../shared/models/personal.interface';
import { TimelineMilestone, TimelineStats } from '../../shared/models/timeline.interface';
import { ProficiencyLevel } from '../../shared/enums/ProficiencyLevel';
import { AchievementType } from '../../shared/enums/AchievementType';
import { LearningStatus } from '../../shared/enums/LearningStatus';
import { GoalPriority } from '../../shared/enums/GoalPriority';
import { ImportanceLevel } from '../../shared/enums/ImportanceLevel';
import { RecognitionLevel } from '../../shared/enums/RecognitionLevel';
import { Icons } from '../../shared/enums/Icons';

interface PageSection {
  id: string;
  name: string;
  element?: HTMLElement;
}

interface HireMeComponent {
  openModal: jest.Mock;
}

// Mock class that replicates SkillsComponent logic without Angular decorators
class MockSkillsComponent {
  // Properties from original component
  private destroy$ = { next: jest.fn(), complete: jest.fn() };

  showBackToTop = false;
  activeSection = 'skills-hero';
  private isBrowser: boolean = true;
  private scrollTimeout?: number;

  sections: PageSection[] = [
    { id: 'skills-hero', name: 'Overview' },
    { id: 'skills-categories', name: 'Categories' },
    { id: 'technical-stack', name: 'Technologies' },
    { id: 'certifications', name: 'Certifications' },
    { id: 'skills-timeline', name: 'Timeline' }
  ];

  // Skills Data
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

  // Technologies Data
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

  // Certificates Data
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

  // Education Data
  currentLearningHero: CurrentLearning[] = [];
  learningProgress: LearningProgress[] = [];
  academicProjects: AcademicProject[] = [];

  // Personal Data
  recentAchievements: Achievement[] = [];
  futureGoal: FutureGoal[] = [];

  // Timeline Data
  timelineMilestones: TimelineMilestone[] = [];
  timelineStats: TimelineStats = {
    "Major Milestones": "0",
    " Achievements": "0"
  };

  hireMeComponent: HireMeComponent | null = null;

  constructor(
    private router: any,
    private platformId: any,
    private pdfService: any,
    private dataService: any
  ) { }

  // Data loading method - pure logic without Angular lifecycle
  loadAllDataFromDataService(): void {
    this.dataService.loadAllData().subscribe({
      next: (allData: any) => {
        this.allSkills = allData.skills.skills;
        this.topSkills = allData.skills.topSkills;
        this.featuredSkills = allData.skills.featuredSkills;
        this.skillsCategories = allData.skills.skillsCategories;
        this.skillsStats = allData.skills.skillsStats;

        this.technologies = allData.technologies.technologies;
        this.techCategories = allData.technologies.techCategories;
        this.techStats = allData.technologies.techStats;

        this.certificates = allData.certificates.certificates;
        this.certificateCategories = allData.certificates.categories;
        this.certificateStats = allData.certificates.stats;

        this.currentLearningHero = allData.education.currentLearning;
        this.learningProgress = allData.education.learningProgress;
        this.academicProjects = allData.education.academicProjects;

        this.recentAchievements = allData.personal.achievements.slice(0, 5);
        this.futureGoal = allData.personal.futureGoals;

        this.timelineMilestones = allData.timeline.timelineMilestones;
        this.timelineStats = allData.timeline.timelineStats;
      },
      error: (error: any) => {
        console.error('Error loading skills data from DataService:', error);
      }
    });
  }

  // Scroll event handler logic (without @HostListener)
  onWindowScroll(): void {
    if (!this.isBrowser) return;

    const mockWindow = (global as any).mockWindow || { pageYOffset: 0 };
    this.showBackToTop = mockWindow.pageYOffset > 300;

    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }

    this.scrollTimeout = window.setTimeout(() => {
      this.updateActiveSection();
    }, 100);
  }

  private updateActiveSection(): void {
    if (!this.isBrowser) return;

    const mockWindow = (global as any).mockWindow || { pageYOffset: 0 };
    const scrollPosition = mockWindow.pageYOffset + 100;

    for (let i = this.sections.length - 1; i >= 0; i--) {
      const section = this.sections[i];
      if (section.element) {
        const offsetTop = section.element.offsetTop || 0;
        if (scrollPosition >= offsetTop) {
          this.activeSection = section.id;
          break;
        }
      }
    }
  }

  // Navigation methods - pure logic
  scrollToSection(sectionId: string): void {
    if (!this.isBrowser) return;
    // Simulate scrolling behavior
    const targetSection = this.sections.find(s => s.id === sectionId);
    if (targetSection) {
      this.activeSection = sectionId;
    }
  }

  scrollToTop(): void {
    if (!this.isBrowser) return;
    this.activeSection = 'skills-hero';
  }

  // Event handlers from child components
  onExploreSkills(): void {
    this.scrollToSection('skills-categories');
  }

  onTechClick(technology: Technology): Technology {
    // Mock implementation - could trigger filters or navigation
    return technology;
  }

  onViewAllCertifications(): string {
    // Mock implementation - could navigate to certifications page
    return 'certifications-page';
  }

  onMilestoneSelected(milestone: TimelineMilestone): TimelineMilestone {
    // Mock implementation - could show milestone details
    return milestone;
  }

  onViewFullJourney(): string {
    // Mock implementation - could navigate to timeline page
    return 'timeline-page';
  }

  onViewProjects(): string {
    // Mock implementation - could navigate to projects page
    return 'projects-page';
  }

  onContactMe(): void {
    if (this.hireMeComponent) {
      this.hireMeComponent.openModal();
    }
  }

  onDownloadResume(): void {
    this.pdfService.downloadPDF("CV_English.pdf", "cv-ciobanu-alin-viorel.pdf");
  }

  // Data management methods for child components
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
    return this.certificates.length;
  }

  getTotalProjectsCount(): number {
    return this.academicProjects.length;
  }

  // Track by functions for ngFor optimization
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

  // Responsive design helpers
  isMobile(): boolean {
    if (!this.isBrowser) return false;
    const mockWindow = (global as any).mockWindow || { innerWidth: 1024 };
    return mockWindow.innerWidth < 768;
  }

  isTablet(): boolean {
    if (!this.isBrowser) return false;
    const mockWindow = (global as any).mockWindow || { innerWidth: 1024 };
    return mockWindow.innerWidth >= 768 && mockWindow.innerWidth < 1024;
  }

  isDesktop(): boolean {
    if (!this.isBrowser) return false;
    const mockWindow = (global as any).mockWindow || { innerWidth: 1024 };
    return mockWindow.innerWidth >= 1024;
  }

  handleError(error: any, context: string): void {
    console.error(`Error in ${context}:`, error);
  }

  announcePageChange(message: string): void {
    if (!this.isBrowser) return;
    // Mock accessibility announcement
  }

  exportSkillsData(): any {
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
    return skillsData;
  }

  shareSkillsPage(): string {
    return window.location?.href || 'mock-url';
  }

  printSkillsSummary(): void {
    // Mock print functionality
  }
}

// Mock data based on real interfaces
const createMockSkill = (id: string, name: string, level: number): Skill => ({
  id,
  name,
  level,
  proficiency: ProficiencyLevel.ADVANCED,
  description: `Description for ${name}`,
  yearsOfExperience: 3,
  projects: 5,
  color: '#3B82F6',
  category: 'Frontend'
});

const createMockTopSkill = (name: string, level: number): TopSkill => ({
  name,
  level,
  color: '#3B82F6',
  category: 'Frontend',
  proficiency: ProficiencyLevel.ADVANCED,
  projects: 5
});

const createMockTechnology = (id: string, name: string): Technology => ({
  id,
  name,
  category: 'Frontend',
  proficiency: ProficiencyLevel.ADVANCED,
  level: 85,
  yearsOfExperience: 3,
  projects: 5,
  description: `Description for ${name}`,
  icon: Icons.CODE,
  color: '#3B82F6',
  backgroundColor: '#EBF4FF',
  features: ['Feature 1', 'Feature 2'],
  trending: true,
  certification: true,
  learning: false
});

const createMockCertificate = (id: string, name: string, featured: boolean = false): Certificate => ({
  id,
  name,
  issuer: 'Test Provider',
  date: '2024-01-01',
  certificateId: 'CERT-123',
  description: `Description for ${name}`,
  skillsGained: ['Skill 1', 'Skill 2'],
  categoryName: 'Web Development',
  icon: Icons.AWARD,
  primaryColor: '#3B82F6',
  secondaryColor: '#93C5FD',
  verified: true,
  featured
});

const createMockAchievement = (id: string, title: string): Achievement => ({
  id,
  title,
  description: `Description for ${title}`,
  date: '2024-01-01',
  type: AchievementType.CERTIFICATION,
  icon: Icons.AWARD,
  primaryColor: '#F59E0B',
  secondaryColor: '#FCD34D',
  recognitionLevel: RecognitionLevel.INSTITUTIONAL,
  url: 'https://example.com',
  skillsGained: ['Skill 1', 'Skill 2'],
  issuer: 'Test Issuer'
});

const createMockLearningProgress = (id: string, name: string): LearningProgress => ({
  id,
  name,
  progress: 75,
  color: '#10B981',
  timeSpent: 40,
  description: `Description for ${name}`
});

const createMockTimelineMilestone = (id: string, title: string): TimelineMilestone => ({
  id,
  title,
  year: '2024',
  category: 'Education',
  description: `Description for ${title}`,
  icon: Icons.GRADUATION_cAP,
  primaryColor: '#8B5CF6',
  secondaryColor: '#C4B5FD',
  isActive: true,
  importance: ImportanceLevel.HIGH,
  duration: '6 months',
  technologies: ['React', 'TypeScript']
});

const createMockCurrentLearning = (id: string, title: string): CurrentLearning => ({
  id,
  title,
  status: LearningStatus.IN_PROGRESS,
  progress: 60,
  color: '#06B6D4',
  icon: Icons.GRADUATION_cAP,
  description: `Description for ${title}`
});

const createMockAcademicProject = (id: string, title: string): AcademicProject => ({
  id,
  title,
  courseName: 'Test Course',
  description: `Description for ${title}`,
  technologies: ['React', 'TypeScript'],
  duration: 3,
  type: 'Web Application',
  githubLink: 'https://github.com/test/repo',
  icon: Icons.CODE,
  primaryColor: '#EF4444',
  secondaryColor: '#FCA5A5'
});

const createMockFutureGoal = (id: string, title: string): FutureGoal => ({
  id,
  title,
  description: `Description for ${title}`,
  color: '#8B5CF6',
  icon: Icons.TARGET,
  targetDate: 'Dec 2024',
  priority: GoalPriority.HIGH,
  gradient: 'linear-gradient(135deg, #8B5CF6, #C4B5FD)',
  progress: 30,
  milestones: [
    { description: 'First milestone', completed: true, targetDate: 'Nov 2024' },
    { description: 'Second milestone', completed: false, targetDate: 'Dec 2024' }
  ]
});

// Mock data objects
const mockSkills: Skill[] = [
  createMockSkill('1', 'React', 90),
  createMockSkill('2', 'TypeScript', 85),
  createMockSkill('3', 'Angular', 80)
];

const mockTopSkills: TopSkill[] = [
  createMockTopSkill('React', 90),
  createMockTopSkill('TypeScript', 85)
];

const mockTechnologies: Technology[] = [
  createMockTechnology('1', 'React'),
  createMockTechnology('2', 'Vue.js'),
  createMockTechnology('3', 'Angular')
];

const mockCertificates: Certificate[] = [
  createMockCertificate('1', 'AWS Certified', true),
  createMockCertificate('2', 'Google Cloud Professional', false),
  createMockCertificate('3', 'Microsoft Azure', true)
];

const mockAchievements: Achievement[] = [
  createMockAchievement('1', 'First Achievement'),
  createMockAchievement('2', 'Second Achievement')
];

const mockAllData = {
  skills: {
    skills: mockSkills,
    topSkills: mockTopSkills,
    featuredSkills: [],
    skillsCategories: [],
    skillsStats: {
      description: "Full-stack developer",
      projectsText: "20+ projects",
      technologiesText: "15+ technologies",
      yearsCoding: "5",
      projects: "20",
      certifications: "8",
      avgProficiency: "85",
      yearsCodingLabel: "Years Coding",
      projectsLabel: "Projects",
      certificationsLabel: "Certifications",
      avgProficiencyLabel: "Avg Proficiency"
    }
  },
  technologies: {
    technologies: mockTechnologies,
    techCategories: [],
    techStats: {
      totalTechnologies: 3,
      trendingCount: 2,
      averagePopularityScore: 85,
      categoryDistribution: { distribution: new Map([['Frontend', 3]]) },
      recentlyReleasedCount: 1,
      mostPopularCategory: 'Frontend',
      trendingPercentage: 67
    }
  },
  certificates: {
    certificates: mockCertificates,
    categories: [],
    stats: {
      totalCertificates: 3,
      verifiedCount: 3,
      averageRelevanceScore: 90,
      providerDistribution: new Map([['AWS', 1], ['Google', 1], ['Microsoft', 1]]),
      expiringCount: 0,
      featuredCount: 2,
      highRelevanceCount: 3,
      featuredPercentage: 67,
      verificationRate: 100,
      topProvider: 'AWS'
    }
  },
  education: {
    currentLearning: [createMockCurrentLearning('1', 'Advanced React')],
    learningProgress: [createMockLearningProgress('1', 'Machine Learning')],
    academicProjects: [createMockAcademicProject('1', 'E-commerce Platform')]
  },
  personal: {
    achievements: mockAchievements,
    futureGoals: [createMockFutureGoal('1', 'Master AI/ML')]
  },
  timeline: {
    timelineMilestones: [createMockTimelineMilestone('1', 'Started Programming')],
    timelineStats: {
      "Major Milestones": "5",
      " Achievements": "10"
    }
  }
};

describe('SkillsComponent Logic Tests', () => {
  let component: MockSkillsComponent;
  let mockRouter: any;
  let mockPdfService: any;
  let mockDataService: any;
  let mockCdr: any;
  let mockWindow: any;

  beforeEach(() => {
    // Setup services with jest.fn()
    mockRouter = {
      events: of({ constructor: { name: 'NavigationEnd' } })
    };

    mockPdfService = {
      downloadPDF: jest.fn()
    };

    mockDataService = {
      loadAllData: jest.fn().mockReturnValue(of(mockAllData))
    };

    mockCdr = {
      markForCheck: jest.fn()
    };

    // Setup browser APIs
    mockWindow = {
      pageYOffset: 0,
      innerWidth: 1024,
      document: { body: { style: { overflow: '' } } }
    };
    (global as any).mockWindow = mockWindow;

    // Create component instance
    component = new MockSkillsComponent(
      mockRouter,
      'browser',
      mockPdfService,
      mockDataService
    );
  });

  afterEach(() => {
    delete (global as any).mockWindow;
  });

  it('should load all data correctly from DataService', () => {
    component.loadAllDataFromDataService();

    expect(mockDataService.loadAllData).toHaveBeenCalled();
    expect(component.allSkills).toHaveLength(3);
    expect(component.technologies).toHaveLength(3);
    expect(component.certificates).toHaveLength(3);
  });

  it('should handle DataService errors gracefully', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    mockDataService.loadAllData.mockReturnValue(throwError('Network error'));

    component.loadAllDataFromDataService();

    expect(consoleSpy).toHaveBeenCalledWith('Error loading skills data from DataService:', 'Network error');
    consoleSpy.mockRestore();
  });

  it('should show back to top button when scrolled past threshold', () => {
    mockWindow.pageYOffset = 400;

    component.onWindowScroll();

    expect(component.showBackToTop).toBe(true);
  });

  it('should hide back to top button when scrolled less than threshold', () => {
    mockWindow.pageYOffset = 200;

    component.onWindowScroll();

    expect(component.showBackToTop).toBe(false);
  });

  it('should update active section based on scroll position', () => {
    component.sections[1].element = { offsetTop: 500 } as HTMLElement;
    mockWindow.pageYOffset = 600;

    component['updateActiveSection']();

    expect(component.activeSection).toBe('skills-categories');
  });

  it('should navigate to correct section when scrollToSection called', () => {
    component.scrollToSection('technical-stack');

    expect(component.activeSection).toBe('technical-stack');
  });

  it('should scroll to top and reset active section', () => {
    component.activeSection = 'certifications';

    component.scrollToTop();

    expect(component.activeSection).toBe('skills-hero');
  });

  it('should navigate to skills categories when exploring skills', () => {
    const scrollSpy = jest.spyOn(component, 'scrollToSection');

    component.onExploreSkills();

    expect(scrollSpy).toHaveBeenCalledWith('skills-categories');
  });

  it('should return technology when tech clicked', () => {
    const technology = mockTechnologies[0];

    const result = component.onTechClick(technology);

    expect(result).toBe(technology);
  });

  it('should return correct page route when viewing certifications', () => {
    const result = component.onViewAllCertifications();

    expect(result).toBe('certifications-page');
  });

  it('should trigger hire component modal when contact clicked', () => {
    const mockHireComponent = { openModal: jest.fn() };
    component.hireMeComponent = mockHireComponent;

    component.onContactMe();

    expect(mockHireComponent.openModal).toHaveBeenCalled();
  });

  it('should call PDF service when downloading resume', () => {
    component.onDownloadResume();

    expect(mockPdfService.downloadPDF).toHaveBeenCalledWith('CV_English.pdf', 'cv-ciobanu-alin-viorel.pdf');
  });

  it('should return top 5 skills from all categories', () => {
    component.topSkills = Array.from({ length: 10 }, (_, i) =>
      createMockTopSkill(`Skill ${i + 1}`, 80 + i)
    );

    const result = component.getTopSkillsFromAllCategories();

    expect(result).toHaveLength(5);
  });



  it('should return zero proficiency when no skills exist', () => {
    component.allSkills = [];

    const result = component.calculateAvgProficiency();

    expect(result).toBe(0);
  });

  it('should count only active skills with level greater than zero', () => {
    component.allSkills = [
      createMockSkill('1', 'Active1', 80),
      createMockSkill('2', 'Inactive', 0),
      createMockSkill('3', 'Active2', 90)
    ];

    const result = component.getActiveSkillsCount();

    expect(result).toBe(2);
  });

  it('should track skills by name for optimization', () => {
    const skill = createMockTopSkill('React', 90);

    const result = component.trackBySkill(0, skill);

    expect(result).toBe('React');
  });

  it('should calculate progress percentage correctly', () => {
    expect(component.getProgressPercentage(25, 100)).toBe(25);
    expect(component.getProgressPercentage(3, 4)).toBe(75);
    expect(component.getProgressPercentage(10, 0)).toBe(0);
  });

  it('should format dates in readable format', () => {
    const result = component.formatDate('2024-03-15');

    expect(result).toBe('March 2024');
  });

  it('should detect mobile viewport correctly', () => {
    mockWindow.innerWidth = 500;

    expect(component.isMobile()).toBe(true);
    expect(component.isTablet()).toBe(false);
    expect(component.isDesktop()).toBe(false);
  });

});