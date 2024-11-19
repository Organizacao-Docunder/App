Cypress.Commands.add(
  'sessionLogin',
  ({
    email = Cypress.env('USER_EMAIL'),
    password = Cypress.env('USER_PASSWORD'),
  } = {}) => {
    const login = () =>
      cy.api_login({ email, password }).then((response) => {
        let accessToken: string = response.headers['set-cookie'].find(
          (cookie: string) => cookie.startsWith('access_token='),
        );
        accessToken = accessToken.split(';')[0];
        cy.setCookie('ACCESS_TOKEN', accessToken, {
          httpOnly: true,
        });
        Cypress.env('USER_ID', response.body.id);
        Cypress.env('ACCESS_TOKEN', accessToken);
      });
    cy.session(email, login);
  },
);
