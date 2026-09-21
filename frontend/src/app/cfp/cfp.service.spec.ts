import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { CfpService, CreateSpeakerPayload } from './cfp.service';
import { SpeakerDTO } from '@cfp-platform/share-types';

describe('CfpService', () => {
  let service: CfpService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CfpService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(CfpService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send POST request to /api/cfp with proposal payload and return created SpeakerDTO', () => {
    const payload: CreateSpeakerPayload = {
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      talkTitle: 'The First Algorithm',
      isGDE: true,
    };

    const mockResponse: SpeakerDTO = {
      id: 'speaker-123',
      ...payload,
    };

    let actualResponse: SpeakerDTO | undefined;

    service.submitProposal(payload).subscribe((res) => {
      actualResponse = res;
    });

    const req = httpTesting.expectOne('/api/cfp');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);

    req.flush(mockResponse);

    expect(actualResponse).toEqual(mockResponse);
  });
});
