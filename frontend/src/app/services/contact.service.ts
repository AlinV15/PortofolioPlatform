import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

import { GlobalService } from './global.service';
import { CacheConfig } from '../shared/models/request.interface';
import { EndpointType } from '../shared/enums/EndpointType';
import {
    ContactInfo,
    ContactLocation,
    Coordinates
} from '../shared/models/contact.interface';

@Injectable({
    providedIn: 'root'
})
export class ContactService extends GlobalService {
    protected readonly serviceName = 'ContactService';
    protected readonly serviceApiUrl = `${this.apiUrl}/contact`;

    // Configurări cache specifice pentru Contact
    protected readonly cacheConfig: CacheConfig = {
        defaultTTL: 3600000, // 1 oră pentru contact (date foarte stabile)
        maxCacheSize: 5,
        enablePrefetch: true,
        cleanupInterval: 300000, // 5 minute (mai rar - date stabile)
        prefetchDelay: 1000, // 1 secundă - delay minimal (critice pentru SSR)
        avgEntrySize: 512, // 512B per entry (date mici)
        expectedHitRate: 0.95 // 95% hit rate (date foarte stabile)
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
     * Get contact information
     */
    getContactInfo(): Observable<ContactInfo> {
        const defaultInfo: ContactInfo = {
            email: '',
            phone: '',
            location: '',
            github: '',
            linkedin: ''
        };

        return this.makeRequest<ContactInfo>(
            EndpointType.CONTACT_INFO,
            `${this.serviceApiUrl}/info`,
            defaultInfo
        );
    }

    /**
     * Get contact location details
     */
    getContactLocation(): Observable<ContactLocation> {
        const defaultLocation: ContactLocation = {
            name: '',
            address: '',
            city: '',
            country: '',
            coordinates: { lat: 0, lng: 0 },
            timezone: '',
            workingHours: ''
        };

        return this.makeRequest<ContactLocation>(
            EndpointType.CONTACT_LOCATION,
            `${this.serviceApiUrl}/location`,
            defaultLocation
        );
    }

    /**
     * Refreshează toate datele de contact
     */
    refreshAllContactData(): Observable<{
        info: ContactInfo;
        location: ContactLocation;
    }> {
        this.invalidateCache();

        return forkJoin({
            info: this.getContactInfo().pipe(
                catchError(error => {
                    this.log(`Failed to refresh contact info: ${error.message}`, 'warn');
                    return of({
                        email: '',
                        phone: '',
                        location: '',
                        github: '',
                        linkedin: ''
                    });
                })
            ),
            location: this.getContactLocation().pipe(
                catchError(error => {
                    this.log(`Failed to refresh contact location: ${error.message}`, 'warn');
                    return of({
                        name: '',
                        address: '',
                        city: '',
                        country: '',
                        coordinates: { lat: 0, lng: 0 },
                        timezone: '',
                        workingHours: ''
                    });
                })
            )
        }).pipe(
            tap(data => {
                this.log('Successfully refreshed all contact data');
            }),
            catchError(error => {
                this.log(`Critical error during refresh contact data: ${error.message}`, 'error');
                return of({
                    info: { email: '', phone: '', location: '', github: '', linkedin: '' },
                    location: { name: '', address: '', city: '', country: '', coordinates: { lat: 0, lng: 0 }, timezone: '', workingHours: '' }
                });
            })
        );
    }

    // ========================
    // UTILITY METHODS SPECIFICE CONTACT
    // ========================

    /**
     * Verifică dacă informațiile de contact sunt complete
     */
    isContactInfoComplete(): Observable<boolean> {
        return this.getContactInfo().pipe(
            map(info => {
                return !!(info.email && info.phone && info.location);
            })
        );
    }

    /**
     * Verifică dacă locația are coordonate valide
     */
    hasValidCoordinates(): Observable<boolean> {
        return this.getContactLocation().pipe(
            map(location => {
                const coords = location.coordinates;
                return coords &&
                    typeof coords.lat === 'number' &&
                    typeof coords.lng === 'number' &&
                    coords.lat !== 0 &&
                    coords.lng !== 0 &&
                    coords.lat >= -90 && coords.lat <= 90 &&
                    coords.lng >= -180 && coords.lng <= 180;
            })
        );
    }

    /**
     * Obține toate link-urile sociale dintr-o dată
     */
    getSocialLinks(): Observable<{ github: string; linkedin: string }> {
        return this.getContactInfo().pipe(
            map(info => ({
                github: info.github,
                linkedin: info.linkedin
            }))
        );
    }

    /**
     * Formatează informațiile de contact pentru afișare
     */
    getFormattedContactInfo(): Observable<{
        email: { value: string; href: string; valid: boolean };
        phone: { value: string; href: string; valid: boolean };
        location: { value: string; valid: boolean };
        social: { github: string; linkedin: string };
    }> {
        return this.getContactInfo().pipe(
            map(info => ({
                email: {
                    value: info.email,
                    href: info.email ? `mailto:${info.email}` : '',
                    valid: this.isValidEmail(info.email)
                },
                phone: {
                    value: info.phone,
                    href: info.phone ? `tel:${info.phone.replace(/\s/g, '')}` : '',
                    valid: this.isValidPhone(info.phone)
                },
                location: {
                    value: info.location,
                    valid: !!info.location
                },
                social: {
                    github: info.github,
                    linkedin: info.linkedin
                }
            }))
        );
    }

    /**
     * Obține informații complete de contact cu locația
     */
    getCompleteContactData(): Observable<{
        info: ContactInfo;
        location: ContactLocation;
        formatted: {
            fullAddress: string;
            timeInfo: string;
            mapUrl: string;
        };
    }> {
        return forkJoin({
            info: this.getContactInfo(),
            location: this.getContactLocation()
        }).pipe(
            map(({ info, location }) => ({
                info,
                location,
                formatted: {
                    fullAddress: this.formatFullAddress(location),
                    timeInfo: this.formatTimeInfo(location),
                    mapUrl: this.generateMapUrl(location.coordinates)
                }
            }))
        );
    }

    // ========================
    // ABSTRACT METHODS IMPLEMENTATION
    // ========================

    /**
     * Warmup cache cu date esențiale (optimizat pentru SSR)
     */
    warmupCache(): void {
        if (!this.isBrowser) {
            this.prefetchEssentialData();
        }
    }

    /**
     * Prefetch pentru datele esențiale de contact
     */
    protected prefetchEssentialData(): void {
        if (!this.cacheConfig.enablePrefetch) return;

        // Ambele endpoint-uri sunt esențiale pentru contact
        this.getContactInfo().subscribe();
        this.getContactLocation().subscribe();

        this.log('Essential contact data prefetch initiated');
    }

    /**
     * Validare și transformare specifică pentru datele de contact
     */
    protected validateAndTransformData<T>(data: any, endpoint: EndpointType): T {
        if (!data) {
            throw new Error(`No data received for ${endpoint}`);
        }

        // Validări specifice per endpoint
        switch (endpoint) {
            case EndpointType.CONTACT_INFO:
                return this.validateContactInfo(data) as T;
            case EndpointType.CONTACT_LOCATION:
                return this.validateContactLocation(data) as T;
            default:
                return data;
        }
    }

    // ========================
    // PRIVATE VALIDATION METHODS
    // ========================

    private validateContactInfo(data: any): ContactInfo {
        const defaults: ContactInfo = {
            email: '',
            phone: '',
            location: '',
            github: '',
            linkedin: ''
        };

        return {
            email: this.sanitizeEmail(data.email) || defaults.email,
            phone: this.sanitizePhone(data.phone) || defaults.phone,
            location: (data.location || defaults.location).toString().trim(),
            github: this.sanitizeUrl(data.github) || defaults.github,
            linkedin: this.sanitizeUrl(data.linkedin) || defaults.linkedin
        };
    }

    private validateContactLocation(data: any): ContactLocation {
        const defaults: ContactLocation = {
            name: '',
            address: '',
            city: '',
            country: '',
            coordinates: { lat: 0, lng: 0 },
            timezone: '',
            workingHours: ''
        };

        return {
            name: (data.name || defaults.name).toString().trim(),
            address: (data.address || defaults.address).toString().trim(),
            city: (data.city || defaults.city).toString().trim(),
            country: (data.country || defaults.country).toString().trim(),
            coordinates: this.validateCoordinates(data.coordinates) || defaults.coordinates,
            timezone: (data.timezone || defaults.timezone).toString().trim(),
            workingHours: (data.workingHours || defaults.workingHours).toString().trim()
        };
    }

    private validateCoordinates(coords: any): Coordinates {
        if (!coords || typeof coords !== 'object') {
            return { lat: 0, lng: 0 };
        }

        const lat = Number(coords.lat);
        const lng = Number(coords.lng);

        // Verifică dacă coordonatele sunt în range-ul valid
        if (isNaN(lat) || isNaN(lng) ||
            lat < -90 || lat > 90 ||
            lng < -180 || lng > 180) {
            return { lat: 0, lng: 0 };
        }

        return { lat, lng };
    }

    // ========================
    // PRIVATE UTILITY METHODS
    // ========================

    private sanitizeEmail(email: any): string {
        if (!email || typeof email !== 'string') return '';

        const sanitized = email.trim().toLowerCase();
        return this.isValidEmail(sanitized) ? sanitized : '';
    }

    private sanitizePhone(phone: any): string {
        if (!phone || typeof phone !== 'string') return '';

        // Păstrează doar numere, spații, +, -, (, )
        return phone.replace(/[^0-9\s\+\-\(\)]/g, '').trim();
    }

    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    private isValidPhone(phone: string): boolean {
        // Pattern simplu pentru telefon (minim 7 cifre)
        const phoneRegex = /[\d\s\+\-\(\)]{7,}/;
        return phoneRegex.test(phone);
    }

    private formatFullAddress(location: ContactLocation): string {
        const parts = [location.address, location.city, location.country]
            .filter(part => part && part.trim());
        return parts.join(', ');
    }

    private formatTimeInfo(location: ContactLocation): string {
        const parts = [];
        if (location.timezone) parts.push(`Timezone: ${location.timezone}`);
        if (location.workingHours) parts.push(`Working Hours: ${location.workingHours}`);
        return parts.join(' | ');
    }

    private generateMapUrl(coordinates: Coordinates): string {
        if (!coordinates || coordinates.lat === 0 || coordinates.lng === 0) {
            return '';
        }
        return `https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}`;
    }
}