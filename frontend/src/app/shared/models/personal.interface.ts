import { LucideIconData } from "lucide-angular";
import { AchievementType } from "../enums/AchievementType";
import { ComplexityLevel } from "../enums/ComplexityLevel";
import { GoalPriority } from "../enums/GoalPriority";
import { HighlightType } from "../enums/HighlightType";
import { HobbyCategory } from "../enums/HobbyCategory";
import { ImpactLevel } from "../enums/ImpactLevel";
import { ImportanceLevel } from "../enums/ImportanceLevel";
import { InterestCategory } from "../enums/InterestCategory";
import { PriorityLevel } from "../enums/PriorityLevel";
import { RecognitionLevel } from "../enums/RecognitionLevel";


// Main interface
export interface Achievement {
    id: string;
    title: string;
    description: string;
    date: `${number}-${number}-${number}`; // YYYY-MM-DD format
    type: AchievementType;
    icon: string | LucideIconData;
    primaryColor: `#${string}`;
    secondaryColor: `#${string}`;
    recognitionLevel: RecognitionLevel;
    url?: string; // Optional link to certificate/project
    skillsGained?: string[]; // Optional skills acquired
    issuer?: string; // Optional for certifications
}



// Main interface
export interface Highlight {
    id: string;
    title: string;
    description: string;
    highlightType: HighlightType;
    priorityLevel: PriorityLevel;
    icon: string | LucideIconData;
    metrics?: {  // Optional quantitative data
        users?: number;
        rating?: number;
        duration?: string;
    };
    tags?: string[];  // Optional categorization
}



// Main interface
export interface Value {
    id: string;
    title: string;
    description: string;
    icon: string | LucideIconData;
    importanceLevel: ImportanceLevel;
    examples?: string[]; // Optional real-world examples
    relatedSkills?: string[]; // Optional connected skills
}


// Main interface
export interface Hobby {
    id: string;
    name: string;
    description: string;
    icon: string | LucideIconData;
    category: HobbyCategory;
    yearsActive: number;
    complexityLevel: ComplexityLevel;
    relatedSkills: string[];
    impactOnWork: ImpactLevel;
    favoriteAspect: string;
    achievements: string[];
    primaryColor: `#${string}`;
    secondaryColor: `#${string}`;
    timePerWeek?: number; // Optional hours spent
    equipment?: string[]; // Optional gear/tools needed
}


// Main interface
export interface FutureGoal {
    id: string;
    title: string;
    description: string;
    color: `#${string}`;
    icon: string | LucideIconData;
    targetDate: string; // Format: "MMM YYYY" (e.g., "Jul 2025")
    priority: GoalPriority;
    gradient?: string; // Optional gradient value
    progress?: number; // Optional 0-100 percentage
    milestones?: {
        description: string;
        completed: boolean;
        targetDate?: string;
    }[];
}



// Main Interest interface
export interface Interest {
    id: string;
    name: string;
    description: string;
    icon: string | LucideIconData; // Allow both enum and custom string values
    category: InterestCategory | string; // Allow both enum and custom string values
    whyInterested: string;
    recentDiscoveries: string[];
    primaryColor: string; // Hex color code
    secondaryColor: string; // Hex color code
}
export interface KeyStats {
    technologies: number;
    projects: number;
    certificates: number;
    educationYears: number;
}

export interface PersonalityTrait {
    id: string;
    trait: string;
    description: string;
    icon: string | LucideIconData; // Reusing the icon enum, allowing custom values
    examples: string[];
}