import { Component, input, computed, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { LucideAngularModule, Mail, Phone, PhoneCall, MapPin, Github, Linkedin, Send, Copy, ExternalLink } from 'lucide-angular';
import { ContactInfo } from '../../shared/models/contact.interface';
import { MaterialToastService } from '../../services/toast.service';

@Component({
  selector: 'app-contact-info',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule
  ],
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.css']
})
export class ContactInfoComponent {

  constructor(private toastService: MaterialToastService) {

  }
  // Icon variables for template
  readonly mailIcon = Mail;
  readonly phoneIcon = Phone;
  readonly phoneCallIcon = PhoneCall;
  readonly mapPinIcon = MapPin;
  readonly githubIcon = Github;
  readonly linkedinIcon = Linkedin;
  readonly sendIcon = Send;
  readonly copyIcon = Copy;
  readonly externalLinkIcon = ExternalLink;

  // Platform detection
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  // Input signals for contact information
  readonly contactInfo = input.required<ContactInfo>();
  readonly error = input<string | null>(null);

  // Computed signals for formatted contact data
  readonly formattedContactInfo = computed(() => {
    const info = this.contactInfo();
    return {
      email: {
        value: info.email,
        href: info.email ? `mailto:${info.email}` : '',
        valid: this.isValidEmail(info.email),
        displayText: info.email || 'Not available'
      },
      phone: {
        value: info.phone,
        href: info.phone ? `tel:${info.phone.replace(/\s/g, '')}` : '',
        valid: this.isValidPhone(info.phone),
        displayText: info.phone || 'Not available'
      },
      location: {
        value: info.location,
        valid: !!info.location,
        displayText: info.location || 'Not available'
      },
      github: {
        value: info.github,
        valid: !!info.github,
        displayText: this.extractDisplayName(info.github, 'GitHub')
      },
      linkedin: {
        value: info.linkedin,
        valid: !!info.linkedin,
        displayText: this.extractDisplayName(info.linkedin, 'LinkedIn')
      }
    };
  });

  // Computed signal to check if any contact info is available
  readonly hasContactInfo = computed(() => {
    const info = this.contactInfo();
    return !!(info.email || info.phone || info.location || info.github || info.linkedin);
  });

  // Computed signal to check if all essential info is available
  readonly hasEssentialInfo = computed(() => {
    const info = this.contactInfo();
    return !!(info.email && info.phone);
  });

  // Computed signal for social links
  readonly socialLinks = computed(() => {
    const info = this.contactInfo();
    return [
      {
        name: 'GitHub',
        url: info.github,
        icon: this.githubIcon,
        valid: !!info.github,
        displayName: this.extractDisplayName(info.github, 'GitHub')
      },
      {
        name: 'LinkedIn',
        url: info.linkedin,
        icon: this.linkedinIcon,
        valid: !!info.linkedin,
        displayName: this.extractDisplayName(info.linkedin, 'LinkedIn')
      }
    ].filter(link => link.valid);
  });

  // Action methods
  copyToClipboard(text: string, type: string): void {
    if (!this.isBrowser || !text) {
      console.warn(`Cannot copy ${type}: text is empty or not in browser`);
      return;
    }

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        console.log(`${type} copied to clipboard: ${text}`);
        // Here you can add a toast notification
        this.showCopyFeedback(type);
      }).catch(err => {
        console.error(`Failed to copy ${type}:`, err);
        this.fallbackCopyToClipboard(text, type);
      });
    } else {
      this.fallbackCopyToClipboard(text, type);
    }
  }

  openLink(url: string, linkName: string = 'Link'): void {
    if (!this.isBrowser || !url) {
      console.warn(`Cannot open ${linkName}: URL is empty or not in browser`);
      return;
    }

    try {
      // Validate URL before opening
      const validatedUrl = this.validateUrl(url);
      if (validatedUrl) {
        window.open(validatedUrl, '_blank', 'noopener,noreferrer');
        console.log(`Opened ${linkName}: ${validatedUrl}`);
      } else {
        console.error(`Invalid URL for ${linkName}: ${url}`);
      }
    } catch (error) {
      console.error(`Error opening ${linkName}:`, error);
    }
  }

  sendEmail(): void {
    const emailData = this.formattedContactInfo().email;
    if (!this.isBrowser || !emailData.valid) {
      console.warn('Cannot send email: not in browser or invalid email');
      return;
    }

    try {
      window.location.href = emailData.href;
      console.log('Opening email client for:', emailData.value);
    } catch (error) {
      console.error('Error opening email client:', error);
    }
  }

  callPhone(): void {
    const phoneData = this.formattedContactInfo().phone;
    if (!this.isBrowser || !phoneData.valid) {
      console.warn('Cannot make call: not in browser or invalid phone number');
      return;
    }

    try {
      window.location.href = phoneData.href;
      console.log('Initiating call to:', phoneData.value);
    } catch (error) {
      console.error('Error initiating call:', error);
    }
  }

  // Validation methods
  private isValidEmail(email: string): boolean {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  }

  private isValidPhone(phone: string): boolean {
    if (!phone) return false;
    // Basic phone validation - at least 7 digits
    const phoneRegex = /[\d\s\+\-\(\)]{7,}/;
    return phoneRegex.test(phone);
  }

  private validateUrl(url: string): string | null {
    if (!url) return null;

    try {
      // If URL doesn't start with protocol, add https
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }

      // Test if it's a valid URL
      new URL(url);
      return url;
    } catch {
      return null;
    }
  }

  // Utility methods
  private extractDisplayName(url: string, fallback: string): string {
    if (!url) return fallback;

    try {
      const urlObj = new URL(url.startsWith('http') ? url : 'https://' + url);
      const pathname = urlObj.pathname;

      // Extract username from GitHub/LinkedIn URLs
      if (pathname && pathname.length > 1) {
        const segments = pathname.split('/').filter(segment => segment.length > 0);
        if (segments.length > 0) {
          return `@${segments[0]}`;
        }
      }

      return fallback;
    } catch {
      return fallback;
    }
  }

  private showCopyFeedback(type: string): void {
    this.toastService.success(`${type} copied to clipboard!`, 'Close', 2000);
  }

  private fallbackCopyToClipboard(text: string, type: string): void {
    // Fallback for older browsers
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);

      if (successful) {
        this.toastService.success(`${type} copied to clipboard!`, 'Close', 2000);
        this.showCopyFeedback(type);
      } else {
        this.toastService.error(`Failed to copy ${type}. Please try again.`, 'Close', 3000);
      }
    } catch (err) {
      this.toastService.error(`Error copying ${type}: ${err}`, 'Close', 3000);
    }
  }

  // Utility methods for template
  getContactItemClass(isValid: boolean, hasData: boolean): string {
    if (!hasData) return 'contact-item--unavailable';
    if (!isValid) return 'contact-item--invalid';
    return 'contact-item--valid';
  }

  getContactItemStatus(isValid: boolean, hasData: boolean): string {
    if (!hasData) return 'unavailable';
    if (!isValid) return 'invalid';
    return 'available';
  }

  // Debug method for development
  getDebugInfo(): any {
    return {
      hasContactInfo: this.hasContactInfo(),
      hasEssentialInfo: this.hasEssentialInfo(),
      formattedInfo: this.formattedContactInfo(),
      socialLinks: this.socialLinks(),
      error: this.error()
    };
  }
}