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
  };

  interface Chainable<Subject> {
    /**
     * Logs into Docunder via the graphical user interface (GUI).
     *
     * @param credentials Object - The credentials for login
     * @param credentials.email string - The email of the user you want to log in with
     * @param credentials.password string - The password of the user you want to log in with
     *
     * @example cy.gui_login() // Logs into the app using the default email and password (defined as envs)
     * @example cy.gui_Login({ email: 'user@email.com', password: 'myPassword' }) // Logs into the app using the provided credentials
     */
    gui_login(credentials?: LoginParams): void | Cypress.Chainable<null>;

    /**
     * Fills in first part of the signup form and submits it with the provided credentials.
     * If no info was given, it will use fake data in the inputs.
     *
     * @param userDetails Object - The credentials for signup
     * @param userDetails.name string - The name of the user being signed up
     * @param userDetails.email string - The email of a still not signed up user
     * @param userDetails.password string - The password for the user being signed up
     *
     * @example cy.gui_fillSignupFormAndSubmit() // email = Romenia_Slive@hotmail.com, password = A1a@XSLRKI5X
     * @example cy.gui_fillSignupFormAndSubmit({ email: 'user@example.com', password: 'sEcR37-p@s5w0rD' }) // email = user@example.com, password = sEcR37-p@s5w0rD
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
     * @param secretAnswer.answer1 string - The answer for the first question
     * @param secretAnswer.answer2 string - The answer for the second question
     * @param secretAnswer.answer3 string - The answer for the third question
     *
     * @example cy.gui_fillSignupFormAndSubmit() // answer1 = cat, answer2 = Paris, answer3 = red
     * @example cy.gui_fillSignupFormAndSubmit({ answer1: bethoven}) // answer1 = bethoven, answer2 = Recife, answer3 = cyan
     */
    gui_fillSecretQuestionFormAndSubmit(
      secretAnswer?: SecretAnswer,
    ): void | Cypress.Chainable<null>;

    /**
     * Logs into Docunder via the Application Programming Interface (API).
     * If no info was given, it will use fake data in the inputs.
     *
     * @param credentials Object - The credentials for login
     * @param credentials.email string - The email of the user you want to log in with
     * @param credentials.password string - The password of the user you want to log in with
     *
     * @example cy.api_login() // Logs into the app using the default email and password (defined as envs)
     * @example cy.api_Login({ email: 'user@email.com', password: 'myPassword' }) // Logs into the app using the provided credentials
     */
    api_login(credentials?: LoginParams): Chainable<Response>;

    /**
     * Logs into Docunder using the cy.api_login().
     * Stores the Session and the JWT Token
     * If no info was given, it will use fake data in the inputs.
     *
     * @param credentials Object - The credentials for login
     * @param credentials.email string - The email of the user you want to log in with
     * @param credentials.password string - The password of the user you want to log in with
     *
     * @example cy.sessionLogin() // Logs into the app using the default email and password (defined as envs)
     * @example cy.sessionLogin({ email: 'user@email.com', password: 'myPassword' }) // Logs into the app using the provided credentials
     */
    sessionLogin(credentials?: LoginParams): Chainable<Response>;
    /**
     * Creates a new user in Docunder using the API
     * If no info was given, it will use fake data in the inputs.
     *
     * @param userDetails Object - The credentials for signup
     * @param userDetails.name string - The name of the user being signed up
     * @param userDetails.email string - The email of a still not signed up user
     * @param userDetails.password string - The password for the user being signed up
     *
     * @param secretAnswer Object - The secretAnswers for signup
     * @param secretAnswer.answer1 string - The answer for the first question
     * @param secretAnswer.answer2 string - The answer for the second question
     * @param secretAnswer.answer3 string - The answer for the third question
     *
     */
    api_createNewUser(
      userDetails?: SignupFormParams,
      secretAnswer?: SecretAnswer,
    ): Chainable<Response>;
  }
}
