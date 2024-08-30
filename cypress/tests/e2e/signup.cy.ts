describe('Create a new account on Docunder', () => {
  beforeEach(() => {
    cy.visit('/signup');
  });
  it('creates a new account sucessfully', () => {
    cy.gui_fillSignupFormAndSubmit();
    cy.get('#questionId1').should('be.visible');

    cy.gui_fillSecretQuestionFormAndSubmit();
    cy.contains('h2', 'Atenção').should('be.visible');
    cy.contains('button', 'Enviar').click();

    cy.url().should('eq', `${Cypress.config('baseUrl')}/home`);
    cy.contains('h3', 'Início').should('be.visible');
  });

  describe('Invalid Inputs', () => {
    describe('Sign Up Page', () => {
      it('try to create an account with a short name ', () => {
        cy.gui_fillSignupFormAndSubmit({ name: '.' });
        cy.get('p')
          .contains('O nome deve conter apenas letras e espaços.')
          .should('be.visible');
      });
      it('try to create an account with an invalid email ', () => {
        cy.gui_fillSignupFormAndSubmit({ email: 'bianca@email,com' });
        cy.get('p').contains('E-mail inválido.').should('be.visible');
      });

      it('try to create an account with an invalid password ', () => {
        cy.gui_fillSignupFormAndSubmit({ password: 'Stress&Test' });
        cy.get('p')
          .contains('Adicione pelo menos um dígito.')
          .should('be.visible');
      });

      it('try to create an account with password not matching ', () => {
        cy.get('#name').type('Bianca');
        cy.get('#email').type('testrandomemail@user.com');
        cy.get('#password').type('Str3ss&Test', { log: false });
        cy.get('input[name="matchPassword"').type('T3sting@123', {
          log: false,
        });

        cy.contains('button', 'Continuar').click();

        cy.get('p')
          .contains('Confirmação de senha incorreta.')
          .should('be.visible');
      });
    });
    describe('Secret Answer Page', () => {
      it('try to create an account with all empty fields', () => {
        cy.gui_fillSignupFormAndSubmit();
        cy.get('#questionId1').should('be.visible');

        cy.get('#questionId1').should('be.visible').select(1);
        cy.get('#questionId2').should('be.visible').select(2);
        cy.get('#questionId3').should('be.visible').select(3);
        cy.contains('button', 'Enviar').click();

        cy.get('p')
          .contains('A resposta deve ter entre 3 e 74 caracteres.')
          .should('be.visible');
      });

      it('try to create an account with one invalid field', () => {
        cy.gui_fillSignupFormAndSubmit();
        cy.get('#questionId1').should('be.visible');

        cy.gui_fillSecretQuestionFormAndSubmit({
          answer1: 'x',
        });

        cy.get('p')
          .contains('A resposta deve ter entre 3 e 74 caracteres.')
          .should('be.visible');
      });
    });
  });
});

describe('Terms of Service and Privacy Police', () => {
  beforeEach(() => {
    cy.visit('/signup');
    cy.get('span')
      .contains('Termos de Uso e das Políticas de privacidade')
      .as('btnToS');
    cy.get('@btnToS').should('be.visible');
    cy.get('@btnToS').click();
  });
  it('should open the modal and be visible', () => {
    cy.get('h3').contains('Termos e condições de uso').should('be.visible');
  });

  it('should have a close button', () => {
    cy.get('h3').contains('Termos e condições de uso').as('tosHeader');
    cy.get('button').contains('Fechar').should('be.visible').click();
  });
});
