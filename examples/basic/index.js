const { OleloHonua, OpenRouterProvider } = require("olelo-honua");

// Load .env file from ./.env (root)
require("dotenv").config();

// Open Router API Key from .env
const OPEN_ROUTER_API_KEY = process.env.OPEN_ROUTER_API_KEY;
const OPEN_ROUTER_MODEL_ID = process.env.OPEN_ROUTER_MODEL_ID;

// Create a new instance
const dakine = new OleloHonua(
  {
    primeLanguage: "en", // Default language
    includeLanguage: ["haw", "es", "de", "ja", "ar"], // Additional languages
    useBulkProvider: true,
  },
  new OpenRouterProvider(OPEN_ROUTER_API_KEY, OPEN_ROUTER_MODEL_ID),
);
// Runs or re-runs i18n translations
dakine.hanaHou();
