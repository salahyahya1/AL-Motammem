import { TestBed } from '@angular/core/testing';

import { VedioPlayerServiceForIosService } from './vedio-player-service-for-ios.service';

describe('VedioPlayerServiceForIosService', () => {
  let service: VedioPlayerServiceForIosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VedioPlayerServiceForIosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
