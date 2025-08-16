import { Component, OnInit, OnDestroy, signal, computed, effect, inject, PLATFORM_ID, input } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { LucideAngularModule, MapPin, Navigation, Clock, Globe, ExternalLink, Copy, Loader2, MapPinOff, RefreshCw, Focus, Info } from 'lucide-angular';
import { environment } from '../../../../environments/environment';
import { ContactLocation } from '../../shared/models/contact.interface';

// Tipuri locale simple pentru a evita erorile TypeScript
interface SimpleMap {
  setCenter(latLng: any): void;
  setZoom(zoom: number): void;
  addListener(event: string, handler: () => void): any;
}

interface SimpleMarker {
  addListener(event: string, handler: () => void): any;
  map: SimpleMap | null;
  position: any;
}

interface SimpleInfoWindow {
  open(options: { map: SimpleMap; anchor: SimpleMarker } | any, marker?: any): void;
  close(): void;
  setContent(content: string): void;
}

@Component({
  selector: 'app-contact-map',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule
  ],
  templateUrl: './contact-map.component.html',
  styleUrls: ['./contact-map.component.css']
})
export class ContactMapComponent implements OnInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  // Icon variables pentru template
  readonly mapPinIcon = MapPin;
  readonly navigationIcon = Navigation;
  readonly clockIcon = Clock;
  readonly globeIcon = Globe;
  readonly externalLinkIcon = ExternalLink;
  readonly copyIcon = Copy;
  readonly loaderIcon = Loader2;
  readonly mapPinOffIcon = MapPinOff;
  readonly refreshIcon = RefreshCw;
  readonly focusIcon = Focus;
  readonly infoIcon = Info;

  // Input signals for location data
  readonly location = input.required<ContactLocation>();
  readonly error = input<string | null>(null);

  // Angular Signals pentru state management
  private readonly isMapLoaded = signal(false);
  private readonly isMapError = signal(false);
  private readonly mapInstance = signal<SimpleMap | null>(null);
  private readonly marker = signal<SimpleMarker | null>(null);
  private readonly infoWindow = signal<SimpleInfoWindow | null>(null);

  // Computed signals pentru UI state
  readonly showMap = computed(() => this.isMapLoaded() && !this.isMapError() && this.hasValidCoordinates());
  readonly showError = computed(() => this.isMapError() || this.error() !== null || !this.hasValidCoordinates());
  readonly showLoader = computed(() => !this.isMapLoaded() && !this.isMapError() && this.hasValidCoordinates());

  // Computed pentru validarea coordonatelor
  readonly hasValidCoordinates = computed(() => {
    const loc = this.location();
    return loc &&
      loc.coordinates &&
      typeof loc.coordinates.lat === 'number' &&
      typeof loc.coordinates.lng === 'number' &&
      loc.coordinates.lat !== 0 &&
      loc.coordinates.lng !== 0 &&
      loc.coordinates.lat >= -90 && loc.coordinates.lat <= 90 &&
      loc.coordinates.lng >= -180 && loc.coordinates.lng <= 180;
  });

  // Computed pentru informații location formatate
  readonly formattedLocation = computed(() => {
    const loc = this.location();
    return {
      fullAddress: this.formatFullAddress(loc),
      timeInfo: this.formatTimeInfo(loc),
      mapUrl: this.generateMapUrl(loc),
      isComplete: !!(loc.name && loc.address && loc.city && loc.country)
    };
  });

  // Google Maps configuration din environment
  private readonly googleMapsConfig = environment.googleMaps;

  constructor() {
    // Effect pentru reinițializarea hărții când se schimbă location
    effect(() => {
      const loc = this.location();
      if (this.isMapLoaded() && this.hasValidCoordinates()) {
        this.updateMapLocation(loc);
      }
    });

    effect(() => {
      if (this.isMapLoaded()) {
        console.log('Map loaded successfully');
      }
    });

    // Validare API key la inițializare
    if (!this.googleMapsConfig?.apiKey && this.isBrowser) {
      console.error('Google Maps API key is not configured. Please check your environment settings.');
      this.isMapError.set(true);
    } else if (environment.debug && this.isBrowser) {
      console.log('Google Maps configuration loaded:', this.googleMapsConfig);
    }
  }

  ngOnInit(): void {
    if (this.isBrowser && this.hasValidCoordinates()) {
      this.loadGoogleMaps();
    } else if (!this.hasValidCoordinates()) {
      console.warn('Invalid coordinates provided for map:', this.location().coordinates);
    }
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  private async loadGoogleMaps(): Promise<void> {
    if (!this.isBrowser) return;

    try {
      // Verifică dacă Google Maps este deja încărcat
      if ((window as any).google && (window as any).google.maps) {
        this.initializeMap();
        return;
      }

      await this.loadWithDynamicScript();
    } catch (error) {
      console.error('Error loading Google Maps:', error);
      this.isMapError.set(true);
    }
  }

  private async loadWithDynamicScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Validare API key înainte de încărcare
      if (!this.googleMapsConfig.apiKey) {
        reject(new Error('Google Maps API key is not configured'));
        return;
      }

      // Șterge script-ul existent pentru a evita conflictele
      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
      if (existingScript) {
        existingScript.remove();
      }

      // Construiește parametrii URL din environment
      const params = new URLSearchParams({
        key: this.googleMapsConfig.apiKey,
        libraries: [...this.googleMapsConfig.libraries, 'marker'].join(','),
        v: this.googleMapsConfig.version,
        callback: 'initGoogleMapsCallback'
      });

      // Creează element script nou
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?${params.toString()}`;
      script.async = true;
      script.defer = true;

      // Configurează callback global
      (window as any).initGoogleMapsCallback = () => {
        delete (window as any).initGoogleMapsCallback;
        resolve();
        this.initializeMap();
      };

      // Gestionează erorile de încărcare script
      script.onerror = () => {
        delete (window as any).initGoogleMapsCallback;
        reject(new Error('Failed to load Google Maps script - check your API key and network connection'));
      };

      // Adaugă script la document
      document.head.appendChild(script);
    });
  }

  private initializeMap(): void {
    const mapElement = document.getElementById('contact-map');
    if (!mapElement) {
      console.error('Map container not found - make sure element with id="contact-map" exists in template');
      this.isMapError.set(true);
      return;
    }

    if (!this.hasValidCoordinates()) {
      console.error('Cannot initialize map: invalid coordinates');
      this.isMapError.set(true);
      return;
    }

    try {
      // Curăță orice conținut existent
      mapElement.innerHTML = '';

      const googleMaps = (window as any).google.maps;
      const coordinates = this.location().coordinates;

      // Creează instanța hărții cu Map ID pentru funcționalități avansate
      const map = new googleMaps.Map(mapElement, {
        center: coordinates,
        zoom: 13,
        mapTypeId: 'roadmap',
        // Opțiuni moderne pentru hartă
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: true,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: true,
        gestureHandling: 'cooperative',
        clickableIcons: false,
        // Map ID pentru AdvancedMarkerElement (opțional dar recomandat)
        mapId: this.googleMapsConfig.mapId || 'DEMO_MAP_ID'
      });

      // Creează marker folosind AdvancedMarkerElement dacă este disponibil
      let marker: any;

      if (googleMaps.marker && googleMaps.marker.AdvancedMarkerElement) {
        // Folosește noua API AdvancedMarkerElement
        const pin = new googleMaps.marker.PinElement({
          background: '#3B82F6',
          borderColor: '#1E40AF',
          glyphColor: '#FFFFFF',
          glyph: '📍',
          scale: 1.2
        });

        marker = new googleMaps.marker.AdvancedMarkerElement({
          map: map,
          position: coordinates,
          title: this.location().name,
          content: pin.element,
          gmpDraggable: false
        });

        if (environment.debug) {
          console.log('✅ Using AdvancedMarkerElement (recommended)');
        }
      } else {
        // Fallback la Marker clasic (deprecated dar încă funcțional)
        marker = new googleMaps.Marker({
          position: coordinates,
          map: map,
          title: this.location().name,
          animation: googleMaps.Animation.DROP,
          optimized: true,
          icon: {
            url: this.createCustomMarkerIcon(),
            scaledSize: new googleMaps.Size(40, 40),
            anchor: new googleMaps.Point(20, 40)
          }
        });

        if (environment.debug) {
          console.warn('⚠️ Using legacy Marker (deprecated) - consider updating libraries');
        }
      }

      // Creează info window
      const infoWindow = new googleMaps.InfoWindow({
        content: this.createInfoWindowContent(),
        maxWidth: 300,
        disableAutoPan: false,
        pixelOffset: new googleMaps.Size(0, -10)
      });

      // Adaugă listener pentru click pe marker
      marker.addListener('click', () => {
        if (googleMaps.marker && googleMaps.marker.AdvancedMarkerElement) {
          // Pentru AdvancedMarkerElement
          infoWindow.open({
            anchor: marker,
            map: map
          });
        } else {
          // Pentru Marker clasic
          infoWindow.open(map, marker);
        }
      });

      // Adaugă listener pentru click pe hartă (închide info window)
      map.addListener('click', () => {
        infoWindow.close();
      });

      // Opțional: Deschide info window automat după o întârziere
      setTimeout(() => {
        if (googleMaps.marker && googleMaps.marker.AdvancedMarkerElement) {
          infoWindow.open({
            anchor: marker,
            map: map
          });
        } else {
          infoWindow.open(map, marker);
        }
      }, 1500);

      // Actualizează signals
      this.mapInstance.set(map);
      this.marker.set(marker);
      this.infoWindow.set(infoWindow);
      this.isMapLoaded.set(true);
      this.isMapError.set(false);

      // Log success cu informații despre marker
      if (environment.debug) {
        console.log('✅ Google Maps loaded successfully');
        console.log('Map instance:', map);
        console.log('Marker instance:', marker);
        console.log('Location:', this.location());
        console.log('Supports AdvancedMarkerElement:', !!(googleMaps.marker && googleMaps.marker.AdvancedMarkerElement));
      }

    } catch (error) {
      console.error('Error initializing map:', error);
      this.isMapError.set(true);
    }
  }

  private updateMapLocation(newLocation: ContactLocation): void {
    if (!this.hasValidCoordinates()) return;

    const map = this.mapInstance();
    const marker = this.marker();
    const infoWindow = this.infoWindow();

    if (map && marker) {
      const coordinates = newLocation.coordinates;

      // Update map center
      map.setCenter(coordinates);

      // Update marker position
      if ('position' in marker) {
        marker.position = coordinates;
      }

      // Update info window content
      if (infoWindow) {
        infoWindow.setContent(this.createInfoWindowContent());
      }

      console.log('Map location updated:', coordinates);
    }
  }

  private createCustomMarkerIcon(): string {
    // Creează un marker SVG personalizat pentru fallback-ul legacy
    const svg = `
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 0C12.268 0 6 6.268 6 14c0 10.5 14 26 14 26s14-15.5 14-26c0-7.732-6.268-14-14-14z" fill="#3B82F6"/>
        <path d="M20 0C12.268 0 6 6.268 6 14c0 10.5 14 26 14 26s14-15.5 14-26c0-7.732-6.268-14-14-14z" fill="url(#gradient)"/>
        <circle cx="20" cy="14" r="6" fill="white"/>
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#1E40AF;stop-opacity:1" />
          </linearGradient>
        </defs>
      </svg>
    `;

    return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
  }

  private createInfoWindowContent(): string {
    const loc = this.location();
    const formatted = this.formattedLocation();

    return `
      <div style="padding: 16px; max-width: 280px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div style="display: flex; align-items: start; gap: 12px;">
          <div style="width: 32px; height: 32px; background: #dbeafe; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <svg style="width: 16px; height: 16px; color: #3b82f6;" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
            </svg>
          </div>
          <div style="flex: 1; min-width: 0;">
            <h3 style="margin: 0 0 4px 0; font-size: 18px; font-weight: 600; color: #111827;">${loc.name || 'Location'}</h3>
            <p style="margin: 0 0 8px 0; font-size: 14px; color: #6b7280;">${formatted.fullAddress}</p>
            ${loc.workingHours ? `<p style="margin: 0 0 12px 0; font-size: 12px; color: #9ca3af;">${loc.workingHours}</p>` : ''}
            <div style="display: flex; gap: 8px;">
              <button onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${loc.coordinates.lat},${loc.coordinates.lng}', '_blank')" 
                      style="padding: 6px 12px; background: #3b82f6; color: white; border: none; border-radius: 6px; font-size: 12px; cursor: pointer; font-weight: 500;">
                Directions
              </button>
              <button onclick="navigator.clipboard.writeText('${formatted.fullAddress}').then(() => console.log('Address copied!'))" 
                      style="padding: 6px 12px; background: #f3f4f6; color: #374151; border: none; border-radius: 6px; font-size: 12px; cursor: pointer; font-weight: 500;">
                Copy Address
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Utility methods pentru formatarea datelor
  private formatFullAddress(location: ContactLocation): string {
    if (!location) return '';

    const parts = [location.address, location.city, location.country]
      .filter(part => part && part.trim());
    return parts.join(', ');
  }

  private formatTimeInfo(location: ContactLocation): string {
    if (!location) return '';

    const parts = [];
    if (location.timezone) parts.push(`Timezone: ${location.timezone}`);
    if (location.workingHours) parts.push(`Working Hours: ${location.workingHours}`);
    return parts.join(' | ');
  }

  private generateMapUrl(location: ContactLocation): string {
    if (!location || !this.hasValidCoordinates()) return '';

    const { lat, lng } = location.coordinates;
    return `https://www.google.com/maps?q=${lat},${lng}`;
  }

  // Public methods pentru interacțiunea cu harta și UI helpers
  centerMap(): void {
    const map = this.mapInstance();
    if (map && this.hasValidCoordinates()) {
      map.setCenter(this.location().coordinates);
      map.setZoom(13);
    }
  }

  openInGoogleMaps(): void {
    if (!this.isBrowser || !this.hasValidCoordinates()) return;

    const url = this.formattedLocation().mapUrl;
    if (url) {
      window.open(url, '_blank');
    }
  }

  getDirections(): void {
    if (!this.isBrowser || !this.hasValidCoordinates()) return;

    const { lat, lng } = this.location().coordinates;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_blank');
  }

  copyLocation(): void {
    if (!this.isBrowser || !navigator.clipboard) return;

    const locationText = this.formattedLocation().fullAddress;
    if (locationText) {
      navigator.clipboard.writeText(locationText).then(() => {
        console.log('Location copied to clipboard');
        // Aici poți adăuga o notificare toast
      }).catch(err => {
        console.error('Failed to copy location:', err);
      });
    }
  }

  retryLoadMap(): void {
    this.isMapError.set(false);
    this.isMapLoaded.set(false);
    if (this.hasValidCoordinates()) {
      this.loadGoogleMaps();
    }
  }

  // UI Helper methods pentru template
  getCurrentTime(): string {
    if (!this.isBrowser) return '';

    const loc = this.location();
    if (!loc.timezone) return '';

    try {
      const now = new Date();
      return now.toLocaleTimeString('en-US', {
        timeZone: loc.timezone,
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return new Date().toLocaleTimeString();
    }
  }

  showDebugInfo(): boolean {
    return environment.debug || false;
  }

  getApiKeyStatus(): string {
    if (!this.googleMapsConfig.apiKey) return '❌ Not configured';
    if (this.googleMapsConfig.apiKey.length < 20) return '⚠️ Invalid format';
    const maskedKey = this.googleMapsConfig.apiKey.substring(0, 8) + '...' + this.googleMapsConfig.apiKey.slice(-4);
    return `✅ ${maskedKey}`;
  }

  getMapStatus(): string {
    if (this.showLoader()) return '🔄 Loading...';
    if (this.showError()) return '❌ Error';
    if (this.showMap()) return '✅ Loaded';
    return '⏳ Initializing...';
  }

  getMapStatusText(): string {
    if (this.showLoader()) return 'Loading...';
    if (this.showError()) return 'Error';
    if (this.showMap()) return 'Ready';
    return 'Initializing...';
  }

  getLoadedLibraries(): string {
    if (typeof window !== 'undefined' && (window as any).google && (window as any).google.maps) {
      const libraries = [];
      const googleMaps = (window as any).google.maps;
      if (googleMaps.places) libraries.push('places');
      if (googleMaps.geometry) libraries.push('geometry');
      if (googleMaps.marker) libraries.push('marker');
      if (googleMaps.drawing) libraries.push('drawing');
      return libraries.length > 0 ? libraries.join(', ') : 'core only';
    }
    return 'Not loaded';
  }

  // Method pentru verificarea suportului AdvancedMarkerElement
  isAdvancedMarkerSupported(): boolean {
    return !!(typeof window !== 'undefined' &&
      (window as any).google &&
      (window as any).google.maps &&
      (window as any).google.maps.marker &&
      (window as any).google.maps.marker.AdvancedMarkerElement);
  }

  // Enhanced cleanup pentru AdvancedMarkerElement
  private cleanup(): void {
    try {
      // Curăță marker
      const marker = this.marker();
      if (marker && (window as any).google) {
        (window as any).google.maps.event.clearInstanceListeners(marker);
        if ('map' in marker) {
          marker.map = null;
        }
      }

      // Curăță instanța hărții
      const map = this.mapInstance();
      if (map && (window as any).google) {
        (window as any).google.maps.event.clearInstanceListeners(map);
      }

      // Curăță info window
      const infoWindow = this.infoWindow();
      if (infoWindow) {
        infoWindow.close();
      }
    } catch (error) {
      if (environment.debug) {
        console.warn('Error during cleanup:', error);
      }
    }
  }

  // Debug helper methods
  getLocationDebugInfo(): any {
    return {
      location: this.location(),
      hasValidCoordinates: this.hasValidCoordinates(),
      formattedLocation: this.formattedLocation(),
      error: this.error()
    };
  }

  getCoordinatesStatus(): string {
    if (!this.hasValidCoordinates()) return '❌ Invalid coordinates';
    const coords = this.location().coordinates;
    return `✅ ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`;
  }
}