module.exports = {
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    experimentalRunAllSpecs: true,
    env: {
      TEST_URL: "https://gor-pathology.web.app/",
    },
    specPattern: "cypress/e2e/**/*.{js,jsx,ts,tsx}",
  },
};
