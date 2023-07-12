// const { log } = require("cypress/lib/logger");

describe("Login Test Scenario", () => {
  beforeEach(function () {
    cy.visit(Cypress.env("TEST_URL"), { timeout: 3000 });
    cy.fixture("userDetails.json").then((user) => {
      this.user = user;
    });
  });
  it("should display the login page and elements", () => {
    //login Page title
    cy.contains("GOR").should("exist").should("have.text", "GOR");
    cy.contains("Pathology & Diagnostic").should("exist").should("have.text", "Pathology & Diagnostic");
    // Check if the login page is displayed
    cy.get('input[name="email"]').should("exist");
    cy.get('input[name="password"]').should("exist");
    cy.get("button[type='submit'] span[class='MuiButton-label']").should("exist").should("have.text", "Login");
    cy.get("u").should("exist").should("exist").should("have.text", "Recover or set password");
    // cy.contains("OR").should("exist").should("have.text", "OR");
    cy.get("button[type$='submit']").eq(1).should("exist").should("have.text", "Login in with Google");
  });
  it("should log in successfully with valid credentials", function () {
    //Enter UserName and Password
    cy.get('input[name="email"]').type(this.user.username).should("have.value", this.user.username);
    cy.get('input[name="password"]').type(this.user.password).should("have.value", this.user.password);
    cy.get("button[type='submit'] span[class='MuiButton-label']").click();
    //check valid destination URL
    cy.url().should("include", "/dashboard");
    //log Out
    cy.get(".MuiAvatar-root").click();
    cy.contains("Sign out of Lab").click();
    cy.wait(2000);
  });

  it("should display an error message with invalid credentials", function () {
    // validate type should be email for username
    cy.get("input[name='email']").should("have.attr", "type", "email");
    cy.get('input[name="email"]').type(this.user.invalidUsername).should("have.value", this.user.invalidUsername);
    //check input is valid as per the browser's email validation:
    cy.get("input[name='email']").should("have.prop", "validity").its("valid").should("be.true");

    // validate aria-invalid should be true for password
    cy.get('input[name="password"]').should("have.attr", "type", "password");
    cy.get('input[name="password"]').type(this.user.invalidPassword).should("have.value", this.user.invalidPassword);

    // Submit the login form
    cy.get('button[type="submit"]').eq(0).click();

    // Assert that an error message is displayed
    cy.get(".MuiAlert-message")
      .should("exist")
      .should("be.visible")
      .should("have.text", "There is no user record corresponding to this identifier. The user may have been deleted.");
  });
  it("Should get valid acknowledgment message for recover or set password functionality with valid email ID", function () {
    cy.get("u").should("be.visible").should("not.be.disabled").click({ force: true, timeout: 2000 });
    cy.get("#email1").type(this.user.username).should("exist");
    cy.get(".MuiButton-contained").click();
    cy.get(".MuiAlert-message").then(($errorElement) => {
      const errorText = $errorElement.text();

      if (errorText.includes("Recovery link sent!")) {
        cy.get(".MuiAlert-message").should("have.text", "Recovery link sent!");
        cy.log("");
      } else if (errorText.includes("Error 2")) {
        // Handle Error 2
        // Perform assertions or actions specific to Error 2
        cy.log("Email recover or set password done successfully");
      } else {
        cy.get(".MuiAlert-message").should("have.text", "We have blocked all requests from this device due to unusual activity. Try again later.");
        cy.log("Email request limit exceeded");
      }
    });
  });
  it("Recover or set password functionality with invalid email ID", function () {
    cy.get("u").should("be.visible").should("not.be.disabled").click({ force: true, timeout: 2000 });
    cy.get("#email1").type(this.user.invalidUsername).should("exist");
    cy.get(".MuiButton-contained").click();
    cy.get(".MuiAlert-message").should("have.text", "There is no user record corresponding to this identifier. The user may have been deleted.");
    cy.get("#email1").clear();
  });
});
