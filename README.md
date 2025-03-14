# ʻŌlelo Honua

This library provides a way to automatically create and sync locale files using different translation providers.

(ʻŌlelo Honua can be translated to mean "World Language" or "Language Bridge" in Hawaiian.)

## Usage

Here's how you use the library:

```javascript
// Create a new instance
const dakine = new OleloHonua(
  {
    primeLanguage: "haw",
    excludeLanguage: ["ja", "en", "de"],
  },
  new GoogleTranslateProvider({ projectId: "<my_project_id>" }),
);
// Runs or re-runs i18n translations
dakine.hanaHou();
```

## Configuration Example

Here is an example of full configuration options:

```javascript
const config = {
  primeLanguage: "haw",
  includeLanguage: ["es", "fr"],
  // alternatively we can use excludeLanguage: ["ja"],
  useBulkProvider: true
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
