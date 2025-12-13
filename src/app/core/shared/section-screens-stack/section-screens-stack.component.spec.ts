import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionScreensStackComponent } from './section-screens-stack.component';

describe('SectionScreensStackComponent', () => {
  let component: SectionScreensStackComponent;
  let fixture: ComponentFixture<SectionScreensStackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionScreensStackComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectionScreensStackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
