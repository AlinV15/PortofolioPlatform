import { Component, OnInit, OnDestroy, Output, EventEmitter, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate, query, stagger } from '@angular/animations';
import {
  LucideAngularModule,
  Clock, List, Calendar, Play, Pause, Target, Code, Award,
  Rocket, BookOpen, ArrowRight, CheckCircle, GraduationCap,
  Users, Briefcase, Database, Globe, Smartphone, Settings,
  TrendingUp, Star, Zap, Sparkles, Heart, Coffee
} from 'lucide-angular';
import { HireMeComponent } from '../hire-me/hire-me.component'; // Import HireMeComponent

export interface TimelineMilestone {
  id: string;
  year: string;
  title: string;
  category: 'education' | 'technical' | 'professional' | 'certification' | 'project';
  description: string;
  technologies: string[];
  achievements?: string[];
  icon: any;
  isActive?: boolean;
  projectsCount?: number;
  skillsLearned?: number;
  duration?: string;
  primaryColor: string;
  secondaryColor: string;
  importance: 'high' | 'medium' | 'low';
  gradient?: string;
  glowColor?: string;
}

export interface CurrentLearning {
  id: string;
  title: string;
  status: string;
  progress: number;
  color: string;
  icon: any;
  description: string;
  startDate: string;
  expectedCompletion: string;
  gradient?: string;
}

export interface FutureGoal {
  id: string;
  title: string;
  description: string;
  color: string;
  icon: any;
  targetDate: string;
  priority: 'high' | 'medium' | 'low';
  gradient?: string;
}

@Component({
  selector: 'app-skills-timeline',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, HireMeComponent], // Adaugă HireMeComponent
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
  @Output() milestoneSelected = new EventEmitter<TimelineMilestone>();
  @Output() viewFullJourney = new EventEmitter<void>();

  // Reference la HireMeComponent
  @ViewChild(HireMeComponent) hireMeComponent!: HireMeComponent;

  // Enhanced Lucide Icons
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

  // Enhanced Statistics
  totalYears = 3;
  totalMilestones = 8;
  totalTechnologies = 15;
  totalAchievements = 12;

  // Enhanced Timeline data with gradients and glow effects
  milestones: TimelineMilestone[] = [
    {
      id: 'university-start',
      year: '2022',
      title: 'University Journey Begins',
      category: 'education',
      description: 'Started Computer Science Economics at "Alexandru Ioan Cuza" University of Iași. Began exploring programming fundamentals and business applications.',
      technologies: ['C++', 'Digital Electronics', 'Business Fundamentals'],
      achievements: [
        'Enrolled in Computer Science Economics program',
        'Started learning programming basics',
        'Joined university programming clubs'
      ],
      primaryColor: '#3B82F6',
      secondaryColor: '#1D4ED8',
      gradient: 'linear-gradient(135deg, #3B82F6, #1D4ED8, #1E40AF)',
      glowColor: 'rgba(59, 130, 246, 0.4)',
      icon: this.graduationCapIcon,
      projectsCount: 0,
      skillsLearned: 3,
      duration: '4 years',
      importance: 'high'
    },
    {
      id: 'first-programming',
      year: '2022',
      title: 'First Steps in Programming',
      category: 'technical',
      description: 'Introduction to programming with C++ and web technologies. Learned fundamental programming concepts and problem-solving approaches.',
      technologies: ['C++', 'HTML', 'CSS', 'Basic JavaScript'],
      achievements: [
        'Completed first programming assignments',
        'Built basic web pages',
        'Understood programming logic'
      ],
      primaryColor: '#10B981',
      secondaryColor: '#047857',
      gradient: 'linear-gradient(135deg, #10B981, #047857, #065F46)',
      glowColor: 'rgba(16, 185, 129, 0.4)',
      icon: this.codeIcon,
      projectsCount: 2,
      skillsLearned: 4,
      duration: '6 months',
      importance: 'high'
    },
    {
      id: 'asfi-volunteer',
      year: '2022-2023',
      title: 'ASFI Volunteer Experience',
      category: 'professional',
      description: 'Active volunteer at French Students Association Iași. Co-coordinated "Défi pour la littérature" project and managed cultural events.',
      technologies: ['Project Management', 'Event Organization', 'French Language'],
      achievements: [
        'Co-coordinated literary project',
        'Managed ticket sales and events',
        'Completed ANOSR training in Fundraising'
      ],
      primaryColor: '#8B5CF6',
      secondaryColor: '#7C3AED',
      gradient: 'linear-gradient(135deg, #8B5CF6, #7C3AED, #6D28D9)',
      glowColor: 'rgba(139, 92, 246, 0.4)',
      icon: this.usersIcon,
      projectsCount: 3,
      skillsLearned: 5,
      duration: '1 year',
      importance: 'medium'
    },
    {
      id: 'web-development-start',
      year: '2023',
      title: 'Web Development Journey',
      category: 'technical',
      description: 'Dove deep into modern web development. Learned JavaScript, React, and began building real projects with databases.',
      technologies: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Express.js'],
      achievements: [
        'Built first full-stack application',
        'Mastered React fundamentals',
        'Deployed projects to production'
      ],
      primaryColor: '#F59E0B',
      secondaryColor: '#D97706',
      gradient: 'linear-gradient(135deg, #F59E0B, #D97706, #B45309)',
      glowColor: 'rgba(245, 158, 11, 0.4)',
      icon: this.globeIcon,
      projectsCount: 4,
      skillsLearned: 8,
      duration: '8 months',
      importance: 'high'
    },
    {
      id: 'csharp-certification',
      year: '2023',
      title: 'C# Certification Achievement',
      category: 'certification',
      description: 'Completed comprehensive C# course on Codecademy. Gained solid foundation in object-oriented programming and .NET ecosystem.',
      technologies: ['C#', '.NET Framework', 'OOP', 'LINQ', 'Entity Framework'],
      achievements: [
        'Earned Codecademy C# certification',
        'Mastered object-oriented programming',
        'Built console applications'
      ],
      primaryColor: '#EF4444',
      secondaryColor: '#DC2626',
      gradient: 'linear-gradient(135deg, #EF4444, #DC2626, #B91C1C)',
      glowColor: 'rgba(239, 68, 68, 0.4)',
      icon: this.awardIcon,
      projectsCount: 1,
      skillsLearned: 5,
      duration: '3 months',
      importance: 'high'
    },
    {
      id: 'leaders-program',
      year: '2023',
      title: 'Leadership Development',
      category: 'certification',
      description: 'Completed LEADERS Explore program, developing essential leadership skills, critical thinking, and team management capabilities.',
      technologies: ['Leadership', 'Critical Thinking', 'Emotional Intelligence', 'Team Management'],
      achievements: [
        'Earned LEADERS certification',
        'Developed leadership competencies',
        'Enhanced communication skills'
      ],
      primaryColor: '#06B6D4',
      secondaryColor: '#0891B2',
      gradient: 'linear-gradient(135deg, #06B6D4, #0891B2, #0E7490)',
      glowColor: 'rgba(6, 182, 212, 0.4)',
      icon: this.starIcon,
      projectsCount: 0,
      skillsLearned: 6,
      duration: '2 months',
      importance: 'high'
    },
    {
      id: 'advanced-projects',
      year: '2024',
      title: 'Advanced Project Development',
      category: 'project',
      description: 'Built complex applications including e-commerce platform, restaurant management system, and quote management app with modern tech stack.',
      technologies: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'TailwindCSS'],
      achievements: [
        'Built 7+ production-ready projects',
        'Mastered full-stack development',
        'Implemented complex database designs',
        'Deployed applications with modern CI/CD'
      ],
      primaryColor: '#EC4899',
      secondaryColor: '#DB2777',
      gradient: 'linear-gradient(135deg, #EC4899, #DB2777, #BE185D)',
      glowColor: 'rgba(236, 72, 153, 0.4)',
      icon: this.rocketIcon,
      projectsCount: 7,
      skillsLearned: 10,
      duration: '10 months',
      importance: 'high'
    },
    {
      id: 'enterprise-learning',
      year: '2024-2025',
      title: 'Enterprise Technologies',
      category: 'professional',
      description: 'Gained experience with enterprise platforms through university clubs. Learned Mendix low-code development and Microsoft Dynamics AX.',
      technologies: ['Mendix', 'Microsoft Dynamics AX', 'WinMentor', 'Enterprise Systems'],
      achievements: [
        'Joined Codeless Programming Club',
        'Learned low-code development',
        'Gained Microsoft Dynamics AX certification',
        'Developed custom enterprise templates'
      ],
      primaryColor: '#6366F1',
      secondaryColor: '#4F46E5',
      gradient: 'linear-gradient(135deg, #6366F1, #4F46E5, #4338CA)',
      glowColor: 'rgba(99, 102, 241, 0.4)',
      icon: this.briefcaseIcon,
      projectsCount: 2,
      skillsLearned: 4,
      duration: 'Ongoing',
      importance: 'high',
      isActive: true
    }
  ];

  // Enhanced current learning with gradients
  currentLearning: CurrentLearning[] = [
    {
      id: 'angular-spring',
      title: 'Angular + Spring Boot',
      status: 'In Progress',
      progress: 65,
      color: '#DD0031',
      gradient: 'linear-gradient(135deg, #DD0031, #B91C1C)',
      icon: this.codeIcon,
      description: 'Building enterprise applications with Angular frontend and Java Spring Boot backend',
      startDate: 'January 2025',
      expectedCompletion: 'April 2025'
    },
    {
      id: 'advanced-java',
      title: 'Advanced Java Development',
      status: 'Learning',
      progress: 45,
      color: '#ED8B00',
      gradient: 'linear-gradient(135deg, #ED8B00, #D97706)',
      icon: this.settingsIcon,
      description: 'Deep diving into Java enterprise patterns, microservices, and advanced Spring features',
      startDate: 'February 2025',
      expectedCompletion: 'June 2025'
    },
    {
      id: 'cloud-deployment',
      title: 'Cloud & DevOps',
      status: 'Planning',
      progress: 20,
      color: '#0EA5E9',
      gradient: 'linear-gradient(135deg, #0EA5E9, #0284C7)',
      icon: this.globeIcon,
      description: 'Learning AWS, Docker, Kubernetes for scalable application deployment',
      startDate: 'March 2025',
      expectedCompletion: 'August 2025'
    }
  ];

  // Enhanced future goals with gradients
  futureGoals: FutureGoal[] = [
    {
      id: 'cloud-architect',
      title: 'Cloud Architecture',
      description: 'Master cloud-native application design and deployment strategies',
      color: '#0EA5E9',
      gradient: 'linear-gradient(135deg, #0EA5E9, #0284C7, #0369A1)',
      icon: this.globeIcon,
      targetDate: 'End of 2025',
      priority: 'high'
    },
    {
      id: 'mobile-development',
      title: 'Mobile Development',
      description: 'Expand into mobile app development with React Native or Flutter',
      color: '#10B981',
      gradient: 'linear-gradient(135deg, #10B981, #059669, #047857)',
      icon: this.smartphoneIcon,
      targetDate: '2026',
      priority: 'medium'
    },
    {
      id: 'ai-ml-integration',
      title: 'AI/ML Integration',
      description: 'Learn to integrate AI and machine learning into web applications',
      color: '#8B5CF6',
      gradient: 'linear-gradient(135deg, #8B5CF6, #7C3AED, #6D28D9)',
      icon: this.zapIcon,
      targetDate: '2026',
      priority: 'high'
    }
  ];

  private animationInterval?: number;

  constructor() { }

  ngOnInit(): void {
    this.sortMilestones();
    setTimeout(() => {
      this.animationState = 'in';
    }, 500);
  }

  ngOnDestroy(): void {
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
    }
  }

  // View controls
  setTimelineView(view: 'detailed' | 'compact'): void {
    this.timelineView = view;
  }

  toggleAnimation(): void {
    this.isAnimating = !this.isAnimating;

    if (this.isAnimating) {
      this.startAutoAnimation();
    } else {
      this.stopAutoAnimation();
    }
  }

  private startAutoAnimation(): void {
    let currentIndex = 0;
    this.animationInterval = window.setInterval(() => {
      this.milestones.forEach((milestone, index) => {
        milestone.isActive = index === currentIndex;
      });

      currentIndex = (currentIndex + 1) % this.milestones.length;
    }, 2000);
  }

  private stopAutoAnimation(): void {
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
    }

    this.milestones.forEach(milestone => {
      milestone.isActive = false;
    });
  }

  // Data management
  get visibleMilestones(): TimelineMilestone[] {
    if (this.timelineView === 'compact') {
      return this.milestones.filter(m => m.importance === 'high');
    }
    return this.milestones;
  }

  private sortMilestones(): void {
    this.milestones.sort((a, b) => {
      const yearA = parseInt(a.year.split('-')[0]);
      const yearB = parseInt(b.year.split('-')[0]);
      return yearA - yearB;
    });
  }

  // Event handlers
  onMilestoneClick(milestone: TimelineMilestone): void {
    milestone.isActive = !milestone.isActive;
    this.milestoneSelected.emit(milestone);
  }

  onViewFullJourney(): void {
    this.viewFullJourney.emit();
  }

  // 🔥 NOUA METODĂ - Deschide modalul Hire Me
  onHireMeClick(): void {
    console.log('Hire Me button clicked from Skills Timeline');
    if (this.hireMeComponent) {
      this.hireMeComponent.openModal();
    }
  }

  // Animation helpers
  getAnimationDelay(index: number): string {
    return `${index * 200}ms`;
  }

  // Statistics calculations
  getMilestonesInYear(year: string): TimelineMilestone[] {
    return this.milestones.filter(m => m.year.includes(year));
  }

  getTotalProjectsUntilYear(year: string): number {
    const yearNum = parseInt(year);
    return this.milestones
      .filter(m => parseInt(m.year.split('-')[0]) <= yearNum)
      .reduce((total, m) => total + (m.projectsCount || 0), 0);
  }

  getTotalSkillsLearned(): number {
    return this.milestones.reduce((total, m) => total + (m.skillsLearned || 0), 0);
  }

  getCategoryMilestones(category: string): TimelineMilestone[] {
    return this.milestones.filter(m => m.category === category);
  }

  getCurrentYearProgress(): number {
    const currentYearMilestones = this.getMilestonesInYear(this.currentYear.toString());
    if (currentYearMilestones.length === 0) return 0;

    const completedMilestones = currentYearMilestones.filter(m => !m.isActive);
    return Math.round((completedMilestones.length / currentYearMilestones.length) * 100);
  }

  getOverallLearningProgress(): number {
    const totalCurrentLearning = this.currentLearning.reduce((sum, learning) => sum + learning.progress, 0);
    return Math.round(totalCurrentLearning / this.currentLearning.length);
  }

  // Track by functions for ngFor optimization
  trackByMilestone(index: number, milestone: TimelineMilestone): string {
    return milestone.id;
  }

  trackByCurrent(index: number, current: CurrentLearning): string {
    return current.id;
  }

  trackByGoal(index: number, goal: FutureGoal): string {
    return goal.id;
  }

  trackByString(index: number, item: string): string {
    return item;
  }

  // Toate celelalte metode rămân la fel...
  getMostProductiveYear(): string {
    const yearProjects = new Map<string, number>();

    this.milestones.forEach(milestone => {
      const year = milestone.year.split('-')[0];
      const currentProjects = yearProjects.get(year) || 0;
      yearProjects.set(year, currentProjects + (milestone.projectsCount || 0));
    });

    return Array.from(yearProjects.entries())
      .sort((a, b) => b[1] - a[1])[0]?.[0] || '2024';
  }

  getTechnologyEvolution(): string[] {
    const allTechs: string[] = [];

    this.milestones.forEach(milestone => {
      allTechs.push(...milestone.technologies);
    });

    return [...new Set(allTechs)];
  }

  getAchievementsByCategory(): Map<string, number> {
    const categoryCount = new Map<string, number>();

    this.milestones.forEach(milestone => {
      const current = categoryCount.get(milestone.category) || 0;
      categoryCount.set(milestone.category, current + (milestone.achievements?.length || 0));
    });

    return categoryCount;
  }

  getMilestoneCardClass(milestone: TimelineMilestone): string {
    const baseClass = 'timeline-milestone';
    const importanceClass = `importance-${milestone.importance}`;
    const activeClass = milestone.isActive ? 'active' : '';

    return `${baseClass} ${importanceClass} ${activeClass}`.trim();
  }

  getProgressColor(progress: number): string {
    if (progress >= 80) return '#10B981';
    if (progress >= 60) return '#F59E0B';
    if (progress >= 40) return '#EF4444';
    return '#6B7280';
  }
}