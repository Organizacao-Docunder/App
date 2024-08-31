describe('Login on Docunder using the GUI', () => {
  it('sucessfully logs in', () => {
    cy.gui_login();
    cy.contains('h3', 'Início').should('be.visible');
  });

  describe('Invalid credentials', () => {
    it('try to log in with valid email but wrong password', () => {
      cy.gui_login({ password: '1nv4lidP@assword' });
      cy.get('form span p').contains('E-mail e/ou senha incorreto(s)');
    });

    it('try to log in with unregistered email and valid password', () => {
      cy.gui_login({ email: 'invalid@email.com' });
      cy.get('form span p').contains('E-mail e/ou senha incorreto(s)');
    });

    it('try to log in with invalid email and valid password', () => {
      cy.gui_login({ email: 'bianca@email,com' });
      cy.get('form span p').contains('E-mail e/ou senha incorreto(s)');
    });
  });
});
