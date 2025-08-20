import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { PersonalStoryComponent } from '../../components/personal-story/personal-story.component';
import { EducationComponent } from '../../components/education/education.component';
import { VolunteerExperienceComponent } from '../../components/volunteer-experience/volunteer-experience.component';
import { HobbiesInterestsComponent } from '../../components/hobbies-interests/hobbies-interests.component';
import { PersonalTimelineComponent } from '../../components/personal-timeline/personal-timeline.component';

import { ContactInfo } from '../../shared/models/contact.interface';
import { Highlight, Hobby, Interest, PersonalityTrait, Value } from '../../shared/models/personal.interface';
import { AcademicProject, CurrentLearning, Education, EducationStats } from '../../shared/models/education.interface';
import { Certificate } from '../../shared/models/certificate.interface';
import { VolunteerExperience, VolunteerSkill, VolunteerStats } from '../../shared/models/volunteer.interface';
import { TimelineItem } from '../../shared/models/timeline.interface';

import { DataService } from '../../services/data.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-about',
  imports: [PersonalStoryComponent, EducationComponent, VolunteerExperienceComponent, HobbiesInterestsComponent, PersonalTimelineComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {


  personalStoryData = {
    contactData: {

    } as ContactInfo,
    highlights: [] as Highlight[],
    values: [] as Value[],
    currentFocus: [] as CurrentLearning[]
  }

  educationData = {
    education: [] as Education[],
    certificates: [] as Certificate[],
    academicProjects: [] as AcademicProject[],
    academicStats: {} as EducationStats
  }

  volunteerData = {
    volunteerExperiences: [] as VolunteerExperience[],
    volunteerSkills: [] as VolunteerSkill[],
    volunteerStats: {} as VolunteerStats
  }

  hobbiesAndInterestsData = {
    hobbies: [] as Hobby[],
    interests: [] as Interest[],
    personalTraits: [] as PersonalityTrait[],
  }

  timelineData = {
    timelineItems: [] as TimelineItem[]
  }
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private dataService: DataService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {

  }

  ngOnInit(): void {
    this.loadAllData();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      console.log('🔄 Route changed - reloading data');
      this.loadAllData();
    });
  }

  private loadAllData(): void {
    this.dataService.loadAllData().subscribe({
      next: (allData) => {

        // Personal story data
        this.personalStoryData = {
          contactData: allData.contact.info,
          highlights: allData.personal.highlights,
          values: allData.personal.values,
          currentFocus: allData.education.currentLearning
        };

        // Education data
        this.educationData = {
          education: allData.education.education,
          certificates: allData.certificates.certificates,
          academicProjects: allData.education.academicProjects,
          academicStats: allData.education.educationStats
        };

        // Volunteer data
        this.volunteerData = {
          volunteerExperiences: allData.volunteer.experiences,
          volunteerSkills: allData.volunteer.skills,
          volunteerStats: allData.volunteer.stats
        };

        // Hobbies and interests data
        this.hobbiesAndInterestsData = {
          hobbies: allData.personal.hobbies,
          interests: allData.personal.interests,
          personalTraits: allData.personal.personalityTraits
        };

        // Timeline data
        this.timelineData = {
          timelineItems: allData.timeline.timelineItems
        };
      },
      error: (error) => {
        console.error('❌ Error loading about data from DataService:', error);

        // Keep existing error handling - provide empty defaults
        this.personalStoryData = {
          contactData: {} as ContactInfo,
          highlights: [],
          values: [],
          currentFocus: []
        };

        this.educationData = {
          education: [],
          certificates: [],
          academicProjects: [],
          academicStats: {} as EducationStats
        };

        this.volunteerData = {
          volunteerExperiences: [],
          volunteerSkills: [],
          volunteerStats: {} as VolunteerStats
        };

        this.hobbiesAndInterestsData = {
          hobbies: [],
          interests: [],
          personalTraits: []
        };

        this.timelineData = {
          timelineItems: []
        };
      }
    });
  }
}