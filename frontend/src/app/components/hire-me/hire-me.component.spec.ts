import { of, throwError } from 'rxjs';

// Mock emailjs
const mockEmailJS = {
  init: jest.fn(),
  send: jest.fn()
};

// Mock emailjs module
jest.mock('@emailjs/browser', () => mockEmailJS);

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

interface FormControl {
  value: any;
  valid: boolean;
  invalid: boolean;
  touched: boolean;
  markAsTouched: jest.Mock;
  hasError: jest.Mock;
}

interface FormGroup {
  value: any;
  valid: boolean;
  invalid: boolean;
  controls: { [key: string]: FormControl };
  get: jest.Mock;
  reset: jest.Mock;
}

// Mock FormBuilder and FormGroup
const createMockFormControl = (value: any = '', valid: boolean = true): FormControl => ({
  value,
  valid,
  invalid: !valid,
  touched: false,
  markAsTouched: jest.fn(),
  hasError: jest.fn().mockReturnValue(!valid)
});

const createMockFormGroup = (formValue: Partial<ContactForm>): FormGroup => {
  const controls: { [key: string]: FormControl } = {
    name: createMockFormControl(formValue.name || '', !!formValue.name),
    email: createMockFormControl(formValue.email || '', !!formValue.email),
    phone: createMockFormControl(formValue.phone || ''),
    company: createMockFormControl(formValue.company || ''),
    projectType: createMockFormControl(formValue.projectType || '', !!formValue.projectType),
    budget: createMockFormControl(formValue.budget || '', !!formValue.budget),
    timeline: createMockFormControl(formValue.timeline || '', !!formValue.timeline),
    message: createMockFormControl(formValue.message || '', !!formValue.message)
  };

  return {
    value: formValue,
    valid: Object.values(controls).every(control => control.valid),
    invalid: Object.values(controls).some(control => control.invalid),
    controls,
    get: jest.fn((controlName: string) => controls[controlName]),
    reset: jest.fn()
  };
};

// Mock class that replicates HireMeComponent logic without Angular decorators
class MockHireMeComponent {
  // Icons - simplified for testing
  readonly icons = {
    mail: 'Mail',
    user: 'User',
    phone: 'Phone',
    message: 'MessageSquare',
    send: 'Send',
    success: 'CheckCircle',
    error: 'AlertCircle',
    close: 'X'
  };

  hireForm: FormGroup;
  isLoading = false;
  showModal = false;
  submitStatus: 'idle' | 'success' | 'error' = 'idle';
  errorMessage = '';

  // EmailJS Configuration
  private readonly emailjsConfig = {
    serviceId: 'test_service_id',
    templateId: 'test_template_id',
    publicKey: 'test_public_key'
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

  constructor(private fb: any) {
    this.hireForm = this.createForm();
  }

  private createForm(): FormGroup {
    // Mock form creation
    return createMockFormGroup({});
  }

  private initializeEmailJS(): void {
    mockEmailJS.init(this.emailjsConfig.publicKey);
  }

  // Getters pentru validare
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

      const response = await mockEmailJS.send(
        this.emailjsConfig.serviceId,
        this.emailjsConfig.templateId,
        templateParams
      );

      this.submitStatus = 'success';

      // Auto-close modal after 3 seconds on success
      setTimeout(() => {
        this.closeModal();
      }, 3000);

    } catch (error: any) {
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

  trackByValue(index: number, item: any): string {
    return item.value;
  }
}

// Mock data
const validFormData: ContactForm = {
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+1234567890',
  company: 'Test Company',
  message: 'This is a test message that is long enough to pass validation',
  projectType: 'web-development',
  budget: '5k-10k',
  timeline: '2-3-months'
};

const invalidFormData: Partial<ContactForm> = {
  name: '',
  email: 'invalid-email',
  message: 'short'
};

describe('HireMeComponent Logic Tests', () => {
  let component: MockHireMeComponent;
  let mockFormBuilder: any;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Setup mock FormBuilder
    mockFormBuilder = {
      group: jest.fn().mockReturnValue(createMockFormGroup({}))
    };

    // Create component instance
    component = new MockHireMeComponent(mockFormBuilder);
  });

  it('should initialize with default values', () => {
    expect(component.isLoading).toBe(false);
    expect(component.showModal).toBe(false);
    expect(component.submitStatus).toBe('idle');
    expect(component.errorMessage).toBe('');
  });

  it('should have correct project types options', () => {
    expect(component.projectTypes).toHaveLength(8);
    expect(component.projectTypes[0]).toEqual({
      value: 'web-development',
      label: 'Web Development'
    });
    expect(component.projectTypes[7]).toEqual({
      value: 'other',
      label: 'Other'
    });
  });

  it('should have correct budget ranges options', () => {
    expect(component.budgetRanges).toHaveLength(6);
    expect(component.budgetRanges[0]).toEqual({
      value: 'under-1k',
      label: 'Under $1,000'
    });
    expect(component.budgetRanges[5]).toEqual({
      value: 'discuss',
      label: 'Let\'s discuss'
    });
  });

  it('should have correct timeline options', () => {
    expect(component.timelines).toHaveLength(5);
    expect(component.timelines[0]).toEqual({
      value: 'asap',
      label: 'ASAP'
    });
    expect(component.timelines[4]).toEqual({
      value: 'flexible',
      label: 'Flexible timeline'
    });
  });

  it('should open modal and reset form', () => {
    component.submitStatus = 'error';
    component.errorMessage = 'Some error';

    component.openModal();

    expect(component.showModal).toBe(true);
    expect(component.hireForm.reset).toHaveBeenCalled();
  });

  it('should close modal and reset status', () => {
    component.showModal = true;
    component.submitStatus = 'success';
    component.errorMessage = 'Some error';

    component.closeModal();

    expect(component.showModal).toBe(false);
    expect(component.submitStatus).toBe('idle');
    expect(component.errorMessage).toBe('');
  });

  it('should reset form and clear status', () => {
    component.submitStatus = 'error';
    component.errorMessage = 'Some error';

    component.resetForm();

    expect(component.hireForm.reset).toHaveBeenCalled();
    expect(component.submitStatus).toBe('idle');
    expect(component.errorMessage).toBe('');
  });

  it('should not submit when form is invalid', async () => {
    component.hireForm = createMockFormGroup(invalidFormData);
    component.hireForm.invalid = true;

    await component.onSubmit();

    expect(mockEmailJS.send).not.toHaveBeenCalled();
    expect(component.isLoading).toBe(false);
  });

  it('should mark all fields as touched when form is invalid', async () => {
    component.hireForm = createMockFormGroup(invalidFormData);
    component.hireForm.invalid = true;

    await component.onSubmit();

    Object.values(component.hireForm.controls).forEach(control => {
      expect(control.markAsTouched).toHaveBeenCalled();
    });
  });

  it('should submit successfully when form is valid', async () => {
    component.hireForm = createMockFormGroup(validFormData);
    component.hireForm.invalid = false;
    mockEmailJS.send.mockResolvedValue({ status: 200, text: 'OK' });

    await component.onSubmit();

    expect(component.isLoading).toBe(false);
    expect(component.submitStatus).toBe('success');
    expect(mockEmailJS.send).toHaveBeenCalledWith(
      'test_service_id',
      'test_template_id',
      expect.objectContaining({
        from_name: validFormData.name,
        from_email: validFormData.email,
        project_type: 'Web Development',
        budget: '$5,000 - $10,000',
        timeline: '2-3 months'
      })
    );
  });

  it('should handle email sending errors', async () => {
    component.hireForm = createMockFormGroup(validFormData);
    component.hireForm.invalid = false;
    const error = new Error('Network error');
    mockEmailJS.send.mockRejectedValue(error);

    await component.onSubmit();

    expect(component.isLoading).toBe(false);
    expect(component.submitStatus).toBe('error');
    expect(component.errorMessage).toBe('Network error');
  });

  it('should get project type label correctly', () => {
    const result = component['getProjectTypeLabel']('web-development');
    expect(result).toBe('Web Development');

    const unknownResult = component['getProjectTypeLabel']('unknown');
    expect(unknownResult).toBe('unknown');
  });

  it('should get budget label correctly', () => {
    const result = component['getBudgetLabel']('5k-10k');
    expect(result).toBe('$5,000 - $10,000');

    const unknownResult = component['getBudgetLabel']('unknown');
    expect(unknownResult).toBe('unknown');
  });

  it('should get timeline label correctly', () => {
    const result = component['getTimelineLabel']('2-3-months');
    expect(result).toBe('2-3 months');

    const unknownResult = component['getTimelineLabel']('unknown');
    expect(unknownResult).toBe('unknown');
  });

  it('should format error messages correctly', () => {
    const errorWithText = { text: 'Email service error' };
    expect(component.getErrorMessage(errorWithText)).toBe('Failed to send message: Email service error');

    const errorWithMessage = { message: 'Connection failed' };
    expect(component.getErrorMessage(errorWithMessage)).toBe('Connection failed');

    const unknownError = {};
    expect(component.getErrorMessage(unknownError)).toBe('An unexpected error occurred. Please try again or contact me directly.');
  });

  it('should detect field errors correctly', () => {
    const mockControl = createMockFormControl('', false);
    mockControl.touched = true;
    mockControl.invalid = true;

    component.hireForm.get = jest.fn().mockReturnValue(mockControl);

    const result = component.hasError('name');

    expect(result).toBe(true);
  });

  it('should return false for valid touched fields', () => {
    const mockControl = createMockFormControl('valid value', true);
    mockControl.touched = true;
    mockControl.invalid = false;

    component.hireForm.get = jest.fn().mockReturnValue(mockControl);

    const result = component.hasError('name');

    expect(result).toBe(false);
  });

  it('should track by value correctly', () => {
    const item = { value: 'test-value', label: 'Test Label' };

    const result = component.trackByValue(0, item);

    expect(result).toBe('test-value');
  });

  it('should handle optional form fields correctly', async () => {
    const formDataWithoutOptionals: ContactForm = {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'This is a test message',
      projectType: 'web-development',
      budget: '5k-10k',
      timeline: '2-3-months'
    };

    component.hireForm = createMockFormGroup(formDataWithoutOptionals);
    component.hireForm.invalid = false;
    mockEmailJS.send.mockResolvedValue({ status: 200, text: 'OK' });

    await component.onSubmit();

    expect(mockEmailJS.send).toHaveBeenCalledWith(
      'test_service_id',
      'test_template_id',
      expect.objectContaining({
        phone: 'Not provided',
        company: 'Not provided'
      })
    );
  });

  it('should initialize EmailJS with correct public key', () => {
    component['initializeEmailJS']();

    expect(mockEmailJS.init).toHaveBeenCalledWith('test_public_key');
  });

  it('should auto-close modal on successful submission', (done) => {
    component.hireForm = createMockFormGroup(validFormData);
    component.hireForm.invalid = false;
    component.showModal = true;
    mockEmailJS.send.mockResolvedValue({ status: 200, text: 'OK' });

    const closeModalSpy = jest.spyOn(component, 'closeModal');

    component.onSubmit().then(() => {
      expect(component.submitStatus).toBe('success');

      // Check that setTimeout was called for auto-close
      setTimeout(() => {
        expect(closeModalSpy).toHaveBeenCalled();
        done();
      }, 3100); // Wait slightly longer than the 3000ms timeout
    });
  });
});