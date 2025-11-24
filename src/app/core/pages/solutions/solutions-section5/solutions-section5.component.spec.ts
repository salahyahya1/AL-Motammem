import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolutionsSection5Component } from './solutions-section5.component';

describe('SolutionsSection5Component', () => {
  let component: SolutionsSection5Component;
  let fixture: ComponentFixture<SolutionsSection5Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolutionsSection5Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolutionsSection5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
