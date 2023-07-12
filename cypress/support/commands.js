// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add("login", (websiteUrl, username, password) => {
  cy.visit(websiteUrl, { timeout: 15000 });
  //Enter UserNmae and Password
  cy.get('input[name="email"]').type(username).should("have.value", username);
  cy.get('input[name="password"]').type(password).should("have.value", password);
  cy.get("button[type='submit'] span[class='MuiButton-label']").click();
  //check valid destination URL
  cy.url().should("include", "/dashboard");
  cy.wait(2000);
});

Cypress.Commands.add("logout", () => {
  //log Out
  cy.get(".MuiAvatar-root").click();
  cy.contains("Sign out of Lab").click();
  // cy.get("span[class='MuiButton-label']").eq(1).click();
});
