/* eslint-env node */
module.exports = {
  globals: {
    browser: {
      experiments: {},
      identity: {},
    },
  },
  setupFiles: ["<rootDir>/tests/conftests.js"],
  transform: {
    "^.+\\.js$": "babel-jest",
    "^.+\\.tsx?": "ts-jest",
  },
  moduleNameMapper: {
    "^devtools/(.*)$": "<rootDir>/extension/content/$1",
    "\\.(less|css)$": "identity-obj-proxy",
  },
  collectCoverage: true,
  collectCoverageFrom: ["<rootDir>/extension/content/**/*.{js,ts}"],
};
