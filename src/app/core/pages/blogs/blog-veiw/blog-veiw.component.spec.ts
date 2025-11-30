import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogVeiwComponent } from './blog-veiw.component';

describe('BlogVeiwComponent', () => {
  let component: BlogVeiwComponent;
  let fixture: ComponentFixture<BlogVeiwComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogVeiwComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogVeiwComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
