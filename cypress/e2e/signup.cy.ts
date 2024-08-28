import { fakerPT_BR as faker } from '@faker-js/faker';
describe('Create a new account on Docunder', () => {
  beforeEach(() => {
    cy.visit('/signup');
    cy.intercept('POST', '**/login').as('postSignUp');
  });
  it('creates a new account sucessfully', () => {
    cy.get('#name').type(faker.person.firstName());
    cy.get('#email').type(faker.internet.email());
    const _password = faker.internet.password({
      length: 12,
      memorable: false,
      prefix: 'A1a@',
    });
    cy.get('#password').type(_password, { log: false });
    cy.get('input[name="matchPassword"').type(_password, { log: false });
    cy.contains('button', 'Continuar').click();
    // cy.wait('@postSignUp');

    const secretAnswer = {
      answer1: faker.animal.dog(),
      answer2: faker.location.city(),
      answer3: faker.color.human(),
    };

    cy.get('#questionId1').should('be.visible').select(1);
    cy.get('input[name="answer1"').type(secretAnswer.answer1, { log: false });
    cy.get('#questionId2').should('be.visible').select(2);
    cy.get('input[name="answer2"').type(secretAnswer.answer2, { log: false });
    cy.get('#questionId2').should('be.visible').select(3);
    cy.get('input[name="answer2"').type(secretAnswer.answer3, { log: false });
    cy.contains('button', 'Enviar').click();
    // cy.wait('@postSignUp');
    cy.contains('h2', 'Atenção').should('be.visible');
    cy.contains('button', 'Enviar').click();
    cy.wait('@postSignUp');
    cy.url().should('eq', `${Cypress.config('baseUrl')}/home`);
    cy.contains('h3', 'Início').should('be.visible');
  });
});
