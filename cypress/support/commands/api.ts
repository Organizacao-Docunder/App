import { faker } from '@faker-js/faker';

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

Cypress.Commands.add(
  'api_createNewUser',
  (
    {
      name = faker.person.firstName(),
      email = faker.internet.email(),
      password = faker.internet.password({
        length: 12,
        memorable: false,
        prefix: 'A1a@',
      }),
      acceptTermsOfUse = true,
    } = {},
    {
      answer1 = faker.animal.dog(),
      answer2 = faker.location.city(),
      answer3 = faker.color.human(),
    } = {},
  ) => {
    return cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/user`,
      body: {
        name,
        email,
        password,
        acceptedTerms: acceptTermsOfUse,
        secretAnswers: [
          {
            questionId: 1,
            answer: answer1,
          },
          {
            questionId: 2,
            answer: answer2,
          },
          {
            questionId: 3,
            answer: answer3,
          },
        ],
      },
      failOnStatusCode: false,
    });
  },
);
