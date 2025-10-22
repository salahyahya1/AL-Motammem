import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Section10Component } from './section10.component';

describe('Section10Component', () => {
  let component: Section10Component;
  let fixture: ComponentFixture<Section10Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Section10Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Section10Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
