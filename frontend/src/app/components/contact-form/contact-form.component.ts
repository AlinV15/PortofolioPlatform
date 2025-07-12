import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, User, Mail, MessageSquare, Send, RefreshCw, Loader2, CheckCircle, XCircle, Phone } from 'lucide-angular';
import emailjs from '@emailjs/browser';
import { environment } from '../../../../environments/environment';

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface ContactFormResponse {
  success: boolean;
  message: string;
  timestamp?: string;
}

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LucideAngularModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ContactFormComponent implements OnInit {
  contactForm: FormGroup;
  isSubmitting = false;
  submitSuccess = false;
  submitError = false;
  errorMessage = '';
  successMessage = '';

  readonly userIcon = User;
  readonly mailIcon = Mail;
  readonly messageSquareIcon = MessageSquare;
  readonly sendIcon = Send;
  readonly refreshIcon = RefreshCw;
  readonly loaderIcon = Loader2;
  readonly checkCircleIcon = CheckCircle;
  readonly xCircleIcon = XCircle;
  readonly phoneIcon = Phone;

  // EmailJS Configuration - folosește același template ca Quick Message
  private readonly emailjsConfig = {
    serviceId: environment.emailJs.serviceId,
    templateId: environment.emailJs.templateId2,
    publicKey: environment.emailJs.publicKey
  };

  // Message templates pentru contact form
  messageTemplates = [
    {
      label: 'General Inquiry',
      message: 'Hi Alin! I\'d like to learn more about your work and experience. Would love to connect!'
    },
    {
      label: 'Project Collaboration',
      message: 'Hi Alin! I have a project idea and would love to discuss potential collaboration opportunities.'
    },
    {
      label: 'Job Opportunity',
      message: 'Hello! I\'m reaching out regarding a potential job opportunity that might interest you.'
    },
    {
      label: 'Technical Question',
      message: 'Hi! I have some technical questions about your projects and would appreciate your insights.'
    },
    {
      label: 'Mentorship Request',
      message: 'Hello! I\'m a fellow developer and would appreciate any advice or mentorship you might offer.'
    },
    {
      label: 'Custom Message',
      message: '' // Permite utilizatorului să scrie propriul mesaj
    }
  ];

  constructor(private fb: FormBuilder) {
    this.contactForm = this.createForm();
  }

  ngOnInit(): void {
    this.setupFormValidation();
    this.initializeEmailJS();
  }

  private initializeEmailJS(): void {
    emailjs.init(this.emailjsConfig.publicKey);
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100),
        Validators.pattern(/^[a-zA-ZăîâșțĂÎÂȘȚ\s]+$/)
      ]],
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.maxLength(255)
      ]],
      message: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(1000)
      ]]
    });
  }

  private setupFormValidation(): void {
    // Real-time validation feedback
    this.contactForm.valueChanges.subscribe(() => {
      if (this.submitError) {
        this.submitError = false;
        this.errorMessage = '';
      }
    });
  }

  // Getters pentru accesarea controalelor în template
  get name() { return this.contactForm.get('name'); }
  get email() { return this.contactForm.get('email'); }
  get message() { return this.contactForm.get('message'); }

  // Verifică dacă un câmp are eroare și a fost atins
  hasError(fieldName: string): boolean {
    const field = this.contactForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  // Get error message for a field
  getErrorMessage(fieldName: string): string {
    const field = this.contactForm.get(fieldName);
    if (!field || !field.errors) return '';

    const errors = field.errors;

    if (errors['required']) return `${this.getFieldLabel(fieldName)} is required`;
    if (errors['minlength']) return `${this.getFieldLabel(fieldName)} must be at least ${errors['minlength'].requiredLength} characters`;
    if (errors['maxlength']) return `${this.getFieldLabel(fieldName)} cannot exceed ${errors['maxlength'].requiredLength} characters`;
    if (errors['email']) return 'Please enter a valid email address';
    if (errors['pattern']) return 'Name can only contain letters and spaces';

    return 'Invalid field';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      'name': 'Name',
      'email': 'Email',
      'message': 'Message'
    };
    return labels[fieldName] || fieldName;
  }

  // Use message template
  useTemplate(template: any): void {
    this.contactForm.patchValue({
      message: template.message
    });
  }

  // Determină tipul de mesaj bazat pe conținut
  private determineMessageType(message: string): string {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('project') && lowerMessage.includes('collaborat')) {
      return 'Project Collaboration';
    } else if (lowerMessage.includes('job') || lowerMessage.includes('opportunity') || lowerMessage.includes('position')) {
      return 'Job Opportunity';
    } else if (lowerMessage.includes('mentor') || lowerMessage.includes('advice') || lowerMessage.includes('guidance')) {
      return 'Mentorship Request';
    } else if (lowerMessage.includes('question') || lowerMessage.includes('help') || lowerMessage.includes('technical')) {
      return 'Technical Question';
    } else {
      return 'General Inquiry';
    }
  }

  // Funcție pentru trimiterea formularului cu EmailJS (același template ca Quick Message)
  async onSubmit(): Promise<void> {
    if (this.contactForm.invalid) {
      this.markAllFieldsAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.submitError = false;
    this.submitSuccess = false;

    try {
      const formData: ContactFormData = this.contactForm.value;

      // Pregătește datele pentru Quick Message template (același ca CTA)
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        message: formData.message,
        reply_to: formData.email,
        message_type: this.determineMessageType(formData.message), // Determinat automat
        submission_date: new Date().toLocaleString('en-US', {
          timeZone: 'Europe/Bucharest',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        // Context pentru a diferenția de CTA
        source: 'Contact Page Form'
      };

      // Trimite email prin EmailJS folosind Quick Message template
      const response = await emailjs.send(
        this.emailjsConfig.serviceId,
        this.emailjsConfig.templateId,
        templateParams
      );

      console.log('Contact form email sent successfully:', response);
      this.handleSubmitSuccess('Your message has been sent successfully! I\'ll get back to you within 24 hours.');

    } catch (error: any) {
      console.error('Contact form email error:', error);
      this.handleSubmitError(this.getEmailJSErrorMessage(error));
    } finally {
      this.isSubmitting = false;
    }
  }

  private getEmailJSErrorMessage(error: any): string {
    if (error?.text) {
      return `Failed to send message: ${error.text}`;
    }
    if (error?.message) {
      return error.message;
    }
    if (error?.status === 0) {
      return 'Network error. Please check your internet connection and try again.';
    }
    return 'Error sending message. Please try again or contact me directly via email.';
  }

  private handleSubmitSuccess(message: string): void {
    this.submitSuccess = true;
    this.successMessage = message;
    this.contactForm.reset();

    // Hide success message after 7 seconds
    setTimeout(() => {
      this.submitSuccess = false;
      this.successMessage = '';
    }, 7000);
  }

  private handleSubmitError(message: string): void {
    this.submitError = true;
    this.errorMessage = message;
  }

  private markAllFieldsAsTouched(): void {
    Object.keys(this.contactForm.controls).forEach(key => {
      this.contactForm.get(key)?.markAsTouched();
    });
  }

  // Function to reset the form
  resetForm(): void {
    this.contactForm.reset();
    this.submitError = false;
    this.submitSuccess = false;
    this.errorMessage = '';
    this.successMessage = '';
  }

  // Funcție pentru validarea în timp real
  onFieldBlur(fieldName: string): void {
    const field = this.contactForm.get(fieldName);
    if (field) {
      field.markAsTouched();
    }
  }

  // Funcție pentru numărarea caracterelor
  getCharacterCount(fieldName: string): number {
    const field = this.contactForm.get(fieldName);
    return field?.value?.length || 0;
  }

  // Funcție pentru verificarea limitei de caractere
  isCharacterLimitExceeded(fieldName: string, limit: number): boolean {
    return this.getCharacterCount(fieldName) > limit;
  }

  // Funcție pentru a obține progresul de completare a formularului
  getFormCompletionPercentage(): number {
    const fields = ['name', 'email', 'message'];
    const completedFields = fields.filter(field => {
      const control = this.contactForm.get(field);
      return control?.value && control.value.trim().length > 0;
    });
    return Math.round((completedFields.length / fields.length) * 100);
  }

  // Funcție pentru a verifica dacă formularul este complet
  isFormComplete(): boolean {
    return this.contactForm.valid && this.getFormCompletionPercentage() === 100;
  }

  // Funcție pentru preview mesaj înainte de trimitere
  getMessagePreview(): string {
    const message = this.contactForm.get('message')?.value || '';
    const words = message.trim().split(/\s+/);
    if (words.length <= 20) return message;
    return words.slice(0, 20).join(' ') + '...';
  }

  // Funcție pentru estimarea timpului de citire a mesajului
  getEstimatedReadTime(): number {
    const message = this.contactForm.get('message')?.value || '';
    const wordsPerMinute = 200; // Viteza medie de citire
    const wordCount = message.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  }

  // Track by functions pentru *ngFor
  trackByTemplate(index: number, template: any): string {
    return template.label;
  }
}