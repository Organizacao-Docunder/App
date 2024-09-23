import { defineConfig } from 'cypress';
import 'dotenv/config';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3001',
    env: {
      hideCredentials: true,
      requestMode: true,
      apiUrl: 'http://localhost:3000',
      USER_EMAIL: process.env.CYPRESS_USER_EMAIL,
      USER_PASSWORD: process.env.CYPRESS_USER_PASSWORD,
    },
    experimentalRunAllSpecs: true,
    specPattern: 'cypress/tests/**/*.cy.{js,jsx,ts,tsx}',
  },
  video: false,
  chromeWebSecurity: false,
  scrollBehavior: false,
});
