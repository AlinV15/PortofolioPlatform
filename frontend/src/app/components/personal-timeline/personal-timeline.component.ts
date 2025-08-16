import { Component, OnInit, ElementRef, ViewChildren, QueryList, AfterViewInit, Inject, PLATFORM_ID, Input } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { LucideAngularModule, GraduationCap, Building2, Award, Rocket, Users, Code, Brain, BookOpen, Target, Trophy, LucideIconData } from 'lucide-angular';
import { TimelineItem } from '../../shared/models/timeline.interface';
import { IconHelperService } from '../../services/icon-helper.service';



export interface TimelineConfig {
  showAnimation: boolean;
  animationDelay: number;
  showIcons: boolean;
  showBadges: boolean;
}

@Component({
  selector: 'app-personal-timeline',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './personal-timeline.component.html',
  styleUrls: ['./personal-timeline.component.css']
})
export class PersonalTimelineComponent implements OnInit, AfterViewInit {
  @ViewChildren('timelineItem') timelineElements!: QueryList<ElementRef>;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private iconHelper: IconHelperService) { }

  // Icon variables for Lucide icons
  readonly icons = {
    // Timeline type icons
    education: GraduationCap,
    experience: Building2,
    certification: Award,
    project: Rocket,

    // Additional icons for better visual representation
    volunteer: Users,
    development: Code,
    skills: Brain,
    learning: BookOpen,
    achievement: Target,
    success: Trophy
  };

  @Input() timelineItems: TimelineItem[] = [];



  ngOnInit(): void {
    // Component initialization logic
  }

  ngAfterViewInit(): void {
    // Only setup scroll animation in browser environment
    if (isPlatformBrowser(this.platformId)) {
      this.setupScrollAnimation();
    } else {
      // For SSR, immediately show all items
      this.showAllItemsForSSR();
    }
  }

  private setupScrollAnimation(): void {
    // Check if IntersectionObserver is available
    if (typeof IntersectionObserver === 'undefined') {
      this.showAllItemsForSSR();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    // Use setTimeout to ensure elements are rendered
    setTimeout(() => {
      this.timelineElements.forEach((element) => {
        if (element?.nativeElement) {
          observer.observe(element.nativeElement);
        }
      });
    }, 100);
  }

  private showAllItemsForSSR(): void {
    // For SSR or when IntersectionObserver is not available, show all items immediately
    setTimeout(() => {
      this.timelineElements.forEach((element) => {
        if (element?.nativeElement) {
          element.nativeElement.classList.add('animate-in');
        }
      });
    }, 100);
  }

  getCardClasses(type: string): string {
    const baseClasses = 'group hover:scale-105 cursor-pointer';
    const typeClasses = {
      education: 'border-l-blue-500 hover:border-l-blue-600',
      experience: 'border-l-green-500 hover:border-l-green-600',
      certification: 'border-l-yellow-500 hover:border-l-yellow-600',
      project: 'border-l-red-500 hover:border-l-red-600'
    };

    return `${baseClasses} ${typeClasses[type as keyof typeof typeClasses] || typeClasses.education}`;
  }

  getBadgeClasses(type: string): string {
    const typeClasses = {
      education: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      experience: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      certification: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      project: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    };

    return typeClasses[type as keyof typeof typeClasses] || typeClasses.education;
  }

  getTypeLabel(type: string): string {
    const labels = {
      education: 'Education',
      experience: 'Experience',
      certification: 'Certification',
      project: 'Projects'
    };

    return labels[type as keyof typeof labels] || 'Unknown';
  }

  getTimelineNodeClasses(type: string): string {
    const typeClasses = {
      education: 'bg-blue-500 border-blue-300',
      experience: 'bg-green-500 border-green-300',
      certification: 'bg-yellow-500 border-yellow-300',
      project: 'bg-red-500 border-red-300'
    };

    return typeClasses[type as keyof typeof typeClasses] || typeClasses.education;
  }

  // Handle external links
  onTimelineItemClick(item: TimelineItem): void {
    if (item.link) {
      window.open(item.link, '_blank');
    }
    console.log(`Timeline item clicked: ${item.title}`);
  }

  // Track by functions for performance
  trackByTimelineItem(index: number, item: TimelineItem): string {
    return item.id;
  }

  trackByDetail(index: number, detail: string): string {
    return detail;
  }

  trackByAchievement(index: number, achievement: string): string {
    return achievement;
  }

  stringToFontAwesome(iconString: string) {
    return this.iconHelper.stringToFontAwesome(iconString);
  }

  stringToLucide(icoString: string) {
    return this.iconHelper.stringToLucide(icoString);
  }


}