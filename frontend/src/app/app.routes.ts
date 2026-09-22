import { Route } from '@angular/router';
import { CfpSubmissionComponent } from './cfp/cfp-submission.component';
import { CfpDashboardComponent } from './cfp/cfp-dashboard.component';

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
];
