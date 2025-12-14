import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsPlicyComponent } from './terms-plicy.component';

describe('TermsPlicyComponent', () => {
  let component: TermsPlicyComponent;
  let fixture: ComponentFixture<TermsPlicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TermsPlicyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TermsPlicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
