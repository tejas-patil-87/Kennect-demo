const { log } = require("cypress/lib/logger");
let discountArray = [];
let subtotal = 0;
describe("Cost Calculator for Blood Test Scenario", () => {
  beforeEach(function () {
    cy.fixture("userDetails.json").then((user) => {
      this.user = user;
    });
  });
  it("Check cost Calculator for Blood Test", function () {
    //login
    cy.login(Cypress.env("TEST_URL"), this.user.username, this.user.password);

    // Click on the element to trigger the list pop-up
    cy.get("#patient-test").click();

    //check element list should be visible
    cy.get('[aria-controls="patient-test-popup"]').should("be.visible");

    // click list
    cy.get("#patient-test-popup").then(($listPopUp) => {
      const listItems = $listPopUp.find("li");

      cy.get(listItems.eq(1)).click({ timeout: 2000, force: true, waitForAnimations: false, animationDistanceThreshold: 20 });
    });
    cy.wait(2000);
    cy.get("#patient-test").click({ timeout: 2000 });
    cy.get("li#patient-test-option-2.MuiAutocomplete-option").click({
      timeout: 2000,
      force: true,
      waitForAnimations: false,
      animationDistanceThreshold: 20,
    });

    cy.get("#patient-test").click({ timeout: 2000 });
    cy.get("li#patient-test-option-3.MuiAutocomplete-option").click({
      timeout: 2000,
      force: true,
      waitForAnimations: false,
      animationDistanceThreshold: 20,
    });

    cy.get(".MuiFormControl-root.MuiTextField-root.MuiFormControl-fullWidth")
      .find('div[role="button"]')
      .each(($el, index, $list) => {
        //let testText = $el.text();
        // let price = parseInt(testText.replace(/\D/g, ""));
        // cy.log(price);
        // subtotal += price;

        let testText = $el.text();

        const values = testText.split(" ");
        let finalValue = values[values.length - 1];
        let price = finalValue.slice(0, -1);
        let priceInt = parseInt(price);
        cy.log(priceInt);
        subtotal += priceInt;
      })
      .then(() => {
        cy.log("Subtotal is " + subtotal);
      });

    //apply discount
    cy.get('div[aria-haspopup="listbox"]').click();

    //check all available discounts
    cy.get("ul[role='listbox']")
      .find("li")
      .each(($el, index, $list) => {
        let discount = $el.text();
        discountArray.push(discount);
      })
      .then(() => {
        const discountValue = (subtotal * 20) / 100;
        cy.log("Total is " + (subtotal - discountValue));
        expect(discountArray).to.deep.equal(this.user.allDiscount);
      });
    cy.get("ul[role='listbox']").find("li").eq(4).click();
    // logout
    cy.logout();
  });
});
