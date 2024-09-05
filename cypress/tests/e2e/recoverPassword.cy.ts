import { faker } from '@faker-js/faker';

let email: string;
let answer1: string;
describe('Recovers the user password using the GUI', () => {
  beforeEach(() => {
    Cypress.env('requestMode', false);
    cy.visit('/recover-password');

    email = faker.internet.email();
    answer1 = faker.animal.dog();

    cy.api_createNewUser({ email }, { answer1 });
  });
  it('successfully recovers the password', () => {
    cy.get('#email').should('be.visible').type(email);
    cy.contains('button', 'Continuar').click();

    cy.get('#questionId').should('be.visible').select(1);
    cy.get('input[name="answer"]').type(answer1);
    cy.contains('button', 'Continuar').click();

    const newPassword = 'Str3ss&Test';
    cy.get('#password').should('be.visible').type(newPassword);
    cy.get('#matchPassword').should('be.visible').type(newPassword);
    cy.contains('button', 'Continuar').click();

    cy.get('h1').contains('Senha redefinida').should('be.visible');

    cy.api_login({ email, password: newPassword }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.headers).to.have.property('set-cookie');
      const accessToken = response.headers['set-cookie'].find((cookie) =>
        cookie.startsWith('access_token='),
      );
      expect(accessToken).to.exist;
    });
  });

  describe('Invalid Params', () => {
    it('unregistered email', () => {
      cy.get('#email').should('be.visible').type(faker.internet.email());
      cy.contains('button', 'Continuar').click();
      cy.get('p').contains('O e-mail não confere').should('be.visible');
    });

    it('empty secret question', () => {
      cy.get('#email').should('be.visible').type(email);
      cy.contains('button', 'Continuar').click();

      cy.get('#questionId').should('be.visible');
      cy.contains('button', 'Continuar').click();
      cy.get('p').contains('Escolha uma pergunta.').should('be.visible');
    });

    it('empty secret answer', () => {
      cy.get('#email').should('be.visible').type(email);
      cy.contains('button', 'Continuar').click();

      cy.get('#questionId').should('be.visible').select(1);
      cy.contains('button', 'Continuar').click();
      cy.get('p').contains('Digite sua resposta.').should('be.visible');
    });

    it('wrong secret answer', () => {
      cy.get('#email').should('be.visible').type(email);
      cy.contains('button', 'Continuar').click();

      cy.get('#questionId').should('be.visible').select(1);
      cy.get('input[name="answer"]').type('wrong answer');
      cy.contains('button', 'Continuar').click();
      cy.get('p').contains('A resposta está incorreta.').should('be.visible');
    });

    it('empty new password', () => {
      cy.get('#email').should('be.visible').type(email);
      cy.contains('button', 'Continuar').click();

      cy.get('#questionId').should('be.visible').select(1);
      cy.get('input[name="answer"]').type(answer1);
      cy.contains('button', 'Continuar').click();

      cy.get('#password').should('be.visible');
      cy.contains('button', 'Continuar').click();

      cy.get('p')
        .contains('A senha deve possuir entre 6 e 74 caracteres.')
        .should('be.visible');
    });

    it('invalid new password', () => {
      cy.get('#email').should('be.visible').type(email);
      cy.contains('button', 'Continuar').click();

      cy.get('#questionId').should('be.visible').select(1);
      cy.get('input[name="answer"]').type(answer1);
      cy.contains('button', 'Continuar').click();

      const newPassword = 'invalidPassword';
      cy.get('#password').should('be.visible').type(newPassword);
      cy.get('#matchPassword').should('be.visible').type(newPassword);
      cy.contains('button', 'Continuar').click();

      cy.get('p')
        .contains('Adicione pelo menos um dígito.')
        .should('be.visible');
    });

    it('unmatching passwords', () => {
      cy.get('#email').should('be.visible').type(email);
      cy.contains('button', 'Continuar').click();

      cy.get('#questionId').should('be.visible').select(1);
      cy.get('input[name="answer"]').type(answer1);
      cy.contains('button', 'Continuar').click();

      cy.get('#password').should('be.visible').type('Str3ss&Test');
      cy.get('#matchPassword').should('be.visible').type('s3cretP@ssword');
      cy.contains('button', 'Continuar').click();

      cy.get('p')
        .contains('Confirmação de senha incorreta.')
        .should('be.visible');
    });
  });
});
