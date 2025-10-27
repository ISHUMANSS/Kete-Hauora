const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",//change to https://ketehauora.netlify.app when testing production build
    setupNodeEvents(on, config) {
      return config;
    }
  }
});
