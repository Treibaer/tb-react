/// <reference types="Cypress" />

describe("Board view", () => {
  beforeEach(() => {
    cy.fixture("ticket-details.json").as("ticketDetails");
    cy.visit("/");
  });

  it("test the ticket creation process", () => {
    cy.get("@ticketDetails").then((ticketDetails) => {
      const { title, description, status, assignee, assigneeId, type } =
        ticketDetails;
      const now = Date.now();
      cy.log(`Starting test at ${now}`);
      localStorage.setItem("token", "abc");

      cy.get("div.text-6xl").should("contain", "Welcome");
      // check navigation
      cy.get("nav").find("[data-cy=nav-link-board-view]").click();
      cy.get('[data-cy="title"]').should("contain", "Board View");

      // create ticket by pressing c
      cy.get("body").type("c");
      cy.getById("input-ticket-title").type(`${title} ${now}`);
      cy.getById("input-ticket-description").type(description);

      // set status to in progress
      cy.getById("status-dropdown").click();
      cy.getById(`status-${status}`).click();

      // set assignee to Hannes
      cy.getById("assignee-dropdown").click();
      cy.getById(`assignee-${assigneeId}`).click();

      // set type to unity
      cy.getById("type-dropdown").click();
      cy.getById(`type-${type}`).click();

      cy.screenshot(`ticket-creation-dialog-${now}`);

      // submit
      cy.getById("dialog-submit-button").click();

      // go to all tickets view
      cy.getById("nav-link-all-tickets").click();

      // select the last ticket and go to the ticket detail view
      cy.getById("tickets-list").find("a").last().click();

      // check if the ticket is in progress
      cy.getById("statusDropdown").should("contain", status);

      // check if the assignee is Hannes
      cy.getById("assigneeDropdown").should("contain", assignee);

      // check if the type is unity
      cy.getById("typeDropdown").should("contain", type);

      cy.getToast().should("contain", "Ticket");
      cy.getToast().should("contain", "Created");

      // get the ticket id from the toast ('Ticket HK-232 Created')
      cy.getToast().then((toast) => {
        const parts = toast.text().split(" ");
        expect(parts[0]).to.equal("Ticket");
        expect(parts[2]).to.equal("Created");

        const ticketId = parts[1];
        cy.log(`Ticket id: ${ticketId}`);
      });

      cy.screenshot(`ticket-detail-view-${now}`);
    });
  });
});
