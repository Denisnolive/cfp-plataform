import { Route } from '@angular/router';
import { CfpSubmissionComponent } from './cfp/cfp-submission.component';

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
];
