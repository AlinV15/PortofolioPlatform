import { Component, Input, Output, EventEmitter, OnDestroy, Inject, PLATFORM_ID, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  LucideAngularModule,
  Rocket, Wrench, Lightbulb, Star, ExternalLink, Github,
  X, ChevronLeft, ChevronRight, Monitor, Server, Check,
  Zap, Settings, Camera, ZoomIn, ArrowLeft, ArrowRight,
  Clock, Calendar, FolderOpen, Target, Code, Globe,
  Play, Eye, Download, Share2, Bookmark, Hash
} from 'lucide-angular';
import { Project } from '../../shared/models/project.interface';
import { ProjectStatus } from '../../shared/enums/ProjectStatus';
import { ComplexityLevel } from '../../shared/enums/ComplexityLevel';

type TabType = 'overview' | 'technical' | 'gallery' | 'details';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css']
})
export class ProjectDetailsComponent implements OnDestroy, AfterViewInit, OnChanges {

  // ========================
  // INPUTS FROM PARENT
  // ========================
  @Input() project: Project | null = null;
  @Input() canNavigate = false;
  @Input() isFirst = false;
  @Input() isLast = false;
  @Input() currentIndex = -1;
  @Input() totalProjects = 0;
  @Input() onOpen = false;

  // ========================
  // OUTPUTS TO PARENT
  // ========================
  @Output() close = new EventEmitter<void>();
  @Output() previous = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();
  @Output() demoClick = new EventEmitter<Project>();
  @Output() githubClick = new EventEmitter<Project>();

  // ========================
  // LUCIDE ICONS
  // ========================
  readonly rocketIcon = Rocket;
  readonly wrenchIcon = Wrench;
  readonly lightbulbIcon = Lightbulb;
  readonly layersIcon = Star;
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
  readonly playIcon = Play;
  readonly eyeIcon = Eye;
  readonly downloadIcon = Download;
  readonly share2Icon = Share2;
  readonly bookmarkIcon = Bookmark;
  readonly hashIcon = Hash;

  // ========================
  // COMPONENT STATE
  // ========================

  // Gallery state
  currentImageIndex = 0;
  showImageGallery = false;
  imageLoading = false;

  // Content tabs
  activeTab: TabType = 'overview';

  // Browser detection for SSR
  private isBrowser = false;
  private keyboardListener?: (event: KeyboardEvent) => void;
  private scrollPosition = 0;
  toolsAndOther: string[] = [];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngAfterViewInit(): void {
    this.toolsAndOther = [
      ...(this.technicalDetails?.tools || []),
      ...(this.technicalDetails?.other || [])
    ];
    if (this.isBrowser && this.project) {
      this.setupModalBehavior();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.toolsAndOther = [
      ...(this.technicalDetails?.tools || []),
      ...(this.technicalDetails?.other || [])
    ];
    if (changes['project']) {
      if (this.project && this.isBrowser) {
        this.openModal();
        this.resetState();
      } else if (!this.project && this.isBrowser) {
        this.closeModal();
      }
    }
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  // ========================
  // STATE MANAGEMENT
  // ========================

  private resetState(): void {
    this.currentImageIndex = 0;
    this.showImageGallery = false;
    this.activeTab = 'overview';
    this.imageLoading = false;
  }

  // ========================
  // MODAL BEHAVIOR
  // ========================

  private setupModalBehavior(): void {
    if (!this.isBrowser) return;
    try {
      this.setupKeyboardNavigation();
      this.setupScrollLock();
      this.setupFocusTrap();
    } catch (error) {
      console.warn('Modal setup failed:', error);
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

      // Focus the modal after it's rendered
      setTimeout(() => {
        const modalElement = document.querySelector('.project-details-modal');
        if (modalElement instanceof HTMLElement) {
          modalElement.focus();
        }
      }, 100);
    } catch (error) {
      console.warn('Modal open failed:', error);
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
      console.warn('Modal close failed:', error);
    }
  }

  private setupKeyboardNavigation(): void {
    if (!this.isBrowser) return;

    this.keyboardListener = (event: KeyboardEvent) => {
      // Don't handle keyboard events if user is typing in an input
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (event.key) {
        case 'Escape':
          event.preventDefault();
          if (this.showImageGallery) {
            this.closeImageGallery();
          } else {
            this.onClose();
          }
          break;
        case 'ArrowLeft':
          event.preventDefault();
          if (this.showImageGallery) {
            this.previousImage();
          } else if (this.canNavigate && !this.isFirst) {
            this.onPrevious();
          }
          break;
        case 'ArrowRight':
          event.preventDefault();
          if (this.showImageGallery) {
            this.nextImage();
          } else if (this.canNavigate && !this.isLast) {
            this.onNext();
          }
          break;
        case ' ': // Spacebar
          if (this.showImageGallery) {
            event.preventDefault();
            this.nextImage();
          }
          break;
      }
    };

    document.addEventListener('keydown', this.keyboardListener);
  }

  private setupScrollLock(): void {
    if (!this.isBrowser) return;

    // Calculate scrollbar width to prevent layout shift
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
  }

  private setupFocusTrap(): void {
    if (!this.isBrowser) return;

    // This would implement focus trapping within the modal
    // For production, consider using a library like focus-trap
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
      console.warn('Cleanup failed:', error);
    }
  }

  // ========================
  // EVENT HANDLERS
  // ========================

  onClose(): void {
    this.close.emit();
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  onPrevious(): void {
    if (this.canNavigate && !this.isFirst) {
      this.previous.emit();
    }
  }

  onNext(): void {
    if (this.canNavigate && !this.isLast) {
      this.next.emit();
    }
  }

  onDemoClick(): void {
    if (this.project) {
      this.demoClick.emit(this.project);
    }
  }

  onGithubClick(): void {
    if (this.project) {
      this.githubClick.emit(this.project);
    }
  }

  // ========================
  // TAB MANAGEMENT
  // ========================

  setActiveTab(tab: TabType): void {
    this.activeTab = tab;
  }

  get availableTabs(): { id: TabType; label: string; icon: any; count?: number }[] {
    const tabs = [
      { id: 'overview' as TabType, label: 'Overview', icon: this.eyeIcon },
      { id: 'technical' as TabType, label: 'Technical', icon: this.codeIcon }
    ];

    if (this.hasImages) {
      tabs.push({
        id: 'gallery' as TabType,
        label: 'Gallery',
        icon: this.cameraIcon,
      });
    }

    if (this.hasDetailedInfo) {
      tabs.push({ id: 'details' as TabType, label: 'Details', icon: this.folderOpenIcon });
    }

    return tabs;
  }

  // ========================
  // IMAGE GALLERY
  // ========================

  openImageGallery(index: number = 0): void {
    if (!this.hasImages || !this.isBrowser) return;
    this.currentImageIndex = Math.max(0, Math.min(index, (this.project?.images?.length || 1) - 1));
    this.showImageGallery = true;
    this.imageLoading = true;
  }

  closeImageGallery(): void {
    this.showImageGallery = false;
    this.imageLoading = false;
  }

  previousImage(): void {
    if (!this.hasImages) return;
    this.imageLoading = true;
    this.currentImageIndex = this.currentImageIndex > 0
      ? this.currentImageIndex - 1
      : (this.project?.images?.length || 1) - 1;
  }

  nextImage(): void {
    if (!this.hasImages) return;
    this.imageLoading = true;
    this.currentImageIndex = this.currentImageIndex < (this.project?.images?.length || 1) - 1
      ? this.currentImageIndex + 1
      : 0;
  }

  onImageLoad(): void {
    this.imageLoading = false;
  }

  onImageError(): void {
    this.imageLoading = false;
    console.warn('Failed to load image:', this.currentImage);
  }

  // ========================
  // COMPUTED PROPERTIES
  // ========================

  get isInBrowser(): boolean {
    return this.isBrowser;
  }

  get hasImages(): boolean {
    return !!(this.project?.images?.length);
  }

  get hasFeatures(): boolean {
    return !!(this.project?.features?.length);
  }

  get hasChallenges(): boolean {
    return !!(this.project?.challenges?.length);
  }

  get hasTechnologies(): boolean {
    return !!(this.project?.technologies?.length);
  }

  get hasMetrics(): boolean {
    return !!(this.project?.metrics);
  }

  get hasDetailedInfo(): boolean {
    return this.hasChallenges || this.hasMetrics || !!(this.project?.longDescription);
  }

  get currentImage(): string | undefined {
    return this.project?.images?.[this.currentImageIndex];
  }

  get navigationInfo(): string {
    if (!this.canNavigate || this.totalProjects <= 1) return '';
    return `${this.currentIndex + 1} of ${this.totalProjects}`;
  }

  // ========================
  // PROJECT DATA PROCESSING
  // ========================

  get projectStats() {
    if (!this.project) return null;

    return {
      developmentTime: this.project.developmentTime || 'N/A',
      year: this.project.year || 'N/A',
      category: this.formatCategory(this.project.category || ''),
      complexity: this.formatComplexity(this.project.complexity || ''),
      status: this.formatStatus(this.project.status || '')
    };
  }

  get technicalDetails() {
    if (!this.project?.technologies) return { frontend: [], backend: [], tools: [], other: [] };

    const frontend = ['React', 'Angular', 'Vue', 'Next.js', 'HTML', 'CSS', 'JavaScript', 'TypeScript', 'TailwindCSS', 'SCSS', 'Bootstrap'];
    const backend = ['Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Prisma', 'Java', 'Spring', 'C#', '.NET', 'Python', 'Django', 'Flask'];
    const tools = ['Docker', 'AWS', 'Vercel', 'Netlify', 'Git', 'GitHub', 'GitLab', 'Webpack', 'Vite', 'Jest', 'Cypress'];

    return {
      frontend: this.project.technologies.filter(tech =>
        frontend.some(f => tech.toLowerCase().includes(f.toLowerCase()))
      ),
      backend: this.project.technologies.filter(tech =>
        backend.some(b => tech.toLowerCase().includes(b.toLowerCase()))
      ),
      tools: this.project.technologies.filter(tech =>
        tools.some(t => tech.toLowerCase().includes(t.toLowerCase()))
      ),
      other: this.project.technologies.filter(tech =>
        ![...frontend, ...backend, ...tools].some(known =>
          tech.toLowerCase().includes(known.toLowerCase())
        )
      )
    };
  }

  get primaryMetrics() {
    if (!this.project?.metrics) return [];

    const metrics = [
      { label: 'Users', value: this.project.metrics.users, icon: this.targetIcon },
      { label: 'Performance', value: this.project.metrics.performance, icon: this.zapIcon },
      { label: 'Code Quality', value: this.project.metrics.codeQuality, icon: this.checkIcon },
      { label: 'Lines of Code', value: this.project.metrics.lines, icon: this.codeIcon },
      { label: 'Commits', value: this.project.metrics.commits, icon: this.githubIcon },
      { label: 'Test Coverage', value: this.project.metrics.testCoverage ? `${this.project.metrics.testCoverage}%` : undefined, icon: this.checkIcon }
    ];

    return metrics.filter(metric => metric.value !== undefined && metric.value !== null);
  }

  // ========================
  // FORMATTING HELPERS
  // ========================

  public formatCategory(category: string): string {
    const categoryMap: { [key: string]: string } = {
      'ecommerce': 'E-commerce',
      'management': 'Management System',
      'crud': 'CRUD Application',
      'collaboration': 'Collaborative Tool',
      'portfolio': 'Portfolio Website',
      'webapp': 'Web Application',
      'mobile': 'Mobile Application',
      'api': 'API Service'
    };
    return categoryMap[category.toLowerCase()] || category.charAt(0).toUpperCase() + category.slice(1);
  }

  public formatComplexity(complexity: string): string {
    return complexity.charAt(0).toUpperCase() + complexity.slice(1).toLowerCase();
  }

  public formatStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      'production': 'Live in Production',
      'development': 'In Development',
      'testing': 'Testing Phase',
      'maintenance': 'Maintenance Mode',
      'archived': 'Archived',
      'planning': 'Planning Phase'
    };
    return statusMap[status.toLowerCase()] || status.charAt(0).toUpperCase() + status.slice(1);
  }

  getStatusIcon(status: string): any {
    const icons = {
      'production': this.rocketIcon,
      'development': this.wrenchIcon,
      'testing': this.checkIcon,
      'maintenance': this.settingsIcon,
      'archived': this.folderOpenIcon,
      'planning': this.lightbulbIcon
    };
    return icons[status.toLowerCase() as keyof typeof icons] || this.wrenchIcon;
  }

  getStatusColor(status: string): string {
    const colors = {
      'production': 'text-green-600 dark:text-green-400',
      'development': 'text-yellow-600 dark:text-yellow-400',
      'testing': 'text-blue-600 dark:text-blue-400',
      'maintenance': 'text-purple-600 dark:text-purple-400',
      'archived': 'text-gray-600 dark:text-gray-400',
      'planning': 'text-orange-600 dark:text-orange-400'
    };
    return colors[status.toLowerCase() as keyof typeof colors] || 'text-gray-600 dark:text-gray-400';
  }

  getComplexityColor(complexity: string): string {
    const colors = {
      'beginner': 'text-green-600 dark:text-green-400',
      'intermediate': 'text-yellow-600 dark:text-yellow-400',
      'advanced': 'text-red-600 dark:text-red-400'
    };
    return colors[complexity.toLowerCase() as keyof typeof colors] || 'text-gray-600 dark:text-gray-400';
  }

  getTechBadgeColor(index: number): string {
    const colors = [
      'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
      'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300'
    ];
    return colors[index % colors.length];
  }

  // ========================
  // PERFORMANCE HELPERS
  // ========================

  trackByImage(index: number, image: string): string {
    return image;
  }

  trackByFeature(index: number, feature: string): string {
    return feature;
  }

  trackByTech(index: number, tech: string): string {
    return tech;
  }

  trackByChallenge(index: number, challenge: string): string {
    return challenge;
  }

  trackByTab(index: number, tab: any): string {
    return tab.id;
  }

  trackByMetric(index: number, metric: any): string {
    return metric.label;
  }

  onPreviewImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    // Optionally, set a fallback image or hide the image
    target.src = 'assets/images/placeholder-image.png';
  }

}