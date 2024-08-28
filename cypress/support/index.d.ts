/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject> {
    /**
     * Logs into Docunder via the graphical user interface (GUI).
     *
     * @param username string - The email of the user you want to log in with
     * @param password string - The password of the user you want to log in with
     *
     * @example cy.gui_login() // Logs into the app using the default email and password (defined as envs)
     * @example cy.gui_Login('user@email.com', 'myPassword') // Logs into the app using the provided credentials
     */
    gui_login(
      username?: string,
      password?: string,
    ): void | Cypress.Chainable<null>;

    /**
     * Fills in the signup form and submits it with the provided credentials.
     *
     * After that, enters a six digits code sent to the email used in the previous
     * step, and submits the second form.
     *
     * Finally, waits for the `@getStories` request to ensure the signup succeeded.
     *
     * @param email string - The email of a still not signed up user
     * @param password string - The password for the user being signed up
     *
     * @example cy.fillSignupFormAndSubmit('some-user@example.com', 'sEcR37-p@s5w0rD')
     */
    gui_fillSignupFormAndSubmit(
      username?: string,
      password?: string,
    ): void | Cypress.Chainable<null>;
  }
}
