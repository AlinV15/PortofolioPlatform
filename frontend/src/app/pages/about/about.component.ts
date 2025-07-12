import { Component } from '@angular/core';
import { PersonalStoryComponent } from '../../components/personal-story/personal-story.component';
import { EducationComponent } from '../../components/education/education.component';
import { VolunteerExperienceComponent } from '../../components/volunteer-experience/volunteer-experience.component';
import { HobbiesInterestsComponent } from '../../components/hobbies-interests/hobbies-interests.component';
import { PersonalTimelineComponent } from '../../components/personal-timeline/personal-timeline.component';

@Component({
  selector: 'app-about',
  imports: [PersonalStoryComponent, EducationComponent, VolunteerExperienceComponent, HobbiesInterestsComponent, PersonalTimelineComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {

}
