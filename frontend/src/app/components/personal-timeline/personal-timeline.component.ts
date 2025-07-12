import { Component, OnInit, ElementRef, ViewChildren, QueryList, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { LucideAngularModule, GraduationCap, Building2, Award, Rocket, Users, Code, Brain, BookOpen, Target, Trophy, LucideIconData } from 'lucide-angular';

export interface TimelineItem {
  id: string;
  year: string;
  title: string;
  subtitle: string;
  description: string;
  type: 'education' | 'experience' | 'certification' | 'project';
  icon: LucideIconData;
  color: string;
  details?: string[];
  current?: boolean;
  achievements?: string[];
  link?: string;
}

export interface TimelineConfig {
  showAnimation: boolean;
  animationDelay: number;
  showIcons: boolean;
  showBadges: boolean;
}

@Component({
  selector: 'app-personal-timeline',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './personal-timeline.component.html',
  styleUrls: ['./personal-timeline.component.css']
})
export class PersonalTimelineComponent implements OnInit, AfterViewInit {
  @ViewChildren('timelineItem') timelineElements!: QueryList<ElementRef>;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  // Icon variables for Lucide icons
  readonly icons = {
    // Timeline type icons
    education: GraduationCap,
    experience: Building2,
    certification: Award,
    project: Rocket,

    // Additional icons for better visual representation
    volunteer: Users,
    development: Code,
    skills: Brain,
    learning: BookOpen,
    achievement: Target,
    success: Trophy
  };

  timelineItems: TimelineItem[] = [
    {
      id: '2018',
      year: '2018-2022',
      title: 'Vasile Sav Technological High School',
      subtitle: 'Automation and Computer Technology',
      description: 'Specialized education in automation and computer technology, building foundational knowledge in programming, electronics, and technical systems.',
      type: 'education',
      icon: this.icons.education,
      color: 'blue',
      details: [
        'Introduction to C++ programming',
        'Digital Electronics',
        'Analog Electronics',
        'Organic Chemistry'
      ],
      achievements: [
        'Mathematics Competition - Mention (12th grade)',
        'Inorganic Chemistry Competition - Mention (9th grade)'
      ]
    },
    {
      id: '2022',
      year: '2022-Present',
      title: 'Alexandru Ioan Cuza University',
      subtitle: 'Economic Informatics - 3rd Year Student',
      description: 'Pursuing Bachelor\'s degree at Faculty of Economics and Business Administration, specializing in Economic Informatics, combining technology with business and economic understanding.',
      type: 'education',
      icon: this.icons.education,
      color: 'blue',
      current: true,
      details: [
        'Programming I & II, Algorithms and Programming Logic',
        'Databases I, Information Systems Analysis & Design',
        'Website Development, Electronic Commerce, e-Marketing',
        'ERP, Computer Networks I, Information Systems Security',
        'Economics: Microeconomics, Macroeconomics, Finance',
        'Management, Marketing, Financial Accounting',
        'French for Business (Level B1-B2)',
        'Economic Projects in Informatics'
      ],
      achievements: [
        'Comprehensive curriculum covering both technical and business aspects',
        'Hands-on experience with modern technologies and business tools',
        'Strong foundation in programming, databases, and system analysis'
      ]
    },
    {
      id: '2022-2023',
      year: '2022-2023',
      title: 'ASFI Student Association',
      subtitle: 'Active Volunteer & Project Co-coordinator',
      description: 'Active participation in student association activities, developing leadership and organizational skills through cultural and social projects.',
      type: 'experience',
      icon: this.icons.volunteer,
      color: 'green',
      details: [
        'Co-coordinated "Défi pour la littérature" project',
        'Co-coordinated ticket sales and outdoor film activities',
        'Active participation in association projects',
        'Participated in ANOSR trainings in Fundraising and Projects'
      ],
      achievements: [
        'Enhanced teamwork and project management skills',
        'Experience in event organization and coordination',
        'Leadership development through student community involvement'
      ]
    },
    {
      id: '2023-cert',
      year: 'December 2023',
      title: 'Professional Certifications',
      subtitle: 'Leadership & Technical Skills Development',
      description: 'Completed comprehensive certification programs to enhance both leadership capabilities and technical programming skills.',
      type: 'certification',
      icon: this.icons.certification,
      color: 'yellow',
      details: [
        'LEADERS Explore - Leadership Certificate (ID: LDRS03090/12/21/2023)',
        'Learn C# Course - Codecademy (ID: 90AEA8BA-E)',
        'Problem Solving and Decision Making',
        'Taking Initiative and Self-Leadership',
        'Critical Thinking and Personal Efficiency',
        'Emotional Intelligence and Communication',
        'Object-Oriented Programming with C#'
      ],
      achievements: [
        'Enhanced leadership and team management skills',
        'Strengthened programming knowledge in C#',
        'Improved communication and interpersonal abilities'
      ]
    },
    {
      id: '2025-clubs',
      year: 'March-May 2025',
      title: 'University Programming Clubs',
      subtitle: 'Enterprise Technologies & Low-Code Platforms',
      description: 'Expanding expertise in enterprise technologies through active participation in specialized programming clubs focusing on modern business solutions.',
      type: 'experience',
      icon: this.icons.skills,
      color: 'purple',
      details: [
        'Codeless Club: Mendix Low-Code Platform development',
        'WinMentor Club: SQL integration and custom template development',
        'Microsoft Dynamics AX (Axapta) User Certification',
        'Enterprise application development and customization',
        'Business process automation and optimization'
      ],
      achievements: [
        'Intermediate proficiency in Mendix platform',
        'Experience with ERP system integration',
        'Understanding of enterprise software architecture'
      ]
    },
    {
      id: '2024-projects',
      year: '2024-2025',
      title: 'Full-Stack Development Portfolio',
      subtitle: '7+ Production-Ready Applications',
      description: 'Building comprehensive portfolio of modern web applications using cutting-edge technologies, with some projects launched in production.',
      type: 'project',
      icon: this.icons.project,
      color: 'red',
      current: true,
      details: [
        'FloweringStories E-commerce App - Next.js, MongoDB, TypeScript',
        'Restaurant Management Application - Next.js, Prisma, PostgreSQL',
        'QuotezApp - CRUD Platform - React, Express, MongoDB',
        'Todo/Kanban Application - Next.js, MongoDB',
        'RoomieFinder Student Platform - Next.js, Prisma, PostgreSQL',
        'Angular Collaborative University Project - Angular, TypeScript',
        'Personal Portfolio Website - HTML, CSS, JavaScript'
      ],
      achievements: [
        'Hands-on experience with modern full-stack technologies',
        'Production deployment and user experience optimization',
        'Comprehensive understanding of web development lifecycle'
      ],
      link: 'https://github.com/AlinV15'
    }
  ];

  ngOnInit(): void {
    // Component initialization logic
  }

  ngAfterViewInit(): void {
    // Only setup scroll animation in browser environment
    if (isPlatformBrowser(this.platformId)) {
      this.setupScrollAnimation();
    } else {
      // For SSR, immediately show all items
      this.showAllItemsForSSR();
    }
  }

  private setupScrollAnimation(): void {
    // Check if IntersectionObserver is available
    if (typeof IntersectionObserver === 'undefined') {
      this.showAllItemsForSSR();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    // Use setTimeout to ensure elements are rendered
    setTimeout(() => {
      this.timelineElements.forEach((element) => {
        if (element?.nativeElement) {
          observer.observe(element.nativeElement);
        }
      });
    }, 100);
  }

  private showAllItemsForSSR(): void {
    // For SSR or when IntersectionObserver is not available, show all items immediately
    setTimeout(() => {
      this.timelineElements.forEach((element) => {
        if (element?.nativeElement) {
          element.nativeElement.classList.add('animate-in');
        }
      });
    }, 100);
  }

  getCardClasses(type: string): string {
    const baseClasses = 'group hover:scale-105 cursor-pointer';
    const typeClasses = {
      education: 'border-l-blue-500 hover:border-l-blue-600',
      experience: 'border-l-green-500 hover:border-l-green-600',
      certification: 'border-l-yellow-500 hover:border-l-yellow-600',
      project: 'border-l-red-500 hover:border-l-red-600'
    };

    return `${baseClasses} ${typeClasses[type as keyof typeof typeClasses] || typeClasses.education}`;
  }

  getBadgeClasses(type: string): string {
    const typeClasses = {
      education: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      experience: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      certification: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      project: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    };

    return typeClasses[type as keyof typeof typeClasses] || typeClasses.education;
  }

  getTypeLabel(type: string): string {
    const labels = {
      education: 'Education',
      experience: 'Experience',
      certification: 'Certification',
      project: 'Projects'
    };

    return labels[type as keyof typeof labels] || 'Unknown';
  }

  getTimelineNodeClasses(type: string): string {
    const typeClasses = {
      education: 'bg-blue-500 border-blue-300',
      experience: 'bg-green-500 border-green-300',
      certification: 'bg-yellow-500 border-yellow-300',
      project: 'bg-red-500 border-red-300'
    };

    return typeClasses[type as keyof typeof typeClasses] || typeClasses.education;
  }

  // Handle external links
  onTimelineItemClick(item: TimelineItem): void {
    if (item.link) {
      window.open(item.link, '_blank');
    }
    console.log(`Timeline item clicked: ${item.title}`);
  }

  // Track by functions for performance
  trackByTimelineItem(index: number, item: TimelineItem): string {
    return item.id;
  }

  trackByDetail(index: number, detail: string): string {
    return detail;
  }

  trackByAchievement(index: number, achievement: string): string {
    return achievement;
  }
}