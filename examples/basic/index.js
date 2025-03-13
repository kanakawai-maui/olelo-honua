const OleloHonua = require("../../dist").OleloHonua;
const { ToyProvider } = require("../../dist/providers/toy");

console.log(OleloHonua)

// Create a new instance
const dakine = new OleloHonua({
    primeLanguage: "en",
    includeLanguage: ["haw"]
}, 
new ToyProvider()
);
// Runs or re-runs i18n translations
dakine.hanaHou();
