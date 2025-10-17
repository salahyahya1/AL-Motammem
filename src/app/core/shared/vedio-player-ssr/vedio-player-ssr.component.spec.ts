import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VedioPlayerSsrComponent } from './vedio-player-ssr.component';

describe('VedioPlayerSsrComponent', () => {
  let component: VedioPlayerSsrComponent;
  let fixture: ComponentFixture<VedioPlayerSsrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VedioPlayerSsrComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VedioPlayerSsrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
