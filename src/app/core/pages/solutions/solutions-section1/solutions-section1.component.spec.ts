import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolutionsSection1Component } from './solutions-section1.component';

describe('SolutionsSection1Component', () => {
  let component: SolutionsSection1Component;
  let fixture: ComponentFixture<SolutionsSection1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolutionsSection1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolutionsSection1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
