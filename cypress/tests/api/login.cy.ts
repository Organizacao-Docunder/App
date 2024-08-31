describe('Login on Docunder using the API ', () => {
  it('sucessfully logs in', () => {
    cy.api_login().then((response) => {
      expect(response.status).to.equal(200);
      expect(response.headers).to.have.property('set-cookie');
      const accessToken = response.headers['set-cookie'].find((cookie) =>
        cookie.startsWith('access_token='),
      );
      expect(accessToken).to.exist;
    });
  });

  describe('Invalid Credentials', () => {
    it('try to log in with valid email but wrong password', () => {
      cy.api_login({ password: '1nV4lidP@ssw0rd' }).then((response) => {
        expect(response.status).to.equal(401);
        expect(response.headers).to.not.have.property('set-cookie');
      });
    });

    it('try to log in with invalid email and valid password', () => {
      cy.api_login({ email: 'rodrigo@email,com' }).then((response) => {
        expect(response.status).to.equal(400);
        expect(response.headers).to.not.have.property('set-cookie');
      });
    });

    it('try to log in with unregistered email and valid password', () => {
      cy.api_login({ email: 'bomdia@email.com' }).then((response) => {
        expect(response.status).to.equal(401);
        expect(response.headers).to.not.have.property('set-cookie');
      });
    });
  });
});
