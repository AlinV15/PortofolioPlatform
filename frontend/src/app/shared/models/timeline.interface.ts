import { LucideIconData } from "lucide-angular";
import { AchievementType } from "../enums/AchievementType";
import { EducationStatus } from "../enums/EducationStatus";
import { ImportanceLevel } from "../enums/ImportanceLevel";

// Interfaces
export interface TimelineStats {
    "Major Milestones": string;  // or number if these will always be numeric
    " Achievements": string;     // or number
}


// export interface TimelineItem {
//     id: string;
//     year: string; // Could also be number if preferred
//     title: string;
//     subtitle: string;
//     description: string;
//     type: string;
//     icon: string; // Consider using enum for known icons
//     current: boolean;
//     primaryColor: `#${string}`; // Hex color format
//     secondaryColor: `#${string}`;
//     link?: string; // Optional URL
// }

// export interface TimelineMilestone {
//     id: string;
//     year: string; // Could also be number if preferred
//     title: string;
//     category: string;
//     description: string;
//     icon: string;
//     primaryColor: `#${string}`;
//     secondaryColor: `#${string}`;
//     isActive?: boolean; // Optional as not all items have it
//     importance?: ImportanceLevel; // Optional field
//     duration?: string; // Optional duration field
//     technologies?: string[]; // Optional tech stack
// }
// shared/models/timeline.interface.ts



// Main Timeline Item interface - enhanced to work with existing models
export interface TimelineItem {
    id: string;
    year: string;
    title: string;
    subtitle: string;
    description: string;
    type: string;
    icon: string | LucideIconData; // Smart icon detection - can be Lucide, Font Awesome, emoji, or image path
    status: EducationStatus;
    current: boolean;
    details?: string[];
    achievements?: string[];
    link?: string;
    location?: string;
    duration?: string;
    technologies?: string[];
    skills?: string[];
    tags?: string[];
    priority?: number; // For sorting within same year
    featured?: boolean;
}

// Timeline Stats interface from existing model
export interface TimelineStats {
    "Major Milestones": string;
    " Achievements": string;
}

// Timeline Milestone interface from existing model
export interface TimelineMilestone {
    id: string;
    year: string;
    title: string;
    category: string;
    description: string;
    icon: string | LucideIconData;
    primaryColor: `#${string}`;
    secondaryColor: `#${string}`;
    isActive?: boolean;
    importance?: ImportanceLevel;
    duration?: string;
    technologies?: string[];
}

// Enhanced interfaces for component functionality
export interface TimelineConfig {
    showAnimation: boolean;
    animationDelay: number;
    showIcons: boolean;
    showBadges: boolean;
    groupByYear?: boolean;
    maxItemsPerYear?: number;
    sortOrder: 'asc' | 'desc';
    filterTypes?: TimelineItem['type'][];
    showCurrentFirst?: boolean;
}

export interface TimelineGroup {
    year: string;
    items: TimelineItem[];
    isCurrentYear: boolean;
    itemCount: number;
}

export interface TimelineComponentStats {
    totalItems: number;
    itemsByType: Record<TimelineItem['type'], number>;
    currentItems: number;
    completedItems: number;
    yearsSpanned: number[];
    mostActiveYear: string;
}

// Icon detection helper types
export type IconType = 'lucide' | 'fontawesome' | 'emoji' | 'image';

export interface IconInfo {
    type: IconType;
    value: string;
    isValid: boolean;
    className?: string; // For Font Awesome
    lucideName?: string; // For Lucide
}