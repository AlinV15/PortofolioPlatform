// personal-story.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, Rocket, Trophy, GraduationCap, Handshake, Earth, BookCopy, Star, Lightbulb, Sprout, Shield } from 'lucide-angular';
import { PdfDownloadService } from '../../services/pdf-download.service';

interface PersonalHighlight {
  title: string;
  description: string;
  icon: any; // Changed to any for Lucide icons
  iconType: 'lucide' | 'fontawesome'; // Added iconType
}

interface PersonalValue {
  title: string;
  description: string;
  icon: any;
  iconType: 'lucide' | 'fontawesome';
}

@Component({
  selector: 'app-personal-story',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './personal-story.component.html',
  styleUrls: ['./personal-story.component.css']
})
export class PersonalStoryComponent {

  // Register Lucide icons
  readonly Rocket = Rocket;
  readonly Trophy = Trophy;
  readonly GraduationCap = GraduationCap;
  readonly Handshake = Handshake;
  readonly Earth = Earth;
  readonly BookCopy = BookCopy;
  readonly Star = Star;
  readonly Lightbulb = Lightbulb;
  readonly Sprout = Sprout;
  readonly Shield = Shield;

  // Personal information
  personalInfo = {
    name: 'Ciobanu Alin-Viorel',
    title: 'Student | Full Stack Developer',
    location: 'Iași, Romania',
    email: 'alinviorelciobanu@gmail.com',
    phone: '0753586216',
    github: 'https://github.com/AlinV15',
    linkedin: 'https://www.linkedin.com/in/alin-v-ciobanu-84b06b269/',
    quote: '"I constantly develop an analytical and strategic mindset through the unique combination of studying specialized literature, practicing chess, and engaging in team sports."'
  };

  // Main story sections
  personalStory = {
    intro: "I'm an Economic Informatics student with a focus on full-stack web development, passionate about modern technologies and seeking growth opportunities in the tech industry. I have hands-on experience in JavaScript, React, Next.js, and TypeScript through 7+ personal projects, some of which are deployed in production.",

    journey: "My journey in technology started with curiosity about how digital systems work and has evolved into a deep commitment to creating meaningful solutions that bridge the gap between business needs and technical innovation. I've developed enterprise system skills through university programming clubs and am certified in LEADERS leadership.",

    mission: "My mission is to leverage technology to solve real-world problems while continuously learning and growing in the ever-evolving tech landscape. I believe in writing clean, maintainable code and creating user experiences that truly matter.",

    vision: "I envision a future where technology serves humanity more effectively, and I want to be part of building that future through innovative web applications and thoughtful software solutions.",

    passion: "My passion lies in combining technical expertise with creative problem-solving to deliver exceptional results. I'm attracted to intellectual challenges and creative projects, actively investing in developing both technical and interpersonal skills."
  };

  // Personal highlights with proper icon references
  highlights: PersonalHighlight[] = [
    {
      title: '7+ Complete Projects',
      description: 'Full-stack applications deployed in production with modern technologies',
      icon: this.Rocket,
      iconType: 'lucide'
    },
    {
      title: 'LEADERS Leadership Certified',
      description: 'Developed leadership, critical thinking, and team management skills',
      icon: this.Trophy,
      iconType: 'lucide'
    },
    {
      title: 'Economic Informatics Student',
      description: 'Combining technology with business and economic understanding',
      icon: this.GraduationCap,
      iconType: 'lucide'
    },
    {
      title: 'Active Volunteer',
      description: 'ASFI association member and programming clubs participant',
      icon: this.Handshake,
      iconType: 'lucide'
    },
    {
      title: 'Multilingual',
      description: 'French (B1-B2) and English (A2-B1) proficiency',
      icon: this.Earth,
      iconType: 'lucide'
    },
    {
      title: 'Strategic Thinker',
      description: 'Chess player with analytical mindset and problem-solving skills',
      icon: 'fas fa-chess-pawn', // Font Awesome pentru chess
      iconType: 'fontawesome'
    }
  ];

  // Core values with proper icon references
  values: PersonalValue[] = [
    {
      title: 'Continuous Learning',
      description: 'Always seeking to expand knowledge and stay updated with the latest technologies and methodologies',
      icon: this.BookCopy,
      iconType: 'lucide'
    },
    {
      title: 'Quality & Excellence',
      description: 'Committed to delivering high-quality work with attention to detail and best practices',
      icon: this.Star,
      iconType: 'lucide'
    },
    {
      title: 'Collaboration',
      description: 'Strong believer in teamwork, effective communication, and collective problem-solving',
      icon: this.Handshake,
      iconType: 'lucide'
    },
    {
      title: 'Innovation',
      description: 'Constantly looking for creative solutions and new ways to approach challenges',
      icon: this.Lightbulb,
      iconType: 'lucide'
    },
    {
      title: 'Adaptability',
      description: 'Resilient and flexible, able to thrive in changing environments and learn from failures',
      icon: this.Sprout,
      iconType: 'lucide'
    },
    {
      title: 'Integrity',
      description: 'Maintaining honesty, transparency, and ethical standards in all professional interactions',
      icon: this.Shield,
      iconType: 'lucide'
    }
  ];

  // Current focus areas
  currentFocus = [
    'Full-Stack Development with React & Next.js',
    'TypeScript & Modern JavaScript',
    'Database Design & Management',
    'Enterprise Systems Integration',
    'Leadership & Team Collaboration',
    'Problem-Solving & Analytical Thinking'
  ];

  constructor(private downloadPdf: PdfDownloadService) { }

  // Track by functions
  trackByHighlight(index: number, highlight: PersonalHighlight): string {
    return highlight.title;
  }

  trackByValue(index: number, value: PersonalValue): string {
    return value.title;
  }

  trackByFocus(index: number, focus: string): string {
    return focus;
  }

  // Check if icon is Font Awesome
  isFontAwesome(item: PersonalHighlight | PersonalValue): boolean {
    return item.iconType === 'fontawesome';
  }

  // Check if icon is Lucide
  isLucideIcon(item: PersonalHighlight | PersonalValue): boolean {
    return item.iconType === 'lucide';
  }

  // Handle contact actions
  onContactClick(type: 'email' | 'phone' | 'github' | 'linkedin'): void {
    const contacts = {
      email: `mailto:${this.personalInfo.email}`,
      phone: `tel:${this.personalInfo.phone}`,
      github: this.personalInfo.github,
      linkedin: this.personalInfo.linkedin
    };

    window.open(contacts[type], type === 'email' || type === 'phone' ? '_self' : '_blank');
  }

  // Handle CTA actions
  onViewProjectsClick(): void {
    console.log('Navigate to projects page');
  }

  onDownloadCVClick(): void {
    console.log('Download CV');
    this.downloadPdf.downloadPDF("CV_English.pdf", "CV_Alin-Viorel-Ciobanu")
  }
}