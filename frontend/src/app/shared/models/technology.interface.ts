import { LucideIconData } from "lucide-angular";
import { ProficiencyLevel } from "../enums/ProficiencyLevel";

// CategoryDistribution interface to represent distribution of technologies by category
export interface CategoryDistribution {
    distribution: Map<string, number>;
}

// Main TechStats interface
export interface TechStats {
    totalTechnologies: number;
    trendingCount: number;
    averagePopularityScore: number;
    categoryDistribution: CategoryDistribution;
    recentlyReleasedCount: number;
    mostPopularCategory: string;
    trendingPercentage: number;
}


// Main TechCategory interface
export interface TechCategory {
    id: string;
    name: string; // Allow both enum and custom values
    description: string;
    icon: string | LucideIconData; // Allow both enum and custom values
    color: string; // Hex color code
    bgColor: string; // Hex background color code
}




// Main Technology interface
export interface Technology {
    id: string;
    name: string;
    category: string;
    proficiency: ProficiencyLevel | string;
    level: number; // Proficiency level as percentage (0-100)
    yearsOfExperience: number;
    projects: number;
    description: string;
    icon: string | LucideIconData;
    color: string; // Hex color code
    backgroundColor: string; // Hex background color code
    features: string[];
    trending: boolean;
    certification: boolean;
    learning: boolean;
}