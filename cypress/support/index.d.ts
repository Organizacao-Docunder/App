/// <reference types="cypress" />

declare namespace Cypress {
  type SecretAnswer = {
    answer1?: string;
    answer2?: string;
    answer3?: string;
  };

  type LoginParams = {
    email?: string;
    password?: string;
  };

  type SignupFormParams = {
    name?: string;
    email?: string;
    password?: string;
    acceptTermsOfUse?: boolean;
  };

  interface Chainable<Subject> {
    /**
     * Logs into Docunder via the graphical user interface (GUI).
     *
     * @param credentials The credentials for login
     *
     * @example
     * // Logs into the app using the default email and password (defined as envs)
     * cy.gui_login()
     *
     * // Logs into the app using the provided credentials
     * cy.gui_Login({ email: 'user@email.com', password: 'myPassword' })
     */
    gui_login(credentials?: LoginParams): void | Cypress.Chainable<null>;

    /**
     * Fills in first part of the signup form and submits it with the provided credentials.
     * If no info was given, it will use fake data in the inputs.
     *
     * @param userDetails Object - The credentials for fill the signup form
     *
     * @example
     *  //Fill the form with fake data
     *  cy.gui_fillSignupFormAndSubmit()
     *  //Fill the form with the given data
     *  cy.gui_fillSignupFormAndSubmit({ email: 'user@example.com', password: 'sEcR37-p@s5w0rD' })
     */
    gui_fillSignupFormAndSubmit(
      userDetails?: SignupFormParams,
    ): void | Cypress.Chainable<null>;

    /**
     * Fills in second part of the signup form and submits it with the provided secret questions.
     * The Questions are choosen as index 1, 2 and 3
     * If no info was given, it will use fake data in the inputs.
     *
     * @param secretAnswer Object - The secretAnswers for signup
     *
     * @example
     * //answer1 = cat, answer2 = Paris, answer3 = red
     * cy.gui_fillSignupFormAndSubmit()
     *
     * //answer1 = bethoven, answer2 = Recife, answer3 = cyan
     * cy.gui_fillSignupFormAndSubmit({ answer1: bethoven})
     */
    gui_fillSecretQuestionFormAndSubmit(
      secretAnswer?: SecretAnswer,
    ): void | Cypress.Chainable<null>;

    /**
     * Logs into Docunder via the Application Programming Interface (API).
     * If no info was given, it will use fake data in the inputs.
     *
     * @param credentials Object - The credentials for login
     *
     * @example
     * //Logs into the app using the default email and password (defined as envs)
     * cy.api_login()
     *
     * //Logs into the app using the provided credentials
     * cy.api_Login({ email: 'user@email.com', password: 'myPassword' })
     */
    api_login(credentials?: LoginParams): Chainable<Response>;

    /**
     * Logs into Docunder using the cy.api_login().
     * Stores the Session and the JWT Token
     * If no info was given, it will use fake data in the inputs.
     *
     * @param credentials Object - The credentials for login
     *
     * @example
     * //Logs into the app using the default email and password (defined as envs)
     * cy.sessionLogin()
     *
     * //Logs into the app using the provided credentials
     * cy.sessionLogin({ email: 'user@email.com', password: 'myPassword' })
     */
    sessionLogin(credentials?: LoginParams): Chainable<Response>;

    /**
     * Creates a new user in Docunder using the API
     * If no info was given, it will use fake data in the inputs.
     *
     * @param userDetails The credentials for signup
     * @param secretAnswer The secretAnswers for signup
     *
     * @example
     * //Create a new user with fake data
     * cy.api_createNewUser()
     *
     * //Create a new user with the given data. The missing inputs will be used fake data
     * cy.api_createNewUser({ name: 'Bianca' }, { answer1: 'dog' });
     */
    api_createNewUser(
      userDetails?: SignupFormParams,
      secretAnswer?: SecretAnswer,
    ): Chainable<Response>;
  }
}
