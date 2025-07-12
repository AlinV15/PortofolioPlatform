import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificationsGridComponent } from './certifications-grid.component';

describe('CertificationsGridComponent', () => {
  let component: CertificationsGridComponent;
  let fixture: ComponentFixture<CertificationsGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CertificationsGridComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CertificationsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
