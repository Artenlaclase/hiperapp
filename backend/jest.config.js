const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  rootDir: __dirname,
  roots: ["<rootDir>/src", "<rootDir>/test"],
  moduleFileExtensions: ["js", "json", "ts"],
  testMatch: ["**/?(*.)+(spec|test).ts?(x)", "**/?(*.)+(e2e-spec).ts?(x)"],
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
};