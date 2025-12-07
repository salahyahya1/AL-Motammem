import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSection2Component } from './product-section2.component';

describe('ProductSection2Component', () => {
  let component: ProductSection2Component;
  let fixture: ComponentFixture<ProductSection2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductSection2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductSection2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
