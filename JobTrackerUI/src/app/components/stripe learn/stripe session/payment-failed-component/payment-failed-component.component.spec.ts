import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentFailedComponentComponent } from './payment-failed-component.component';

describe('PaymentFailedComponentComponent', () => {
  let component: PaymentFailedComponentComponent;
  let fixture: ComponentFixture<PaymentFailedComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentFailedComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentFailedComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
