Cypress.Commands.add(
  'api_login',
  ({
    email = Cypress.env('USER_EMAIL'),
    password = Cypress.env('USER_PASSWORD'),
  } = {}) => {
    Cypress.log({
      displayName: 'LOGIN',
      message: [`🔐 Authenticating | ${email}`],
    });
    return cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/login`,
      body: {
        email: email,
        password: password,
      },
      failOnStatusCode: false,
    });
  },
);
