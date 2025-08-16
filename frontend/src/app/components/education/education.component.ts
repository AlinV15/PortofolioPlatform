// education.component.ts

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, GraduationCap, School, Trophy, Award, Users, User, Calendar, MapPin, ExternalLink, Github, Lightbulb, Check, LucideIconData, RefreshCcw, X } from 'lucide-angular';
import { AcademicProject, Education, EducationStats, RelevantCourse } from '../../shared/models/education.interface';
import { Certificate } from '../../shared/models/certificate.interface';
import { EducationStatus } from '../../shared/enums/EducationStatus';
import { IconHelperService } from '../../services/icon-helper.service';


@Component({
  selector: 'app-education',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.css']
})
export class EducationComponent {

  // Register Lucide icons
  readonly GraduationCap = GraduationCap;
  readonly School = School;
  readonly Trophy = Trophy;
  readonly Award = Award;
  readonly Users = Users;
  readonly User = User;
  readonly Calendar = Calendar;
  readonly MapPin = MapPin;
  readonly ExternalLink = ExternalLink;
  readonly Github = Github;
  readonly Lightbulb = Lightbulb
  readonly Check = Check;
  readonly Reaload = RefreshCcw;
  readonly X = X;


  // Educational background
  @Input() education: Education[] = [];

  // Certifications and additional qualifications
  @Input() certificates: Certificate[] = []

  // Academic projects (based on university courses)
  @Input() academicProjects: AcademicProject[] = [];

  // Academic statistics
  @Input() academicStats: EducationStats = {
    totalCourses: 0,
    currentYear: "",// or number if preferred
    specialization: "",
    focusAreas: [],
    languages: [],
  }

  constructor(private iconHelper: IconHelperService) {

  }

  trackByProject(index: number, project: AcademicProject): string {
    return project.title
  }

  trackByCertificate(index: number, certificate: Certificate): string {
    return certificate.certificateId
  }

  trackByCourse(index: number, course: RelevantCourse): string {
    return course.title;
  }

  trackBySkill(index: number, skill: string): string {
    return skill;
  }

  // Icon type check functions
  isLucideIcon(item: Education | Certificate | AcademicProject | any): boolean {
    return item.iconType === 'lucide';
  }

  isFontAwesome(item: Education | Certificate | AcademicProject | any): boolean {
    return item.iconType === 'fontawesome';
  }

  isEmojiIcon(item: Education | Certificate | AcademicProject | any): boolean {
    return item.iconType === 'emoji';
  }

  // Get certificate type styling
  getCertificateTypeClass(type: string): string {
    const classes = {
      'technical': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'leadership': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'business': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    };
    return classes[type as keyof typeof classes] || 'bg-gray-100 text-gray-800';
  }

  // Get project type icon (legacy method for backward compatibility)
  getProjectTypeIcon(type: string): LucideIconData {
    return type === 'group' ? this.User : this.Users;
  }

  // State for expandable courses
  expandedCourses: { [key: number]: boolean } = {};

  // Toggle course expansion
  toggleCourseExpansion(eduId: string): void {
    this.expandedCourses[parseInt(eduId)] = !this.expandedCourses[parseInt(eduId)];
  }

  // Check if courses are expanded
  isCoursesExpanded(eduId: string): boolean {
    const eduNr = parseInt(eduId);
    return this.expandedCourses[eduNr] || false;
  }

  // Get courses to display
  getCoursesToDisplay(courses: RelevantCourse[], eduId: string): RelevantCourse[] {
    return this.isCoursesExpanded(eduId) ? courses : courses.slice(0, 12);
  }

  stringToFontAwesome(iconString: string) {
    return this.iconHelper.stringToFontAwesome(iconString);
  }

  stringToLucide(icoString: string) {
    return this.iconHelper.stringToLucide(icoString);
  }


}