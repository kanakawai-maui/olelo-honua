#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { OleloHonua } = require("./dist/index.js");
const { Command } = require("commander");
const packageJson = require("./package.json");

const program = new Command();

program
  .name("olelo-honua")
  .description("CLI for OleloHonua")
  .version(packageJson.version);

program
  .command("init")
  .description("Initializes locale files for the specified languages")
  .option("-c, --config <path>", "Path to the configuration file", false)
  .option("-d, --debug", "Enable debug mode", false)
  .action(async (options) => {
    try {
      const configPath =
        options.config || path.resolve(process.cwd(), "local.config.json");
      if (!fs.existsSync(configPath)) {
        console.error(`Configuration file not found: ${configPath}`);
        process.exit(1);
      }

      const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
      if (options.debug) {
        config.debug = true;
      }
      config.clearCache = true;

      const oleloHonua = new OleloHonua(config);
      await oleloHonua.createLocaleFiles();
      console.log("Locale files initialized successfully.");
    } catch (error) {
      console.error("Error:", error.message);
      process.exit(1);
    }
  });

program
  .command("sync")
  .description("Syncs locale files for the specified languages")
  .option("-c, --config <path>", "Path to the configuration file", false)
  .option("-d, --debug", "Enable debug mode", false)
  .action(async (options) => {
    try {
      const configPath =
        options.config || path.resolve(process.cwd(), "local.config.json");
      if (!fs.existsSync(configPath)) {
        console.error(`Configuration file not found: ${configPath}`);
        process.exit(1);
      }

      const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
      if (options.debug) {
        config.debug = true;
      }
      config.clearCache = false;

      const oleloHonua = new OleloHonua(config);
      await oleloHonua.createLocaleFiles();
      console.log("Locale files synced successfully.");
    } catch (error) {
      console.error("Error:", error.message);
      process.exit(1);
    }
  });

program.parse(process.argv);
