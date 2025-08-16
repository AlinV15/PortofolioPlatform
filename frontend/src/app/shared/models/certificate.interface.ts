import { LucideIconData } from "lucide-angular";

export interface Certificate {
    id: string;
    name: string;
    issuer: string;
    date: string;
    certificateId: string;
    description: string;
    skillsGained: string[],
    categoryName: string,
    icon: string | LucideIconData,
    primaryColor: string,
    secondaryColor: string;
    verified: boolean;
    featured: boolean;
}

export interface CertificateCategory {

    id: string;
    name: string;
    icon: string | LucideIconData;
    activeClass: string;
    hoverClass: string;

}

export interface CertificateStats {
    totalCertificates: number;
    verifiedCount: number;
    averageRelevanceScore: number;
    providerDistribution: Map<string, number>;
    expiringCount: number;
    featuredCount: number;
    highRelevanceCount: number;
    featuredPercentage: number;
    verificationRate: number;
    topProvider: string;
}