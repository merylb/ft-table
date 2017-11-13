import { TestBed, inject } from '@angular/core/testing';

import { CustomPaginatorIntlService } from './custom-paginator-intl.service';

describe('CustomPaginatorIntlService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomPaginatorIntlService]
    });
  });

  it('should be created', inject([CustomPaginatorIntlService], (service: CustomPaginatorIntlService) => {
    expect(service).toBeTruthy();
  }));
});
