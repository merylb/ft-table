import { TestBed, inject } from '@angular/core/testing';

import { FtCdkTableService } from './ft-cdk-table.service';

describe('FtCdkTableService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FtCdkTableService]
    });
  });

  it('should be created', inject([FtCdkTableService], (service: FtCdkTableService) => {
    expect(service).toBeTruthy();
  }));
});
