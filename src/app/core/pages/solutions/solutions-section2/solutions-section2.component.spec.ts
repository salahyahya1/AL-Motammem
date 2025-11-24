import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolutionsSection2Component } from './solutions-section2.component';

describe('SolutionsSection2Component', () => {
  let component: SolutionsSection2Component;
  let fixture: ComponentFixture<SolutionsSection2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolutionsSection2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolutionsSection2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
