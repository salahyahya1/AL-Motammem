import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearningGSAPComponent } from './learning-gsap.component';

describe('LearningGSAPComponent', () => {
  let component: LearningGSAPComponent;
  let fixture: ComponentFixture<LearningGSAPComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LearningGSAPComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LearningGSAPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
