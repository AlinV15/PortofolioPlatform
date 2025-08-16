import { LucideIconData } from "lucide-angular";
import { ImpactLevel } from "../enums/ImpactLevel";
import { VolunteerStatus } from "../enums/VolunteerStatus";
import { VolunteerType } from "../enums/VolunteerType";


// Interfaces
export interface Responsibility {
    id: string;
    description: string;
    impactLevel: ImpactLevel;
    sortOrder: number;
}

export interface VolunteerExperience {
    id: string;
    organization: string;
    role: string;
    period: string;
    location: string;
    type: VolunteerType;
    status: VolunteerStatus;
    description: string;
    responsibilities: Responsibility[];
    achievements: string[];
    skillsGained: string[];
    icon: string | LucideIconData;
    website: string;
    primaryColor: `#${string}`;
    secondaryColor: `#${string}`;
}

export interface VolunteerSkill {
    name: string;
    category: string;
    level: number; // 0-100 scale
    description: string;
    organizations: string[];
    yearsOfExperience: number;
    isActive: boolean;
}

export interface VolunteerStats {
    totalYears: number;
    organizations: number;
    projectsCoordinated: number;
    eventsOrganized: number;
}