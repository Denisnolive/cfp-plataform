import { Route } from '@angular/router';
import { CfpSubmissionComponent } from './cfp/cfp-submission.component';
import { CfpDashboardComponent } from './cfp/cfp-dashboard.component';
import { EventRegistrationComponent } from './event/event-registration.component';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'cfp',
  },
  {
    path: 'cfp',
    component: CfpSubmissionComponent,
  },
  {
    path: 'dashboard',
    component: CfpDashboardComponent,
  },
  {
    path: 'event/new',
    component: EventRegistrationComponent,
  },
];

