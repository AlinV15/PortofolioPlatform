import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

import { GlobalService } from './global.service';
import { CacheConfig } from '../shared/models/request.interface';
import { EndpointType } from '../shared/enums/EndpointType';
import {
    Certificate,
    CertificateCategory,
    CertificateStats
} from '../shared/models/certificate.interface';

@Injectable({
    providedIn: 'root'
})
export class CertificateService extends GlobalService {
    protected readonly serviceName = 'CertificateService';
    protected readonly serviceApiUrl = `${this.apiUrl}/certificates`;

    // Certificate-specific cache settings
    protected readonly cacheConfig: CacheConfig = {
        defaultTTL: 1800000,
        maxCacheSize: 10,
        enablePrefetch: true,
        cleanupInterval: 240000,
        prefetchDelay: 2500,
        avgEntrySize: 2048,
        expectedHitRate: 0.90
    };

    constructor(
        http: HttpClient,
        @Inject(PLATFORM_ID) platformId: Object
    ) {
        super(http, platformId);
    }

    // ========================
    // PUBLIC API METHODS
    // ========================

    /**
     * Get all certificates
     */
    getCertificates(): Observable<Certificate[]> {
        return this.makeRequest<Certificate[]>(
            EndpointType.CERTIFICATES,
            this.serviceApiUrl
        );
    }

    /**
     * Get certificate statistics
     */
    getCertificateStats(): Observable<CertificateStats> {
        const defaultStats: CertificateStats = {
            totalCertificates: 0,
            verifiedCount: 0,
            averageRelevanceScore: 0,
            providerDistribution: new Map<string, number>(),
            expiringCount: 0,
            featuredCount: 0,
            highRelevanceCount: 0,
            featuredPercentage: 0,
            verificationRate: 0,
            topProvider: ''
        };

        return this.makeRequest<CertificateStats>(
            EndpointType.CERTIFICATE_STATS,
            `${this.serviceApiUrl}/stats`,
            defaultStats
        );
    }

    /**
     * Get certificate categories
     */
    getCertificateCategories(): Observable<CertificateCategory[]> {
        return this.makeRequest<CertificateCategory[]>(
            EndpointType.CERTIFICATE_CATEGORIES,
            `${this.serviceApiUrl}/categories`
        );
    }

    /**
     * Refresh all certificate data
     */
    refreshAllCertificateData(): Observable<{
        certificates: Certificate[];
        categories: CertificateCategory[];
        stats: CertificateStats;
    }> {
        this.invalidateCache();

        return forkJoin({
            certificates: this.getCertificates().pipe(
                catchError(error => {
                    this.log(`Failed to refresh certificates: ${error.message}`, 'warn');
                    return of([]);
                })
            ),
            categories: this.getCertificateCategories().pipe(
                catchError(error => {
                    this.log(`Failed to refresh certificate categories: ${error.message}`, 'warn');
                    return of([]);
                })
            ),
            stats: this.getCertificateStats().pipe(
                catchError(error => {
                    this.log(`Failed to refresh certificate stats: ${error.message}`, 'warn');
                    return of({
                        totalCertificates: 0,
                        verifiedCount: 0,
                        averageRelevanceScore: 0,
                        providerDistribution: new Map<string, number>(),
                        expiringCount: 0,
                        featuredCount: 0,
                        highRelevanceCount: 0,
                        featuredPercentage: 0,
                        verificationRate: 0,
                        topProvider: ''
                    });
                })
            )
        }).pipe(
            tap(data => {
                const totalItems = data.certificates.length + data.categories.length + 1; // +1 pentru stats
                this.log(`Successfully refreshed all certificate data: ${totalItems} total items loaded`);
            }),
            catchError(error => {
                this.log(`Critical error during refresh certificate data: ${error.message}`, 'error');
                return of({
                    certificates: [],
                    categories: [],
                    stats: {
                        totalCertificates: 0,
                        verifiedCount: 0,
                        averageRelevanceScore: 0,
                        providerDistribution: new Map<string, number>(),
                        expiringCount: 0,
                        featuredCount: 0,
                        highRelevanceCount: 0,
                        featuredPercentage: 0,
                        verificationRate: 0,
                        topProvider: ''
                    }
                });
            })
        );
    }

    // ========================
    // UTILITY METHODS SPECIFICE CERTIFICATE
    // ========================

    /**
     * Filter certificates based on various criteria
     */
    getFilteredCertificates(filters: {
        category?: string;
        issuer?: string;
        verified?: boolean;
        featured?: boolean;
        skillsGained?: string[];
    }): Observable<Certificate[]> {
        return this.getCertificates().pipe(
            map(certificates => {
                return certificates.filter(cert => {
                    if (filters.category && cert.categoryName !== filters.category) return false;
                    if (filters.issuer && !cert.issuer.toLowerCase().includes(filters.issuer.toLowerCase())) return false;
                    if (filters.verified !== undefined && cert.verified !== filters.verified) return false;
                    if (filters.featured !== undefined && cert.featured !== filters.featured) return false;
                    if (filters.skillsGained && filters.skillsGained.length > 0) {
                        const hasSkill = filters.skillsGained.some(skill =>
                            cert.skillsGained.some(certSkill =>
                                certSkill.toLowerCase().includes(skill.toLowerCase())
                            )
                        );
                        if (!hasSkill) return false;
                    }
                    return true;
                });
            })
        );
    }

    /**
     * Get featured certificates
     */
    getFeaturedCertificates(): Observable<Certificate[]> {
        return this.getCertificates().pipe(
            map(certificates => certificates.filter(cert => cert.featured))
        );
    }

    /**
     * Get verified certificates
     */
    getVerifiedCertificates(): Observable<Certificate[]> {
        return this.getCertificates().pipe(
            map(certificates => certificates.filter(cert => cert.verified))
        );
    }

    /**
     * Group certificates by category
     */
    getCertificatesByCategory(): Observable<Map<string, Certificate[]>> {
        return this.getCertificates().pipe(
            map(certificates => {
                const grouped = new Map<string, Certificate[]>();
                certificates.forEach(cert => {
                    const category = cert.categoryName;
                    if (!grouped.has(category)) {
                        grouped.set(category, []);
                    }
                    grouped.get(category)!.push(cert);
                });
                return grouped;
            })
        );
    }

    /**
     * Group certificates by issuer
     */
    getCertificatesByIssuer(): Observable<Map<string, Certificate[]>> {
        return this.getCertificates().pipe(
            map(certificates => {
                const grouped = new Map<string, Certificate[]>();
                certificates.forEach(cert => {
                    const issuer = cert.issuer;
                    if (!grouped.has(issuer)) {
                        grouped.set(issuer, []);
                    }
                    grouped.get(issuer)!.push(cert);
                });
                return grouped;
            })
        );
    }

    /**
     * Get all unique skills gained from certificates
     */
    getAllUniqueSkills(): Observable<string[]> {
        return this.getCertificates().pipe(
            map(certificates => {
                const allSkills = new Set<string>();
                certificates.forEach(cert => {
                    cert.skillsGained.forEach(skill => allSkills.add(skill));
                });
                return Array.from(allSkills).sort();
            })
        );
    }

    /**
     * Search certificates by various fields
     */
    searchCertificates(searchTerm: string): Observable<Certificate[]> {
        if (!searchTerm || searchTerm.trim().length === 0) {
            return this.getCertificates();
        }

        const lowerSearchTerm = searchTerm.toLowerCase().trim();

        return this.getCertificates().pipe(
            map(certificates => {
                return certificates.filter(cert => {
                    return cert.name.toLowerCase().includes(lowerSearchTerm) ||
                        cert.issuer.toLowerCase().includes(lowerSearchTerm) ||
                        cert.description.toLowerCase().includes(lowerSearchTerm) ||
                        cert.categoryName.toLowerCase().includes(lowerSearchTerm) ||
                        cert.skillsGained.some(skill =>
                            skill.toLowerCase().includes(lowerSearchTerm)
                        );
                });
            })
        );
    }

    /**
     * Calculate advanced certificate analytics
     */
    getAdvancedCertificateAnalytics(): Observable<{
        basic: CertificateStats;
        skillFrequency: { skill: string; count: number; percentage: number }[];
        categoryDistribution: { category: string; count: number; percentage: number }[];
        verificationTrends: { verified: number; unverified: number };
        featuredAnalysis: { featured: number; regular: number; featuredRate: number };
        issuerRanking: { issuer: string; count: number; verifiedCount: number; verificationRate: number }[];
    }> {
        return forkJoin({
            certificates: this.getCertificates(),
            stats: this.getCertificateStats()
        }).pipe(
            map(({ certificates, stats }) => {

                const skillMap = new Map<string, number>();
                certificates.forEach(cert => {
                    cert.skillsGained.forEach(skill => {
                        skillMap.set(skill, (skillMap.get(skill) || 0) + 1);
                    });
                });

                const skillFrequency = Array.from(skillMap.entries())
                    .map(([skill, count]) => ({
                        skill,
                        count,
                        percentage: Math.round((count / certificates.length) * 100 * 10) / 10
                    }))
                    .sort((a, b) => b.count - a.count);


                const categoryMap = new Map<string, number>();
                certificates.forEach(cert => {
                    categoryMap.set(cert.categoryName, (categoryMap.get(cert.categoryName) || 0) + 1);
                });

                const categoryDistribution = Array.from(categoryMap.entries())
                    .map(([category, count]) => ({
                        category,
                        count,
                        percentage: Math.round((count / certificates.length) * 100 * 10) / 10
                    }))
                    .sort((a, b) => b.count - a.count);


                const verifiedCount = certificates.filter(cert => cert.verified).length;
                const unverifiedCount = certificates.length - verifiedCount;


                const featuredCount = certificates.filter(cert => cert.featured).length;
                const regularCount = certificates.length - featuredCount;
                const featuredRate = Math.round((featuredCount / certificates.length) * 100 * 10) / 10;


                const issuerMap = new Map<string, { total: number; verified: number }>();
                certificates.forEach(cert => {
                    const existing = issuerMap.get(cert.issuer) || { total: 0, verified: 0 };
                    issuerMap.set(cert.issuer, {
                        total: existing.total + 1,
                        verified: existing.verified + (cert.verified ? 1 : 0)
                    });
                });

                const issuerRanking = Array.from(issuerMap.entries())
                    .map(([issuer, data]) => ({
                        issuer,
                        count: data.total,
                        verifiedCount: data.verified,
                        verificationRate: Math.round((data.verified / data.total) * 100 * 10) / 10
                    }))
                    .sort((a, b) => b.count - a.count);

                return {
                    basic: stats,
                    skillFrequency,
                    categoryDistribution,
                    verificationTrends: { verified: verifiedCount, unverified: unverifiedCount },
                    featuredAnalysis: { featured: featuredCount, regular: regularCount, featuredRate },
                    issuerRanking
                };
            })
        );
    }

    // ========================
    // ABSTRACT METHODS IMPLEMENTATION
    // ========================

    /**
     * Warmup cache with essential data (optimized for SSR)
     */
    warmupCache(): void {
        if (!this.isBrowser) {
            this.prefetchEssentialData();
        }
    }

    /**
     * Prefetch for essential certificate data
     */
    protected prefetchEssentialData(): void {
        if (!this.cacheConfig.enablePrefetch) return;

        const essentialEndpoints = [
            EndpointType.CERTIFICATES,
            EndpointType.CERTIFICATE_CATEGORIES,
            EndpointType.CERTIFICATE_STATS
        ];

        essentialEndpoints.forEach(endpoint => {
            switch (endpoint) {
                case EndpointType.CERTIFICATES:
                    this.getCertificates().subscribe();
                    break;
                case EndpointType.CERTIFICATE_CATEGORIES:
                    this.getCertificateCategories().subscribe();
                    break;
                case EndpointType.CERTIFICATE_STATS:
                    this.getCertificateStats().subscribe();
                    break;
            }
        });

        this.log('Essential certificate data prefetch initiated');
    }

    /**
     * Validation and transformation specific to certificate data
     */
    protected validateAndTransformData<T>(data: any, endpoint: EndpointType): T {
        if (!data) {
            throw new Error(`No data received for ${endpoint}`);
        }


        switch (endpoint) {
            case EndpointType.CERTIFICATES:
                return this.validateCertificates(data) as T;
            case EndpointType.CERTIFICATE_CATEGORIES:
                return this.validateCertificateCategories(data) as T;
            case EndpointType.CERTIFICATE_STATS:
                return this.validateCertificateStats(data) as T;
            default:
                return data;
        }
    }

    // ========================
    // PRIVATE VALIDATION METHODS
    // ========================

    private validateCertificates(data: any[]): Certificate[] {
        if (!Array.isArray(data)) return [];

        return data.filter(item =>
            item &&
            item.id &&
            item.name &&
            item.issuer &&
            item.date &&
            Array.isArray(item.skillsGained)
        ).map(item => ({
            ...item,
            verified: Boolean(item.verified),
            featured: Boolean(item.featured),
            skillsGained: Array.isArray(item.skillsGained) ? item.skillsGained : [],
            primaryColor: item.primaryColor || '#3B82F6',
            secondaryColor: item.secondaryColor || '#EBF4FF'
        }));
    }

    private validateCertificateCategories(data: any[]): CertificateCategory[] {
        if (!Array.isArray(data)) return [];

        return data.filter(item =>
            item &&
            item.id &&
            item.name
        ).map(item => ({
            ...item,
            icon: item.icon || 'certificate',
            activeClass: item.activeClass || 'bg-blue-100 text-blue-800',
            hoverClass: item.hoverClass || 'hover:bg-blue-50'
        }));
    }

    private validateCertificateStats(data: any): CertificateStats {
        const defaults: CertificateStats = {
            totalCertificates: 0,
            verifiedCount: 0,
            averageRelevanceScore: 0,
            providerDistribution: new Map<string, number>(),
            expiringCount: 0,
            featuredCount: 0,
            highRelevanceCount: 0,
            featuredPercentage: 0,
            verificationRate: 0,
            topProvider: ''
        };


        let providerDistribution = defaults.providerDistribution;
        if (data.providerDistribution) {
            if (data.providerDistribution instanceof Map) {
                providerDistribution = data.providerDistribution;
            } else if (typeof data.providerDistribution === 'object') {
                providerDistribution = new Map(Object.entries(data.providerDistribution));
            }
        }

        return {
            totalCertificates: this.validateNumber(data.totalCertificates, defaults.totalCertificates),
            verifiedCount: this.validateNumber(data.verifiedCount, defaults.verifiedCount),
            averageRelevanceScore: this.validateNumber(data.averageRelevanceScore, defaults.averageRelevanceScore),
            providerDistribution,
            expiringCount: this.validateNumber(data.expiringCount, defaults.expiringCount),
            featuredCount: this.validateNumber(data.featuredCount, defaults.featuredCount),
            highRelevanceCount: this.validateNumber(data.highRelevanceCount, defaults.highRelevanceCount),
            featuredPercentage: this.validateNumber(data.featuredPercentage, defaults.featuredPercentage),
            verificationRate: this.validateNumber(data.verificationRate, defaults.verificationRate),
            topProvider: data.topProvider || defaults.topProvider
        };
    }
}