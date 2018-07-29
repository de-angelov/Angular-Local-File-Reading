import { TestBed, inject } from '@angular/core/testing';

import { ReadFileService } from './read-file.service';

describe('ReadFileService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReadFileService]
    });
  });

  it('should be created', inject([ReadFileService], (service: ReadFileService) => {
    expect(service).toBeTruthy();
  }));
});
