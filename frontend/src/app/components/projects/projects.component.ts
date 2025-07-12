import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Project {
  id: number;
  title: string;
  description: string;
  shortDescription: string;
  technologies: string[];
  image: string;
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  category: 'web' | 'mobile' | 'desktop' | 'fullstack';
}

@Component({
  selector: 'app-featured-projects',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent {

  featuredProjects: Project[] = [
    {
      id: 1,
      title: 'E-Commerce Platform',
      description: 'Full-stack e-commerce solution built with Next.js and MongoDB',
      shortDescription: 'Modern e-commerce platform with admin dashboard',
      technologies: ['Next.js', 'TypeScript', 'MongoDB', 'Tailwind CSS'],
      image: '/assets/images/projects/ecommerce-preview.png',
      githubUrl: 'https://github.com/AlinV15/FloweringStoriesApp---ecommerce-app',
      liveUrl: 'https://flowering-stories-app-ecommerce-app.vercel.app/',
      featured: true,
      category: 'fullstack'
    },
    {
      id: 2,
      title: 'Next.js To do App',
      description: 'A platform for management of tasks using a to do list and a kanban board',
      shortDescription: 'Team collaboration tool with React and Socket.io',
      technologies: ['Next.js', 'MongoDB'],
      image: '/assets/images/projects/todo-preview.webp',
      githubUrl: 'https://github.com/AlinV15/Todo-App-with-Next.js',
      featured: true,
      category: 'web'
    },
    {
      id: 3,
      title: 'Quotez App',
      description: 'An app that shows different quotes, that can be created, read, updated and deleted',
      shortDescription: 'An quote app using React & Express',
      technologies: ['React', 'Express', 'MongoDB', 'JavaScript'],
      image: '/assets/images/projects/quoteapp-preview.png',
      githubUrl: 'https://github.com/AlinV15/QuotezApp',
      featured: true,
      category: 'fullstack'
    }
  ];

  // Track by function for better performance
  trackByProject(index: number, project: Project): number {
    return project.id;
  }

  // Method to get technology badge color
  getTechBadgeColor(tech: string): string {
    const techColors: { [key: string]: string } = {
      'Angular': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      'React': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'Next.js': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      'TypeScript': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'JavaScript': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'Java': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      'Spring Boot': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'Node.js': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'PostgreSQL': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
      'MongoDB': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'MySQL': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'Tailwind CSS': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
      'Socket.io': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
    };

    return techColors[tech] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }

  // Method to handle project click for analytics
  onProjectClick(project: Project): void {
    // You can add analytics tracking here
    console.log(`Project clicked: ${project.title}`);
  }
}