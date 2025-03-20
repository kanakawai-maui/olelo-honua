const { OleloHonua, DeepSeekProvider } = require("olelo-honua");

// Load .env file from ./.env (root)
require("dotenv").config();

// Open Router API Key from .env
const OPEN_ROUTER_API_KEY = process.env.OPEN_ROUTER_API_KEY;
const OPEN_ROUTER_MODEL_ID = process.env.OPEN_ROUTER_MODEL_ID;

// Create a new instance
const dakine = new OleloHonua(
  {
    primeLanguage: "en", // Default language
    includeLanguage: [
        "ar","haw","ja","ru","tl"
    ], // Additional languages
    bulkTranslate: true, // Enable bulk translation
    critique: true, // Enable critique
    repair: true, // Enable repair
    debug: true, // Enable debug
  },
  new DeepSeekProvider(OPEN_ROUTER_API_KEY, OPEN_ROUTER_MODEL_ID),
);
// Runs or re-runs i18n translations
dakine.hanaHou();
