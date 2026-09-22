import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { CfpDashboardComponent } from './cfp-dashboard.component';
import { SpeakerDTO } from '@cfp-platform/share-types';

describe('CfpDashboardComponent', () => {
  let component: CfpDashboardComponent;
  let fixture: ComponentFixture<CfpDashboardComponent>;
  let httpTesting: HttpTestingController;

  const mockProposals: SpeakerDTO[] = [
    {
      id: 'spk-1',
      name: 'Grace Hopper',
      email: 'grace@example.com',
      talkTitle: 'Compilers and Innovations',
      isGDE: true,
    },
    {
      id: 'spk-2',
      name: 'Linus Torvalds',
      email: 'linus@example.com',
      talkTitle: 'Git & Kernel Architecture',
      isGDE: false,
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CfpDashboardComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents();

    httpTesting = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(CfpDashboardComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should create the dashboard component', () => {
    // Flush initial request triggered on ngOnInit
    fixture.detectChanges();
    const req = httpTesting.expectOne('/api/cfp');
    req.flush([]);

    expect(component).toBeTruthy();
  });

  it('should load proposals and render them in the table', () => {
    fixture.detectChanges();

    const req = httpTesting.expectOne('/api/cfp');
    expect(req.request.method).toBe('GET');
    req.flush(mockProposals);

    fixture.detectChanges();

    expect(component.isLoading()).toBe(false);
    expect(component.proposals().length).toBe(2);

    const compiled = fixture.nativeElement as HTMLElement;
    const table = compiled.querySelector('table.cfp-table');
    expect(table).toBeTruthy();

    const rows = compiled.querySelectorAll('tbody tr');
    expect(rows.length).toBe(2);

    expect(rows[0].textContent).toContain('Compilers and Innovations');
    expect(rows[0].textContent).toContain('Grace Hopper');
    expect(rows[0].textContent).toContain('grace@example.com');
  });

  it('should display GDE badge only for speakers who are Google Developer Experts', () => {
    fixture.detectChanges();

    const req = httpTesting.expectOne('/api/cfp');
    req.flush(mockProposals);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const rows = compiled.querySelectorAll('tbody tr');

    const firstRowBadge = rows[0].querySelector('.badge-gde');
    expect(firstRowBadge).toBeTruthy();
    expect(firstRowBadge?.textContent?.trim()).toBe('GDE');

    const secondRowBadge = rows[1].querySelector('.badge-gde');
    expect(secondRowBadge).toBeFalsy();
    expect(rows[1].textContent).toContain('—');
  });

  it('should display empty state when no proposals exist', () => {
    fixture.detectChanges();

    const req = httpTesting.expectOne('/api/cfp');
    req.flush([]);

    fixture.detectChanges();

    expect(component.isLoading()).toBe(false);
    expect(component.proposals().length).toBe(0);

    const compiled = fixture.nativeElement as HTMLElement;
    const emptyState = compiled.querySelector('#empty-state');
    expect(emptyState).toBeTruthy();
    expect(emptyState?.textContent).toContain('Nenhuma palestra submetida');

    const table = compiled.querySelector('table.cfp-table');
    expect(table).toBeFalsy();
  });

  it('should display error message when HTTP request fails', () => {
    fixture.detectChanges();

    const req = httpTesting.expectOne('/api/cfp');
    req.flush(
      { message: 'Falha de comunicação com o servidor' },
      { status: 500, statusText: 'Internal Server Error' }
    );

    fixture.detectChanges();

    expect(component.isLoading()).toBe(false);
    expect(component.errorMessage()).toContain('Falha de comunicação');

    const compiled = fixture.nativeElement as HTMLElement;
    const errorAlert = compiled.querySelector('#dashboard-error');
    expect(errorAlert).toBeTruthy();
    expect(errorAlert?.textContent).toContain('Falha de comunicação');
  });

  it('should include navigation button to return to the CFP submission form', () => {
    fixture.detectChanges();

    const req = httpTesting.expectOne('/api/cfp');
    req.flush([]);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const newSubmissionBtn = compiled.querySelector('#btn-new-submission');
    expect(newSubmissionBtn).toBeTruthy();
    expect(newSubmissionBtn?.getAttribute('href') || newSubmissionBtn?.getAttribute('routerLink')).toBeDefined();
  });
});
