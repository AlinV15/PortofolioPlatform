// call-to-action.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Mail, Linkedin, Github, Phone, Copy, ArrowRight, Eye, Send } from 'lucide-angular';
import emailjs from '@emailjs/browser';
import { environment } from '../../../../environments/environment';

interface ContactMethod {
  id: string;
  label: string;
  value: string;
  icon: string;
  href: string;
  description: string;
}

interface QuickMessage {
  name: string;
  email: string;
  message: string;
}

@Component({
  selector: 'app-call-to-action',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LucideAngularModule],
  templateUrl: './call-to-action.component.html',
  styleUrls: ['./call-to-action.component.css']
})
export class CallToActionComponent {

  // Register Lucide icons
  readonly Mail = Mail;
  readonly Linkedin = Linkedin;
  readonly Github = Github;
  readonly Phone = Phone;
  readonly Copy = Copy;
  readonly ArrowRight = ArrowRight;
  readonly Eye = Eye;
  readonly Send = Send;

  // EmailJS Configuration - ÎNLOCUIEȘTE CU VALORILE TALE
  private readonly emailjsConfig = {
    serviceId: environment.emailJs.serviceId,
    templateId: environment.emailJs.templateId2,
    publicKey: environment.emailJs.publicKey
  };

  // Contact methods with correct email from CV
  contactMethods: ContactMethod[] = [
    {
      id: 'email',
      label: 'Email',
      value: 'alinviorelciobanu@gmail.com',
      icon: 'Mail',
      href: 'mailto:alinviorelciobanu@gmail.com',
      description: 'Drop me a line anytime'
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      value: '/in/alin-v-ciobanu-84b06b269',
      icon: 'Linkedin',
      href: 'https://www.linkedin.com/in/alin-v-ciobanu-84b06b269/',
      description: 'Let\'s connect professionally'
    },
    {
      id: 'github',
      label: 'GitHub',
      value: '@AlinV15',
      icon: 'Github',
      href: 'https://github.com/AlinV15',
      description: 'Check out my code'
    },
    {
      id: 'phone',
      label: 'Phone',
      value: '0753586216',
      icon: 'Phone',
      href: 'tel:0753586216',
      description: 'Call for urgent matters'
    }
  ];

  // Quick message form
  quickMessage: QuickMessage = {
    name: '',
    email: '',
    message: ''
  };

  // Form states
  isSubmitting = false;
  isSubmitted = false;
  submitError = '';
  copySuccess = '';

  // Quick message templates
  messageTemplates = [
    {
      label: 'Project Collaboration',
      message: 'Hi Alin! I have a project idea and would love to discuss potential collaboration opportunities.'
    },
    {
      label: 'Job Opportunity',
      message: 'Hello! I\'m reaching out regarding a potential job opportunity that might interest you.'
    },
    {
      label: 'General Inquiry',
      message: 'Hi Alin! I\'d like to learn more about your work and experience. Would love to connect!'
    },
    {
      label: 'Mentorship',
      message: 'Hello! I\'m a fellow developer and would appreciate any advice or mentorship you might offer.'
    }
  ];

  constructor() {
    // Inițializează EmailJS
    this.initializeEmailJS();
  }

  private initializeEmailJS(): void {
    emailjs.init(this.emailjsConfig.publicKey);
  }

  // Track by functions
  trackByContactMethod(index: number, method: ContactMethod): string {
    return method.id;
  }

  trackByTemplate(index: number, template: any): string {
    return template.label;
  }

  // Get icon by name
  getIcon(iconName: string) {
    switch (iconName) {
      case 'Mail': return this.Mail;
      case 'Linkedin': return this.Linkedin;
      case 'Github': return this.Github;
      case 'Phone': return this.Phone;
      default: return this.Mail;
    }
  }

  // Handle quick message submission cu EmailJS
  async onSubmitQuickMessage(): Promise<void> {
    if (!this.isValidMessage()) {
      return;
    }

    this.isSubmitting = true;
    this.submitError = '';

    try {
      // Pregătește datele pentru EmailJS template
      const templateParams = {
        from_name: this.quickMessage.name,
        from_email: this.quickMessage.email,
        message: this.quickMessage.message,
        reply_to: this.quickMessage.email,
        message_type: 'Quick Message from CTA Section',
        submission_date: new Date().toLocaleString('en-US', {
          timeZone: 'Europe/Bucharest',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        // Context pentru a diferenția de mesajele din modal
        source: 'Call-to-Action Section'
      };

      // Trimite email prin EmailJS
      const response = await emailjs.send(
        this.emailjsConfig.serviceId,
        this.emailjsConfig.templateId,
        templateParams
      );

      console.log('Quick message sent successfully:', response);

      this.isSubmitting = false;
      this.isSubmitted = true;

      // Reset form după 5 secunde
      setTimeout(() => {
        this.resetForm();
      }, 5000);

    } catch (error: any) {
      console.error('Error sending quick message:', error);
      this.isSubmitting = false;
      this.submitError = this.getErrorMessage(error);
    }
  }

  private getErrorMessage(error: any): string {
    if (error?.text) {
      return `Failed to send message: ${error.text}`;
    }
    if (error?.message) {
      return error.message;
    }
    return 'Failed to send message. Please try again or contact me directly via email.';
  }

  // Validate message form
  isValidMessage(): boolean {
    return !!(
      this.quickMessage.name.trim() &&
      this.quickMessage.email.trim() &&
      this.quickMessage.message.trim() &&
      this.isValidEmail(this.quickMessage.email)
    );
  }

  // Email validation
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Use message template
  useTemplate(template: any): void {
    this.quickMessage.message = template.message;
  }

  // Reset form
  resetForm(): void {
    this.quickMessage = {
      name: '',
      email: '',
      message: ''
    };
    this.isSubmitted = false;
    this.submitError = '';
  }

  // Handle contact method click
  onContactMethodClick(method: ContactMethod): void {
    console.log(`Contact via ${method.label}:`, method.value);
    // Analytics tracking could go here
    // Example: this.analytics.track('contact_method_clicked', { method: method.label });
  }

  // Copy contact info to clipboard
  async copyToClipboard(text: string, methodLabel: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);
      console.log(`${methodLabel} copied to clipboard: ${text}`);

      // Show success message
      this.copySuccess = `${methodLabel} copied to clipboard!`;
      setTimeout(() => {
        this.copySuccess = '';
      }, 2000);

    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
      // Fallback for older browsers
      this.fallbackCopyTextToClipboard(text, methodLabel);
    }
  }

  // Fallback copy method for older browsers
  fallbackCopyTextToClipboard(text: string, methodLabel: string): void {
    const textArea = document.createElement('textarea');
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      if (successful) {
        this.copySuccess = `${methodLabel} copied to clipboard!`;
        setTimeout(() => {
          this.copySuccess = '';
        }, 2000);
      }
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
  }

  // Get current year for footer
  getCurrentYear(): number {
    return new Date().getFullYear();
  }

  // Check if form has errors
  hasFormErrors(): boolean {
    if (!this.quickMessage.name.trim()) return true;
    if (!this.quickMessage.email.trim()) return true;
    if (!this.quickMessage.message.trim()) return true;
    if (!this.isValidEmail(this.quickMessage.email)) return true;
    return false;
  }

  // Get field error message
  getFieldError(field: string): string {
    switch (field) {
      case 'name':
        return !this.quickMessage.name.trim() ? 'Name is required' : '';
      case 'email':
        if (!this.quickMessage.email.trim()) return 'Email is required';
        if (!this.isValidEmail(this.quickMessage.email)) return 'Please enter a valid email';
        return '';
      case 'message':
        return !this.quickMessage.message.trim() ? 'Message is required' : '';
      default:
        return '';
    }
  }
}