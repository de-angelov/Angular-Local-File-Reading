import { TestBed, inject } from '@angular/core/testing';
import { EmployeeUtilsService } from './employee-utils.service';
import {} from 'jasmine';
import {isIResult } from '../../models/result';



describe('EmployeeUtilsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmployeeUtilsService]
    });
  });

  it('should be created', inject([EmployeeUtilsService], (service: EmployeeUtilsService) => {
    expect(service).toBeTruthy();
  }));

  it('GetTopTwo should return IResult Object', inject([EmployeeUtilsService], (service: EmployeeUtilsService) => {
    //arange
    const text = '';
    //act
    const result = isIResult(service.GetTopTwo(text))
    //asert
    expect(result ).toBe(true,'message');
  }));

});
