export interface Project {
    id: string;
    title: string;
    description: string;
    longDescription: string;
    technologies: string[];
    category: 'ecommerce' | 'management' | 'crud' | 'portfolio' | 'collaboration' | 'fullstack' | 'frontend' | 'backend';
    status: 'production' | 'development' | 'concept';
    featured: boolean;
    images: string[];
    demoUrl?: string;
    githubUrl: string;
    features: string[];
    challenges?: string[];
    developmentTime: string;
    complexity: 'beginner' | 'intermediate' | 'advanced';
    metrics?: ProjectMetrics;
    tags: string[];
    year: number | string;
}

export interface ProjectMetrics {
    users?: number;
    performance?: string;
    codeQuality?: string;
    lines?: number;
    commits?: number;
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