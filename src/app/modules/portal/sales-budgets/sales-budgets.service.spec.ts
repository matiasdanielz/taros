import { TestBed } from '@angular/core/testing';

import { SalesBudgetsService } from './sales-budgets.service';

describe('SalesBudgetsService', () => {
  let service: SalesBudgetsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalesBudgetsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
