import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSection8Component } from './product-section8.component';

describe('ProductSection8Component', () => {
  let component: ProductSection8Component;
  let fixture: ComponentFixture<ProductSection8Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductSection8Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductSection8Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
