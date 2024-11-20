/// <reference types="Cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to get an element by its data-cy attribute.
     * @param id - The value of the data-cy attribute to search for.
     * @returns Cypress chainable element.
     */
    getById(id: string): Chainable<JQuery<HTMLElement>>;

    /**
     * Custom command to get the newest toast message.
     * @returns Cypress chainable element.
     */
    getToast(): Chainable<JQuery<HTMLElement>>;

    /**
     * Custom command to login.
     */
    login(): void;
  }
}

Cypress.Commands.add("getById", (id: string) => {
  return cy.get(`[data-cy="${id}"]`);
});

// create a new commant, that gets the newest toast message
Cypress.Commands.add("getToast", () => {
  return cy.getById("toaster-wrapper").last().last();
});

Cypress.Commands.add("login", () => {
  cy.visit("/");
  cy.get("h1").should("contain", "Login");
  cy.getById("login-input-email").type("test@treibaer.de");
  cy.getById("login-input-password").type("9n8DEWNU()0");
  cy.get("button").click();

  cy.window().its("localStorage.token").should("exist");
});
