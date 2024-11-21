/// <reference types="Cypress" />

describe("Passwords", () => {
  beforeEach(() => {
    localStorage.setItem("token", "abc");
  });

  it("test creating an entry", () => {
    cy.visit("/passwords/1/entries");

    const now = Date.now();
    const title = `Test Entry ${now}`;
    const password = `password`;
    // check that the entry does not exist
    cy.contains(title).should("not.exist");

    cy.getById("title").should("contain", "Private");
    cy.getById("title-view-create-button").click();
    cy.getById("password-entries-dialog-title").type(title);
    cy.getById("password-entries-dialog-password").type(password);
    cy.getById("dialog-submit-button").click();

    cy.getToast().should("contain", "Entry created");

    cy.contains(title).should("exist");
    cy.contains(title).click();
    cy.getById("password-entries-dialog-title").should("have.value", title);
    cy.getById("password-entries-dialog-password").should("have.value", "");
    cy.getById("password-entries-dialog-show-password").click();
    cy.getById("password-entries-dialog-password").should(
      "have.value",
      password
    );
  });
});
