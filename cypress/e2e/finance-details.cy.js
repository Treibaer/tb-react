/// <reference types="Cypress" />

describe("Finance Details", () => {
  beforeEach(() => {
    localStorage.setItem("token", "abc");
  });

  it("test creating an entry", () => {
    // cy.intercept("GET", "/api/v3/finances/entries", {
    //   fixture: "finances.json",
    // });
    // cy.intercept("POST", "/api/v3/finances/entries", { status: "ok" });

    const now = Date.now();
    const title = `Test Entry ${now}`;
    const value = "1000.00";

    cy.visit("/finances/details");
    cy.getById("title").should("contain", "Finances");
    cy.getById("title-view-create-button").click();
    cy.getById("finance-detail-dialog-title").type(title);
    cy.getById("finance-detail-dialog-value").type(value);
    cy.getById("finance-detail-dialog-tag").select("30");
    cy.getById("dialog-submit-button").click();

    cy.getToast().should("contain", "Entry created");

    cy.contains(title).should("exist");
    cy.contains(title).click();
    cy.getById("finance-detail-dialog-title").should("have.value", title);
    cy.getById("finance-detail-dialog-value").should("have.value", value);
    cy.getById("finance-detail-dialog-tag").should("have.value", "30");

    // test updating the entry
    const title2 = `Test Entry 2 ${now}`;
    const value2 = "2000.00";
    cy.getById("finance-detail-dialog-title").clear();
    cy.getById("finance-detail-dialog-title").type(title2);
    cy.getById("finance-detail-dialog-value").clear();
    cy.getById("finance-detail-dialog-value").type(value2);
    cy.getById("finance-detail-dialog-tag").select("31");
    cy.getById("dialog-submit-button").click();
    cy.getToast().should("contain", "Entry updated");

    cy.contains(title2).should("exist");
    cy.contains(title2).click();
    cy.getById("finance-detail-dialog-title").should("have.value", title2);
    cy.getById("finance-detail-dialog-value").should("have.value", value2);
    cy.getById("finance-detail-dialog-tag").should("have.value", "31");
  });
});
