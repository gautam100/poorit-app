import { TestBed } from '@angular/core/testing';

import { ExamManagementService } from './exam-management.service';

describe('ExamManagementService', () => {
  let service: ExamManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExamManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
