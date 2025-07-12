import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillsTimelineComponent } from './skills-timeline.component';

describe('SkillsTimelineComponent', () => {
  let component: SkillsTimelineComponent;
  let fixture: ComponentFixture<SkillsTimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkillsTimelineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkillsTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
