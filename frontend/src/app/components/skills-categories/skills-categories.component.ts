import { Component, Input, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  LucideAngularModule,
  Monitor, Server, Settings, Users, Code, Database, Globe,
  Smartphone, Palette, Zap, Target, Award, TrendingUp, Star
} from 'lucide-angular';
import { PdfDownloadService } from '../../services/pdf-download.service';

export interface Skill {
  id: string;
  name: string;
  level: number; // 0-100
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  description: string;
  yearsOfExperience: number;
  projects?: number; // number of projects using this skill
  icon?: any; // Lucide icon
  color: string;
  category: SkillCategory;
}

export type SkillCategory = 'frontend' | 'backend' | 'tools' | 'soft-skills' | 'languages';

export interface CategoryInfo {
  id: SkillCategory;
  name: string;
  description: string;
  icon: any;
  color: string;
  bgColor: string;
}

@Component({
  selector: 'app-skills-categories',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './skills-categories.component.html',
  styleUrls: ['./skills-categories.component.css']
})
export class SkillsCategoriesComponent implements OnInit, OnDestroy {
  @Input() skills: Skill[] = [];
  @Input() showAnimations: boolean = true;
  @Input() autoRotateCategories: boolean = false;

  // Lucide Icons
  readonly monitorIcon = Monitor;
  readonly serverIcon = Server;
  readonly settingsIcon = Settings;
  readonly usersIcon = Users;
  readonly codeIcon = Code;
  readonly databaseIcon = Database;
  readonly globeIcon = Globe;
  readonly smartphoneIcon = Smartphone;
  readonly paletteIcon = Palette;
  readonly zapIcon = Zap;
  readonly targetIcon = Target;
  readonly awardIcon = Award;
  readonly trendingUpIcon = TrendingUp;
  readonly starIcon = Star;

  activeCategory: SkillCategory = 'frontend';
  private animationTimeouts: any[] = [];
  private rotationTimer?: any;
  private isBrowser: boolean;

  categories: CategoryInfo[] = [
    {
      id: 'frontend',
      name: 'Frontend Development',
      description: 'Client-side technologies and user interface frameworks',
      icon: this.monitorIcon,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20'
    },
    {
      id: 'backend',
      name: 'Backend Development',
      description: 'Server-side technologies and database management',
      icon: this.serverIcon,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/20'
    },
    {
      id: 'tools',
      name: 'Tools & Technologies',
      description: 'Development tools, platforms, and productivity software',
      icon: this.settingsIcon,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20'
    },
    {
      id: 'soft-skills',
      name: 'Soft Skills',
      description: 'Communication, leadership, and interpersonal abilities',
      icon: this.usersIcon,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20'
    },
    {
      id: 'languages',
      name: 'Languages',
      description: 'Programming languages and spoken languages',
      icon: this.globeIcon,
      color: 'text-pink-600 dark:text-pink-400',
      bgColor: 'bg-pink-100 dark:bg-pink-900/20'
    }
  ];

  // Default skills data based on CV
  defaultSkills: Skill[] = [
    // Frontend Skills
    {
      id: 'javascript',
      name: 'JavaScript',
      level: 75,
      proficiency: 'intermediate',
      description: 'Modern ES6+ JavaScript for web development',
      yearsOfExperience: 2,
      projects: 7,
      color: '#F7DF1E',
      category: 'frontend'
    },
    {
      id: 'typescript',
      name: 'TypeScript',
      level: 70,
      proficiency: 'intermediate',
      description: 'Type-safe JavaScript for large applications',
      yearsOfExperience: 1.5,
      projects: 5,
      color: '#3178C6',
      category: 'frontend'
    },
    {
      id: 'react',
      name: 'React',
      level: 65,
      proficiency: 'intermediate',
      description: 'Modern React with hooks and context',
      yearsOfExperience: 1.5,
      projects: 4,
      color: '#61DAFB',
      category: 'frontend'
    },
    {
      id: 'angular',
      name: 'Angular',
      level: 55,
      proficiency: 'beginner',
      description: 'Angular framework for enterprise applications',
      yearsOfExperience: 1,
      projects: 2,
      color: '#DD0031',
      category: 'frontend'
    },
    {
      id: 'nextjs',
      name: 'Next.js',
      level: 70,
      proficiency: 'intermediate',
      description: 'React framework for production applications',
      yearsOfExperience: 1.5,
      projects: 4,
      color: '#000000',
      category: 'frontend'
    },
    {
      id: 'tailwindcss',
      name: 'TailwindCSS',
      level: 65,
      proficiency: 'intermediate',
      description: 'Utility-first CSS framework',
      yearsOfExperience: 1,
      projects: 5,
      color: '#06B6D4',
      category: 'frontend'
    },

    // Backend Skills
    {
      id: 'nodejs',
      name: 'Node.js',
      level: 60,
      proficiency: 'intermediate',
      description: 'Server-side JavaScript runtime',
      yearsOfExperience: 1.5,
      projects: 3,
      color: '#339933',
      category: 'backend'
    },
    {
      id: 'mongodb',
      name: 'MongoDB',
      level: 55,
      proficiency: 'beginner',
      description: 'NoSQL database for modern applications',
      yearsOfExperience: 1,
      projects: 4,
      color: '#47A248',
      category: 'backend'
    },
    {
      id: 'postgresql',
      name: 'PostgreSQL',
      level: 60,
      proficiency: 'intermediate',
      description: 'Advanced relational database system',
      yearsOfExperience: 1,
      projects: 2,
      color: '#336791',
      category: 'backend'
    },
    {
      id: 'prisma',
      name: 'Prisma',
      level: 50,
      proficiency: 'beginner',
      description: 'Modern database toolkit and ORM',
      yearsOfExperience: 0.5,
      projects: 2,
      color: '#2D3748',
      category: 'backend'
    },
    {
      id: 'csharp',
      name: 'C#',
      level: 45,
      proficiency: 'beginner',
      description: 'Object-oriented programming language',
      yearsOfExperience: 1,
      projects: 1,
      color: '#239120',
      category: 'backend'
    },
    {
      id: 'java',
      name: 'Java',
      level: 45,
      proficiency: 'beginner',
      description: 'Enterprise application development',
      yearsOfExperience: 1,
      projects: 1,
      color: '#ED8B00',
      category: 'backend'
    },

    // Tools & Technologies
    {
      id: 'git',
      name: 'Git/GitHub',
      level: 70,
      proficiency: 'intermediate',
      description: 'Version control and collaboration',
      yearsOfExperience: 2,
      projects: 7,
      color: '#F05032',
      category: 'tools'
    },
    {
      id: 'vscode',
      name: 'VS Code',
      level: 80,
      proficiency: 'advanced',
      description: 'Primary development environment',
      yearsOfExperience: 2,
      color: '#007ACC',
      category: 'tools'
    },
    {
      id: 'mendix',
      name: 'Mendix',
      level: 65,
      proficiency: 'intermediate',
      description: 'Low-code application development platform',
      yearsOfExperience: 0.5,
      projects: 2,
      color: '#0595DB',
      category: 'tools'
    },
    {
      id: 'wordpress',
      name: 'WordPress',
      level: 55,
      proficiency: 'beginner',
      description: 'Content management system',
      yearsOfExperience: 1,
      projects: 2,
      color: '#21759B',
      category: 'tools'
    },
    {
      id: 'msoffice',
      name: 'Microsoft Office',
      level: 60,
      proficiency: 'intermediate',
      description: 'Productivity suite for business',
      yearsOfExperience: 3,
      color: '#D83B01',
      category: 'tools'
    },

    // Soft Skills
    {
      id: 'teamwork',
      name: 'Teamwork',
      level: 75,
      proficiency: 'intermediate',
      description: 'Collaborative project development',
      yearsOfExperience: 2,
      color: '#FF6B6B',
      category: 'soft-skills'
    },
    {
      id: 'communication',
      name: 'Communication',
      level: 75,
      proficiency: 'intermediate',
      description: 'Effective verbal and written communication',
      yearsOfExperience: 2,
      color: '#4ECDC4',
      category: 'soft-skills'
    },
    {
      id: 'problem-solving',
      name: 'Problem Solving',
      level: 80,
      proficiency: 'intermediate',
      description: 'Analytical thinking and debugging',
      yearsOfExperience: 2,
      color: '#45B7D1',
      category: 'soft-skills'
    },
    {
      id: 'time-management',
      name: 'Time Management',
      level: 70,
      proficiency: 'intermediate',
      description: 'Efficient project planning and execution',
      yearsOfExperience: 2,
      color: '#96CEB4',
      category: 'soft-skills'
    },
    {
      id: 'adaptability',
      name: 'Adaptability',
      level: 85,
      proficiency: 'advanced',
      description: 'Quick learning and technology adoption',
      yearsOfExperience: 2,
      color: '#FFEAA7',
      category: 'soft-skills'
    },

    // Languages
    {
      id: 'romanian',
      name: 'Romanian',
      level: 100,
      proficiency: 'expert',
      description: 'Native speaker',
      yearsOfExperience: 20,
      color: '#FFD93D',
      category: 'languages'
    },
    {
      id: 'english',
      name: 'English',
      level: 65,
      proficiency: 'intermediate',
      description: 'Professional working proficiency',
      yearsOfExperience: 5,
      color: '#6C5CE7',
      category: 'languages'
    },
    {
      id: 'french',
      name: 'French',
      level: 70,
      proficiency: 'intermediate',
      description: 'B1-B2 Level conversational',
      yearsOfExperience: 3,
      color: '#A29BFE',
      category: 'languages'
    }
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private pdfService: PdfDownloadService) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    // Use provided skills or default ones
    if (this.skills.length === 0) {
      this.skills = this.defaultSkills;
    }

    if (this.showAnimations && this.isBrowser) {
      this.startProgressAnimations();
    }

    if (this.autoRotateCategories && this.isBrowser) {
      this.startCategoryRotation();
    }
  }

  ngOnDestroy(): void {
    this.clearAnimationTimeouts();
    if (this.rotationTimer) {
      clearInterval(this.rotationTimer);
    }
  }

  // Category management
  setActiveCategory(category: SkillCategory): void {
    this.activeCategory = category;
    if (this.showAnimations && this.isBrowser) {
      this.startProgressAnimations();
    }
  }

  getSkillsByCategory(category: SkillCategory): Skill[] {
    return this.skills.filter(skill => skill.category === category);
  }

  getActiveSkills(): Skill[] {
    return this.getSkillsByCategory(this.activeCategory);
  }

  getActiveCategoryInfo(): CategoryInfo {
    return this.categories.find(cat => cat.id === this.activeCategory) || this.categories[0];
  }

  // Animation methods
  private startProgressAnimations(): void {
    this.clearAnimationTimeouts();

    const activeSkills = this.getActiveSkills();
    activeSkills.forEach((skill, index) => {
      const timeout = setTimeout(() => {
        this.animateProgressBar(skill.id);
      }, index * 150); // Stagger animations

      this.animationTimeouts.push(timeout);
    });
  }

  private animateProgressBar(skillId: string): void {
    if (!this.isBrowser) return;

    const progressBar = document.querySelector(`[data-skill-id="${skillId}"] .progress-fill`);
    if (progressBar instanceof HTMLElement) {
      progressBar.style.width = '0%';

      setTimeout(() => {
        const skill = this.skills.find(s => s.id === skillId);
        if (skill) {
          progressBar.style.width = `${skill.level}%`;
        }
      }, 50);
    }
  }

  private clearAnimationTimeouts(): void {
    this.animationTimeouts.forEach(timeout => clearTimeout(timeout));
    this.animationTimeouts = [];
  }

  private startCategoryRotation(): void {
    let currentIndex = 0;
    this.rotationTimer = setInterval(() => {
      currentIndex = (currentIndex + 1) % this.categories.length;
      this.setActiveCategory(this.categories[currentIndex].id);
    }, 8000); // Change category every 8 seconds
  }

  // Utility methods
  getProficiencyColor(proficiency: string): string {
    const colors = {
      'beginner': 'text-yellow-600 dark:text-yellow-400',
      'intermediate': 'text-blue-600 dark:text-blue-400',
      'advanced': 'text-green-600 dark:text-green-400',
      'expert': 'text-purple-600 dark:text-purple-400'
    };
    return colors[proficiency as keyof typeof colors] || 'text-gray-600 dark:text-gray-400';
  }

  getProficiencyBadgeColor(proficiency: string): string {
    const colors = {
      'beginner': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'intermediate': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'advanced': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'expert': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
    };
    return colors[proficiency as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }

  getProgressBarColor(level: number): string {
    if (level >= 80) return 'bg-gradient-to-r from-green-500 to-emerald-500';
    if (level >= 60) return 'bg-gradient-to-r from-blue-500 to-cyan-500';
    if (level >= 40) return 'bg-gradient-to-r from-yellow-500 to-orange-500';
    return 'bg-gradient-to-r from-gray-400 to-gray-500';
  }

  getCategoryStats(category: SkillCategory): { total: number; avgLevel: number; maxLevel: number } {
    const categorySkills = this.getSkillsByCategory(category);
    const total = categorySkills.length;
    const avgLevel = total > 0 ? Math.round(categorySkills.reduce((sum, skill) => sum + skill.level, 0) / total) : 0;
    const maxLevel = total > 0 ? Math.max(...categorySkills.map(s => s.level)) : 0;

    return { total, avgLevel, maxLevel };
  }

  // Track by functions for *ngFor
  trackByCategory(index: number, category: CategoryInfo): string {
    return category.id;
  }

  trackBySkill(index: number, skill: Skill): string {
    return skill.id;
  }

  downloadResume() {
    this.pdfService.downloadPDF("CV_English.pdf", "cv-ciobanu-alin-viorel.pdf")
  }
}