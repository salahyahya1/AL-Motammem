import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimatedSequenceComponent } from './animated-sequence.component';

describe('AnimatedSequenceComponent', () => {
  let component: AnimatedSequenceComponent;
  let fixture: ComponentFixture<AnimatedSequenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnimatedSequenceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnimatedSequenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
