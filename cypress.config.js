const { defineConfig } = require("cypress");

const fs = require('fs');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('task', {
        readDir(path) {
          return fs.readdirSync(path); // return array of filenames
        },
        copyFile({ path, newPath }) {
          fs.copyFileSync(path, newPath);
          return null; // Cypress butuh return
        },
        deleteFile(path) {
          if (fs.existsSync(path)) {
            fs.unlinkSync(path);
          }
          return null;
        },
      });
    },
  },
});
