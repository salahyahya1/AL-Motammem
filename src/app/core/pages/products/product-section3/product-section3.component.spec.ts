import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSection3Component } from './product-section3.component';

describe('ProductSection3Component', () => {
  let component: ProductSection3Component;
  let fixture: ComponentFixture<ProductSection3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductSection3Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductSection3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
