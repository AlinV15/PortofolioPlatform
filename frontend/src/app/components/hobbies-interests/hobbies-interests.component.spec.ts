import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HobbiesInterestsComponent } from './hobbies-interests.component';

describe('HobbiesInterestsComponent', () => {
  let component: HobbiesInterestsComponent;
  let fixture: ComponentFixture<HobbiesInterestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HobbiesInterestsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HobbiesInterestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
