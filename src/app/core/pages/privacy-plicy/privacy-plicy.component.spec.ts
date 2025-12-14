import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacyPlicyComponent } from './privacy-plicy.component';

describe('PrivacyPlicyComponent', () => {
  let component: PrivacyPlicyComponent;
  let fixture: ComponentFixture<PrivacyPlicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrivacyPlicyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrivacyPlicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
