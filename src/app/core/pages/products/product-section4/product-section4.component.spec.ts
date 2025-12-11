import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSection4Component } from './product-section4.component';

describe('ProductSection4Component', () => {
  let component: ProductSection4Component;
  let fixture: ComponentFixture<ProductSection4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductSection4Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductSection4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
