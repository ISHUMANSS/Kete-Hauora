describe("Register Page", () => {
  it("renders registration form correctly", () => {
    cy.visit("/register");
    cy.contains("Register").should("be.visible");
    cy.get('input[placeholder="Email"]').should("exist");
    cy.get('input[placeholder="Password"]').should("exist");
  });

  it("allows user to successfully create an account", () => {
    cy.visit("/register");
    
    // Use a unique email each run to avoid duplicates
    const uniqueEmail = `testuser_${Date.now()}@example.com`;

    cy.get('input[placeholder="Email"]').type(uniqueEmail);
    cy.get('input[placeholder="Password"]').type("ValidPassword123!");
    cy.contains("Register").click();
  });
});
