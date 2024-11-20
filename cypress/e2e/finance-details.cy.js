/// <reference types="Cypress" />

describe("Finance Details", () => {
  beforeEach(() => {
    localStorage.setItem("token", "abc");
  });

  it("test creating an entry", () => {
    cy.intercept("GET", "/api/v3/finances/entries", {
      fixture: "finances.json",
    });
    cy.intercept("POST", "/api/v3/finances/entries", { status: "ok" });

    cy.visit("/finances/details");
    cy.getById("title").should("contain", "Finances");
    cy.getById("title-view-create-button").click();
    cy.getById("finance-detail-dialog-title").type("Test Entry");
    cy.getById("finance-detail-dialog-value").type("1000");
    cy.getById("finance-detail-dialog-tag").select("30");
    cy.getById("dialog-submit-button").click();
  });
});
