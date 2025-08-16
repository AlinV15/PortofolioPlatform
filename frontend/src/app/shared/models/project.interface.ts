
import { ComplexityLevel } from "../enums/ComplexityLevel";
import { ProjectStatus } from "../enums/ProjectStatus";

export interface Project {
    id: string;
    title: string;
    description: string;
    longDescription: string;
    technologies: string[];
    category: string;
    status: ProjectStatus;
    featured: boolean;
    images: string[];
    demoUrl?: string;
    githubUrl: string;
    features: string[];
    challenges?: string[];
    developmentTime: number;
    complexity: ComplexityLevel;
    metrics?: ProjectMetrics;
    tags: string[];
    year: number | string;
    primaryColor: string;
    secondaryColor?: string;
}

export interface ProjectMetrics {
    users?: number;
    performance?: string;
    codeQuality?: string;
    lines?: number;
    commits?: number;
    testCoverage?: number;
    lastUpdated?: number;
}

export interface ProjectFilter {
    category: string;
    technology?: string;
    status?: string;
    complexity?: string;
}

export type ViewMode = 'grid' | 'list';

export interface SortOption {
    field: 'title' | 'year' | 'complexity' | 'technologies';
    direction: 'asc' | 'desc';
}

export interface ProjectExperience {
    yearsActive: number;
    firstProjectYear: number;
    latestProjectYear: number;
    avgComplexity: string;
    avgComplexityLabel: string;
    successRate: number;
    formattedSuccessRate: string;
    deployedProjects: number;
    totalProjects: number;
    liveProjects: number;
    experienceLevel: string;
}

export interface FeaturedProject {
    id: string;
    title: string;
    description: string;
    shortDescription: string;
    technologies: string[];
    image: string;
    githubUrl: string;
    liveUrl: string;
    featured: boolean;
    category: string;
    primaryColor: string;
    secondaryColor: string;
}

export interface ProjectsStats {
    technologies: number;
    totalProjects: number;
    liveProjects: number;
}

export interface ProjectCategoryDistribution {
    category: string;
    projectCount: number;
    percentage: number;
    formatedPercentage: string;
}

export interface StatCard {
    id: string;
    title: string;
    value: string | number;
    icon: any;
    color: string;
    bgColor: string;
    description: string;
    trend?: string;
}

export interface TechStat {
    name: string;
    count: number;
    percentage: number;
}