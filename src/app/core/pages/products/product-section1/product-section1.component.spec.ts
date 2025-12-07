import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSection1Component } from './product-section1.component';

describe('ProductSection1Component', () => {
  let component: ProductSection1Component;
  let fixture: ComponentFixture<ProductSection1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductSection1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductSection1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
