/// <reference types="Cypress" />

describe("backend", () => {
  it("should get valid /app response", () => {
    cy.request({
      method: "GET",
      url: "http://localhost:3052/api/v3/app",
      headers: {
        Authorization: "Bearer abc",
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.allowed).to.eq(true);
      expect(response.body.icon).to.be.a("string");
      expect(response.body.icon).to.eq(
        "http://192.168.2.47:3052/avatars/hannes_n.png"
      );
      expect(response.body).to.deep.eq({
        allowed: true,
        icon: "http://192.168.2.47:3052/avatars/hannes_n.png",
      });
    });
  });
});
