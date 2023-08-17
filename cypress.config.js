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

  reporter: "mochawesome",
  reporterOptions: {
    reportDir: "cypress/reports/mochawesome",
    overwrite: false,
    html: false,
    json: true,
    charts: true,
  },
  video: false,

  retries: {
    runMode: 2,
    openMode: 1,
  },

  // webview
  viewportWidth: 1366,
  viewportHeight: 768,

  chromeWebSecurity: false,
  defaultCommandTimeout: 6000,
  pageLoadTimeout: 10000,
  // experimentalSessionAndOrigin: true,
};
