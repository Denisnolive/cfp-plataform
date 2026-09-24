import { defineConfig } from 'cypress';
import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';

export default defineConfig({
  projectId: '3wfx32',
  allowCypressEnv: false,
  e2e: {
    ...nxE2EPreset(__filename, {
      cypressDir: 'src',
    }),
    baseUrl: 'http://localhost:4200',
    specPattern: 'src/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'src/support/e2e.ts',
  },
});
