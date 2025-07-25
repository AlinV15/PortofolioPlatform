import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PdfDownloadService } from '../../services/pdf-download.service';

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface SocialLink {
  name: string;
  href: string;
  icon: string;
  ariaLabel: string;
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {



  // Footer navigation sections
  footerSections: FooterSection[] = [
    {
      title: 'Navigation',
      links: [
        { label: 'Home', href: '/' },
        { label: 'About', href: '/about' },
        { label: 'Projects', href: '/projects' },
        { label: 'Skills', href: '/skills' },
        { label: 'Contact', href: '/contact' }
      ]
    },
    {
      title: 'Projects',
      links: [
        { label: 'E-Commerce Platform', href: '/projects/ecommerce' },
        { label: 'Task Manager App', href: '/projects/task-manager' },
        { label: 'CRM System', href: '/projects/crm' },
        { label: 'Portfolio Website', href: '/projects/portfolio' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { label: 'Blog', href: '/blog' },
        { label: 'Resume/CV', href: '/resume', external: true },
        { label: 'Certificates', href: '/certificates' },
        { label: 'Privacy Policy', href: '/privacy' }
      ]
    }
  ];

  // Social media links
  socialLinks: SocialLink[] = [
    {
      name: 'GitHub',
      href: 'https://github.com/alin-viorel',
      icon: 'github',
      ariaLabel: 'Follow me on GitHub'
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com/in/alin-viorel',
      icon: 'linkedin',
      ariaLabel: 'Connect with me on LinkedIn'
    },
    {
      name: 'Twitter',
      href: 'https://twitter.com/alin_viorel',
      icon: 'twitter',
      ariaLabel: 'Follow me on Twitter'
    },
    {
      name: 'Email',
      href: 'mailto:alin.viorel@example.com',
      icon: 'email',
      ariaLabel: 'Send me an email'
    }
  ];

  // Professional info
  professionalInfo = {
    name: 'Alin-Viorel',
    title: 'Full-Stack Developer',
    location: 'Iași, Romania',
    email: 'alin.viorel@example.com',
    tagline: 'Building the future, one line of code at a time.'
  };

  // Quick contact info
  quickContact = {
    email: 'alin.viorel@example.com',
    phone: '+40 123 456 789',
    availability: 'Available for freelance projects'
  };

  // Current year for copyright
  currentYear = new Date().getFullYear();

  // Track by functions
  trackBySection(index: number, section: FooterSection): string {
    return section.title;
  }

  trackByLink(index: number, link: FooterLink): string {
    return link.href;
  }

  trackBySocial(index: number, social: SocialLink): string {
    return social.name;
  }

  // Handle social link clicks for analytics
  onSocialClick(social: SocialLink): void {
    console.log(`Social link clicked: ${social.name}`);
    // Add analytics tracking here
  }

  // Handle footer link clicks
  onFooterLinkClick(link: FooterLink): void {
    console.log(`Footer link clicked: ${link.label}`);
    // Add analytics tracking here
  }

  // Handle newsletter subscription (if implemented)
  onNewsletterSubscribe(email: string): void {
    console.log(`Newsletter subscription: ${email}`);
    // Add newsletter signup logic here
  }

  // Scroll to top functionality
  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  // Get SVG icon for social links
  getSocialIcon(iconName: string): string {
    const icons: { [key: string]: string } = {
      github: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
      </svg>`,
      linkedin: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>`,
      twitter: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
      </svg>`,
      email: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
      </svg>`
    };
    return icons[iconName] || '';
  }


}