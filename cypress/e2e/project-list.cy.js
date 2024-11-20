/// <reference types="Cypress" />

describe("project list", () => {
  it("should show the project list", () => {
    localStorage.setItem("token", "abc");
    cy.visit("http://localhost:3051/projects");

    cy.get("[data-cy=title]").should("contain", "Projects");
    cy.get("[data-cy=title-view]").should("exist");
    cy.get("[data-cy=title-view]").find("button").should("exist");
    cy.get("[data-cy=title-view]").find("button").click();

    cy.get("[name='title']").type("Test Project");
    cy.get("[name='description']").type("Test Description");
    cy.get("[name='slug']").type("TD");
    cy.get("[data-cy='dialog-submit-button'").click();
  });
});
