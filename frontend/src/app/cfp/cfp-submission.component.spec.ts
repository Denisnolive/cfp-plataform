import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { of, throwError } from 'rxjs';
import { provideRouter } from '@angular/router';
import { SpeakerDTO } from '@cfp-platform/share-types';
import { CfpSubmissionComponent } from './cfp-submission.component';
import { CfpService } from './cfp.service';

describe('CfpSubmissionComponent', () => {
  let component: CfpSubmissionComponent;
  let fixture: ComponentFixture<CfpSubmissionComponent>;
  let mockCfpService: { submitProposal: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    mockCfpService = {
      submitProposal: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [CfpSubmissionComponent],
      providers: [
        { provide: CfpService, useValue: mockCfpService },
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CfpSubmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Estado inicial dos Signals e bloqueio do botão de envio', () => {
    it('deve inicializar todos os Signals com seus valores padrão limpos', () => {
      expect(component.name()).toBe('');
      expect(component.email()).toBe('');
      expect(component.talkTitle()).toBe('');
      expect(component.isGDE()).toBe(false);

      expect(component.nameTouched()).toBe(false);
      expect(component.emailTouched()).toBe(false);
      expect(component.talkTitleTouched()).toBe(false);

      expect(component.isSubmitting()).toBe(false);
      expect(component.submissionStatus()).toBe('idle');
      expect(component.feedbackMessage()).toBe('');

      expect(component.isValid()).toBe(false);
      expect(component.canSubmit()).toBe(false);
    });

    it('deve manter o botão de envio desabilitado com disabled e aria-disabled="true" no carregamento inicial', () => {
      const submitBtn: HTMLButtonElement = fixture.nativeElement.querySelector('#btn-submit-cfp');
      expect(submitBtn).toBeTruthy();
      expect(submitBtn.disabled).toBe(true);
      expect(submitBtn.getAttribute('aria-disabled')).toBe('true');
    });
  });

  describe('Reatividade e validação com Signals', () => {
    it('deve atualizar Signals e computar validade ao preencher todos os campos obrigatórios corretamente', () => {
      component.name.set('Ada Lovelace');
      component.email.set('ada@lovelace.dev');
      component.talkTitle.set('Analytical Engine & Signals');
      component.isGDE.set(true);

      fixture.detectChanges();

      expect(component.isNameValid()).toBe(true);
      expect(component.isEmailValid()).toBe(true);
      expect(component.isTalkTitleValid()).toBe(true);
      expect(component.isValid()).toBe(true);
      expect(component.canSubmit()).toBe(true);

      const submitBtn: HTMLButtonElement = fixture.nativeElement.querySelector('#btn-submit-cfp');
      expect(submitBtn.disabled).toBe(false);
      expect(submitBtn.getAttribute('aria-disabled')).toBe('false');
    });

    it('deve considerar e-mail inválido e manter formulário inválido quando e-mail for malformatado', () => {
      component.name.set('Ada Lovelace');
      component.email.set('email-invalido');
      component.talkTitle.set('Analytical Engine');

      expect(component.isEmailValid()).toBe(false);
      expect(component.isValid()).toBe(false);
      expect(component.canSubmit()).toBe(false);
    });

    it('deve considerar inválido quando nome ou título forem apenas espaços em branco', () => {
      component.name.set('   ');
      component.email.set('ada@example.com');
      component.talkTitle.set('   ');

      expect(component.isNameValid()).toBe(false);
      expect(component.isTalkTitleValid()).toBe(false);
      expect(component.isValid()).toBe(false);
    });
  });

  describe('Acessibilidade WAI-ARIA', () => {
    it('deve configurar aria-required="true" e required nos campos obrigatórios', () => {
      const nameInput: HTMLInputElement = fixture.nativeElement.querySelector('#speaker-name');
      const emailInput: HTMLInputElement = fixture.nativeElement.querySelector('#speaker-email');
      const talkTitleInput: HTMLInputElement = fixture.nativeElement.querySelector('#speaker-talk-title');

      expect(nameInput.getAttribute('aria-required')).toBe('true');
      expect(emailInput.getAttribute('aria-required')).toBe('true');
      expect(talkTitleInput.getAttribute('aria-required')).toBe('true');
    });

    it('deve aplicar aria-invalid="true" e aria-describedby quando o campo for tocado e inválido', () => {
      component.nameTouched.set(true);
      component.name.set('');
      fixture.detectChanges();

      const nameInput: HTMLInputElement = fixture.nativeElement.querySelector('#speaker-name');
      expect(nameInput.getAttribute('aria-invalid')).toBe('true');
      expect(nameInput.getAttribute('aria-describedby')).toBe('name-error');

      const errorSpan: HTMLElement = fixture.nativeElement.querySelector('#name-error');
      expect(errorSpan).toBeTruthy();
      expect(errorSpan.getAttribute('role')).toBe('alert');
      expect(errorSpan.textContent).toContain('O nome é obrigatório.');
    });

    it('não deve exibir erros nem aria-invalid="true" antes da interação do usuário', () => {
      const nameInput: HTMLInputElement = fixture.nativeElement.querySelector('#speaker-name');
      expect(nameInput.getAttribute('aria-invalid')).toBe('false');
      expect(nameInput.getAttribute('aria-describedby')).toBeNull();
      expect(fixture.nativeElement.querySelector('#name-error')).toBeNull();
    });
  });

  describe('Fluxo de submissão do formulário', () => {
    it('deve chamar CfpService.submitProposal com payload correto e limpar formulário em caso de sucesso', () => {
      const mockCreatedSpeaker: SpeakerDTO = {
        id: 'speaker-123',
        name: 'Ada Lovelace',
        email: 'ada@lovelace.dev',
        talkTitle: 'Analytical Engine',
        isGDE: true,
      };

      mockCfpService.submitProposal.mockReturnValue(of(mockCreatedSpeaker));

      component.name.set('Ada Lovelace');
      component.email.set('ada@lovelace.dev');
      component.talkTitle.set('Analytical Engine');
      component.isGDE.set(true);
      fixture.detectChanges();

      component.onSubmit();
      fixture.detectChanges();

      expect(mockCfpService.submitProposal).toHaveBeenCalledWith({
        name: 'Ada Lovelace',
        email: 'ada@lovelace.dev',
        talkTitle: 'Analytical Engine',
        isGDE: true,
      });

      expect(component.submissionStatus()).toBe('success');
      expect(component.feedbackMessage()).toBe('Proposta submetida com sucesso!');
      expect(component.name()).toBe('');
      expect(component.email()).toBe('');
      expect(component.talkTitle()).toBe('');
      expect(component.isGDE()).toBe(false);

      const feedbackEl: HTMLElement = fixture.nativeElement.querySelector('#submission-feedback');
      expect(feedbackEl).toBeTruthy();
      expect(feedbackEl.getAttribute('role')).toBe('alert');
      expect(feedbackEl.getAttribute('aria-live')).toBe('polite');
      expect(feedbackEl.textContent).toContain('Proposta submetida com sucesso!');
    });

    it('deve exibir mensagem de erro na região acessível quando o serviço falhar', () => {
      mockCfpService.submitProposal.mockReturnValue(
        throwError(() => ({ error: { message: 'Erro interno ao salvar proposta.' } }))
      );

      component.name.set('Ada Lovelace');
      component.email.set('ada@lovelace.dev');
      component.talkTitle.set('Analytical Engine');
      fixture.detectChanges();

      component.onSubmit();
      fixture.detectChanges();

      expect(component.submissionStatus()).toBe('error');
      expect(component.feedbackMessage()).toBe('Erro interno ao salvar proposta.');

      const feedbackEl: HTMLElement = fixture.nativeElement.querySelector('#submission-feedback');
      expect(feedbackEl).toBeTruthy();
      expect(feedbackEl.getAttribute('role')).toBe('alert');
      expect(feedbackEl.getAttribute('aria-live')).toBe('polite');
      expect(feedbackEl.textContent).toContain('Erro interno ao salvar proposta.');
    });

    it('não deve submeter se o formulário for inválido', () => {
      component.onSubmit();
      expect(mockCfpService.submitProposal).not.toHaveBeenCalled();
      expect(component.nameTouched()).toBe(true);
      expect(component.emailTouched()).toBe(true);
      expect(component.talkTitleTouched()).toBe(true);
    });
  });

  describe('Navegação para o Dashboard', () => {
    it('deve possuir links/botões configurados para navegação para a rota /dashboard', () => {
      const headerDashboardBtn: HTMLElement = fixture.nativeElement.querySelector('#btn-header-dashboard');
      expect(headerDashboardBtn).toBeTruthy();
      expect(headerDashboardBtn.textContent).toContain('Ver Painel');

      const navDashboardBtn: HTMLElement = fixture.nativeElement.querySelector('#btn-nav-dashboard');
      expect(navDashboardBtn).toBeTruthy();
      expect(navDashboardBtn.textContent).toContain('Ver Palestras Submetidas');
    });
  });
});
