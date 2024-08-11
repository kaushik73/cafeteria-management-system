import { Config } from "@jest/types";
const config: Config.InitialOptions = {
  automock: true,
  collectCoverage: false,
  collectCoverageFrom: ["src/**/*.{ts,tsx}"],
  coverageProvider: "babel",
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true,
};

export default config;
