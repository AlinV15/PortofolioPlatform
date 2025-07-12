import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, Lightbulb, Rocket, Check, Trophy, Dot, ClipboardList, MapPin, Target, RefreshCcw, LucideIconData, CheckCircle, } from 'lucide-angular';

interface VolunteerExperience {
  id: number;
  organization: string;
  role: string;
  period: string;
  location: string;
  type: 'association' | 'club' | 'community';
  status: 'completed' | 'ongoing';
  description: string;
  responsibilities: string[];
  achievements: string[];
  skills_gained: string[];
  projects: string[];
  impact: string;
  icon: string;
  website?: string;
}

interface Skill {
  name: string;
  category: 'leadership' | 'technical' | 'communication' | 'project-management';
  level: number;
}

interface VolunteerStats {
  total_years: number;
  organizations: number;
  projects_coordinated: number;
  events_organized: number;
}

@Component({
  selector: 'app-volunteer-experience',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './volunteer-experience.component.html',
  styleUrls: ['./volunteer-experience.component.css']
})
export class VolunteerExperienceComponent {
  //Icons
  readonly lightbulb = Lightbulb;
  readonly rocket = Rocket;
  readonly check = Check;
  readonly trophy = Trophy;
  readonly dot = Dot;
  readonly clipboardList = ClipboardList;
  readonly mapPin = MapPin;
  readonly target = Target;

  // Volunteer experiences from CV
  volunteerExperiences: VolunteerExperience[] = [
    {
      id: 1,
      organization: 'ASFI - Asociația Studenților Francofoni Iași',
      role: 'Active Volunteer & Project Co-coordinator',
      period: 'October 2022 - October 2023',
      location: 'Iași, Romania',
      type: 'association',
      status: 'completed',
      description: 'Active volunteer in the Francophone Students Association focused on social and cultural activities, developing leadership and project management skills.',
      responsibilities: [
        'Active participation in association projects',
        'Co-coordination of "Défi pour la littérature" project',
        'Co-coordination of activities (Ticket sales and Outdoor cinema)',
        'Participation in ANOSR training sessions'
      ],
      achievements: [
        'Successfully co-coordinated literary challenge project',
        'Organized outdoor cinema events for student community',
        'Completed ANOSR training in Fundraising and Project Management',
        'Built strong network within francophone student community'
      ],
      skills_gained: [
        'Project Management',
        'Event Organization',
        'Fundraising',
        'French Language Practice',
        'Cultural Activities Coordination',
        'Team Leadership',
        'Communication Skills'
      ],
      projects: [
        'Défi pour la littérature (Literary Challenge)',
        'Film în aer liber (Outdoor Cinema)',
        'Ticket sales coordination',
        'Cultural events organization'
      ],
      impact: 'Enhanced cultural exchange and community building among francophone students, contributing to stronger student engagement and cultural awareness.',
      icon: '/assets/images/asfi.jpeg',
      website: 'https://asfi.ro'
    },
    {
      id: 2,
      organization: 'Club Codeless (Mendix Platform)',
      role: 'Student Developer & Platform Learner',
      period: 'March 2024 - May 2024',
      location: 'University Club, Iași',
      type: 'club',
      status: 'completed',
      description: 'Participated in university programming club focused on learning Mendix low-code platform and developing practical applications.',
      responsibilities: [
        'Learning Mendix low-code platform usage',
        'Developing basic projects using the platform',
        'Collaborating with team members on platform exploration',
        'Participating in hands-on development sessions'
      ],
      achievements: [
        'Mastered Mendix low-code platform fundamentals',
        'Successfully developed and deployed basic project',
        'Gained experience in rapid application development',
        'Enhanced understanding of enterprise-level solutions'
      ],
      skills_gained: [
        'Mendix Low-Code Development',
        'Rapid Application Prototyping',
        'Visual Development',
        'Enterprise Platform Understanding',
        'Team Collaboration',
        'Agile Development Principles'
      ],
      projects: [
        'Basic Mendix application development',
        'Platform exploration and learning',
        'Collaborative development exercises'
      ],
      impact: 'Gained valuable experience in low-code development, expanding technical skills beyond traditional programming and understanding enterprise solution approaches.',
      icon: '/assets/images/codeless.png'
    },
    {
      id: 3,
      organization: 'Club WinMentor',
      role: 'Student Developer & ERP Specialist',
      period: 'March 2024 - May 2024',
      location: 'University Club, Iași',
      type: 'club',
      status: 'completed',
      description: 'Participated in programming club focused on WinMentor ERP system, gaining hands-on experience with enterprise resource planning solutions.',
      responsibilities: [
        'Integrating SQL code with platform interaction',
        'Displaying specific columns through custom queries',
        'Developing custom templates in WinMentor Enterprise',
        'Learning ERP system architecture and workflows'
      ],
      achievements: [
        'Successfully integrated SQL queries with WinMentor platform',
        'Created custom display solutions for specific business needs',
        'Developed personalized templates in enterprise application',
        'Gained deep understanding of ERP system functionality'
      ],
      skills_gained: [
        'SQL Integration',
        'ERP System Management',
        'WinMentor Platform Expertise',
        'Custom Template Development',
        'Business Process Understanding',
        'Database Query Optimization',
        'Enterprise Software Development'
      ],
      projects: [
        'SQL code integration for platform interaction',
        'Custom column display development',
        'Personal template creation in WinMentor Enterprise',
        'ERP workflow optimization'
      ],
      impact: 'Developed practical enterprise software skills and understanding of business process automation, valuable for future career in business informatics.',
      icon: '/assets/images/winmentor.png'
    }
  ];

  // Skills developed through volunteering
  volunteerSkills: Skill[] = [
    { name: 'Project Management', category: 'project-management', level: 85 },
    { name: 'Event Organization', category: 'project-management', level: 80 },
    { name: 'Team Leadership', category: 'leadership', level: 75 },
    { name: 'Communication', category: 'communication', level: 90 },
    { name: 'Mendix Platform', category: 'technical', level: 70 },
    { name: 'SQL Integration', category: 'technical', level: 75 },
    { name: 'ERP Systems', category: 'technical', level: 65 },
    { name: 'Fundraising', category: 'project-management', level: 70 },
    { name: 'Cultural Coordination', category: 'communication', level: 85 },
    { name: 'French Language', category: 'communication', level: 80 }
  ];

  // Volunteer statistics
  volunteerStats: VolunteerStats = {
    total_years: 2,
    organizations: 3,
    projects_coordinated: 5,
    events_organized: 8
  };

  // Track by functions
  trackByExperience(index: number, experience: VolunteerExperience): number {
    return experience.id;
  }

  trackBySkill(index: number, skill: Skill): string {
    return skill.name;
  }

  trackByString(index: number, item: string): string {
    return item;
  }

  // Get organization type styling
  getOrgTypeClass(type: string): string {
    const classes = {
      'association': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'club': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'community': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    };
    return classes[type as keyof typeof classes] || 'bg-gray-100 text-gray-800';
  }

  // Get skill category color
  getSkillCategoryColor(category: string): string {
    const colors = {
      'leadership': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      'technical': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'communication': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'project-management': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  }

  // Get status icon
  getStatusIcon(status: string): LucideIconData {
    return status === 'ongoing' ? RefreshCcw : CheckCircle;
  }

  // Get icon for organization
  getOrganizationIcon(experience: VolunteerExperience): string {
    if (experience.icon.startsWith('/assets/')) {
      return experience.icon; // Return path for image
    }
    return experience.icon; // Return icon name for lucide icons
  }

  // Check if icon is an image
  isImageIcon(icon: string): boolean {
    return icon.startsWith('/assets/') || icon.includes('.');
  }

  // Handle external links
  onOrganizationClick(experience: VolunteerExperience): void {
    if (experience.website) {
      window.open(experience.website, '_blank');
    }
    console.log(`Organization clicked: ${experience.organization}`);
  }

  // Get grouped skills by category
  getSkillsByCategory(category: string): Skill[] {
    return this.volunteerSkills.filter(skill => skill.category === category);
  }

  // Get skill categories
  getSkillCategories(): string[] {
    return ['leadership', 'technical', 'communication', 'project-management'];
  }

  // Format category name
  formatCategoryName(category: string): string {
    return category.split('-').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }
}