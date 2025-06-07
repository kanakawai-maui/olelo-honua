const { OleloHonua } = require("olelo-honua");

// Load .env file from ./.env (root)
require("dotenv").config();

// Create a new instance
const dakine = new OleloHonua({
  provider: {
    platform: OleloHonua.Providers.OpenRouter,
    credentials: {
      apiKey: process.env.OPEN_ROUTER_API_KEY, // Open Router API Key from .env
    },
    modelId: OleloHonua.OpenRouterModels.DEEPSEEK.DEEPSEEK_V3_FREE, // Model ID
  },
  primeLanguage: "en", // Default language
  excludeLanguage: ["haw"], // Additional languages
  debug: true, // Enable debug
});
// Runs or re-runs i18n translations
dakine.hanaHou();
