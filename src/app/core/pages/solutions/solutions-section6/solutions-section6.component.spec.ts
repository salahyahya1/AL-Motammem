import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolutionsSection6Component } from './solutions-section6.component';

describe('SolutionsSection6Component', () => {
  let component: SolutionsSection6Component;
  let fixture: ComponentFixture<SolutionsSection6Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolutionsSection6Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolutionsSection6Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
