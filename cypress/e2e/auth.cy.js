/// <reference types="Cypress" />

describe("auth", () => {
  it("should fail the login", () => {
    cy.visit("/");
    cy.get("h1").should("contain", "Login");

    cy.getById("login-input-email").type("Hannes");
    cy.getById("login-input-password").type("9n8DEWNU()0");
    cy.get("button").click();

    // should still show login page
    cy.get("h1").should("contain", "Login");
  });

  it("should login", () => {
    cy.login();
  });
  
  it("should register a user", () => {
    cy.visit("http://localhost:3051/register");

    cy.get("div").should("contain", "Register");

    cy.get("input[type='text']").type("Hannes");
    cy.get("input[type='email']").type("hannes@treibaer.de");
    cy.get("input[type='password']").eq(0).type("9n8DEWNU()0");
    cy.get("input[type='password']").eq(1).type("9n8DEWNU()0");
    cy.get("button").click();

    // should still show login page (register not implemented yet)
    cy.get("div").should("contain", "Register");
  });
});
