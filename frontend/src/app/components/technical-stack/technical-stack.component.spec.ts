import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicalStackComponent } from './technical-stack.component';

describe('TechnicalStackComponent', () => {
  let component: TechnicalStackComponent;
  let fixture: ComponentFixture<TechnicalStackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechnicalStackComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechnicalStackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
