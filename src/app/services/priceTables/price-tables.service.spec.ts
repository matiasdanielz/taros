import { TestBed } from '@angular/core/testing';

import { PriceTablesService } from './price-tables.service';

describe('PriceTablesService', () => {
  let service: PriceTablesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PriceTablesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
