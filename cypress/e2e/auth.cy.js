describe("template spec", () => {
  it("should fail the login", () => {
    cy.visit("http://localhost:3051");

    // login page
    cy.get("h1").should("contain", "Login");

    // find input with type text
    cy.get("input[type='text']").type("Hannes");
    cy.get("input[type='password']").type("9n8DEWNU()0");
    cy.get("button").click();

    // should still show login page
    cy.get("h1").should("contain", "Login");
  });

  it("should register a user", () => {
    cy.visit("http://localhost:3051/register");

    cy.get("div").should("contain", "Register");

    // find input with type text
    cy.get("input[type='text']").type("Hannes");
    cy.get("input[type='email']").type("hannes@treibaer.de");
    cy.get("input[type='password']").eq(0).type("9n8DEWNU()0");
    cy.get("input[type='password']").eq(1).type("9n8DEWNU()0");
    cy.get("button").click();

    // should still show login page
    cy.get("div").should("contain", "Register");
  });

  it("should show the navigation based on the module", () => {
    localStorage.setItem("token", "abc");
    cy.visit("http://localhost:3051");

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
