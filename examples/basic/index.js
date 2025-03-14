const { OleloHonua, ToyProvider } = require("olelo-honua");

// Create a new instance
const dakine = new OleloHonua(
  {
    primeLanguage: "en", // Default language
    includeLanguage: ["es", "de"], // Additional languages
    useBulkProvider: false
  },
  new ToyProvider(),
);
// Runs or re-runs i18n translations
dakine.hanaHou();
