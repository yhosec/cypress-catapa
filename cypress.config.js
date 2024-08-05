const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      return require("./node_modules/cypress-fs/plugins/index.js")(on, config);
    },
  },
});
