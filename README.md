# ʻŌlelo Honua

This library provides a way to automatically create and sync locale files using different translation providers.

(ʻŌlelo Honua can be translated to mean "Language Bridge" in Hawaiian.)

## Usage

Here's how you use the library:

```javascript
const oh = new OleloHonua(config, new GoogleTranslateProvider());
oh.createLocaleFiles()
  .then(() => {
    console.log("Locale files created successfully.");
  })
  .catch((error) => {
    console.error("Error creating locale files:", error);
  });
```

## Configuration Example

Here is an example of a configuration object:

```javascript
const config = {
  primeLanguage: "en",
  includeLanguage: ["es", "fr"],
  excludeLanguage: ["jp"],
  translationProvider: {
    apiKey: "your-google-translate-api-key",
    providerName: "GoogleTranslate",
  },
};
```

## Installation

To install the library, use npm or yarn:

```bash
npm install olelo-honua
```

or

```bash
yarn add olelo-honua
```

## Configuration

You need to provide a configuration object and a translation provider. For example, you can use the `GoogleTranslateProvider` as shown in the usage example.

## License

This project is licensed under the MIT License.
