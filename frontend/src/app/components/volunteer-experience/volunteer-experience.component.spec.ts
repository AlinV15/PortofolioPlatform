import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VolunteerExperienceComponent } from './volunteer-experience.component';

describe('VolunteerExperienceComponent', () => {
  let component: VolunteerExperienceComponent;
  let fixture: ComponentFixture<VolunteerExperienceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VolunteerExperienceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VolunteerExperienceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
