import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionIndicatorComponent } from './section-indicator.component';

describe('SectionIndicatorComponent', () => {
  let component: SectionIndicatorComponent;
  let fixture: ComponentFixture<SectionIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionIndicatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectionIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
