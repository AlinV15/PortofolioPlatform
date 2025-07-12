import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  LucideAngularModule,
  Award, Star, Search, ExternalLink, ShieldCheck, Crown,
  Info, Check, GraduationCap, ArrowRight, Code, Database,
  Users, Briefcase, BookOpen, Settings, CheckCircle, Calendar
} from 'lucide-angular';

export interface Certification {
  id: string;
  title: string;
  provider: string;
  category: 'technical' | 'leadership' | 'platform' | 'academic';
  issueDate: Date;
  expiryDate?: Date;
  hasExpiry: boolean;
  credentialId?: string;
  verificationUrl?: string;
  certificateUrl?: string;
  description: string;
  skills: string[];
  primaryColor: string;
  secondaryColor: string;
  icon?: any;
  verified: boolean;
  featured: boolean;
  score?: string;
  relevanceScore: number;
}

export interface CertificationCategory {
  id: string;
  name: string;
  icon: any;
  activeClass: string;
  hoverClass: string;
}

@Component({
  selector: 'app-certifications-grid',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './certifications-grid.component.html',
  styleUrls: ['./certifications-grid.component.css']
})
export class CertificationsGridComponent implements OnInit {
  @Output() certificationSelected = new EventEmitter<Certification>();
  @Output() viewAllCertifications = new EventEmitter<void>();

  // Lucide Icons
  readonly awardIcon = Award;
  readonly starIcon = Star;
  readonly searchIcon = Search;
  readonly externalLinkIcon = ExternalLink;
  readonly shieldCheckIcon = ShieldCheck;
  readonly crownIcon = Crown;
  readonly infoIcon = Info;
  readonly checkIcon = Check;
  readonly graduationCapIcon = GraduationCap;
  readonly arrowRightIcon = ArrowRight;
  readonly codeIcon = Code;
  readonly databaseIcon = Database;
  readonly usersIcon = Users;
  readonly briefcaseIcon = Briefcase;
  readonly bookOpenIcon = BookOpen;
  readonly settingsIcon = Settings;
  readonly verifiedIcon = CheckCircle;
  readonly calendarIcon = Calendar;

  // Filter and search state
  activeFilter: string = 'all';
  searchTerm = '';
  sortBy: 'date' | 'name' | 'provider' | 'relevance' = 'date';

  // Stats
  totalCertifications = 3;
  activeCertifications = 3;
  certificationProviders = 3;
  upcomingCertifications = 2;

  // Certification Categories
  certificationCategories: CertificationCategory[] = [
    {
      id: 'technical',
      name: 'Technical',
      icon: this.codeIcon,
      activeClass: 'bg-gradient-to-r from-blue-500 to-blue-600',
      hoverClass: 'hover:border-blue-300 dark:hover:border-blue-600'
    },
    {
      id: 'leadership',
      name: 'Leadership',
      icon: this.usersIcon,
      activeClass: 'bg-gradient-to-r from-purple-500 to-purple-600',
      hoverClass: 'hover:border-purple-300 dark:hover:border-purple-600'
    },
    {
      id: 'platform',
      name: 'Platform',
      icon: this.settingsIcon,
      activeClass: 'bg-gradient-to-r from-green-500 to-green-600',
      hoverClass: 'hover:border-green-300 dark:hover:border-green-600'
    },
    {
      id: 'academic',
      name: 'Academic',
      icon: this.bookOpenIcon,
      activeClass: 'bg-gradient-to-r from-orange-500 to-orange-600',
      hoverClass: 'hover:border-orange-300 dark:hover:border-orange-600'
    }
  ];

  // Certifications based on CV
  certifications: Certification[] = [
    {
      id: 'microsoft-dynamics-ax',
      title: 'Microsoft Dynamics AX (Axapta) - User Certification',
      provider: 'Microsoft',
      category: 'platform',
      issueDate: new Date('2025-01-01'),
      hasExpiry: false,
      credentialId: 'MS-AX-2025-001',
      description: 'Comprehensive certification in using Microsoft Dynamics AX application for ERP system operation and business process management.',
      skills: ['ERP Systems', 'Business Process Management', 'Microsoft Dynamics', 'Enterprise Applications', 'Supply Chain Management'],
      primaryColor: '#00BCF2',
      secondaryColor: '#0078D4',
      icon: this.briefcaseIcon,
      verified: true,
      featured: true,
      score: 'Certified',
      relevanceScore: 95,
      verificationUrl: 'https://learn.microsoft.com/en-us/credentials/',
      certificateUrl: '#'
    },
    {
      id: 'codecademy-csharp',
      title: 'Learn C# Course - Complete Certification',
      provider: 'Codecademy',
      category: 'technical',
      issueDate: new Date('2023-12-01'),
      hasExpiry: false,
      credentialId: '90AEA8BA-E',
      description: 'Successful completion of comprehensive C# programming course covering object-oriented programming, advanced syntax, and .NET development concepts.',
      skills: ['C# Programming', 'Object-Oriented Programming', '.NET Framework', 'Advanced C# Syntax', 'Software Development'],
      primaryColor: '#239120',
      secondaryColor: '#68217A',
      icon: this.codeIcon,
      verified: true,
      featured: false,
      score: 'Completed',
      relevanceScore: 85,
      verificationUrl: 'https://www.codecademy.com/profiles/certificates',
      certificateUrl: '#'
    },
    {
      id: 'leaders-explore',
      title: 'LEADERS Explore - Leadership Certificate',
      provider: 'LEADERS Program',
      category: 'leadership',
      issueDate: new Date('2023-12-21'),
      hasExpiry: false,
      credentialId: 'LDRS03090/12/21/2023',
      description: 'Advanced leadership development program focusing on problem-solving, decision making, critical thinking, emotional intelligence, and team management in professional environments.',
      skills: ['Problem Solving', 'Decision Making', 'Critical Thinking', 'Emotional Intelligence', 'Team Management', 'Self-Leadership'],
      primaryColor: '#8B5CF6',
      secondaryColor: '#A78BFA',
      icon: this.usersIcon,
      verified: true,
      featured: true,
      score: 'Excellence',
      relevanceScore: 90,
      verificationUrl: 'https://leaders.ro/verify',
      certificateUrl: '#'
    }
  ];

  // Upcoming certifications (in progress)
  upcomingCertificationsList = [
    'Angular Developer Certification',
    'Java Spring Boot Certification'
  ];

  // Certification providers for verification notice
  certificationProvidersList = [
    'Microsoft Learn',
    'Codecademy',
    'LEADERS Program'
  ];

  constructor() { }

  ngOnInit(): void {
    // Sort certifications by date (newest first) on component load
    this.sortCertifications();
  }

  // Filter and search methods
  setActiveFilter(filter: string): void {
    this.activeFilter = filter;
  }

  onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value;
  }

  onSortChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.sortBy = target.value as 'date' | 'name' | 'provider' | 'relevance';
    this.sortCertifications();
  }

  clearFilters(): void {
    this.activeFilter = 'all';
    this.searchTerm = '';
    this.sortBy = 'date';
    this.sortCertifications();
  }

  get filteredCertifications(): Certification[] {
    let filtered = this.certifications;

    // Filter by category
    if (this.activeFilter !== 'all') {
      filtered = filtered.filter(cert => cert.category === this.activeFilter);
    }

    // Filter by search term
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(cert =>
        cert.title.toLowerCase().includes(term) ||
        cert.provider.toLowerCase().includes(term) ||
        cert.description.toLowerCase().includes(term) ||
        cert.skills.some(skill => skill.toLowerCase().includes(term))
      );
    }

    return filtered;
  }

  // Sorting method
  private sortCertifications(): void {
    this.certifications.sort((a, b) => {
      switch (this.sortBy) {
        case 'date':
          return b.issueDate.getTime() - a.issueDate.getTime();
        case 'name':
          return a.title.localeCompare(b.title);
        case 'provider':
          return a.provider.localeCompare(b.provider);
        case 'relevance':
          return b.relevanceScore - a.relevanceScore;
        default:
          return 0;
      }
    });
  }

  // Event handlers
  onCertificationClick(certification: Certification): void {
    this.certificationSelected.emit(certification);
  }

  viewCertificate(certification: Certification, event: Event): void {
    event.stopPropagation();
    if (certification.certificateUrl) {
      window.open(certification.certificateUrl, '_blank');
    }
  }

  verifyCertificate(certification: Certification, event: Event): void {
    event.stopPropagation();
    if (certification.verificationUrl) {
      window.open(certification.verificationUrl, '_blank');
    }
  }

  onViewAllCertifications(): void {
    this.viewAllCertifications.emit();
  }

  // Date utility methods
  isExpired(expiryDate?: Date): boolean {
    if (!expiryDate) return false;
    return expiryDate < new Date();
  }

  isExpiringSoon(expiryDate?: Date): boolean {
    if (!expiryDate) return false;
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
    return expiryDate <= threeMonthsFromNow && expiryDate >= new Date();
  }

  getDaysUntilExpiry(expiryDate?: Date): number {
    if (!expiryDate) return -1;
    const today = new Date();
    const timeDiff = expiryDate.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

  // Certification analysis methods
  getCertificationsByCategory(category: string): Certification[] {
    return this.certifications.filter(cert => cert.category === category);
  }

  getRecentCertifications(months: number = 12): Certification[] {
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - months);
    return this.certifications.filter(cert => cert.issueDate >= cutoffDate);
  }

  getFeaturedCertifications(): Certification[] {
    return this.certifications.filter(cert => cert.featured);
  }

  getVerifiedCertifications(): Certification[] {
    return this.certifications.filter(cert => cert.verified);
  }

  // Skills aggregation methods
  getAllSkillsFromCertifications(): string[] {
    const allSkills = this.certifications.flatMap(cert => cert.skills);
    return [...new Set(allSkills)]; // Remove duplicates
  }

  getTopSkills(limit: number = 10): string[] {
    const skillCounts = new Map<string, number>();

    this.certifications.forEach(cert => {
      cert.skills.forEach(skill => {
        skillCounts.set(skill, (skillCounts.get(skill) || 0) + 1);
      });
    });

    return Array.from(skillCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(entry => entry[0]);
  }

  // Statistics methods
  getAverageRelevanceScore(): number {
    if (this.certifications.length === 0) return 0;
    const total = this.certifications.reduce((sum, cert) => sum + cert.relevanceScore, 0);
    return Math.round(total / this.certifications.length);
  }

  getCertificationTrend(): 'increasing' | 'stable' | 'decreasing' {
    if (this.certifications.length < 2) return 'stable';

    const recentCerts = this.getRecentCertifications(12);
    const olderCerts = this.certifications.length - recentCerts.length;

    if (recentCerts.length > olderCerts) return 'increasing';
    if (recentCerts.length < olderCerts) return 'decreasing';
    return 'stable';
  }

  // Track by functions for ngFor optimization
  trackByCertification(index: number, certification: Certification): string {
    return certification.id;
  }

  trackByCategory(index: number, category: CertificationCategory): string {
    return category.id;
  }

  trackByString(index: number, item: string): string {
    return item;
  }

  // Utility methods for template
  getCertificationAge(issueDate: Date): string {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - issueDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 30) return 'Recent';
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  }

  getCertificationPriority(certification: Certification): 'high' | 'medium' | 'low' {
    if (certification.featured && certification.relevanceScore >= 90) return 'high';
    if (certification.relevanceScore >= 80) return 'medium';
    return 'low';
  }

  // Search and filter helper methods
  getFilteredCount(category: string): number {
    if (category === 'all') return this.certifications.length;
    return this.certifications.filter(cert => cert.category === category).length;
  }

  hasActiveCertifications(): boolean {
    return this.certifications.some(cert => !this.isExpired(cert.expiryDate));
  }

  // Export and sharing methods
  exportCertificationData(): any {
    return {
      summary: {
        total: this.totalCertifications,
        active: this.activeCertifications,
        providers: this.certificationProviders,
        averageRelevance: this.getAverageRelevanceScore()
      },
      certifications: this.certifications.map(cert => ({
        title: cert.title,
        provider: cert.provider,
        issueDate: cert.issueDate,
        skills: cert.skills,
        verified: cert.verified,
        credentialId: cert.credentialId
      })),
      skills: this.getAllSkillsFromCertifications(),
      exportDate: new Date().toISOString()
    };
  }

  // Animation and UI helpers
  getStaggerDelay(index: number): string {
    return `${index * 100}ms`;
  }

  getCertificationGradient(certification: Certification): string {
    return `linear-gradient(135deg, ${certification.primaryColor}, ${certification.secondaryColor})`;
  }

  // Validation methods
  isValidCertification(certification: Certification): boolean {
    return !!(
      certification.title &&
      certification.provider &&
      certification.issueDate &&
      certification.skills.length > 0
    );
  }

  // Future enhancements placeholders
  refreshCertificationStatus(): void {
    // Placeholder for future API calls to refresh certification status
    console.log('Refreshing certification status...');
  }

  syncWithLinkedIn(): void {
    // Placeholder for LinkedIn integration
    console.log('Syncing with LinkedIn...');
  }

  generateCertificationReport(): void {
    // Placeholder for generating detailed reports
    console.log('Generating certification report...');
  }
}