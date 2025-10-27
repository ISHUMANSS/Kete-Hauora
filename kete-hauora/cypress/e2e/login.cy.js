describe("Login Page", () => {
  it("renders login form correctly", () => {
    cy.visit("/login");
    cy.contains("Login").should("be.visible");
    cy.get('input[placeholder="Email"]').should("exist");
    cy.get('input[placeholder="Password"]').should("exist");
  });

  it("shows error for invalid login", () => {
    cy.visit("/login");
    cy.get('input[placeholder="Email"]').type("wrong@test.com");
    cy.get('input[placeholder="Password"]').type("wrongpassword");
    cy.contains("Login").click();
  });
});
