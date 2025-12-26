import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessegeDialogComponent } from './messege-dialog.component';

describe('MessegeDialogComponent', () => {
  let component: MessegeDialogComponent;
  let fixture: ComponentFixture<MessegeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessegeDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessegeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
