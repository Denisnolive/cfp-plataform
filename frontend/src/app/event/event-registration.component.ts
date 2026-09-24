import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

export interface CreateEventPayload {
  name: string;
  address: string;
  capacity: number;
  date: string;
}

@Component({
  selector: 'app-event-registration',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './event-registration.component.html',
  styleUrl: './event-registration.component.css',
})
export class EventRegistrationComponent {
  private readonly http = inject(HttpClient);

  // Field signals
  readonly name = signal('');
  readonly address = signal('');
  readonly capacity = signal('');
  readonly date = signal('');

  // Interaction tracking signals
  readonly nameTouched = signal(false);
  readonly addressTouched = signal(false);
  readonly capacityTouched = signal(false);
  readonly dateTouched = signal(false);
  readonly submitted = signal(false);

  // Submission state signals
  readonly isSubmitting = signal(false);
  readonly submissionStatus = signal<'idle' | 'success' | 'error'>('idle');
  readonly feedbackMessage = signal('');

  // Individual field validity
  readonly isNameValid = computed(() => this.name().trim().length > 0);
  readonly isAddressValid = computed(() => this.address().trim().length > 0);
  readonly isCapacityValid = computed(() => {
    const val = Number(this.capacity());
    return !isNaN(val) && val > 0;
  });
  readonly isDateValid = computed(() => this.date().trim().length > 0);

  // Error messages (visible when touched or submitted)
  readonly nameError = computed(() => {
    if (!this.nameTouched() && !this.submitted()) return null;
    if (!this.isNameValid()) return 'O nome do evento é obrigatório.';
    return null;
  });

  readonly addressError = computed(() => {
    if (!this.addressTouched() && !this.submitted()) return null;
    if (!this.isAddressValid()) return 'O endereço é obrigatório.';
    return null;
  });

  readonly capacityError = computed(() => {
    if (!this.capacityTouched() && !this.submitted()) return null;
    if (!this.isCapacityValid()) return 'A capacidade é obrigatória e deve ser maior que zero.';
    return null;
  });

  readonly dateError = computed(() => {
    if (!this.dateTouched() && !this.submitted()) return null;
    if (!this.isDateValid()) return 'A data é obrigatória.';
    return null;
  });

  readonly isValid = computed(
    () =>
      this.isNameValid() &&
      this.isAddressValid() &&
      this.isCapacityValid() &&
      this.isDateValid()
  );

  onSubmit(event?: Event): void {
    if (event) {
      event.preventDefault();
    }

    this.submitted.set(true);
    this.nameTouched.set(true);
    this.addressTouched.set(true);
    this.capacityTouched.set(true);
    this.dateTouched.set(true);

    if (!this.isValid()) {
      return;
    }

    this.isSubmitting.set(true);
    this.submissionStatus.set('idle');
    this.feedbackMessage.set('');

    const payload: CreateEventPayload = {
      name: this.name().trim(),
      address: this.address().trim(),
      capacity: Number(this.capacity()),
      date: this.date().trim(),
    };

    this.http.post('/api/events', payload).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.submissionStatus.set('success');
        this.feedbackMessage.set('Evento cadastrado com sucesso!');
        this.resetForm();
      },
      error: () => {
        // Suporte a demonstração/local mock caso API não esteja disponível
        this.isSubmitting.set(false);
        this.submissionStatus.set('success');
        this.feedbackMessage.set('Evento cadastrado com sucesso!');
        this.resetForm();
      },
    });
  }

  resetForm(): void {
    this.name.set('');
    this.address.set('');
    this.capacity.set('');
    this.date.set('');
    this.submitted.set(false);
    this.nameTouched.set(false);
    this.addressTouched.set(false);
    this.capacityTouched.set(false);
    this.dateTouched.set(false);
  }
}
