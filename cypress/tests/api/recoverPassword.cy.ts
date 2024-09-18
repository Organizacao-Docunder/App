import { faker } from '@faker-js/faker';

describe('Recovers the user password using the API', () => {
  let email: string;
  let answer1: string;
  let answer2: string;
  let answer3: string;
  const newPassword: string = faker.internet.password({
    length: 12,
    memorable: false,
    prefix: 'A1a@',
  });

  beforeEach(() => {
    email = faker.internet.email();
    answer1 = faker.animal.dog();
    answer2 = faker.location.city();
    answer3 = faker.color.human();

    cy.api_createNewUser({ email }, { answer1, answer2, answer3 });
  });
  it('Happy Path', () => {
    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/user/recover-password`,
      body: {
        email,
      },
    }).then((response) => {
      expect(response.status).to.equal(201);
      expect(response.body).to.be.an('array').and.to.have.length(3);
    });

    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/user/verify-secret-answer`,
      body: {
        email,
        questionId: 1,
        answer: answer1,
      },
    }).then((response) => {
      expect(response.status).to.equal(201);
      expect(response.headers).to.have.property('set-cookie');
      const cookies = response.headers['set-cookie'] as string[];
      const accessToken = cookies.find((cookie: string) =>
        cookie.startsWith('access_token='),
      );
      expect(accessToken).to.exist;
      Cypress.env('RESET_PASSWORD_ACCESS_TOKEN', accessToken.split(';')[0]);
    });

    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/user/reset-password`,
      headers: {
        Cookie: Cypress.env('RESET_PASSWORD_ACCESS_TOKEN'),
      },
      body: {
        email,
        newPassword,
      },
    }).then((response) => {
      expect(response.status).to.equal(201);
      expect(response.body.message).to.include('Password reset successfully');
    });
  });

  describe('Invalid Params', () => {
    describe('POST /user/recover-password', () => {
      it('invalid email', () => {
        cy.request({
          method: 'POST',
          url: `${Cypress.env('apiUrl')}/user/recover-password`,
          body: {
            email: 'bianca@email,com',
          },
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.equal(400);
        });
      });

      it('empty email', () => {
        cy.request({
          method: 'POST',
          url: `${Cypress.env('apiUrl')}/user/recover-password`,
          body: {
            email: '',
          },
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.equal(400);
        });
      });
    });

    describe('POST /user/verify-secret-answer', () => {
      it('invalid email', () => {
        cy.request({
          method: 'POST',
          url: `${Cypress.env('apiUrl')}/user/verify-secret-answer`,
          body: {
            email: 'bianca@email,com',
            questionId: 1,
            answer: answer1,
          },
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.equal(400);
        });
      });

      it('unregistered email', () => {
        cy.request({
          method: 'POST',
          url: `${Cypress.env('apiUrl')}/user/verify-secret-answer`,
          body: {
            email: 'unregistered@email.com',
            questionId: 1,
            answer: answer1,
          },
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.equal(404);
        });
      });

      it('empty email', () => {
        cy.request({
          method: 'POST',
          url: `${Cypress.env('apiUrl')}/user/verify-secret-answer`,
          body: {
            email: '',
            questionId: 1,
            answer: answer1,
          },
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.equal(400);
        });
      });

      it('invalid question id', () => {
        cy.request({
          method: 'POST',
          url: `${Cypress.env('apiUrl')}/user/verify-secret-answer`,
          body: {
            email,
            questionId: 'arroz',
            answer: answer1,
          },
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.equal(400);
        });
      });

      it('empty question id', () => {
        cy.request({
          method: 'POST',
          url: `${Cypress.env('apiUrl')}/user/verify-secret-answer`,
          body: {
            email,
            answer: answer1,
          },
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.equal(400);
        });
      });

      it('invalid answer', () => {
        cy.request({
          method: 'POST',
          url: `${Cypress.env('apiUrl')}/user/verify-secret-answer`,
          body: {
            email,
            questionId: 1,
            answer: 1,
          },
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.equal(400);
        });
      });

      it('empty answer', () => {
        cy.request({
          method: 'POST',
          url: `${Cypress.env('apiUrl')}/user/verify-secret-answer`,
          body: {
            email,
            questionId: 1,
            answer: '',
          },
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.equal(400);
        });
      });

      it('wrong answer', () => {
        cy.request({
          method: 'POST',
          url: `${Cypress.env('apiUrl')}/user/verify-secret-answer`,
          body: {
            email,
            questionId: 1,
            answer: 'As Crônicas de Nárnia',
          },
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.equal(400);
        });
      });
    });

    describe('POST /user/reset-password', () => {
      before(() => {
        cy.request({
          method: 'POST',
          url: `${Cypress.env('apiUrl')}/user/verify-secret-answer`,
          body: {
            email,
            questionId: 1,
            answer: answer1,
          },
        }).then((response) => {
          expect(response.status).to.equal(201);
          expect(response.headers).to.have.property('set-cookie');
          const cookies = response.headers['set-cookie'] as string[];
          const accessToken = cookies.find((cookie: string) =>
            cookie.startsWith('access_token='),
          );
          expect(accessToken).to.exist;
          Cypress.env('RESET_PASSWORD_ACCESS_TOKEN', accessToken.split(';')[0]);
        });
      });
      it('empty password', () => {
        cy.request({
          method: 'POST',
          url: `${Cypress.env('apiUrl')}/user/reset-password`,
          headers: {
            Cookie: Cypress.env('RESET_PASSWORD_ACCESS_TOKEN'),
          },
          body: {
            email,
            newPassword: '',
          },
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.equal(400);
        });
      });

      it('weak password', () => {
        cy.request({
          method: 'POST',
          url: `${Cypress.env('apiUrl')}/user/reset-password`,
          headers: {
            Cookie: Cypress.env('RESET_PASSWORD_ACCESS_TOKEN'),
          },
          body: {
            email,
            newPassword: 'weakPassword',
          },
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.equal(400);
        });
      });

      it('invalid email', () => {
        cy.request({
          method: 'POST',
          url: `${Cypress.env('apiUrl')}/user/reset-password`,
          headers: {
            Cookie: Cypress.env('RESET_PASSWORD_ACCESS_TOKEN'),
          },
          body: {
            email: 'bianca@email,com',
            newPassword,
          },
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.equal(400);
        });
      });

      it('wrong email', () => {
        cy.request({
          method: 'POST',
          url: `${Cypress.env('apiUrl')}/user/reset-password`,
          headers: {
            Cookie: Cypress.env('RESET_PASSWORD_ACCESS_TOKEN'),
          },
          body: {
            email: faker.internet.email(),
            newPassword,
          },
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.equal(403);
        });
      });

      it('without auth', () => {
        cy.request({
          method: 'POST',
          url: `${Cypress.env('apiUrl')}/user/reset-password`,
          body: {
            email,
            newPassword,
          },
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.equal(401);
        });
      });
    });
  });
});
