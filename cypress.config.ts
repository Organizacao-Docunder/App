import { defineConfig } from 'cypress';

export default defineConfig({
  projectId: 's4aruy',
  e2e: {
    baseUrl: 'http://localhost:3001',
    env: {
      hideCredentials: true,
      requestMode: true,
      apiUrl: 'http://localhost:3000',
    },
    experimentalRunAllSpecs: true,
    specPattern: 'cypress/tests/**/*.cy.{js,jsx,ts,tsx}',
  },
  video: false,
  chromeWebSecurity: false,
  scrollBehavior: false,
});
