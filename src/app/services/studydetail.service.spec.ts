import { TestBed } from '@angular/core/testing';

import { StudydetailService } from './studydetail.service';

describe('StudydetailService', () => {
  let service: StudydetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudydetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
