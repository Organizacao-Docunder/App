import { faker } from '@faker-js/faker';

Cypress.Commands.add(
  'gui_login',
  ({
    email = Cypress.env('USER_EMAIL'),
    password = Cypress.env('USER_PASSWORD'),
  } = {}) => {
    cy.visit('/login');
    Cypress.log({
      displayName: 'LOGIN',
      message: [`🔐 Authenticating | ${email}`],
    });

    cy.intercept('POST', '**/login').as('auth');

    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password, { log: false });
    cy.get('#signup').click();
    cy.wait('@auth');
  },
);

Cypress.Commands.add(
  'gui_fillSignupFormAndSubmit',
  ({
    name = faker.person.firstName(),
    email = faker.internet.email(),
    password = faker.internet.password({
      length: 12,
      memorable: false,
      prefix: 'A1a@',
    }),
    acceptTermsOfUse = true,
  } = {}) => {
    cy.get('#name').type(name);
    cy.get('#email').type(email);
    cy.get('#password').type(password, { log: false });
    cy.get('input[name="matchPassword"').type(password, { log: false });
    if (acceptTermsOfUse) cy.get('#termsOfUse').check();
    cy.contains('button', 'Continuar').click();
  },
);

Cypress.Commands.add(
  'gui_fillSecretQuestionFormAndSubmit',
  ({
    answer1 = faker.animal.dog(),
    answer2 = faker.location.city(),
    answer3 = faker.color.human(),
  } = {}) => {
    cy.get('#questionId1').should('be.visible').select(1);
    cy.get('input[name="answer1"').type(answer1, { log: false });
    cy.get('#questionId2').should('be.visible').select(2);
    cy.get('input[name="answer2"').type(answer2, { log: false });
    cy.get('#questionId3').should('be.visible').select(3);
    cy.get('input[name="answer3"').type(answer3, { log: false });
    cy.contains('button', 'Enviar').click();
  },
);
