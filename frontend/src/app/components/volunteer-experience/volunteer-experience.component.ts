import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, Lightbulb, Rocket, Check, Trophy, Dot, ClipboardList, MapPin, Target, RefreshCcw, LucideIconData, CheckCircle, } from 'lucide-angular';
import { Responsibility, VolunteerExperience, VolunteerSkill, VolunteerStats } from '../../shared/models/volunteer.interface';
import { IconHelperService } from '../../services/icon-helper.service';



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
  @Input() volunteerExperiences: VolunteerExperience[] = []

  // Skills developed through volunteering
  @Input() volunteerSkills: VolunteerSkill[] = [];

  // Volunteer statistics
  @Input() volunteerStats: VolunteerStats = {

    totalYears: 0,
    organizations: 0,
    projectsCoordinated: 0,
    eventsOrganized: 0
  }



  constructor(private iconHelper: IconHelperService) { }


  trackByString(index: number, item: string): string {
    return item;
  }

  trackByExperience(index: number, experience: VolunteerExperience): string {
    return experience.id;
  }

  trackBySkill(index: number, skill: VolunteerSkill): string {
    return skill.name;
  }

  trackByResponsibility(index: number, item: Responsibility) {
    return item.id;
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



  havingWebsite(site: string): boolean {
    if (!site) {
      return false;
    }
    return true;
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

  stringToFontAwesome(iconString: string) {
    return this.iconHelper.stringToFontAwesome(iconString);
  }

  stringToLucide(icoString: string) {
    return this.iconHelper.stringToLucide(icoString);
  }

  getSkillsByCategory(category: string) {
    return this.volunteerSkills.filter(skill =>
      skill.category.toLowerCase() === category.toLowerCase()
    );
  }
}