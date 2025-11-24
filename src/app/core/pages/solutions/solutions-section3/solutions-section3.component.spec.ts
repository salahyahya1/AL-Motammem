import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolutionsSection3Component } from './solutions-section3.component';

describe('SolutionsSection3Component', () => {
  let component: SolutionsSection3Component;
  let fixture: ComponentFixture<SolutionsSection3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolutionsSection3Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolutionsSection3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
