const { log } = require("cypress/lib/logger");
import { faker, tr } from "@faker-js/faker";
// import { should } from "chai";
let linkTextArray = [];
let demoTaskArray = [];
let demoTaskArraycheck = [];
let testArray = [];
describe("Home page Test Scenario", () => {
  beforeEach(function () {
    cy.fixture("userDetails.json").then((user) => {
      this.user = user;
    });
  });
  it("Home page visit", function () {
    //login
    cy.login(Cypress.env("TEST_URL"), this.user.username, this.user.password);
    //avatar check
    cy.get(".MuiAvatar-root").should("exist").should("be.visible");

    //all link check
    cy.get("div div ul[class='MuiList-root MuiList-padding']")
      .eq(0)
      .find("a")
      .each(($el, index, $list) => {
        let linkText = $el.text();
        linkTextArray.push(linkText);
      })
      .then(() => {
        cy.log(JSON.stringify(linkTextArray));
        expect(linkTextArray).to.deep.equal(this.user.linksAsArray);
        cy.wrap(linkTextArray);
        cy.wrap(linkTextArray).should("include", "Dashboard");
        cy.wrap(linkTextArray).should("include", "Tests");
        cy.wrap(linkTextArray).should("include", "Inventory");
        cy.wrap(linkTextArray).should("include", "Patients");
        cy.wrap(linkTextArray).should("include", "Labs");
        cy.wrap(linkTextArray).should("include", "Doctors");
        cy.wrap(linkTextArray).should("include", "Accounting");
      });

    //dashboard title check
    cy.get("div[class='title']").should("exist").should("be.visible").should("have.text", "Dashboard");

    //check subtile
    cy.get("p").eq(0).should("exist").should("be.visible").should("have.text", "dashboard");

    //to list tittle
    cy.contains("Remaining work").should("exist").should("be.visible").should("have.text", "Remaining work");

    cy.contains("mark as done").should("exist").should("be.visible").should("have.text", "mark as done");

    cy.contains("TODO").should("exist").should("be.visible").should("have.text", "TODO");
    //check add BTN

    cy.get(".MuiButton-label").should("exist").should("be.visible").should("have.text", "Add");
    //check + img
    cy.get("img[alt$='add']").should("exist").should("be.visible").should("have.attr", "src", "/static/media/add.74e26774.svg");

    //check test calculator tittle
    cy.contains("Test Cost Calculator").should("exist").should("be.visible").should("have.text", "Test Cost Calculator");

    //check tests
    cy.get("#patient-test").should("exist").should("be.visible");
    //check place holder
    cy.get("fieldset[aria-hidden='true']").should("exist").should("be.visible").should("have.text", "Add tests for patientDiscount");

    cy.get('label[data-shrink="true"]').should("exist").should("be.visible").should("have.text", "Discount");
    cy.get("div[aria-haspopup='listbox']").should("exist").should("be.visible").should("have.text", "None");
    cy.get("p").eq(1).should("exist").should("be.visible").should("have.text", "Discount for customer");

    cy.contains("Subtotal").should("exist").should("be.visible").should("have.text", "Subtotal");
    cy.contains("Total").should("exist").should("be.visible").should("have.text", "Total");

    // logout
    cy.logout();
  });

  it("Add to functionality and check it is added or not", function () {
    //login
    cy.login(Cypress.env("TEST_URL"), this.user.username, this.user.password);

    cy.wait(3000);
    cy.get(".MuiButton-label").click({ timeout: 5000 });
    let randomTask = faker.lorem.words();
    cy.log(randomTask);
    cy.get("#outlined-add-todo-input").type(randomTask, { force: true, timeout: 2000 });
    cy.get(".MuiButton-label").click({ force: true, timeout: 1000 });
    cy.get(".MuiAlert-message").should("be.visible").should("have.text", "Todo added successfully!");

    //check added item in list
    cy.get('[href="/dashboard"] > .MuiButtonBase-root').click();
    cy.wait(5000);
    cy.reload();
    cy.get("ul[aria-label='completed todo']")
      .find("div[role='button']")
      .each(($el, index, $list) => {
        let demoTask = $el.text();
        cy.log(demoTask);
        demoTaskArray.push(demoTask, { timeout: 1000 });
      })
      .then(() => {
        cy.log(JSON.stringify(demoTaskArray));
        cy.wrap(demoTaskArray).should("include", randomTask, { timeout: 15000 });
        cy.wait(3000);
      });

    cy.get("ul[aria-label='completed todo']")
      .find(".MuiListItem-container")
      .each(($el, index, $list) => {
        let demoTask = $el.text();
        cy.log(demoTask);
        cy.log($el);
        if (demoTask == randomTask) {
          cy.wait(2000);
          cy.wrap($el).find('input[type="checkbox"]').check({ force: true });
          cy.wait(2000);
        } else {
          cy.log("error-------------------------------->");
        }
      })
      .then(() => {
        //check after mark as done task is completed or not from list
        cy.get(".MuiAlert-message").should("be.visible").should("have.text", "Todo completed successfully.");
        cy.get("ul[aria-label='completed todo']")
          .find("div[role='button']")
          .each(($el, index, $list) => {
            let demoTask = $el.text();
            cy.log(demoTask);
            demoTaskArraycheck.push(demoTask, { timeout: 1000 });
          })
          .then(() => {
            cy.log(JSON.stringify(demoTaskArray));
            cy.wrap(demoTaskArray).should("not.include.any.keys", randomTask, { timeout: 15000 });
            cy.wait(2000);
          });
      });

    // logout
    cy.logout();
  });
});
