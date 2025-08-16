import { LucideIconData } from "lucide-angular";
import { EducationStatus } from "../enums/EducationStatus";
import { LearningStatus } from "../enums/LearningStatus";

export interface Education {
    id: string;
    level: string;
    institution: string;
    degree: string;
    field: string;
    period: string;
    location: string;
    description: string;
    achievements: string[];
    relevantCourses: RelevantCourse[];
    status: EducationStatus;
    highlights: string[];
    icon: string | LucideIconData;
    primaryColor: `#${string}`;
    secondaryColor: `#${string}`;
}

export interface RelevantCourse {
    id: string;
    title: string;
    description: string;
    grade: string;
    year: number;
    relevant: boolean;
}

export interface CurrentLearning {
    id: string;
    title: string;
    status: LearningStatus;
    progress: number; // Assuming progress is a percentage (0-100)
    color: `#${string}`; // Hex color code
    icon: string | LucideIconData; // Icon name/identifier
    description: string;
}

export interface LearningMilestone {
    id: string;
    title: string;
    year: string; // or number if you prefer
    description: string;
    technologies: string[];
}

export interface LearningProgress {
    id: string;
    name: string;
    progress: number; // percentage (0-100)
    color: `#${string}`; // hex color code
    timeSpent: number; // in hours
    description: string;
}

export interface Language {
    name: string;
    level: string;
    icon: string;
    iconType: string; // assuming these are possible types
}

export interface EducationStats {
    totalCourses: number;
    currentYear: string; // or number if preferred
    specialization: string;
    focusAreas: string[];
    languages: Language[];
}

export interface AcademicProject {
    id: string;
    title: string;
    courseName: string;
    description: string;
    technologies: string[];
    duration: number; // in months or weeks? (clarify unit)
    type: string; // or more specific type if limited options exist
    githubLink?: string; // optional as not all projects may have a repo
    icon: string | LucideIconData;
    primaryColor: `#${string}`; // hex color
    secondaryColor: `#${string}`; // hex color
}