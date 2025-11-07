import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutSection3Component } from './about-section3.component';

describe('AboutSection3Component', () => {
  let component: AboutSection3Component;
  let fixture: ComponentFixture<AboutSection3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutSection3Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutSection3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
