import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, Inject, PLATFORM_ID, AfterViewInit, OnChanges, SimpleChanges, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  LucideAngularModule,
  Rocket, Wrench, Lightbulb, Star, ExternalLink, Github,
  X, ChevronLeft, ChevronRight, Monitor, Server, Check,
  Zap, Settings, Camera, ZoomIn, ArrowLeft, ArrowRight,
  Clock, Calendar, FolderOpen, Target, Code, Globe
} from 'lucide-angular';
import { Project } from '../../../interfaces/project.interface';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProjectDetailsComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {
  @Input() project: Project | null = null;
  @Input() isOpen = false;
  @Input() allProjects: Project[] = []; // Pentru navigarea între proiecte
  @Output() close = new EventEmitter<void>();
  @Output() previousProject = new EventEmitter<void>();
  @Output() nextProject = new EventEmitter<void>();

  // Lucide Icons
  readonly rocketIcon = Rocket;
  readonly wrenchIcon = Wrench;
  readonly lightbulbIcon = Lightbulb;
  readonly starIcon = Star;
  readonly externalLinkIcon = ExternalLink;
  readonly githubIcon = Github;
  readonly xIcon = X;
  readonly chevronLeftIcon = ChevronLeft;
  readonly chevronRightIcon = ChevronRight;
  readonly monitorIcon = Monitor;
  readonly serverIcon = Server;
  readonly checkIcon = Check;
  readonly zapIcon = Zap;
  readonly settingsIcon = Settings;
  readonly cameraIcon = Camera;
  readonly zoomInIcon = ZoomIn;
  readonly arrowLeftIcon = ArrowLeft;
  readonly arrowRightIcon = ArrowRight;
  readonly clockIcon = Clock;
  readonly calendarIcon = Calendar;
  readonly folderOpenIcon = FolderOpen;
  readonly targetIcon = Target;
  readonly codeIcon = Code;
  readonly globeIcon = Globe;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  // Gallery state
  currentImageIndex = 0;
  showImageGallery = false;

  // Content tabs - simplificate
  activeTab: 'overview' | 'technical' | 'gallery' = 'overview';

  // Browser detection for SSR
  private isBrowser = false;
  private keyboardListener?: (event: KeyboardEvent) => void;
  private scrollPosition = 0;

  ngOnInit(): void {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngAfterViewInit(): void {
    if (this.isBrowser && this.isOpen) {
      this.setupModalBehavior();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen']) {
      if (this.isOpen && this.isBrowser) {
        this.openModal();
      } else if (!this.isOpen && this.isBrowser) {
        this.closeModal();
      }
    }

    if (changes['project'] && this.project) {
      // Reset state when project changes
      this.currentImageIndex = 0;
      this.showImageGallery = false;
      this.activeTab = 'overview';
    }
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  // Modal behavior methods (păstrează din codul original)
  private setupModalBehavior(): void {
    if (!this.isBrowser) return;
    try {
      this.setupKeyboardNavigation();
      this.setupFocusTrap();
      this.setupScrollLock();
    } catch (error) {
      if (this.isBrowser) {
        console.warn('Modal setup failed:', error);
      }
    }
  }

  private openModal(): void {
    if (!this.isBrowser) return;
    try {
      this.scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${this.scrollPosition}px`;
      document.body.style.width = '100%';
      document.body.classList.add('modal-open');

      setTimeout(() => {
        const modalElement = document.querySelector('.project-details-modal');
        if (modalElement instanceof HTMLElement) {
          modalElement.focus();
        }
      }, 100);
    } catch (error) {
      // Silent fail for SSR
    }
  }

  private closeModal(): void {
    if (!this.isBrowser) return;
    try {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.classList.remove('modal-open');
      window.scrollTo(0, this.scrollPosition);
    } catch (error) {
      // Silent fail for SSR
    }
  }

  private setupKeyboardNavigation(): void {
    if (!this.isBrowser) return;

    this.keyboardListener = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':
          this.onClose();
          break;
        case 'ArrowLeft':
          if (!this.showImageGallery) {
            event.preventDefault();
            this.onPreviousProject();
          }
          break;
        case 'ArrowRight':
          if (!this.showImageGallery) {
            event.preventDefault();
            this.onNextProject();
          }
          break;
      }
    };

    document.addEventListener('keydown', this.keyboardListener);
  }

  private setupFocusTrap(): void {
    // Păstrează din implementarea originală
    if (!this.isBrowser) return;
    // ... implementarea focus trap
  }

  private setupScrollLock(): void {
    // Păstrează din implementarea originală
    if (!this.isBrowser) return;
    // ... implementarea scroll lock
  }

  private cleanup(): void {
    if (!this.isBrowser) return;
    try {
      if (this.keyboardListener) {
        document.removeEventListener('keydown', this.keyboardListener);
      }
      this.closeModal();
      document.body.style.paddingRight = '';
    } catch (error) {
      // Silent fail for SSR
    }
  }

  // Event handlers
  onClose(): void {
    this.close.emit();
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  onPreviousProject(): void {
    this.previousProject.emit();
  }

  onNextProject(): void {
    this.nextProject.emit();
  }

  // Tab navigation - simplificat
  setActiveTab(tab: 'overview' | 'technical' | 'gallery'): void {
    this.activeTab = tab;
  }

  // Image gallery methods - îmbunătățite
  openImageGallery(index: number = 0): void {
    if (!this.project?.images?.length || !this.isBrowser) return;
    this.currentImageIndex = index;
    this.showImageGallery = true;
    document.body.style.overflow = 'hidden';
  }

  closeImageGallery(): void {
    this.showImageGallery = false;
    if (this.isBrowser) {
      document.body.style.overflow = '';
    }
  }

  previousImage(): void {
    if (!this.project?.images?.length) return;
    this.currentImageIndex = this.currentImageIndex > 0
      ? this.currentImageIndex - 1
      : this.project.images.length - 1;
  }

  nextImage(): void {
    if (!this.project?.images?.length) return;
    this.currentImageIndex = this.currentImageIndex < this.project.images.length - 1
      ? this.currentImageIndex + 1
      : 0;
  }

  // External link handlers
  onDemoClick(): void {
    if (!this.isBrowser || !this.project?.demoUrl) return;
    try {
      window.open(this.project.demoUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      if (this.isBrowser) {
        console.warn('Demo link failed:', error);
      }
    }
  }

  onGithubClick(): void {
    if (!this.isBrowser || !this.project?.githubUrl) return;
    try {
      window.open(this.project.githubUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      if (this.isBrowser) {
        console.warn('GitHub link failed:', error);
      }
    }
  }

  getStatusIcon(status: string): any {
    const icons = {
      'production': this.rocketIcon,
      'development': this.wrenchIcon,
      'concept': this.lightbulbIcon
    };
    return icons[status as keyof typeof icons] || this.wrenchIcon;
  }

  getTechBadgeColor(index: number): string {
    const colors = [
      'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
      'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300'
    ];
    return colors[index % colors.length];
  }

  // Project navigation helpers
  get currentProjectIndex(): number {
    if (!this.project || !this.allProjects.length) return -1;
    return this.allProjects.findIndex(p => p.id === this.project!.id);
  }

  get isFirstProject(): boolean {
    return this.currentProjectIndex <= 0;
  }

  get isLastProject(): boolean {
    return this.currentProjectIndex >= this.allProjects.length - 1;
  }

  // Track by functions
  trackByImage(index: number, image: string): string {
    return image;
  }

  trackByFeature(index: number, feature: string): string {
    return feature;
  }

  trackByTech(index: number, tech: string): string {
    return tech;
  }

  // Getters for template
  get isInBrowser(): boolean {
    return this.isBrowser;
  }

  get hasImages(): boolean {
    return !!(this.project?.images?.length);
  }

  get currentImage(): string | undefined {
    return this.project?.images?.[this.currentImageIndex];
  }

  get isFirstImage(): boolean {
    return this.currentImageIndex === 0;
  }

  get isLastImage(): boolean {
    return this.currentImageIndex === (this.project?.images?.length || 1) - 1;
  }

  // Informații de proiect organizate
  get projectStats() {
    return {
      developmentTime: this.project?.developmentTime || 'N/A',
      year: this.project?.year || 'N/A',
      category: this.project?.category || 'N/A',
      complexity: this.project?.complexity || 'N/A',
      status: this.project?.status || 'N/A'
    };
  }

  get technicalDetails() {
    return {
      frontend: this.project?.technologies.filter((tech: string) =>
        ['React', 'Angular', 'Vue', 'Next.js', 'HTML', 'CSS', 'JavaScript', 'TypeScript', 'TailwindCSS'].includes(tech)
      ) || [],
      backend: this.project?.technologies.filter((tech: string) =>
        ['Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Prisma', 'Java', 'Spring', 'C#'].includes(tech)
      ) || []
    };
  }
}