import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CfpService, CreateSpeakerPayload } from './cfp.service';

@Component({
  selector: 'app-cfp-submission',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cfp-submission.component.html',
  styleUrl: './cfp-submission.component.css',
})
export class CfpSubmissionComponent {
  private readonly cfpService = inject(CfpService);

  // Form field signals
  readonly name = signal('');
  readonly email = signal('');
  readonly talkTitle = signal('');
  readonly isGDE = signal(false);

  // Interaction tracking signals
  readonly nameTouched = signal(false);
  readonly emailTouched = signal(false);
  readonly talkTitleTouched = signal(false);

  // Submission state signals
  readonly isSubmitting = signal(false);
  readonly submissionStatus = signal<'idle' | 'success' | 'error'>('idle');
  readonly feedbackMessage = signal('');

  // Individual field validity computeds
  readonly isNameValid = computed(() => this.name().trim().length > 0);
  readonly isEmailValid = computed(() => {
    const val = this.email().trim();
    return val.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  });
  readonly isTalkTitleValid = computed(() => this.talkTitle().trim().length > 0);

  // Error message computeds (only visible after interaction)
  readonly nameError = computed(() => {
    if (!this.nameTouched()) return null;
    if (!this.name().trim()) return 'O nome é obrigatório.';
    return null;
  });

  readonly emailError = computed(() => {
    if (!this.emailTouched()) return null;
    const val = this.email().trim();
    if (!val) return 'O e-mail é obrigatório.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      return 'Informe um e-mail válido.';
    }
    return null;
  });

  readonly talkTitleError = computed(() => {
    if (!this.talkTitleTouched()) return null;
    if (!this.talkTitle().trim()) return 'O título da palestra é obrigatório.';
    return null;
  });

  // Overall form validity
  readonly isValid = computed(
    () => this.isNameValid() && this.isEmailValid() && this.isTalkTitleValid()
  );

  // Submit button enablement
  readonly canSubmit = computed(
    () => this.isValid() && !this.isSubmitting()
  );

  onSubmit(event?: Event): void {
    if (event) {
      event.preventDefault();
    }

    this.nameTouched.set(true);
    this.emailTouched.set(true);
    this.talkTitleTouched.set(true);

    if (!this.canSubmit()) {
      return;
    }

    this.isSubmitting.set(true);
    this.submissionStatus.set('idle');
    this.feedbackMessage.set('');

    const payload: CreateSpeakerPayload = {
      name: this.name().trim(),
      email: this.email().trim(),
      talkTitle: this.talkTitle().trim(),
      isGDE: this.isGDE(),
    };

    this.cfpService.submitProposal(payload).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.submissionStatus.set('success');
        this.feedbackMessage.set('Proposta submetida com sucesso!');
        this.resetForm();
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.submissionStatus.set('error');
        const apiError = err?.error?.message;
        const msg = Array.isArray(apiError)
          ? apiError.join(', ')
          : apiError || 'Erro ao submeter proposta. Tente novamente.';
        this.feedbackMessage.set(msg);
      },
    });
  }

  resetForm(): void {
    this.name.set('');
    this.email.set('');
    this.talkTitle.set('');
    this.isGDE.set(false);
    this.nameTouched.set(false);
    this.emailTouched.set(false);
    this.talkTitleTouched.set(false);
  }
}
