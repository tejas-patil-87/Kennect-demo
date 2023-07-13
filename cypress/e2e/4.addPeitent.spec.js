const { log } = require("cypress/lib/logger");
import { faker, tr } from "@faker-js/faker";
let demoTaskArray = [];

describe("Add Patients", () => {
  beforeEach(function () {
    cy.fixture("userDetails.json").then((user) => {
      this.user = user;
    });
  });
  it("Check add patient and add test check reflecting on dashboard", function () {
    //login
    cy.login(Cypress.env("TEST_URL"), this.user.username, this.user.password);

    cy.get("a[href='/patients']").click();
    cy.url().should("include", "/patients");

    cy.contains("Add Patient").click();
    cy.url().should("include", "/add");

    // Add Patient Name
    const name = faker.name.firstName();
    const lastName = faker.name.lastName();
    const email = faker.internet.email();
    const mobileNumber = faker.phone.number("9001######");
    cy.wait(1000);
    cy.get("input[name='name']").type(`${name} ${lastName}`);
    cy.get("input[name='email']").clear();
    cy.get("input[name='email']").type(email);
    cy.get("input[name='phone']").clear();
    cy.get("input[name='phone']").type(mobileNumber);

    cy.get("button[type='button']").contains("General Details").click();

    cy.wait(1000);
    cy.get("input[name='height']").clear();
    cy.get("input[name='height']").type(this.user.height);
    cy.get("input[name='weight']").clear();
    cy.get("input[name='weight']").type(this.user.weight);

    cy.get("#mui-component-select-gender").click();
    cy.get("ul").find("li").eq(1).click();

    cy.get("input[name='age']").clear();
    cy.get("input[name='age']").type(this.user.age);
    cy.get("input[name='systolic']").clear();
    cy.get("input[name='systolic']").type(this.user.systolic);
    cy.get("input[name='diastolic']").clear();
    cy.get("input[name='diastolic']").type(this.user.diastolic);
    cy.get("button[type='button']").contains("Add Tests").click();

    //add test
    cy.get("#patient-test").click({ force: true, timeout: 2000 });
    cy.get("li#patient-test-option-1.MuiAutocomplete-option").click({
      timeout: 2000,
      force: true,
      waitForAnimations: false,
      animationDistanceThreshold: 20,
    });
    cy.get("#patient-test").click({ force: true, timeout: 2000 });
    cy.get("li#patient-test-option-2.MuiAutocomplete-option").click({
      timeout: 2000,
      force: true,
      waitForAnimations: false,
      animationDistanceThreshold: 20,
    });
    cy.get("#patient-test").click({ force: true, timeout: 2000 });
    cy.get("li#patient-test-option-3.MuiAutocomplete-option").click({
      timeout: 2000,
      force: true,
      waitForAnimations: false,
      animationDistanceThreshold: 20,
    });

    //add discount
    cy.get('div[aria-haspopup="listbox"]').eq(0).click({ force: true, scrollBehavior: "top" });
    cy.get("ul[role='listbox']").find("li").eq(4).click();

    //add lab
    cy.get("#patient-tests-labs").click({ force: true, timeout: 2000 });
    cy.get("#patient-tests-labs-popup").then(($listPopUp) => {
      const listItems = $listPopUp.find("li");
      cy.wait(2000);
      cy.get(listItems.eq(1)).click({ timeout: 4000, force: true, waitForAnimations: false, animationDistanceThreshold: 20 });
      cy.wait(2000);
    });

    // lab recommendations
    // cy.get('input[name="doctor_name"]').click({ force: true, timeout: 2000 });
    // cy.get('input[aria-controls="patient-tests-labs-popup]').then(($listPopUp) => {
    //   const listItems = $listPopUp.find("li");
    //   cy.wait(2000);
    //   cy.get(listItems.eq(3)).click({ timeout: 4000, force: true, waitForAnimations: false, animationDistanceThreshold: 20 });
    //   cy.wait(2000);
    // });

    //commission
    // cy.get("#mui-component-select-doctor_commission").click({ force: true });
    // cy.get('[data-value="10"]').eq(1).click({ force: true });

    cy.get(".MuiIconButton-label > .material-icons").click({ force: true, timeout: 3000 });
    cy.wait(2000);
    cy.get("button[title='Save']").click({ force: true, timeout: 2000 });

    cy.get("button[tabindex='0']").eq(6).click({ force: true, timeout: 2000 });

    cy.wait(5000);

    cy.get(".MuiAlert-message").should("have.text", "Patient added successfully.", { timeout: 10000 });

    //check test listed in to do task
    cy.get('[href="/dashboard"] > .MuiButtonBase-root').click({
      timeout: 4000,
      force: true,
      waitForAnimations: false,
      animationDistanceThreshold: 20,
    });
    cy.url().should("include", "/dashboard");
    cy.wait(3000);
    cy.get("ul[aria-label='completed todo']")
      .find("div[role='button']")
      .each(($el, index, $list) => {
        let demoTask = $el.text();

        const values = demoTask.split(" ");
        let finalName = values[values.length - 2] + " " + values[values.length - 1];
        cy.log(finalName);
        demoTaskArray.push(finalName, { timeout: 1000 });
      })
      .then(() => {
        cy.log(JSON.stringify(demoTaskArray));
        cy.wrap(demoTaskArray).should("include", `${name} ${lastName}`, { timeout: 15000 });
        demoTaskArray.includes(`${name} ${lastName}`);
        cy.wait(1000);
      });

    // logout
    cy.logout();
  });
});
