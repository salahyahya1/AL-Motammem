import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSection7Component } from './product-section7.component';

describe('ProductSection7Component', () => {
  let component: ProductSection7Component;
  let fixture: ComponentFixture<ProductSection7Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductSection7Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductSection7Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
