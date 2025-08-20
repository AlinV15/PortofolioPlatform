declare var gtag: (...args: any[]) => void;
import { Component, OnInit, OnDestroy, signal, computed, effect, viewChild, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LucideAngularModule, Mail, Phone, MapPin, User, Menu, X, Share2, Download, Linkedin, Github, ArrowUp, LucideIconData } from 'lucide-angular';
import { Meta, Title } from '@angular/platform-browser';
import { ContactInfoComponent } from '../../components/contact-info/contact-info.component';
import { ContactFormComponent } from '../../components/contact-form/contact-form.component';
import { ContactMapComponent } from '../../components/contact-map/contact-map.component';
import { PdfDownloadService } from '../../services/pdf-download.service';


import { DataService } from '../../services/data.service';

import { ContactInfo, ContactLocation } from '../../shared/models/contact.interface';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';

export interface ContactSection {
  id: string;
  title: string;
  description: string;
  icon: LucideIconData;
  active: boolean;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    LucideAngularModule,
    ContactInfoComponent,
    ContactFormComponent,
    ContactMapComponent
  ],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit, OnDestroy {
  // Icon variables for template
  readonly mailIcon = Mail;
  readonly phoneIcon = Phone;
  readonly shareIcon = Share2;
  readonly menuIcon = Menu;
  readonly xIcon = X;
  readonly downloadIcon = Download;
  readonly linkedinIcon = Linkedin;
  readonly githubIcon = Github;
  readonly arrowUpIcon = ArrowUp;
  readonly userIcon = User;
  readonly mapPinIcon = MapPin;

  // Subjects for cleanup 
  private readonly destroy$ = new Subject<void>();

  // Contact data signals 
  readonly contactInfo = signal<ContactInfo>({
    email: "",
    phone: "",
    location: "",
    github: "",
    linkedin: ""
  });

  readonly contactLocation = signal<ContactLocation>({
    name: "",
    address: "",
    city: "",
    country: "",
    coordinates: {
      lat: 0,
      lng: 0
    },
    timezone: "",
    workingHours: ""
  });


  readonly contactDataError = signal<string | null>(null);
  readonly locationDataError = signal<string | null>(null);


  private readonly meta = inject(Meta);
  private readonly title = inject(Title);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly dataService = inject(DataService);
  private readonly downloadPdf = inject(PdfDownloadService);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private readonly contactForm = viewChild(ContactFormComponent, { read: ContactFormComponent });
  private readonly contactMap = viewChild(ContactMapComponent, { read: ContactMapComponent });

  // Signals for state management 
  readonly activeSection = signal<string>('info');
  readonly isScrolled = signal<boolean>(false);
  readonly isMobileMenuOpen = signal<boolean>(false);

  // Computed signals for UI state
  readonly showBackToTop = computed(() => this.isScrolled());
  readonly sections = signal<ContactSection[]>([
    {
      id: 'info',
      title: 'Contact Information',
      description: 'Find all the ways to contact me',
      icon: this.userIcon,
      active: true
    },
    {
      id: 'form',
      title: 'Send a Message',
      description: 'Use the form to send me a direct message',
      icon: this.mailIcon,
      active: false
    },
    {
      id: 'map',
      title: 'My Location',
      description: 'See where I am and how to reach me',
      icon: this.mapPinIcon,
      active: false
    }
  ]);

  // Computed for active section data 
  readonly activeSectionData = computed(() =>
    this.sections().find(section => section.id === this.activeSection())
  );

  // Analytics and trackin
  private readonly pageViewTime = signal<number>(Date.now());

  constructor(
    private router: Router
  ) {

    if (this.isBrowser) {
      effect(() => {
        const handleScroll = () => {
          this.isScrolled.set(window.scrollY > 100);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
      });
    }


    effect(() => {
      this.trackSectionView(this.activeSection());
    });
  }

  ngOnInit(): void {
    this.setupSEO();
    this.trackPageView();
    this.setupKeyboardNavigation();
    this.loadContactData();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      console.log('🔄 Route changed - reloading data');
      this.loadContactData();
    });


  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    // Cleanup and tracking
    if (this.isBrowser) {
      const timeOnPage = Date.now() - this.pageViewTime();

      if (typeof gtag !== 'undefined') {
        gtag('event', 'page_engagement', {
          engagement_time_msec: timeOnPage,
          page_title: 'Contact Page'
        });
      }
    }
  }

  /**
   * Load contact data from DataService instead of ContactService
   */
  private loadContactData(): void {
    this.dataService.loadAllData()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (allData) => {

          this.contactInfo.set(allData.contact.info);
          this.contactLocation.set(allData.contact.location);


          this.contactDataError.set(null);
          this.locationDataError.set(null);

        },
        error: (error) => {
          console.error('❌ Error loading contact data from DataService:', error);

          this.contactDataError.set('Failed to load contact information');
          this.locationDataError.set('Failed to load location information');

          this.contactInfo.set({
            email: "",
            phone: "",
            location: "",
            github: "",
            linkedin: ""
          });

          this.contactLocation.set({
            name: "",
            address: "",
            city: "",
            country: "",
            coordinates: { lat: 0, lng: 0 },
            timezone: "",
            workingHours: ""
          });
        }
      });
  }

  /**
   * Retry loading contact data using DataService
   */
  retryLoadContactData(): void {
    this.contactDataError.set(null);
    this.locationDataError.set(null);


    this.dataService.refreshSection('contact').subscribe({
      next: (contactData) => {
        this.contactInfo.set(contactData.info);
        this.contactLocation.set(contactData.location);
      },
      error: (error) => {
        console.error('❌ Error refreshing contact data:', error);
        this.contactDataError.set('Failed to refresh contact information');
        this.locationDataError.set('Failed to refresh location information');
      }
    });
  }

  // Method to get icon variable from icon string 
  getIconForSection(iconName: string): any {
    const iconMap: { [key: string]: any } = {
      'user': this.userIcon,
      'mail': this.mailIcon,
      'map-pin': this.mapPinIcon,
      'phone': this.phoneIcon,
      'share-2': this.shareIcon,
      'menu': this.menuIcon,
      'x': this.xIcon,
      'download': this.downloadIcon,
      'linkedin': this.linkedinIcon,
      'github': this.githubIcon,
      'arrow-up': this.arrowUpIcon
    };
    return iconMap[iconName] || this.userIcon;
  }

  private setupSEO(): void {
    // SEO optimization pentru pagina de contact 
    this.title.setTitle('Contact - Alin Viorel Ciobanu | Full Stack Developer');

    this.meta.updateTag({
      name: 'description',
      content: 'Contact me for collaborations, projects or web development opportunities. Full Stack Developer with experience in React, Next.js, Angular and Spring Boot.'
    });

    this.meta.updateTag({
      name: 'keywords',
      content: 'contact, full stack developer, web development, React, Next.js, Angular, Spring Boot, Iași, Romania'
    });

    this.meta.updateTag({ property: 'og:title', content: 'Contact - Alin Viorel Ciobanu' });
    this.meta.updateTag({ property: 'og:description', content: 'Contact me for collaborations and web development projects' });
    this.meta.updateTag({ property: 'og:type', content: 'website' });

    // Schema.org structured data - doar în browser
    if (this.isBrowser) {
      const structuredData = {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "name": "Contact - Alin Viorel Ciobanu",
        "description": "Contact page for Alin Viorel Ciobanu, Full Stack Developer",
        "mainEntity": {
          "@type": "Person",
          "name": "Alin Viorel Ciobanu",
          "jobTitle": "Full Stack Developer",
          "email": "alinviorelciobanu@gmail.com",
          "telephone": "0753586216",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Iași",
            "addressCountry": "Romania"
          }
        }
      };

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }
  }

  private trackPageView(): void {
    // Analytics tracking for viewing the page 
    if (this.isBrowser && typeof gtag !== 'undefined') {
      gtag('event', 'page_view', {
        page_title: 'Contact Page',
        page_location: window.location.href,
        page_path: '/contact'
      });
    }
  }

  private trackSectionView(sectionId: string): void {
    // Analytics tracking for viewing a section
    if (typeof gtag !== 'undefined') {
      gtag('event', 'section_view', {
        section_name: sectionId,
        page_title: 'Contact Page'
      });
    }
  }

  private setupKeyboardNavigation(): void {
    // Keyboard navigation for accessibility
    if (this.isBrowser) {
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Tab' && event.shiftKey) {

        } else if (event.key === 'Tab') {

        } else if (event.key === 'Escape') {
          this.isMobileMenuOpen.set(false);
        }
      });
    }
  }

  // Navigation methods
  setActiveSection(sectionId: string): void {

    this.sections.update(sections =>
      sections.map(section => ({
        ...section,
        active: section.id === sectionId
      }))
    );
    this.activeSection.set(sectionId);

    // Smooth scroll to section - just in browser
    if (this.isBrowser) {
      const element = document.getElementById(`section-${sectionId}`);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest'
        });
      }
    }
  }

  scrollToSection(sectionId: string): void {
    this.setActiveSection(sectionId);
    this.isMobileMenuOpen.set(false);
  }

  scrollToTop(): void {
    if (this.isBrowser) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(isOpen => !isOpen);
  }

  // Quick actions
  sendQuickEmail(): void {
    const email = this.contactInfo().email;
    if (this.isBrowser && email) {
      window.location.href = `mailto:${email}?subject=Contact from Portfolio`;
    }
  }

  makeQuickCall(): void {
    const phone = this.contactInfo().phone;
    if (this.isBrowser && phone) {
      window.location.href = `tel:${phone}`;
    }
  }

  openLinkedIn(): void {
    const linkedin = this.contactInfo().linkedin;
    if (this.isBrowser && linkedin) {
      window.open(linkedin, '_blank');
    }
  }

  openGitHub(): void {
    const github = this.contactInfo().github;
    if (this.isBrowser && github) {
      window.open(github, '_blank');
    }
  }

  // Utility methods
  shareContact(): void {
    if (this.isBrowser) {
      if (navigator.share) {
        navigator.share({
          title: 'Contact - Alin Viorel Ciobanu',
          text: 'Contact me for collaborations and web development projects',
          url: window.location.href
        }).catch(err => console.log('Error sharing:', err));
      } else {
        this.copyPageUrl();
      }
    }
  }

  copyPageUrl(): void {
    if (this.isBrowser && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).then(() => {
        console.log('URL copied to clipboard');
      }).catch(err => {
        console.error('Failed to copy URL:', err);
      });
    }
  }

  downloadVCard(): void {
    this.downloadPdf.downloadPDF("CV_English.pdf", "CV_Alin-Viorel-Ciobanu")
  }

  // Form interaction methods
  focusContactForm(): void {
    this.setActiveSection('form');
    if (this.isBrowser) {
      setTimeout(() => {
        const formComponent = this.contactForm();
        if (formComponent && formComponent.contactForm?.get('name')) {
          const nameInput = document.querySelector('input[formControlName="name"]') as HTMLInputElement;
          nameInput?.focus();
        }
      }, 500);
    }
  }

  resetContactForm(): void {
    this.contactForm()?.resetForm();
  }

  // Map interaction methods
  centerMap(): void {
    this.contactMap()?.centerMap();
  }

  openMapFullscreen(): void {
    this.setActiveSection('map');
    this.contactMap()?.openInGoogleMaps();
  }

  // Error handling 
  onComponentError(error: any, componentName: string): void {
    console.error(`Error in ${componentName}:`, error);

    if (typeof gtag !== 'undefined') {
      gtag('event', 'exception', {
        description: `${componentName} error: ${error.message}`,
        fatal: false
      });
    }
  }
}