// about.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, Rocket, Briefcase, Zap, Heart, Trophy, Laptop, BarChart3, Users } from 'lucide-angular';

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  year: number;
}

interface Stat {
  value: string;
  label: string;
  icon: string;
}

interface StoryHighlights {
  currentRole: string;
  location: string;
  education: string;
  passion: string;
  goal: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {

  // Register Lucide icons
  readonly Rocket = Rocket;
  readonly Briefcase = Briefcase;
  readonly Zap = Zap;
  readonly Heart = Heart;
  readonly Trophy = Trophy;
  readonly Laptop = Laptop;
  readonly BarChart3 = BarChart3;
  readonly Users = Users;

  // Quick stats pentru preview (actualizate cu datele din CV)
  stats: Stat[] = [
    {
      value: '7+',
      label: 'Projects Completed',
      icon: 'Rocket'
    },
    {
      value: '3+',
      label: 'Years Learning',
      icon: 'Briefcase'
    },
    {
      value: '10+',
      label: 'Technologies',
      icon: 'Zap'
    },
    {
      value: '100%',
      label: 'Passion Driven',
      icon: 'Heart'
    }
  ];

  // Key achievements (bazate pe CV-ul tău)
  achievements: Achievement[] = [
    {
      id: 1,
      title: 'LEADERS Leadership Certificate',
      description: 'Completed advanced leadership and critical thinking program with focus on teamwork and communication',
      icon: 'Trophy',
      year: 2023
    },
    {
      id: 2,
      title: 'Full-Stack Development Portfolio',
      description: 'Built 7+ production-ready applications using React, Next.js, Angular, and modern databases',
      icon: 'Laptop',
      year: 2024
    },
    {
      id: 3,
      title: 'Microsoft Dynamics AX Certification',
      description: 'Specialized in enterprise resource planning systems and ERP operation management',
      icon: 'BarChart3',
      year: 2025
    },
    {
      id: 4,
      title: 'Community Leadership & Volunteering',
      description: 'Active volunteer at ASFI, co-coordinated projects, and participated in programming clubs',
      icon: 'Users',
      year: 2023
    }
  ];

  // Personal story highlights (bazate pe CV-ul tău)
  storyHighlights: StoryHighlights = {
    currentRole: 'Full-Stack Developer & Computer Science Economics Student',
    location: 'Iași, Romania',
    education: 'Computer Science Economics at Alexandru Ioan Cuza University',
    passion: 'building modern web applications and solving complex technical challenges',
    goal: 'creating innovative digital solutions'
  };

  // Current technologies (din CV-ul tău)
  currentTechnologies = [
    { name: 'Angular', color: 'red' },
    { name: 'React & Next.js', color: 'blue' },
    { name: 'TypeScript', color: 'blue' },
    { name: 'JavaScript', color: 'yellow' },
    { name: 'C# & Java', color: 'purple' },
    { name: 'PostgreSQL', color: 'indigo' },
    { name: 'MongoDB', color: 'green' },
    { name: 'Prisma', color: 'indigo' }
  ];

  // Track by functions
  trackByStat(index: number, stat: Stat): string {
    return stat.label;
  }

  trackByAchievement(index: number, achievement: Achievement): number {
    return achievement.id;
  }

  trackByTechnology(index: number, tech: any): string {
    return tech.name;
  }

  // Get icon by name
  getIcon(iconName: string) {
    switch (iconName) {
      case 'Rocket': return this.Rocket;
      case 'Briefcase': return this.Briefcase;
      case 'Zap': return this.Zap;
      case 'Heart': return this.Heart;
      case 'Trophy': return this.Trophy;
      case 'Laptop': return this.Laptop;
      case 'BarChart3': return this.BarChart3;
      case 'Users': return this.Users;
      default: return this.Rocket;
    }
  }

  // Get technology color classes
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

  // Method to handle learn more click
  onLearnMoreClick(): void {
    console.log('Navigate to detailed About page');
    // Analytics tracking could go here
    // Example: this.analytics.track('about_learn_more_clicked');
  }

  // Method to handle project view click
  onViewProjectsClick(): void {
    console.log('Navigate to Projects page');
    // Analytics tracking could go here
    // Example: this.analytics.track('about_view_projects_clicked');
  }

  // Method to handle contact click
  onStartConversationClick(): void {
    console.log('Navigate to Contact page');
    // Analytics tracking could go here
    // Example: this.analytics.track('about_start_conversation_clicked');
  }

  // Calculate experience years dynamically
  getExperienceYears(): number {
    const startYear = 2022; // When you started learning programming
    const currentYear = new Date().getFullYear();
    return currentYear - startYear;
  }

  // Get current academic year
  getCurrentAcademicYear(): string {
    const currentYear = new Date().getFullYear();
    const startYear = 2022; // When you started university
    const yearInUniversity = currentYear - startYear + 1;

    const yearNames = ['1st', '2nd', '3rd', '4th'];
    return yearNames[yearInUniversity - 1] || `${yearInUniversity}th`;
  }
}