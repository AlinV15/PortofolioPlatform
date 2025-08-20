import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LucideAngularModule, Mail, User, Phone, MessageSquare, Send, CheckCircle, AlertCircle, X } from 'lucide-angular';
import emailjs from '@emailjs/browser';

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
  selector: 'app-hire-me',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './hire-me.component.html',
  styleUrls: ['./hire-me.component.css']
})
export class HireMeComponent implements OnInit {

  // Icons
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

  hireForm: FormGroup;
  isLoading = false;
  showModal = false;
  submitStatus: 'idle' | 'success' | 'error' = 'idle';
  errorMessage = '';

  // EmailJS Configuration
  private readonly emailjsConfig = {
    serviceId: 'YOUR_SERVICE_ID',
    templateId: 'YOUR_TEMPLATE_ID',
    publicKey: 'YOUR_PUBLIC_KEY'
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
  }

  ngOnInit(): void {
    this.initializeEmailJS();
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

  // Getters for validation
  get name() { return this.hireForm.get('name'); }
  get email() { return this.hireForm.get('email'); }
  get projectType() { return this.hireForm.get('projectType'); }
  get budget() { return this.hireForm.get('budget'); }
  get timeline() { return this.hireForm.get('timeline'); }
  get message() { return this.hireForm.get('message'); }

  openModal(): void {
    this.showModal = true;
    this.resetForm();
  }

  closeModal(): void {
    this.showModal = false;
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
        this.closeModal();
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

  getErrorMessage(error: any): string {
    if (error?.text) {
      return `Failed to send message: ${error.text}`;
    }
    if (error?.message) {
      return error.message;
    }
    return 'An unexpected error occurred. Please try again or contact me directly.';
  }

  hasError(controlName: string): boolean {
    const control = this.hireForm.get(controlName);
    return !!(control && control.invalid && control.touched);
  }

  // Track by functions pentru *ngFor
  trackByValue(index: number, item: any): string {
    return item.value;
  }
}