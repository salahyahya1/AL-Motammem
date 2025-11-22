import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolutionsSection4Component } from './solutions-section4.component';

describe('SolutionsSection4Component', () => {
  let component: SolutionsSection4Component;
  let fixture: ComponentFixture<SolutionsSection4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolutionsSection4Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolutionsSection4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
