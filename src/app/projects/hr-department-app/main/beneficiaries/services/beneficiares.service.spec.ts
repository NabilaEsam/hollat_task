import { TestBed } from '@angular/core/testing';

import { BeneficiaresService } from './beneficiares.service';

describe('BeneficiaresService', () => {
  let service: BeneficiaresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BeneficiaresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
