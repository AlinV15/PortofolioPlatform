import { Component, HostListener, OnDestroy, OnInit, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface ContactInfo {
  text?: string;
  iconPath: string;
  iconPath2?: string;
  fillRule?: string;
  clipRule?: string;
}

type ContentSection = any
@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrl: './terms.component.css',
  imports: [CommonModule, RouterModule]
})
export class TermsComponent implements OnInit, OnDestroy {

  // Data properties
  ownerName = 'Alin-Viorel Ciobanu';
  country = 'Romania';
  city = 'Iași';

  // State properties
  activeSection = 'introduction';
  showBackToTop = false;

  // Table of Contents
  tableOfContents = [
    { id: 'introduction', title: '1. Introduction' },
    { id: 'acceptance', title: '2. Acceptance of Terms' },
    { id: 'services', title: '3. Description of Services' },
    { id: 'responsibilities', title: '4. User Responsibilities' },
    { id: 'intellectual-property', title: '5. Intellectual Property' },
    { id: 'privacy', title: '6. Privacy & Data Protection' },
    { id: 'contact', title: '7. Contact & Communication' },
    { id: 'third-party', title: '8. Third-Party Links' },
    { id: 'disclaimers', title: '9. Disclaimers' },
    { id: 'liability', title: '10. Limitation of Liability' },
    { id: 'updates', title: '11. Professional Updates' },
    { id: 'termination', title: '12. Termination' },
    { id: 'governing-law', title: '13. Governing Law' },
    { id: 'changes', title: '14. Changes to Terms' },
    { id: 'contact-info', title: '15. Contact Information' }
  ];

  // Platform services
  platformServices: string[] = [
    'Professional portfolio showcase and information',
    'Technical project demonstrations and documentation',
    'Professional experience and skills presentation',
    'Contact information and networking capabilities',
    'Educational background and certification display'
  ];

  // User restrictions
  userRestrictions: string[] = [
    'Use the Platform in any way that violates applicable laws or regulations',
    'Transmit or distribute viruses, malware, or other harmful code',
    'Attempt to gain unauthorized access to any part of the Platform',
    'Interfere with or disrupt the Platform\'s functionality',
    'Use automated systems to access the Platform without permission'
  ];

  // Intellectual Property sections
  intellectualPropertySections: ContentSection[] = [
    {
      title: '5.1 Our Content',
      content: 'All content on this Platform, including but not limited to text, graphics, logos, images, code samples, project descriptions, and software, is the property of Alin-Viorel Ciobanu or licensed to us. This content is protected by copyright, trademark, and other intellectual property laws.'
    },
    {
      title: '5.2 Project Showcase',
      content: 'The projects and code samples displayed on this Platform are presented for demonstration purposes. While some projects may be open-source (as indicated by GitHub links), the presentation and compilation of this portfolio content remains our intellectual property.'
    },
    {
      title: '5.3 Limited License',
      content: 'We grant you a limited, non-exclusive, non-transferable license to access and use the Platform for personal, non-commercial purposes only.'
    }
  ];

  // Contact sections
  contactSections: ContentSection[] = [
    {
      title: '7.1 Professional Inquiries',
      content: 'Contact information provided on this Platform is for professional inquiries, collaboration opportunities, and legitimate business purposes only.'
    },
    {
      title: '7.2 Response Times',
      content: 'While we strive to respond to professional inquiries promptly, we do not guarantee specific response times and reserve the right to prioritize communications based on relevance and opportunity.'
    }
  ];

  // Third-party sections
  thirdPartySections: ContentSection[] = [
    {
      title: '8.1 External Links',
      content: 'Our Platform may contain links to third-party websites, services, or resources (including GitHub, LinkedIn, and project repositories). These links are provided for convenience and information purposes only.'
    },
    {
      title: '8.2 No Endorsement',
      content: 'We do not endorse, control, or assume responsibility for the content, privacy policies, or practices of any third-party websites or services.'
    }
  ];

  // Disclaimer sections
  disclaimerSections: ContentSection[] = [
    {
      title: '9.1 Platform Availability',
      content: 'We strive to maintain Platform availability but do not guarantee uninterrupted access. The Platform may be temporarily unavailable due to maintenance, updates, or technical issues.'
    },
    {
      title: '9.2 Technical Information',
      content: 'Technical skills, project descriptions, and other professional information are presented based on our current knowledge and experience. Technology evolves rapidly, and specific technical details may become outdated.'
    },
    {
      title: '9.3 No Warranties',
      content: 'The Platform is provided "as is" without warranties of any kind, either express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, or non-infringement.'
    }
  ];

  // Professional update sections
  professionalUpdateSections: ContentSection[] = [
    {
      title: '11.1 Continuous Learning',
      content: 'As a professional committed to continuous learning and development, information on this Platform may be updated to reflect new skills, experiences, and achievements.'
    },
    {
      title: '11.2 Content Updates',
      content: 'We reserve the right to modify, update, or remove content on the Platform at any time to ensure accuracy and relevance of professional information.'
    }
  ];

  // Contact information
  contactInfo: ContactInfo[] = [
    {
      text: 'alinviorelciobanu@gmail.com',
      iconPath: 'M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z',
      iconPath2: 'M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z'
    },
    {
      text: 'LinkedIn Profile',
      iconPath: 'M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z',
      fillRule: 'evenodd',
      clipRule: 'evenodd'
    },
    {
      text: 'GitHub Profile',
      iconPath: 'M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z',
      fillRule: 'evenodd',
      clipRule: 'evenodd'
    }
  ];

  // Professional information
  professionalInfo: string[] = [
    'Full Stack Developer',
    'Computer Science Economics Student',
    'Iași, Romania'
  ];

  constructor() { }

  ngOnInit(): void {

    this.setupIntersectionObserver();
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(): void {
    // Show/hide back to top button
    this.showBackToTop = window.pageYOffset > 300;

    // Update active section
    this.updateActiveSection();
  }

  scrollToSection(event: Event, sectionId: string): void {
    event.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }


  private setupIntersectionObserver(): void {
    const options = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, options);

    // Observer setup for fade-in animations
    setTimeout(() => {
      const sections = document.querySelectorAll('.section-fade');
      sections.forEach(section => observer.observe(section));
    }, 100);
  }

  private updateActiveSection(): void {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.pageYOffset + 200;

    sections.forEach(section => {
      const element = section as HTMLElement;
      const sectionTop = element.offsetTop;
      const sectionHeight = element.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        this.activeSection = element.id;
      }
    });
  }
}
