const OleloHonua = require("../../dist").OleloHonua;
const { ToyProvider } = require("../../dist/providers/toy");

// Create a new instance
const dakine = new OleloHonua({
        primeLanguage: "en", // Default language
        includeLanguage: ["haw", "de"] // Additional languages
    }, 
    new ToyProvider()
);
// Runs or re-runs i18n translations
dakine.hanaHou();
