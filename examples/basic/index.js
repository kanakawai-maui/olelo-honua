const { OleloHonua, DeepSeekProvider } = require("olelo-honua");

// Load .env file from ./.env (root)
require("dotenv").config();

// Open Router API Key from .env
const OPEN_ROUTER_API_KEY = process.env.OPEN_ROUTER_API_KEY;

// Create a new instance
const dakine = new OleloHonua(
  {
    primeLanguage: "en", // Default language
    includeLanguage: ["ar", "haw", "ja", "ru", "tl"], // Additional languages
    bulkTranslate: true, // Enable bulk translation
    critique: true, // Enable critique
    saveCritique: true, // Enable saving of latest critique(s)
    repair: true, // Enable repair
    debug: true, // Enable debug
  },
  new DeepSeekProvider(OPEN_ROUTER_API_KEY),
);
// Runs or re-runs i18n translations
dakine.hanaHou();
