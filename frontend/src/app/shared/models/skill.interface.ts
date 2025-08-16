import { LucideIconData } from "lucide-angular";
import { ProficiencyLevel } from "../enums/ProficiencyLevel";


export interface Skill {
    id: string;
    name: string;
    level: number;
    proficiency: ProficiencyLevel;
    description: string;
    yearsOfExperience: number;
    projects: number;
    color: string;
    category: string;
}

export interface TopSkill {
    name: string;
    level: number;
    color: string;
    category: string;
    proficiency: ProficiencyLevel;
    projects: number;
}

export interface FeaturedSkill {
    id: string;
    name: string;
    level: number;
    categoryName: string;
    description: string;
    yearsOfExperience: number;
    color: string;
    projects: string[];
    proficiency: ProficiencyLevel;
    trending: boolean;
    learning: boolean;
}

export interface SkillCategory {
    name: string;
    icon: string | LucideIconData;
    description: string;
}

export interface SkillStats {
    description: string;
    projectsText: string;
    technologiesText: string;
    yearsCoding: string;
    projects: string;
    certifications: string;
    avgProficiency: string;
    yearsCodingLabel: string;
    projectsLabel: string;
    certificationsLabel: string;
    avgProficiencyLabel: string;
}