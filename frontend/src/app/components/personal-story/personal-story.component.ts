import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, Rocket, Trophy, GraduationCap, Handshake, Earth, BookCopy, Star, Lightbulb, Sprout, Shield } from 'lucide-angular';
import { PdfDownloadService } from '../../services/pdf-download.service';
import { Highlight, Value } from '../../shared/models/personal.interface';

import { CurrentLearning } from '../../shared/models/education.interface';
import { IconHelperService } from '../../services/icon-helper.service';
import { ContactInfo } from '../../shared/models/contact.interface';

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
  @Input() personalInfo: ContactInfo = {
    email: " ",
    phone: " ",
    location: " ",
    github: " ",
    linkedin: " ",
  }
  @Input() highlights: Highlight[] = [];
  @Input() values: Value[] = [];
  @Input() currentFocus: CurrentLearning[] = [];


  // Main story sections
  personalStory = {
    intro: "I'm a Software Development and Business Information Systems student with a focus on full-stack web development, passionate about modern technologies and seeking growth opportunities in the tech industry. I have hands-on experience in JavaScript, React, Next.js, and TypeScript through 7+ personal projects, some of which are deployed in production.",

    journey: "My journey in technology started with curiosity about how digital systems work and has evolved into a deep commitment to creating meaningful solutions that bridge the gap between business needs and technical innovation. I've developed enterprise system skills through university programming clubs and am certified in LEADERS leadership.",

    mission: "My mission is to leverage technology to solve real-world problems while continuously learning and growing in the ever-evolving tech landscape. I believe in writing clean, maintainable code and creating user experiences that truly matter.",

    vision: "I envision a future where technology serves humanity more effectively, and I want to be part of building that future through innovative web applications and thoughtful software solutions.",

    passion: "My passion lies in combining technical expertise with creative problem-solving to deliver exceptional results. I'm attracted to intellectual challenges and creative projects, actively investing in developing both technical and interpersonal skills."
  };


  constructor(private downloadPdf: PdfDownloadService, private iconHelper: IconHelperService) { }

  // Track by functions
  trackByHighlight(index: number, highlight: Highlight): string {
    return highlight.title;
  }

  trackByValue(index: number, value: Value): string {
    return value.title;
  }

  trackByFocus(index: number, focus: string): string {
    return focus;
  }
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

  stringToFontAwesome(iconString: string) {
    return this.iconHelper.stringToFontAwesome(iconString);
  }

  stringToLucide(icoString: string) {
    return this.iconHelper.stringToLucide(icoString);
  }

  onDownloadCVClick(): void {
    console.log('Download CV');
    this.downloadPdf.downloadPDF("CV_English.pdf", "CV_Alin-Viorel-Ciobanu")
  }
}