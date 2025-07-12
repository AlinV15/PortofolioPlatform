// education.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, GraduationCap, School, Trophy, Award, Users, User, Calendar, MapPin, ExternalLink, Github, Lightbulb, Check, LucideIconData, RefreshCcw } from 'lucide-angular';

interface Education {
  id: number;
  level: 'university' | 'highschool';
  institution: string;
  degree: string;
  field: string;
  period: string;
  location: string;
  description: string;
  achievements: string[];
  relevant_courses: string[];
  status: 'completed' | 'ongoing';
  gpa?: string;
  highlights?: string[];
  icon: any;
  iconType: 'lucide' | 'fontawesome' | 'emoji';
}

interface Certificate {
  id: number;
  name: string;
  issuer: string;
  date: string;
  certificate_id?: string;
  description: string;
  skills_gained: string[];
  type: 'technical' | 'leadership' | 'business';
  link?: string;
  icon: any;
  iconType: 'lucide' | 'fontawesome' | 'emoji';
}

interface AcademicProject {
  id: number;
  title: string;
  course: string;
  description: string;
  technologies: string[];
  duration: string;
  type: 'individual' | 'group';
  github_link?: string;
  icon: any;
  iconType: 'lucide' | 'fontawesome' | 'emoji';
}

@Component({
  selector: 'app-education',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.css']
})
export class EducationComponent {

  // Register Lucide icons
  readonly GraduationCap = GraduationCap;
  readonly School = School;
  readonly Trophy = Trophy;
  readonly Award = Award;
  readonly Users = Users;
  readonly User = User;
  readonly Calendar = Calendar;
  readonly MapPin = MapPin;
  readonly ExternalLink = ExternalLink;
  readonly Github = Github;
  readonly Lightbulb = Lightbulb
  readonly Check = Check;
  readonly Reaload = RefreshCcw;


  // Educational background
  education: Education[] = [
    {
      id: 1,
      level: 'university',
      institution: 'Alexandru Ioan Cuza University',
      degree: 'Bachelor\'s Degree',
      field: 'Economic Informatics',
      period: 'September 2022 - July 2025',
      location: 'Faculty of Economics and Business Administration, Iași',
      status: 'completed',
      description: 'Pursuing studies at the Faculty of Economics and Business Administration, specializing in Economic Informatics, combining technology with business and economic understanding.',
      achievements: [
        'Developing expertise in both technical and business domains',
        'Active participation in programming clubs and student organizations',
        'Building practical skills through hands-on projects'
      ],
      relevant_courses: [
        'Microeconomics', 'Applied Mathematics in Economics', 'Information Technologies in Business',
        'Accounting Fundamentals', 'Business Law', 'French for Business 1 & 2',
        'Statistics Fundamentals', 'Software Tools for Business', 'Financial Accounting',
        'Management', 'Macroeconomics', 'Programming I', 'Marketing',
        'Office Information Systems', 'Finance', 'Econometrics', 'French for Business 3 & 4',
        'Algorithms and Programming Logic', 'Databases I', 'Money and Credit',
        'Specialty Practice', 'Operations Research', 'Groupware', 'Computer Networks I',
        'Programming II', 'Electronic Commerce', 'Information Systems Analysis',
        'Financial-Accounting Management of the Enterprise', 'Information Systems Design',
        'Information Systems Security', 'Website Development', 'e-Marketing', 'ERP',
        'Economic Projects in Informatics'
      ],
      highlights: [
        'Comprehensive curriculum covering both technical and business aspects',
        'Hands-on experience with modern technologies and business tools',
        'Strong foundation in programming, databases, and system analysis'
      ],
      icon: this.GraduationCap,
      iconType: 'lucide'
    },
    {
      id: 2,
      level: 'highschool',
      institution: 'Vasile Sav Technological High School',
      degree: 'High School Diploma',
      field: 'Automation and Computer Technology',
      period: 'September 2018 - June 2022',
      location: 'Roman',
      status: 'completed',
      description: 'Specialized in Automation and Computer Technology, building foundational knowledge in programming, electronics, and technical systems.',
      achievements: [
        'Inorganic Chemistry Competition - Mention (9th grade)',
        'Mathematics Competition - Mention (12th grade)'
      ],
      relevant_courses: [
        'Organic Chemistry',
        'Introduction to C++',
        'Digital Electronics',
        'Analog Electronics'
      ],
      highlights: [
        'First exposure to programming with C++',
        'Strong analytical and problem-solving foundation',
        'Academic recognition in mathematics and chemistry'
      ],
      icon: this.School,
      iconType: 'lucide'
    }
  ];

  // Certifications and additional qualifications
  certificates: Certificate[] = [
    {
      id: 1,
      name: 'LEADERS Explore - Leadership Certificate',
      issuer: 'LEADERS Organization',
      date: 'December 2023',
      certificate_id: 'LDRS03090/12/21/2023',
      type: 'leadership',
      description: 'Comprehensive leadership development program focusing on essential leadership skills, critical thinking, and team management in professional environments.',
      skills_gained: [
        'Problem Solving and Decision Making',
        'Taking Initiative and Self-Leadership',
        'Critical Thinking and Personal Efficiency',
        'Emotional Intelligence and Communication',
        'Self Awareness and Teamwork'
      ],
      icon: this.Trophy,
      iconType: 'lucide'
    },
    {
      id: 2,
      name: 'Learn C# Course - Certificate of Completion',
      issuer: 'Codecademy',
      date: 'December 2023',
      certificate_id: '90AEA8BA-E',
      type: 'technical',
      description: 'Successful completion of comprehensive C# programming course, strengthening object-oriented programming knowledge and advanced C# concepts.',
      skills_gained: [
        'Object-Oriented Programming',
        'C# Syntax and Advanced Concepts',
        'Software Development Best Practices',
        'Problem-Solving with C#'
      ],
      icon: 'fas fa-code',
      iconType: 'fontawesome'
    },
    {
      id: 3,
      name: 'Microsoft Dynamics AX (Axapta) - User Certification',
      issuer: 'Microsoft',
      date: '2025',
      type: 'business',
      description: 'Certification in Microsoft Dynamics AX application usage, ERP system operation, and business process management.',
      skills_gained: [
        'ERP System Operation',
        'Business Process Management',
        'Microsoft Dynamics AX Usage',
        'Enterprise Resource Planning'
      ],
      icon: this.Award,
      iconType: 'lucide'
    }
  ];

  // Academic projects (based on university courses)
  academicProjects: AcademicProject[] = [
    {
      id: 1,
      title: 'Web Application with Angular',
      course: 'Website Development',
      description: 'Collaborative university project demonstrating competency in Angular framework with team development experience and version control.',
      technologies: ['Angular', 'TypeScript', 'HTML/CSS', 'Git'],
      duration: '3 months',
      type: 'group',
      github_link: 'https://github.com/AlinV15/Proiect-Web-App-with-Angular',
      icon: this.Users,
      iconType: 'lucide'
    },
    {
      id: 2,
      title: 'Database Design Project',
      course: 'Databases I',
      description: 'Comprehensive database design and implementation project focusing on relational database principles and SQL optimization.',
      technologies: ['SQL', 'PostgreSQL', 'Database Design', 'ER Modeling'],
      duration: '2 months',
      type: 'individual',
      icon: this.User,
      iconType: 'lucide'
    },
    {
      id: 3,
      title: 'ERP System Analysis',
      course: 'ERP',
      description: 'Analysis and implementation of enterprise resource planning concepts with focus on business process optimization.',
      technologies: ['ERP Concepts', 'Business Analysis', 'Process Modeling'],
      duration: '1 semester',
      type: 'group',
      icon: this.Users,
      iconType: 'lucide'
    },
    {
      id: 4,
      title: 'E-Commerce Platform Design',
      course: 'Electronic Commerce',
      description: 'Design and development of e-commerce solution with focus on user experience and business requirements.',
      technologies: ['Web Development', 'UX/UI Design', 'E-Commerce Principles'],
      duration: '4 months',
      type: 'individual',
      icon: this.User,
      iconType: 'lucide'
    }
  ];

  // Academic statistics
  academicStats = {
    totalCourses: 30,
    currentYear: 3,
    specialization: 'Economic Informatics',
    focusAreas: ['Programming', 'Database Systems', 'Business Analysis', 'Web Development'],
    languages: [
      { name: 'French', level: 'B1-B2', icon: '🇫🇷', iconType: 'emoji' },
      { name: 'English', level: 'A2-B1', icon: '🇬🇧', iconType: 'emoji' }
    ]
  };

  // Track by functions
  trackByEducation(index: number, education: Education): number {
    return education.id;
  }

  trackByCertificate(index: number, certificate: Certificate): number {
    return certificate.id;
  }

  trackByProject(index: number, project: AcademicProject): number {
    return project.id;
  }

  trackByCourse(index: number, course: string): string {
    return course;
  }

  trackBySkill(index: number, skill: string): string {
    return skill;
  }

  // Icon type check functions
  isLucideIcon(item: Education | Certificate | AcademicProject | any): boolean {
    return item.iconType === 'lucide';
  }

  isFontAwesome(item: Education | Certificate | AcademicProject | any): boolean {
    return item.iconType === 'fontawesome';
  }

  isEmojiIcon(item: Education | Certificate | AcademicProject | any): boolean {
    return item.iconType === 'emoji';
  }

  // Get certificate type styling
  getCertificateTypeClass(type: string): string {
    const classes = {
      'technical': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'leadership': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'business': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    };
    return classes[type as keyof typeof classes] || 'bg-gray-100 text-gray-800';
  }

  // Get project type icon (legacy method for backward compatibility)
  getProjectTypeIcon(type: string): LucideIconData {
    return type === 'group' ? this.User : this.Users;
  }

  // State for expandable courses
  expandedCourses: { [key: number]: boolean } = {};

  // Toggle course expansion
  toggleCourseExpansion(eduId: number): void {
    this.expandedCourses[eduId] = !this.expandedCourses[eduId];
  }

  // Check if courses are expanded
  isCoursesExpanded(eduId: number): boolean {
    return this.expandedCourses[eduId] || false;
  }

  // Get courses to display
  getCoursesToDisplay(courses: string[], eduId: number): string[] {
    return this.isCoursesExpanded(eduId) ? courses : courses.slice(0, 12);
  }

  // Handle external links
  onCertificateClick(certificate: Certificate): void {
    if (certificate.link) {
      window.open(certificate.link, '_blank');
    }
    console.log(`Certificate clicked: ${certificate.name}`);
  }


  onProjectClick(project: AcademicProject): void {
    if (project.github_link) {
      window.open(project.github_link, '_blank');
    }
    console.log(`Project clicked: ${project.title}`);
  }
}