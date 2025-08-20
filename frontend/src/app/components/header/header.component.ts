import { Component, afterNextRender } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LucideAngularModule, Mail, User, Phone, MessageSquare, Send, CheckCircle, AlertCircle, X } from 'lucide-angular';
import emailjs from '@emailjs/browser';
import { environment } from '../../../../environments/environment';

interface ContactForm {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  projectType: string;
  budget: string;
  timeline: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isDarkMode = false;
  isMobileMenuOpen = false;

  // Hire Me Modal properties
  showHireMeModal = false;
  hireForm: FormGroup;
  isLoading = false;
  submitStatus: 'idle' | 'success' | 'error' = 'idle';
  errorMessage = '';

  // Icons for Hire Me modal
  readonly icons = {
    mail: Mail,
    user: User,
    phone: Phone,
    message: MessageSquare,
    send: Send,
    success: CheckCircle,
    error: AlertCircle,
    close: X
  };

  // EmailJS Configuration - ÎNLOCUIEȘTE CU VALORILE TALE
  private readonly emailjsConfig = {
    serviceId: environment.emailJs.serviceId,
    templateId: environment.emailJs.templateId,
    publicKey: environment.emailJs.publicKey
  };

  // Form options
  projectTypes = [
    { value: 'web-development', label: 'Web Development' },
    { value: 'mobile-app', label: 'Mobile Application' },
    { value: 'full-stack', label: 'Full-Stack Solution' },
    { value: 'ecommerce', label: 'E-commerce Platform' },
    { value: 'api-integration', label: 'API Integration' },
    { value: 'consultation', label: 'Technical Consultation' },
    { value: 'maintenance', label: 'Maintenance & Support' },
    { value: 'other', label: 'Other' }
  ];

  budgetRanges = [
    { value: 'under-1k', label: 'Under $1,000' },
    { value: '1k-5k', label: '$1,000 - $5,000' },
    { value: '5k-10k', label: '$5,000 - $10,000' },
    { value: '10k-25k', label: '$10,000 - $25,000' },
    { value: 'over-25k', label: 'Over $25,000' },
    { value: 'discuss', label: 'Let\'s discuss' }
  ];

  timelines = [
    { value: 'asap', label: 'ASAP' },
    { value: '1-month', label: 'Within 1 month' },
    { value: '2-3-months', label: '2-3 months' },
    { value: '3-6-months', label: '3-6 months' },
    { value: 'flexible', label: 'Flexible timeline' }
  ];

  constructor(private fb: FormBuilder) {
    this.hireForm = this.createForm();


    afterNextRender(() => {

      setTimeout(() => {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
          this.isDarkMode = true;
          document.documentElement.classList.add('dark');
        }


        this.initializeEmailJS();
      }, 0);
    });
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      company: [''],
      projectType: ['', Validators.required],
      budget: ['', Validators.required],
      timeline: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  private initializeEmailJS(): void {
    emailjs.init(this.emailjsConfig.publicKey);
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  // Hire Me Modal methods
  openHireMeModal(): void {
    this.showHireMeModal = true;
    this.isMobileMenuOpen = false;
    this.resetForm();
  }

  closeHireMeModal(): void {
    this.showHireMeModal = false;
    this.submitStatus = 'idle';
    this.errorMessage = '';
  }

  resetForm(): void {
    this.hireForm.reset();
    this.submitStatus = 'idle';
    this.errorMessage = '';
  }

  async onSubmit(): Promise<void> {
    if (this.hireForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isLoading = true;
    this.submitStatus = 'idle';

    try {
      const formData = this.hireForm.value as ContactForm;

      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        phone: formData.phone || 'Not provided',
        company: formData.company || 'Not provided',
        project_type: this.getProjectTypeLabel(formData.projectType),
        budget: this.getBudgetLabel(formData.budget),
        timeline: this.getTimelineLabel(formData.timeline),
        message: formData.message,
        reply_to: formData.email,
        submission_date: new Date().toLocaleString('en-US', {
          timeZone: 'Europe/Bucharest',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      };

      const response = await emailjs.send(
        this.emailjsConfig.serviceId,
        this.emailjsConfig.templateId,
        templateParams
      );

      console.log('Email sent successfully:', response);
      this.submitStatus = 'success';


      setTimeout(() => {
        this.closeHireMeModal();
      }, 3000);

    } catch (error: any) {
      console.error('Error sending email:', error);
      this.submitStatus = 'error';
      this.errorMessage = this.getErrorMessage(error);
    } finally {
      this.isLoading = false;
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.hireForm.controls).forEach(key => {
      this.hireForm.get(key)?.markAsTouched();
    });
  }

  private getProjectTypeLabel(value: string): string {
    return this.projectTypes.find(type => type.value === value)?.label || value;
  }

  private getBudgetLabel(value: string): string {
    return this.budgetRanges.find(budget => budget.value === value)?.label || value;
  }

  private getTimelineLabel(value: string): string {
    return this.timelines.find(timeline => timeline.value === value)?.label || value;
  }

  private getErrorMessage(error: any): string {
    if (error?.text) {
      return `Failed to send message: ${error.text}`;
    }
    if (error?.message) {
      return error.message;
    }
    return 'An unexpected error occurred. Please try again or contact me directly.';
  }

  // Form validation helpers
  hasError(controlName: string): boolean {
    const control = this.hireForm.get(controlName);
    return !!(control && control.invalid && control.touched);
  }

  getFieldErrorMessage(controlName: string): string {
    const control = this.hireForm.get(controlName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return `${this.getFieldLabel(controlName)} is required`;
      }
      if (control.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (control.errors['minlength']) {
        const requiredLength = control.errors['minlength'].requiredLength;
        return `${this.getFieldLabel(controlName)} must be at least ${requiredLength} characters`;
      }
    }
    return '';
  }

  private getFieldLabel(controlName: string): string {
    const labels: { [key: string]: string } = {
      name: 'Name',
      email: 'Email',
      projectType: 'Project Type',
      budget: 'Budget',
      timeline: 'Timeline',
      message: 'Message'
    };
    return labels[controlName] || controlName;
  }

  // Track by functions pentru *ngFor
  trackByValue(index: number, item: any): string {
    return item.value;
  }
}