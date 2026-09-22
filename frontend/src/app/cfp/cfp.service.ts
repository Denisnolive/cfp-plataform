import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SpeakerDTO } from '@cfp-platform/share-types';

export type CreateSpeakerPayload = Omit<SpeakerDTO, 'id'>;

@Injectable({
  providedIn: 'root',
})
export class CfpService {
  private readonly http = inject(HttpClient);
  readonly apiUrl = '/api/cfp';

  submitProposal(proposal: CreateSpeakerPayload): Observable<SpeakerDTO> {
    return this.http.post<SpeakerDTO>(this.apiUrl, proposal);
  }

  submit(proposal: CreateSpeakerPayload): Observable<SpeakerDTO> {
    return this.submitProposal(proposal);
  }
}
