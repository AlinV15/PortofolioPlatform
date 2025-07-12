// skills.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, Palette, Server, Database } from 'lucide-angular';

interface Skill {
  id: number;
  name: string;
  level: number;
  category: 'frontend' | 'backend' | 'database' | 'tools' | 'soft';
  icon: string; // DevIcon class name
  description: string;
  yearsOfExperience: number;
  color: string;
  projects?: string[];
}

interface SkillCategory {
  name: string;
  skills: Skill[];
  icon: any;
  description: string;
}

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css']
})
export class SkillsComponent implements OnInit {

  // Register Lucide icons for categories
  readonly Palette = Palette;
  readonly Server = Server;
  readonly Database = Database;

  // Skills data with DevIcon classes (bazate pe CV-ul tău)
  topSkills: Skill[] = [
    {
      id: 1,
      name: 'JavaScript',
      level: 85,
      category: 'frontend',
      icon: 'devicon-javascript-plain',
      description: 'Modern ES6+ JavaScript with deep understanding of async/await, closures, and prototypes',
      yearsOfExperience: 3,
      color: '#F7DF1E',
      projects: ['E-commerce Application', 'Todo Application', 'Personal Portfolio Website']
    },
    {
      id: 2,
      name: 'TypeScript',
      level: 80,
      category: 'frontend',
      icon: 'devicon-typescript-plain',
      description: 'Strong typing, interfaces, generics, and advanced TypeScript patterns',
      yearsOfExperience: 2,
      color: '#3178C6',
      projects: ['Restaurant Management App', 'RoomieFinder Application', 'Angular Web Application']
    },
    {
      id: 3,
      name: 'React',
      level: 82,
      category: 'frontend',
      icon: 'devicon-react-original',
      description: 'Hooks, Context API, Next.js, and modern React patterns',
      yearsOfExperience: 2,
      color: '#61DAFB',
      projects: ['QuotezApp', 'FloweringStoriesApp', 'Todo Application']
    },
    {
      id: 4,
      name: 'Angular',
      level: 75,
      category: 'frontend',
      icon: 'devicon-angularjs-plain',
      description: 'Component architecture, RxJS, Services, and standalone components',
      yearsOfExperience: 1,
      color: '#DD0031',
      projects: ['Angular Web Application', 'Portfolio Platform']
    },
    {
      id: 5,
      name: 'Next.js',
      level: 80,
      category: 'frontend',
      icon: 'devicon-nextjs-plain',
      description: 'Server-side rendering, static generation, and full-stack React applications',
      yearsOfExperience: 2,
      color: '#000000',
      projects: ['E-commerce Application', 'Restaurant Management App', 'Todo Application', 'RoomieFinder Application']
    },
    {
      id: 6,
      name: 'Java',
      level: 70,
      category: 'backend',
      icon: 'devicon-java-plain',
      description: 'Object-oriented programming, Spring fundamentals, and enterprise patterns',
      yearsOfExperience: 2,
      color: '#ED8B00',
      projects: ['University Projects', 'Programming Exercises']
    },
    {
      id: 7,
      name: 'C#',
      level: 68,
      category: 'backend',
      icon: 'devicon-csharp-plain',
      description: 'Object-oriented programming and .NET framework basics',
      yearsOfExperience: 1,
      color: '#f728f0',
      projects: ['Codecademy Course Projects', 'Learning Exercises']
    },
    {
      id: 8,
      name: 'PostgreSQL',
      level: 75,
      category: 'database',
      icon: 'devicon-postgresql-plain',
      description: 'Advanced queries, indexing, database design, and performance optimization',
      yearsOfExperience: 2,
      color: '#336791',
      projects: ['Restaurant Management App', 'RoomieFinder Application']
    },
    {
      id: 9,
      name: 'MongoDB',
      level: 70,
      category: 'database',
      icon: 'devicon-mongodb-plain',
      description: 'NoSQL database design, aggregation pipelines, and document-based storage',
      yearsOfExperience: 2,
      color: '#47A248',
      projects: ['E-commerce Application', 'QuotezApp', 'Todo Application']
    }
  ];

  // Array-uri pentru fiecare categorie
  frontendSkills: Skill[] = [];
  backendSkills: Skill[] = [];
  databaseSkills: Skill[] = [];
  skillCategories: SkillCategory[] = [];

  // Animation states
  animationTriggered = false;
  animatedSkills = new Set<number>();

  ngOnInit(): void {
    console.log('🚀 Component started, topSkills length:', this.topSkills.length);

    // Populează array-urile direct
    this.frontendSkills = this.topSkills.filter(skill => skill.category === 'frontend');
    this.backendSkills = this.topSkills.filter(skill => skill.category === 'backend');
    this.databaseSkills = this.topSkills.filter(skill => skill.category === 'database');

    console.log('🎨 Frontend skills:', this.frontendSkills.length);
    console.log('⚙️ Backend skills:', this.backendSkills.length);
    console.log('🗄️ Database skills:', this.databaseSkills.length);

    // Creează categoriile
    this.skillCategories = [
      {
        name: 'Frontend',
        skills: this.frontendSkills,
        icon: this.Palette,
        description: 'Modern web technologies and frameworks'
      },
      {
        name: 'Backend',
        skills: this.backendSkills,
        icon: this.Server,
        description: 'Server-side development and APIs'
      },
      {
        name: 'Database',
        skills: this.databaseSkills,
        icon: this.Database,
        description: 'Data management and optimization'
      }
    ];

    // Trigger animations after component loads
    setTimeout(() => {
      this.animationTriggered = true;
      this.animateSkillBars();
    }, 500);
  }

  // Animate skill bars sequentially
  animateSkillBars(): void {
    this.topSkills.forEach((skill, index) => {
      setTimeout(() => {
        this.animatedSkills.add(skill.id);
      }, index * 200);
    });
  }

  // Get skill level class for styling
  getSkillLevelClass(level: number): string {
    if (level >= 85) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    if (level >= 70) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    if (level >= 50) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  }

  // Get skill level text
  getSkillLevelText(level: number): string {
    if (level >= 85) return 'Expert';
    if (level >= 70) return 'Advanced';
    if (level >= 50) return 'Intermediate';
    return 'Beginner';
  }

  // Get progress bar width style
  getProgressWidth(skill: Skill): { [key: string]: string } {
    const isAnimated = this.animatedSkills.has(skill.id);
    return {
      'width': isAnimated ? `${skill.level}%` : '0%',
      'background-color': skill.color,
      'transition': 'width 1s ease-in-out'
    };
  }

  // Track by function for performance
  trackBySkill(index: number, skill: Skill): number {
    return skill.id;
  }

  trackByCategory(index: number, category: SkillCategory): string {
    return category.name;
  }

  trackByTechnology(index: number, tech: any): string {
    return tech.name;
  }

  // Method to handle skill click for detailed view
  onSkillClick(skill: Skill): void {
    console.log(`Skill clicked: ${skill.name}`);
  }

  // Calculate total years of experience
  getTotalExperience(): number {
    return Math.max(...this.topSkills.map(skill => skill.yearsOfExperience));
  }

  // Get average skill level
  getAverageSkillLevel(): number {
    const total = this.topSkills.reduce((sum, skill) => sum + skill.level, 0);
    return Math.round(total / this.topSkills.length);
  }

  // Additional technologies from CV
  additionalTechnologies = [
    { name: 'Prisma', category: 'Database ORM', icon: 'devicon-prisma-original' },
    { name: 'TailwindCSS', category: 'CSS Framework', icon: 'devicon-tailwindcss-plain' },
    { name: 'Git & GitHub', category: 'Version Control', icon: 'devicon-git-plain' },
    { name: 'HTML5', category: 'Markup', icon: 'devicon-html5-plain' },
    { name: 'CSS3', category: 'Styling', icon: 'devicon-css3-plain' },
    { name: 'Node.js', category: 'Runtime', icon: 'devicon-nodejs-plain' },
    { name: 'Express.js', category: 'Backend Framework', icon: 'devicon-express-original' },
    { name: 'WordPress', category: 'CMS Platform', icon: 'devicon-wordpress-plain' }
  ];
}