import { Component, inject, OnInit, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SpeakerDTO } from '@cfp-platform/share-types';

@Component({
  selector: 'app-cfp-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cfp-dashboard.component.html',
  styleUrl: './cfp-dashboard.component.css',
})
export class CfpDashboardComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  readonly apiUrl = '/api/cfp';

  readonly proposals: WritableSignal<SpeakerDTO[]> = signal<SpeakerDTO[]>([]);
  readonly isLoading: WritableSignal<boolean> = signal<boolean>(true);
  readonly errorMessage: WritableSignal<string | null> = signal<string | null>(null);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadProposals();
    } else {
      this.isLoading.set(false);
    }
  }

  loadProposals(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.http.get<SpeakerDTO[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.proposals.set(data ?? []);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        const apiError = err?.error?.message;
        const msg = Array.isArray(apiError)
          ? apiError.join(', ')
          : apiError || 'Erro ao carregar as propostas de palestras.';
        this.errorMessage.set(msg);
      },
    });
  }
}
