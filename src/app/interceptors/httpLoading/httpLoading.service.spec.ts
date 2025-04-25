import { TestBed } from '@angular/core/testing';

import { HttpLoadingService } from './httpLoading.service';

describe('HttpService', () => {
  let service: HttpLoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpLoadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
