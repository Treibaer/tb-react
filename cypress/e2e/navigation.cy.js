/// <reference types="Cypress" />

describe("Navigation", () => {
  it("should show the navigation based on the module", () => {
    localStorage.setItem("token", "abc");
    cy.visit("/");

    cy.get("div.text-6xl").should("contain", "Welcome");
    // check navigation
    cy.get("nav").find("[data-cy=nav-link-dashboard]");
    cy.get("nav").find("[data-cy=nav-link-projects]");
    cy.get("nav").find("[data-cy=nav-link-board-view]");
    cy.get("nav").find("[data-cy=nav-link-assets]");
    cy.get("nav").find("[data-cy=nav-link-finances]");
    cy.get("nav").find("[data-cy=nav-link-passwords]");

    cy.get("[data-cy=nav-link-pages]").should("not.exist");
    cy.get("[data-cy=nav-link-boards]").should("not.exist");
    cy.get("[data-cy=nav-link-all-tickets]").should("not.exist");

    cy.get("[data-cy=nav-link-board-view]").click();
    cy.get("[data-cy=nav-link-pages]").should("exist");
    cy.get("[data-cy=nav-link-boards]").should("exist");
    cy.get("[data-cy=nav-link-all-tickets]").should("exist");

    // test finance module
    cy.get("[data-cy=nav-link-details]").should("not.exist");
    cy.get("[data-cy=nav-link-summary]").should("not.exist");
    cy.get("[data-cy=nav-link-finances]").click();
    cy.get("[data-cy=nav-link-details]").should("exist");
    cy.get("[data-cy=nav-link-summary]").should("exist");
  });
});
