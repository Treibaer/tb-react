/// <reference types="cypress" />

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
  }
}

Cypress.Commands.add("getById", (id: string) => {
  return cy.get(`[data-cy="${id}"]`);
});

// create a new commant, that gets the newest toast message
Cypress.Commands.add("getToast", () => {
  return cy.getById("toaster-wrapper").last().last();
});
