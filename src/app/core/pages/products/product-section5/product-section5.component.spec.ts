import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSection5Component } from './product-section5.component';

describe('ProductSection5Component', () => {
  let component: ProductSection5Component;
  let fixture: ComponentFixture<ProductSection5Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductSection5Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductSection5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
