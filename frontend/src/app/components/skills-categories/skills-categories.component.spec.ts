import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillsCategoriesComponent } from './skills-categories.component';

describe('SkillsCategoriesComponent', () => {
  let component: SkillsCategoriesComponent;
  let fixture: ComponentFixture<SkillsCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkillsCategoriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkillsCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
