import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillsHeroComponent } from './skills-hero.component';

describe('SkillsHeroComponent', () => {
  let component: SkillsHeroComponent;
  let fixture: ComponentFixture<SkillsHeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkillsHeroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkillsHeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
