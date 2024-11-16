/// <reference types="cypress" />

describe("Board view", () => {
  it("test the ticket creation process", () => {
    const now = Date.now();
    cy.log(`Starting test at ${now}`);
    localStorage.setItem("token", "abc");
    cy.visit("http://localhost:3051");

    cy.get("div.text-6xl").should("contain", "Welcome");
    // check navigation
    cy.get("nav").find("[data-cy=nav-link-board-view]").click();
    cy.get('[data-cy="title"]').should("contain", "Board View");

    // create ticket by pressing c
    cy.get("body").type("c");
    cy.get('[data-cy="input-ticket-title"]').type(`Test Ticket ${now}`);
    cy.get('[data-cy="input-ticket-description"]').type("Test Description");

    // set status to in progress
    cy.get('[data-cy="status-dropdown"]').click();
    cy.get('[data-cy="status-inProgress"]').click();

    // set assignee to Hannes
    cy.get('[data-cy="assignee-dropdown"]').click();
    cy.get('[data-cy="assignee-1"]').click();

    // set type to unity
    cy.get('[data-cy="type-dropdown"]').click();
    cy.get('[data-cy="type-unity"]').click();

    // submit
    cy.get('[data-cy="dialog-submit-button"]').click();

    // go to all tickets view
    cy.get('[data-cy="nav-link-all-tickets"]').click();

    // select the last ticket and go to the ticket detail view
    cy.get('[data-cy="tickets-list"]').find("div").last().click();

    // check if the ticket is in progress
    cy.get('[data-cy="statusDropdown"]').should("contain", "inProgress");

    // check if the assignee is Hannes
    cy.get('[data-cy="assigneeDropdown"]').should("contain", "Hannes");

    // check if the type is unity
    cy.get('[data-cy="typeDropdown"]').should("contain", "unity");
    cy.screenshot(`ticket-creation-${now}`);
  });
});
