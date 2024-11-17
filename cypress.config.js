import { defineConfig } from "cypress";

export default defineConfig({
  screenshotOnRunFailure: true,
  video: true,
  defaultCommandTimeout: 1000,
  e2e: {
    baseUrl: "http://localhost:3051",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
