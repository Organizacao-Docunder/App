import { faker } from '@faker-js/faker';

Cypress.Commands.add(
  'gui_login',
  (
    _email = Cypress.env('USER_EMAIL'),
    _password = Cypress.env('USER_PASSWORD'),
  ) => {
    cy.intercept('POST', '**/login').as('auth');

    cy.get('input[name="email"]').type(_email);
    cy.get('input[name="password"]').type(_password, { log: false });
    cy.get('#signup').click();
    cy.wait('@auth');
  },
);

Cypress.Commands.add('gui_fillSignupFormAndSubmit', (email, password) => {
  email =
    email ||
    `${faker.string.uuid()}@${Cypress.env('MAILOSAUR_SERVER_ID')}.mailosaur.net`;
  password = password || Cypress.env('USER_PASSWORD');

  cy.intercept('GET', '**/notes').as('getNotes');
  cy.visit('/signup');

  cy.get('#email').type(email);
  cy.get('#password').type(password, { log: false });
  cy.get('#confirmPassword').type(password, { log: false });
  cy.contains('button', 'Signup').click();

  cy.get('#confirmationCode').should('be.visible');
});
