import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSection6Component } from './product-section6.component';

describe('ProductSection6Component', () => {
  let component: ProductSection6Component;
  let fixture: ComponentFixture<ProductSection6Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductSection6Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductSection6Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
