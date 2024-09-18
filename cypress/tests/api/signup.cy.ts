import { faker } from '@faker-js/faker';

const API_URL = Cypress.env('apiUrl');
describe('Create a new account on Docunder using the API', () => {
  describe('Happy Path', () => {
    it('CRUD of a new account', () => {
      const name = `Happy Path ${faker.person.firstName()}`;
      const email = faker.internet.email();
      const password = faker.internet.password({
        length: 12,
        memorable: false,
        prefix: 'A1a@',
      });
      const newName = faker.person.firstName();

      // POST /user
      cy.api_createNewUser({ name, email, password }).then((response) => {
        expect(response.status).to.equal(201);
        expect(response.body.name).to.equal(name);
        expect(response.body.email).to.equal(email);

        const userId = response.body.id;

        cy.sessionLogin({ email, password });

        // GET /me
        cy.request({
          method: 'GET',
          url: `${API_URL}/me`,
        }).then((response) => {
          expect(response.status).to.equal(200);
          expect(response.body.id).to.equal(userId);
          expect(response.body.name).to.equal(name);
          expect(response.body.email).to.equal(email);
        });

        // PATCH /user/:userId
        cy.request({
          method: 'PATCH',
          url: `${API_URL}/user/${userId}`,
          body: {
            name: newName,
            email: email,
          },
        }).then((response) => {
          expect(response.status).to.equal(200);
          expect(response.body.id).to.equal(userId);
          expect(response.body.name).to.equal(newName);
          expect(response.body.email).to.equal(email);
        });

        // DELETE /user/:userId
        cy.request({
          method: 'DELETE',
          url: `${API_URL}/user/${userId}`,
        }).then((response) => {
          expect(response.status).to.equal(200);
        });
      });
    });
  });

  describe('Invalid Params', () => {
    before(() => {
      const name = `Patch ${faker.person.firstName()}`;
      const email = faker.internet.email();
      const password = faker.internet.password({
        length: 12,
        memorable: false,
        prefix: 'A1a@',
      });
      Cypress.env('NEW_EMAIL', email);
      Cypress.env('NEW_PASSWORD', password);
      cy.api_createNewUser({ name, email, password });
      cy.sessionLogin({ email, password });
    });

    describe('POST /user', () => {
      it('try to create User with empty name', () => {
        cy.api_createNewUser({
          name: '',
          email: 'post_empty_name@email.com',
        }).then((response) => {
          expect(response.status).to.equal(400);
          expect(response.body.message).to.include('name should not be empty');
        });
      });

      it('try to create User with invalid name', () => {
        cy.api_createNewUser({
          name: 'Bi@nca',
          email: 'post_invalid_name@email.com',
        }).then((response) => {
          expect(response.status).to.equal(400);
          expect(response.body.message).to.include(
            'The name should only contain letters and spaces.',
          );
        });
      });

      it('try to create User with invalid email', () => {
        cy.api_createNewUser({
          name: 'Post Invalid Email',
          email: 'bianca@email,com',
        }).then((response) => {
          expect(response.status).to.equal(400);
          expect(response.body.message).to.include('email must be an email');
        });
      });

      it('try to create User with already registered email', () => {
        cy.api_createNewUser({
          name: 'Post Registered Email',
          email: Cypress.env('USER_EMAIL'),
        }).then((response) => {
          expect(response.status).to.equal(409);
          expect(response.body.message).to.include(
            'The email is already in use',
          );
        });
      });

      it('try to create User with empty password', () => {
        cy.api_createNewUser({
          name: 'Post mpty Password',
          password: '',
        }).then((response) => {
          expect(response.status).to.equal(400);
          expect(response.body.message).to.include(
            'password must be longer than or equal to 6 characters',
          );
        });
      });

      it('try to create User with weak password', () => {
        cy.api_createNewUser({
          name: 'Post Weak Password',
          password: 'weakPassword',
        }).then((response) => {
          expect(response.status).to.equal(400);
          expect(response.body.message).to.include('Password Too Weak');
        });
      });

      it('try to create User with short password', () => {
        cy.api_createNewUser({
          name: 'Post Short Password',
          password: 'G0ku!',
        }).then((response) => {
          expect(response.status).to.equal(400);
          expect(response.body.message).to.include(
            'password must be longer than or equal to 6 characters',
          );
        });
      });
    });

    describe('PATCH /user', () => {
      it('try to update User with invalid id', () => {
        cy.request({
          method: 'PATCH',
          url: `${API_URL}/user/0`,
          headers: {
            Cookie: Cypress.env('ACCESS_TOKEN'),
          },
          body: {
            name: 'Patch Invalid Id',
            email: Cypress.env('NEW_EMAIL'),
          },
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.equal(400);
        });
      });

      it('try to update User with invalid name', () => {
        cy.request({
          method: 'PATCH',
          url: `${API_URL}/user/${Cypress.env('USER_ID')}`,
          headers: {
            Cookie: Cypress.env('ACCESS_TOKEN'),
          },
          body: {
            name: 'Bi@nca',
            email: Cypress.env('NEW_EMAIL'),
          },
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.equal(400);
        });
      });

      it('try to update User with invalid email', () => {
        cy.request({
          method: 'PATCH',
          url: `${API_URL}/user/${Cypress.env('USER_ID')}`,
          headers: {
            Cookie: Cypress.env('ACCESS_TOKEN'),
          },
          body: {
            name: 'Patch Invalid Email',
            email: 'bianca@email,com',
          },
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.equal(400);
        });
      });

      it('try to update User with empty name', () => {
        cy.request({
          method: 'PATCH',
          url: `${API_URL}/user/${Cypress.env('USER_ID')}`,
          headers: {
            Cookie: Cypress.env('ACCESS_TOKEN'),
          },
          body: {
            name: '',
            email: Cypress.env('NEW_EMAIL'),
          },
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.equal(400);
        });
      });

      it('try to update User with empty email', () => {
        cy.request({
          method: 'PATCH',
          url: `${API_URL}/user/${Cypress.env('USER_ID')}`,
          headers: {
            Cookie: Cypress.env('ACCESS_TOKEN'),
          },
          body: {
            name: 'Patch Empty Email',
            email: '',
          },
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.equal(400);
        });
      });

      it('try to update User with empty body', () => {
        cy.request({
          method: 'PATCH',
          url: `${API_URL}/user/${Cypress.env('USER_ID')}`,
          headers: {
            Cookie: Cypress.env('ACCESS_TOKEN'),
          },
          body: {},
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.equal(400);
        });
      });

      it('try to update User with already used email', () => {
        cy.request({
          method: 'PATCH',
          url: `${API_URL}/user/${Cypress.env('USER_ID')}`,
          headers: {
            Cookie: Cypress.env('ACCESS_TOKEN'),
          },
          body: {
            name: 'Patch Registered Email',
            email: Cypress.env('USER_EMAIL'),
          },
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.equal(409);
        });
      });
    });

    describe('DELETE /user', () => {
      it('try to delete user with invalid userId ', () => {
        cy.request({
          method: 'DELETE',
          url: `${API_URL}/user/0`,
          headers: {
            Cookie: Cypress.env('ACCESS_TOKEN'),
          },
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.equal(400);
        });
      });

      it('try to delete user with not registered userId ', () => {
        cy.request({
          method: 'DELETE',
          url: `${API_URL}/user/999999`,
          headers: {
            Cookie: Cypress.env('ACCESS_TOKEN'),
          },
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.equal(404);
        });
      });

      it('try to delete user with userId as a string ', () => {
        cy.request({
          method: 'DELETE',
          url: `${API_URL}/user/teste`,
          headers: {
            Cookie: Cypress.env('ACCESS_TOKEN'),
          },
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.equal(400);
        });
      });
    });
  });

  describe('Invalid Auth', () => {
    it('GET /me', () => {
      cy.request({
        method: 'GET',
        url: `${API_URL}/me`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(401);
      });
    });
    it('GET /user', () => {
      cy.request({
        method: 'GET',
        url: `${API_URL}/user`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(401);
      });
    });

    it('PATCH /user', () => {
      cy.request({
        method: 'PATCH',
        url: `${API_URL}/user/${1}`,
        body: {
          name: 'Roberto',
          email: Cypress.env('USER_EMAIL'),
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(401);
      });
    });

    it('DELETE /user', () => {
      cy.request({
        method: 'DELETE',
        url: `${API_URL}/user/${1}`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(401);
      });
    });
  });
});
