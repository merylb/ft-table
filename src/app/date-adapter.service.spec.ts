import { TestBed, inject } from '@angular/core/testing';

import { DateAdapterService } from './date-adapter.service';

describe('DateAdapterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DateAdapterService]
    });
  });

  it('should be created', inject([DateAdapterService], (service: DateAdapterService) => {
    expect(service).toBeTruthy();
  }));
});
