import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Add these imports at the top of technical-stack.component.ts
import { Inject, PLATFORM_ID } from '@angular/core';
import {
  LucideAngularModule,
  Award, Star, Search, ExternalLink, ShieldCheck, Crown,
  Info, Check, GraduationCap, ArrowRight, Code, Database,
  Users, Briefcase, BookOpen, Settings, CheckCircle, Calendar
} from 'lucide-angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// Services
import { IconHelperService } from '../../services/icon-helper.service';

// Models and Interfaces
import { Certificate, CertificateCategory, CertificateStats } from '../../shared/models/certificate.interface';

@Component({
  selector: 'app-certifications-grid',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './certifications-grid.component.html',
  styleUrls: ['./certifications-grid.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CertificationsGridComponent implements OnInit, OnDestroy {
  // Input data from parent component
  @Input() certificates: Certificate[] = [];
  @Input() certificateCategories: CertificateCategory[] = [];
  @Input() certificateStats: CertificateStats = {
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

  // Output events
  @Output() certificationSelected = new EventEmitter<Certificate>();
  @Output() viewAllCertifications = new EventEmitter<void>();
  @Output() categorySelected = new EventEmitter<string>();

  private destroy$ = new Subject<void>();

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

  // Category mapping for ID/name mismatches
  private categoryNameToIdMap = new Map<string, string>();
  private categoryIdToNameMap = new Map<string, string>();

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private iconHelper: IconHelperService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.initializeCategoryMappings();
    // Sort certifications by date (newest first) on component load
    this.sortCertifications();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Initialize category mappings to handle ID/name mismatches
   */
  private initializeCategoryMappings(): void {
    this.certificateCategories.forEach(category => {
      this.categoryIdToNameMap.set(category.id, category.name);
      this.categoryNameToIdMap.set(category.name, category.id);
    });

    // Debug logging
    console.log('=== CERTIFICATE CATEGORY MAPPINGS ===');
    console.log('Categories:', this.certificateCategories.map(c => ({ id: c.id, name: c.name })));
    console.log('Sample certificates:', this.certificates.slice(0, 3).map(c => ({ name: c.name, categoryName: c.categoryName })));
    console.log('ID to Name map:', Array.from(this.categoryIdToNameMap.entries()));
    console.log('Name to ID map:', Array.from(this.categoryNameToIdMap.entries()));
    console.log('=======================================');
  }

  /**
   * Get category ID from name
   */
  private getCategoryIdFromName(categoryName: string): string {
    return this.categoryNameToIdMap.get(categoryName) || categoryName;
  }

  /**
   * Get category name from ID
   */
  private getCategoryNameFromId(categoryId: string): string {
    return this.categoryIdToNameMap.get(categoryId) || categoryId;
  }

  // Filter and search methods - FIXED
  setActiveFilter(filter: string): void {
    this.activeFilter = filter;
    this.categorySelected.emit(filter);
    this.cdr.markForCheck();
  }

  onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value;
    this.cdr.markForCheck();
  }

  onSortChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.sortBy = target.value as 'date' | 'name' | 'provider' | 'relevance';
    this.sortCertifications();
    this.cdr.markForCheck();
  }

  clearFilters(): void {
    this.activeFilter = 'all';
    this.searchTerm = '';
    this.sortBy = 'date';
    this.sortCertifications();
    this.cdr.markForCheck();
  }

  // FIXED: Handle category matching properly
  get filteredCertificates(): Certificate[] {
    let filtered = [...this.certificates];

    // Filter by category - Handle both ID and name matching
    if (this.activeFilter !== 'all') {
      filtered = filtered.filter(cert => {
        // Try matching by categoryName directly
        if (cert.categoryName === this.activeFilter) {
          return true;
        }

        // Try matching by converting category name to ID
        const categoryId = this.getCategoryIdFromName(cert.categoryName);
        if (categoryId === this.activeFilter) {
          return true;
        }

        // Try matching by converting active filter to name
        const categoryName = this.getCategoryNameFromId(this.activeFilter);
        if (cert.categoryName === categoryName) {
          return true;
        }

        return false;
      });
    }

    // Filter by search term
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(cert =>
        cert.name.toLowerCase().includes(term) ||
        cert.issuer.toLowerCase().includes(term) ||
        cert.description.toLowerCase().includes(term) ||
        cert.skillsGained.some(skill => skill.toLowerCase().includes(term))
      );
    }

    return filtered;
  }

  // Sorting method - Made SSR safe
  private sortCertifications(): void {
    this.certificates.sort((a, b) => {
      switch (this.sortBy) {
        case 'date':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'name':
          return a.name.localeCompare(b.name);
        case 'provider':
          return a.issuer.localeCompare(b.issuer);
        case 'relevance':
          // Assuming higher relevance score is better
          return (b as any).relevanceScore - (a as any).relevanceScore || 0;
        default:
          return 0;
      }
    });
  }

  // Event handlers
  onViewAllCertifications(): void {
    this.viewAllCertifications.emit();
  }

  // Icon helpers using IconHelperService
  getCertificateIcon(certificate: Certificate): any {
    if (certificate.icon) {
      return this.iconHelper.stringToLucide(certificate.icon as string);
    }
    return this.awardIcon;
  }

  getCategoryIcon(category: CertificateCategory): any {
    if (category.icon) {
      return this.iconHelper.stringToLucide(category.icon as string);
    }
    return this.graduationCapIcon;
  }

  // Date utility methods - Made SSR safe
  isExpired(expiryDate?: Date): boolean {
    if (!expiryDate || typeof window === 'undefined') return false;
    return expiryDate < new Date();
  }

  isExpiringSoon(expiryDate?: Date): boolean {
    if (!expiryDate || typeof window === 'undefined') return false;
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
    return expiryDate <= threeMonthsFromNow && expiryDate >= new Date();
  }

  getDaysUntilExpiry(expiryDate?: Date): number {
    if (!expiryDate || typeof window === 'undefined') return -1;
    const today = new Date();
    const timeDiff = expiryDate.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

  /**
   * Format certificate date for display
   */
  formatCertificateDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  }

  // Certificate analysis methods - FIXED
  getCertificationsByCategory(category: string): Certificate[] {
    const categoryName = this.getCategoryNameFromId(category);
    return this.certificates.filter(cert =>
      cert.categoryName === categoryName || cert.categoryName === category
    );
  }

  getRecentCertifications(months: number = 12): Certificate[] {
    if (typeof window === 'undefined') return [];
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - months);
    return this.certificates.filter(cert => new Date(cert.date) >= cutoffDate);
  }

  getFeaturedCertifications(): Certificate[] {
    return this.certificates.filter(cert => cert.featured);
  }

  getVerifiedCertifications(): Certificate[] {
    return this.certificates.filter(cert => cert.verified);
  }

  // Skills aggregation methods
  getAllSkillsFromCertifications(): string[] {
    const allSkills = this.certificates.flatMap(cert => cert.skillsGained);
    return [...new Set(allSkills)]; // Remove duplicates
  }

  getTopSkills(limit: number = 10): string[] {
    const skillCounts = new Map<string, number>();

    this.certificates.forEach(cert => {
      cert.skillsGained.forEach(skill => {
        skillCounts.set(skill, (skillCounts.get(skill) || 0) + 1);
      });
    });

    return Array.from(skillCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(entry => entry[0]);
  }

  // Statistics methods using real certificateStats
  getAverageRelevanceScore(): number {
    return Math.round(this.certificateStats.averageRelevanceScore);
  }

  getCertificationTrend(): 'increasing' | 'stable' | 'decreasing' {
    const recentCerts = this.getRecentCertifications(12);
    const totalCerts = this.certificates.length;

    if (totalCerts < 2) return 'stable';

    const recentPercentage = (recentCerts.length / totalCerts) * 100;

    if (recentPercentage > 50) return 'increasing';
    if (recentPercentage < 20) return 'decreasing';
    return 'stable';
  }

  /**
   * Get provider distribution from stats
   */
  getProviderDistribution(): Array<{ provider: string; count: number; percentage: number }> {
    const distribution = this.certificateStats.providerDistribution;
    const total = this.certificateStats.totalCertificates;

    if (!distribution || total === 0) return [];

    return Array.from(distribution.entries()).map(([provider, count]) => ({
      provider,
      count,
      percentage: Math.round((count / total) * 100)
    })).sort((a, b) => b.count - a.count);
  }

  /**
   * Get verification rate percentage
   */
  getVerificationRate(): number {
    return Math.round(this.certificateStats.verificationRate);
  }

  /**
   * Get featured percentage
   */
  getFeaturedPercentage(): number {
    return Math.round(this.certificateStats.featuredPercentage);
  }

  // Track by functions for ngFor optimization
  trackByCertification(index: number, certification: Certificate): string {
    return certification.id;
  }

  trackByCategory(index: number, category: CertificateCategory): string {
    return category.id;
  }

  trackByString(index: number, item: string): string {
    return item;
  }

  // Utility methods for template
  getCertificationAge(issueDate: string): string {
    if (typeof window === 'undefined') return 'Recently obtained';

    const now = new Date();
    const issued = new Date(issueDate);
    const diffTime = Math.abs(now.getTime() - issued.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 30) return 'Recent';
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  }

  getCertificationPriority(certification: Certificate): 'high' | 'medium' | 'low' {
    if (certification.featured && certification.verified) return 'high';
    if (certification.verified) return 'medium';
    return 'low';
  }

  /**
   * Get certificate status color
   */
  getCertificateStatusColor(certificate: Certificate): string {
    if (certificate.featured) return 'border-yellow-500 bg-yellow-50';
    if (certificate.verified) return 'border-green-500 bg-green-50';
    return 'border-gray-200 bg-white';
  }

  /**
   * Get skills badge colors
   */
  getSkillBadgeColor(index: number): string {
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800',
      'bg-purple-100 text-purple-800',
      'bg-yellow-100 text-yellow-800',
      'bg-pink-100 text-pink-800',
      'bg-indigo-100 text-indigo-800'
    ];
    return colors[index % colors.length];
  }

  // Search and filter helper methods - FIXED
  getFilteredCount(category: string): number {
    if (category === 'all') return this.certificates.length;

    const categoryName = this.getCategoryNameFromId(category);
    return this.certificates.filter(cert =>
      cert.categoryName === categoryName || cert.categoryName === category
    ).length;
  }

  hasActiveCertifications(): boolean {
    return this.certificates.length > 0;
  }

  hasFeaturedCertifications(): boolean {
    return this.certificates.some(cert => cert.featured);
  }

  hasVerifiedCertifications(): boolean {
    return this.certificates.some(cert => cert.verified);
  }

  // Export and analysis methods
  exportCertificationData(): any {
    return {
      summary: {
        total: this.certificateStats.totalCertificates,
        verified: this.certificateStats.verifiedCount,
        featured: this.certificateStats.featuredCount,
        averageRelevance: this.getAverageRelevanceScore(),
        verificationRate: this.getVerificationRate(),
        topProvider: this.certificateStats.topProvider
      },
      certifications: this.certificates.map(cert => ({
        name: cert.name,
        issuer: cert.issuer,
        date: cert.date,
        skills: cert.skillsGained,
        verified: cert.verified,
        featured: cert.featured,
        certificateId: cert.certificateId
      })),
      skills: this.getAllSkillsFromCertifications(),
      providers: this.getProviderDistribution(),
      exportDate: new Date().toISOString()
    };
  }

  // Animation and UI helpers
  getStaggerDelay(index: number): string {
    return `${index * 100}ms`;
  }

  getCertificationGradient(certification: Certificate): string {
    return `linear-gradient(135deg, ${certification.primaryColor}, ${certification.secondaryColor})`;
  }

  // Validation methods
  isValidCertification(certification: Certificate): boolean {
    return !!(
      certification.name &&
      certification.issuer &&
      certification.date &&
      certification.skillsGained.length > 0
    );
  }

  /**
   * Get category active class using the provided activeClass
   */
  getCategoryActiveClass(category: CertificateCategory): string {
    return this.isCategoryActive(category.id) ? category.activeClass : '';
  }

  // FIXED: Get unique certificate providers
  get certificatesProviders(): string[] {
    return this.certificates.reduce((acc: string[], cert) => {
      if (!acc.includes(cert.issuer)) {
        acc.push(cert.issuer);
      }
      return acc;
    }, []);
  }

  /**
   * Get category hover class using the provided hoverClass  
   */
  getCategoryHoverClass(category: CertificateCategory): string {
    return category.hoverClass;
  }

  /**
   * Check if category is active - FIXED
   */
  isCategoryActive(categoryId: string): boolean {
    return this.activeFilter === categoryId ||
      this.activeFilter === this.getCategoryNameFromId(categoryId);
  }

  /**
   * Get search results count
   */
  getSearchResultsCount(): number {
    return this.filteredCertificates.length;
  }

  /**
   * Check if search has results
   */
  hasSearchResults(): boolean {
    return this.filteredCertificates.length > 0;
  }


}