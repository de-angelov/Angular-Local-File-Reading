import { TestBed, inject } from '@angular/core/testing';

import { EmployeeUtilsService } from './employee-utils.service';

describe('EmployeeUtilsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmployeeUtilsService]
    });
  });

  it('should be created', inject([EmployeeUtilsService], (service: EmployeeUtilsService) => {
    expect(service).toBeTruthy();
  }));
});
