import { TestBed } from '@angular/core/testing';

import { PaymentConditionsService } from './payment-conditions.service';

describe('PaymentConditionsService', () => {
  let service: PaymentConditionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentConditionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
