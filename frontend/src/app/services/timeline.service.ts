import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { GlobalService } from './global.service';
import { CacheConfig } from '../shared/models/request.interface';
import { EndpointType } from '../shared/enums/EndpointType';
import {
    TimelineItem,
    TimelineMilestone,
    TimelineStats,
    TimelineGroup,
    TimelineComponentStats,
    IconInfo
} from '../shared/models/timeline.interface';
import { EducationStatus } from '../shared/enums/EducationStatus';
import { ImportanceLevel } from '../shared/enums/ImportanceLevel';

@Injectable({
    providedIn: 'root'
})
export class TimelineService extends GlobalService {
    protected readonly serviceName = 'TimelineService';
    protected readonly serviceApiUrl = `${this.apiUrl}`;

    // Specific cache configuration for Timeline
    protected readonly cacheConfig: CacheConfig = {
        defaultTTL: 900000,
        maxCacheSize: 20,
        enablePrefetch: true,
        cleanupInterval: 300000,
        prefetchDelay: 2000,
        avgEntrySize: 2048,
        expectedHitRate: 0.85
    };

    constructor(
        http: HttpClient,
        @Inject(PLATFORM_ID) platformId: Object
    ) {
        super(http, platformId);
    }

    // ========================
    // IMPLEMENTATION OF ABSTRACT METHODS
    // ========================

    /**
     * Implement cache warmup for Timeline data
     */
    override warmupCache(): void {
        if (!this.isBrowser) return;

        this.log('Starting Timeline cache warmup...');

        forkJoin({
            stats: this.getTimelineStats(),
            items: this.getAllTimelineItems(),
            milestones: this.getAllTimelineMilestones()
        }).pipe(
            catchError(error => {
                this.log(`Timeline warmup failed: ${error.message}`, 'warn');
                return of(null);
            })
        ).subscribe(result => {
            if (result) {
                this.log(`Timeline cache warmup completed: ${result.items.length} items, ${result.milestones.length} milestones`);
            }
        });
    }

    /**
     * Implement prefetching of essential data
     */
    protected override prefetchEssentialData(): void {
        if (!this.isBrowser) return;

        this.log('Prefetching essential Timeline data...');


        this.getTimelineStats().pipe(
            catchError(error => {
                this.log(`Timeline stats prefetch failed: ${error.message}`, 'warn');
                return of(this.getDefaultTimelineStats());
            })
        ).subscribe(stats => {
            this.log(`Timeline stats prefetched: ${stats["Major Milestones"]} milestones, ${stats[" Achievements"]} achievements`);
        });


        setTimeout(() => {
            this.getAllTimelineItems().pipe(
                catchError(() => of([]))
            ).subscribe(items => {
                this.log(`Timeline items prefetched: ${items.length} items`);
            });
        }, 1500);

        setTimeout(() => {
            this.getAllTimelineMilestones().pipe(
                catchError(() => of([]))
            ).subscribe(milestones => {
                this.log(`Timeline milestones prefetched: ${milestones.length} milestones`);
            });
        }, 2500);
    }

    /**
     * Implement data validation and transformation
     */
    protected override validateAndTransformData<T>(data: any, endpoint: EndpointType): T {
        if (!data) {
            this.log(`No data received for ${endpoint}`, 'warn');
            return this.getDefaultData<T>(endpoint);
        }

        try {
            switch (endpoint) {
                case EndpointType.TIMELINE_ITEMS:
                    return this.validateTimelineItems(data) as T;

                case EndpointType.TIMELINE_MILESTONES:
                    return this.validateTimelineMilestones(data) as T;

                case EndpointType.TIMELINE_STATS:
                    return this.validateTimelineStats(data) as T;

                default:
                    this.log(`Unknown endpoint type: ${endpoint}`, 'warn');
                    return data as T;
            }
        } catch (error) {
            this.log(`Data validation failed for ${endpoint}: ${error}`, 'error');
            return this.getDefaultData<T>(endpoint);
        }
    }

    // ========================
    // PUBLIC API METHODS
    // ========================

    /**
     * Get all timeline items 
     */
    getAllTimelineItems(): Observable<TimelineItem[]> {
        return this.makeRequest<TimelineItem[]>(
            EndpointType.TIMELINE_ITEMS,
            `${this.serviceApiUrl}/timeline-items`,
            [] // fallback data
        );
    }

    /**
     * Get timeline milestones
     */
    getAllTimelineMilestones(): Observable<TimelineMilestone[]> {
        return this.makeRequest<TimelineMilestone[]>(
            EndpointType.TIMELINE_MILESTONES,
            `${this.serviceApiUrl}/timeline-milestones`,
            [] // fallback data
        );
    }

    /**
     * Get timeline statistics
     */
    getTimelineStats(): Observable<TimelineStats> {
        return this.makeRequest<TimelineStats>(
            EndpointType.TIMELINE_STATS,
            `${this.serviceApiUrl}/timeline-stats`,
            this.getDefaultTimelineStats() // fallback data
        );
    }

    // ========================
    // UTILITY METHODS FOR TIMELINE
    // ========================

    /**
     * Group timeline items by year
     */
    groupItemsByYear(items: TimelineItem[], sortOrder: 'asc' | 'desc' = 'desc'): TimelineGroup[] {
        const currentYear = new Date().getFullYear().toString();
        const groupedData = new Map<string, TimelineItem[]>();


        items.forEach(item => {
            const year = item.year;
            if (!groupedData.has(year)) {
                groupedData.set(year, []);
            }
            groupedData.get(year)!.push(item);
        });


        groupedData.forEach(yearItems => {
            yearItems.sort((a, b) => {

                if (a.priority !== undefined && b.priority !== undefined) {
                    return b.priority - a.priority;
                }

                if (a.featured && !b.featured) return -1;
                if (!a.featured && b.featured) return 1;

                if (a.current && !b.current) return -1;
                if (!a.current && b.current) return 1;

                return a.title.localeCompare(b.title);
            });
        });


        const groups: TimelineGroup[] = Array.from(groupedData.entries()).map(([year, yearItems]) => ({
            year,
            items: yearItems,
            isCurrentYear: year === currentYear,
            itemCount: yearItems.length
        }));


        groups.sort((a, b) => {
            const yearA = parseInt(a.year);
            const yearB = parseInt(b.year);
            return sortOrder === 'desc' ? yearB - yearA : yearA - yearB;
        });

        return groups;
    }

    /**
     * Calculetes statistics for a timeline component
     */
    calculateComponentStats(items: TimelineItem[]): TimelineComponentStats {
        const currentItems = items.filter(item => item.current).length;
        const completedItems = items.filter(item => item.status === EducationStatus.COMPLETED).length;

        const itemsByType: Record<string, number> = {};
        const yearCounts: Record<string, number> = {};

        items.forEach(item => {

            itemsByType[item.type] = (itemsByType[item.type] || 0) + 1;

            yearCounts[item.year] = (yearCounts[item.year] || 0) + 1;
        });


        const mostActiveYear = Object.entries(yearCounts)
            .reduce((max, [year, count]) => count > max.count ? { year, count } : max, { year: '', count: 0 }).year;

        const yearsSpanned = Object.keys(yearCounts).map(year => parseInt(year)).sort((a, b) => a - b);

        return {
            totalItems: items.length,
            itemsByType,
            currentItems,
            completedItems,
            yearsSpanned,
            mostActiveYear
        };
    }

    /**
     * Detects the type of icon used in a timeline item
     */
    detectIconType(icon: string): IconInfo {
        if (!icon) {
            return { type: 'lucide', value: 'circle', isValid: false };
        }

        // Check for emoji (simple detection)
        const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u;
        if (emojiRegex.test(icon)) {
            return { type: 'emoji', value: icon, isValid: true };
        }

        // Check for image path
        if (icon.includes('/') || icon.includes('.')) {
            return { type: 'image', value: icon, isValid: true };
        }

        // Check for Font Awesome (starts with fa-)
        if (icon.startsWith('fa-') || icon.startsWith('fas ') || icon.startsWith('far ') || icon.startsWith('fab ')) {
            return {
                type: 'fontawesome',
                value: icon,
                isValid: true,
                className: icon.startsWith('fa-') ? `fas ${icon}` : icon
            };
        }

        // Default to Lucide
        return {
            type: 'lucide',
            value: icon,
            isValid: true,
            lucideName: icon
        };
    }

    /**
     * Filters timeline items by type
     */
    filterItemsByType(items: TimelineItem[], types: string[]): TimelineItem[] {
        if (!types || types.length === 0) return items;
        return items.filter(item => types.includes(item.type));
    }

    /**
     * Sorts timeline items based on various criteria
     */
    sortItems(items: TimelineItem[], showCurrentFirst: boolean = true): TimelineItem[] {
        return [...items].sort((a, b) => {
            // Current items first if enabled
            if (showCurrentFirst) {
                if (a.current && !b.current) return -1;
                if (!a.current && b.current) return 1;
            }

            // Featured items
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;

            // Priority
            if (a.priority !== undefined && b.priority !== undefined) {
                return b.priority - a.priority;
            }

            // Default alphabetical
            return a.title.localeCompare(b.title);
        });
    }

    // ========================
    // PRIVATE VALIDATION METHODS
    // ========================

    /**
     * Validates and transforms timeline items according to the real interface
     */
    private validateTimelineItems(data: any[]): TimelineItem[] {
        if (!Array.isArray(data)) {
            this.log('Timeline items data is not an array', 'warn');
            return [];
        }

        return data.map(item => ({
            id: item.id || crypto.randomUUID(),
            year: item.year?.toString() || new Date().getFullYear().toString(),
            title: item.title || 'Untitled',
            subtitle: item.subtitle || '',
            description: item.description || '',
            type: item.type || 'general',
            icon: item.icon || 'circle',
            status: item.status || EducationStatus.ONGOING,
            current: Boolean(item.current),
            details: Array.isArray(item.details) ? item.details : [],
            achievements: Array.isArray(item.achievements) ? item.achievements : [],
            link: this.sanitizeUrl(item.link),
            location: item.location || undefined,
            duration: item.duration || undefined,
            technologies: Array.isArray(item.technologies) ? item.technologies : [],
            skills: Array.isArray(item.skills) ? item.skills : [],
            tags: Array.isArray(item.tags) ? item.tags : [],
            priority: this.validateNumber(item.priority, 0),
            featured: Boolean(item.featured)
        }));
    }

    /**
     * Validates and transforms timeline milestones according to the real interface
     */
    private validateTimelineMilestones(data: any[]): TimelineMilestone[] {
        if (!Array.isArray(data)) {
            this.log('Timeline milestones data is not an array', 'warn');
            return [];
        }

        return data.map(milestone => ({
            id: milestone.id || crypto.randomUUID(),
            year: milestone.year?.toString() || new Date().getFullYear().toString(),
            title: milestone.title || 'Untitled Milestone',
            category: milestone.category || 'general',
            description: milestone.description || '',
            icon: milestone.icon || 'star',
            primaryColor: this.validateHexColor(milestone.primaryColor, '#3B82F6'),
            secondaryColor: this.validateHexColor(milestone.secondaryColor, '#93C5FD'),
            isActive: milestone.isActive !== undefined ? Boolean(milestone.isActive) : undefined,
            importance: milestone.importance as ImportanceLevel || undefined,
            duration: milestone.duration || undefined,
            technologies: Array.isArray(milestone.technologies) ? milestone.technologies : []
        }));
    }

    /**
     * Validates and transforms timeline statistics according to the real interface
     */
    private validateTimelineStats(data: any): TimelineStats {
        return {
            "Major Milestones": (data["Major Milestones"] || data.majorMilestones || "0").toString(),
            " Achievements": (data[" Achievements"] || data.achievements || "0").toString()
        };
    }

    /**
     * Validates the hex color format
     */
    private validateHexColor(color: any, defaultColor: `#${string}`): `#${string}` {
        if (typeof color === 'string' && /^#[0-9A-Fa-f]{6}$/.test(color)) {
            return color as `#${string}`;
        }
        return defaultColor;
    }

    /**
     * Returns default data for a given endpoint type
     */
    private getDefaultData<T>(endpoint: EndpointType): T {
        switch (endpoint) {
            case EndpointType.TIMELINE_ITEMS:
                return [] as T;

            case EndpointType.TIMELINE_MILESTONES:
                return [] as T;

            case EndpointType.TIMELINE_STATS:
                return this.getDefaultTimelineStats() as T;

            default:
                return null as T;
        }
    }

    /**
     * Returns default timeline statistics
     */
    private getDefaultTimelineStats(): TimelineStats {
        return {
            "Major Milestones": "0",
            " Achievements": "0"
        };
    }
}