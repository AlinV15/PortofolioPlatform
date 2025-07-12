import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

interface TableOfContentsItem {
  id: string;
  title: string;
}

interface InformationSection {
  title: string;
  description: string;
  itemsTitle?: string;
  items?: string[];
}

interface UsageSection {
  title: string;
  purposes: string[];
}

interface SharingSection {
  title: string;
  content: string;
  items?: string[];
}

interface SecuritySection {
  title: string;
  description: string;
  measures?: string[];
}

interface RightsSection {
  title: string;
  description: string;
  rights?: string[];
}

interface RetentionSection {
  title: string;
  description: string;
  items?: string[];
}

interface TransferSection {
  title: string;
  description: string;
  items?: string[];
}

interface UpdateSection {
  title: string;
  description: string;
  methods?: string[];
}

interface LegalBasisItem {
  type: string;
  description: string;
}

interface DisclosureSection {
  title: string;
  description: string;
  items?: string[];
}


@Component({
  selector: 'app-privacy',
  imports: [CommonModule],
  templateUrl: './privacy.component.html',
  styleUrl: './privacy.component.css'
})
export class PrivacyComponent implements OnInit, OnDestroy {

  // Data properties
  ownerName = 'Alin-Viorel Ciobanu';
  country = 'Romania';
  city = 'Iași';
  contactEmail = 'alinviorelciobanu@gmail.com';

  // State properties
  activeSection = 'introduction';
  showBackToTop = false;

  // Table of Contents
  tableOfContents: TableOfContentsItem[] = [
    { id: 'introduction', title: '1. Introduction' },
    { id: 'information-collection', title: '2. Information We Collect' },
    { id: 'information-usage', title: '3. How We Use Information' },
    { id: 'information-sharing', title: '4. Information Sharing' },
    { id: 'data-security', title: '5. Data Security' },
    { id: 'your-rights', title: '6. Your Rights and Choices' },
    { id: 'data-retention', title: '7. Data Retention' },
    { id: 'international-transfers', title: '8. International Transfers' },
    { id: 'childrens-privacy', title: '9. Children\'s Privacy' },
    { id: 'policy-updates', title: '10. Policy Updates' },
    { id: 'legal-basis', title: '11. Legal Basis (EU)' },
    { id: 'contact-privacy', title: '12. Privacy Contact' },
    { id: 'specific-disclosures', title: '13. Specific Disclosures' }
  ];

  // Information Collection Sections
  informationCollectionSections: InformationSection[] = [
    {
      title: '2.1 Personal Information',
      description: 'We may collect personal information that you voluntarily provide to us when you contact us through our contact forms or email, subscribe to our newsletter or updates, engage with our professional networking features, or request information about our services or projects.',
      itemsTitle: 'Types of personal information may include:',
      items: [
        'Name and contact information (email address, phone number)',
        'Professional information (company, job title, industry)',
        'Communication preferences',
        'Any other information you choose to provide'
      ]
    },
    {
      title: '2.2 Automatically Collected Information',
      description: 'When you visit our Platform, we may automatically collect certain information about your device and usage patterns:',
      items: [
        'Device Information: IP address, browser type, operating system, device identifiers',
        'Usage Data: Pages visited, time spent on pages, click-through rates, referring websites',
        'Technical Data: Server logs, error reports, performance metrics'
      ]
    },
    {
      title: '2.3 Cookies and Tracking Technologies',
      description: 'We use cookies and similar tracking technologies to enhance your experience:',
      items: [
        'Essential Cookies: Required for basic website functionality',
        'Analytics Cookies: Help us understand how visitors interact with our Platform',
        'Preference Cookies: Remember your settings and preferences'
      ]
    }
  ];

  // Information Usage Sections
  informationUsageSections: UsageSection[] = [
    {
      title: '3.1 Professional Communication',
      purposes: [
        'Responding to your inquiries and professional requests',
        'Providing information about our services and projects',
        'Facilitating potential collaboration opportunities',
        'Maintaining professional networking relationships'
      ]
    },
    {
      title: '3.2 Platform Improvement',
      purposes: [
        'Analyzing user behavior to improve Platform functionality',
        'Optimizing user experience and interface design',
        'Identifying and fixing technical issues',
        'Developing new features and services'
      ]
    },
    {
      title: '3.3 Legal and Security',
      purposes: [
        'Protecting against fraud, unauthorized access, and security threats',
        'Complying with legal obligations and regulatory requirements',
        'Enforcing our Terms and Conditions',
        'Protecting our rights and interests'
      ]
    }
  ];

  // Information Sharing Sections
  informationSharingSections: SharingSection[] = [
    {
      title: '4.1 No Sale of Personal Information',
      content: 'We do not sell, trade, or rent your personal information to third parties for marketing purposes.'
    },
    {
      title: '4.2 Limited Sharing',
      content: 'We may share your information only in the following circumstances:',
      items: [
        'With your explicit consent',
        'For professional collaboration when you\'ve expressed interest',
        'Service providers who assist us in operating our Platform (with appropriate data protection agreements)',
        'Legal requirements when required by law or legal process'
      ]
    },
    {
      title: '4.3 Third-Party Services',
      content: 'Our Platform may integrate with third-party services:',
      items: [
        'GitHub: For project repository links and code demonstrations',
        'LinkedIn: For professional networking and profile verification',
        'Analytics Services: For understanding Platform usage (anonymized data)'
      ]
    }
  ];

  // Data Security Sections
  dataSecuritySections: SecuritySection[] = [
    {
      title: '5.1 Security Measures',
      description: 'We implement appropriate technical and organizational measures to protect your information:',
      measures: [
        'Encryption of data in transit and at rest',
        'Regular security assessments and updates',
        'Access controls and authentication mechanisms',
        'Secure hosting and infrastructure'
      ]
    },
    {
      title: '5.2 Data Breach Response',
      description: 'In the event of a data breach, we will:',
      measures: [
        'Promptly assess the scope and impact',
        'Take immediate steps to contain the breach',
        'Notify affected individuals and relevant authorities as required by law',
        'Implement additional safeguards to prevent future incidents'
      ]
    }
  ];

  // Your Rights Sections
  yourRightsSections: RightsSection[] = [
    {
      title: '6.1 Access and Control',
      description: 'You have the right to:',
      rights: [
        'Access your personal information we hold',
        'Correct inaccurate or incomplete information',
        'Delete your personal information (subject to legal requirements)',
        'Restrict processing of your information',
        'Data portability in commonly used formats'
      ]
    },
    {
      title: '6.2 Communication Preferences',
      description: 'You can:',
      rights: [
        'Opt-out of marketing communications at any time',
        'Update your contact preferences',
        'Unsubscribe from newsletters and updates'
      ]
    },
    {
      title: '6.3 Cookie Preferences',
      description: 'You can control cookies through:',
      rights: [
        'Browser settings to block or delete cookies',
        'Opt-out mechanisms for analytics services',
        'Platform preference settings where available'
      ]
    }
  ];

  // Data Retention Sections
  dataRetentionSections: RetentionSection[] = [
    {
      title: '7.1 Retention Periods',
      description: 'We retain your information for as long as necessary to:',
      items: [
        'Fulfill the purposes outlined in this Privacy Policy',
        'Comply with legal obligations',
        'Resolve disputes and enforce agreements',
        'Maintain professional relationship records'
      ]
    },
    {
      title: '7.2 Deletion Process',
      description: 'When retention is no longer necessary, we will:',
      items: [
        'Securely delete or anonymize your information',
        'Remove identifying characteristics from analytical data',
        'Ensure complete removal from backup systems'
      ]
    }
  ];

  // International Transfers Sections
  internationalTransfersSections: TransferSection[] = [
    {
      title: '8.1 Cross-Border Processing',
      description: 'Your information may be processed in countries other than your residence, including:',
      items: [
        'European Union for hosting and analytics services',
        'United States for certain technical services',
        'Romania for primary data processing'
      ]
    },
    {
      title: '8.2 Transfer Safeguards',
      description: 'We ensure appropriate safeguards for international transfers:',
      items: [
        'Standard contractual clauses',
        'Adequacy decisions by relevant authorities',
        'Appropriate technical and organizational measures'
      ]
    }
  ];

  // Policy Updates Sections
  policyUpdatesSections: UpdateSection[] = [
    {
      title: '10.1 Policy Changes',
      description: 'We may update this Privacy Policy to reflect:',
      methods: [
        'Changes in our data practices',
        'Updates to applicable laws and regulations',
        'Improvements to our Platform and services',
        'Feedback from users and stakeholders'
      ]
    },
    {
      title: '10.2 Notification of Changes',
      description: 'We will notify you of material changes by:',
      methods: [
        'Posting the updated policy on our Platform',
        'Updating the "Last Updated" date',
        'Sending email notifications for significant changes (if applicable)',
        'Providing reasonable notice before changes take effect'
      ]
    }
  ];

  // Legal Basis Items
  legalBasisItems: LegalBasisItem[] = [
    {
      type: 'Consent',
      description: 'When you voluntarily provide information or agree to communications'
    },
    {
      type: 'Legitimate Interests',
      description: 'For professional networking, Platform improvement, and security'
    },
    {
      type: 'Legal Obligations',
      description: 'For compliance with applicable laws and regulations'
    },
    {
      type: 'Contract Performance',
      description: 'When processing is necessary for providing requested services'
    }
  ];

  // Specific Disclosures Sections
  specificDisclosuresSections: DisclosureSection[] = [
    {
      title: '13.1 Professional Portfolio Context',
      description: 'This Privacy Policy applies specifically to our professional portfolio platform, which focuses on:',
      items: [
        'Showcasing technical skills and projects',
        'Facilitating professional networking',
        'Demonstrating expertise in full-stack development',
        'Supporting career development and opportunities'
      ]
    },
    {
      title: '13.2 Student Status Considerations',
      description: 'As a Computer Science Economics student, we may:',
      items: [
        'Update our skills and qualifications regularly',
        'Modify project showcases based on learning progress',
        'Adjust professional information as we advance in our career'
      ]
    }
  ];

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.setupScrollListener();
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

  private setupScrollListener(): void {
    // Additional scroll setup if needed
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
