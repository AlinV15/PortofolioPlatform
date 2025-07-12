import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalStoryComponent } from './personal-story.component';

describe('PersonalStoryComponent', () => {
  let component: PersonalStoryComponent;
  let fixture: ComponentFixture<PersonalStoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonalStoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonalStoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
