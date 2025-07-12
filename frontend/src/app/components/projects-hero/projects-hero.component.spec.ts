import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsHeroComponent } from './projects-hero.component';

describe('ProjectsHeroComponent', () => {
  let component: ProjectsHeroComponent;
  let fixture: ComponentFixture<ProjectsHeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectsHeroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectsHeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
