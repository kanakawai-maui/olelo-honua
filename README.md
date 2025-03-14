# ʻŌlelo Honua

This library provides a way to automatically create and sync locale files using different translation providers.

(ʻŌlelo Honua can be translated to mean "World Language" or "Language Bridge" in Hawaiian.)

A common workflow when using tools like i18next or react-i18next is to create translation files for a primary language and then utilize a third-party service (e.g., Google Translate or ChatGPT) for the remaining translations. This process can be cumbersome and repetitive. ʻŌlelo Honua aims to automate this task, making internationalization (i18n) easier. One significant barrier to implementing i18n is maintaining and updating all these translation files. Additionally, there needs to be a way to verify that translations are accurate and not misleading. ʻŌlelo Honua addresses these challenges by providing a seamless and efficient solution for managing and verifying translations.

## Problem and Solution

### Problem

Imagine you have an application that supports multiple languages. You start by creating translation files for your primary language, but as your application grows, you need to add support for more languages. Manually creating and updating these translation files for each language can be time-consuming and error-prone.

### Solution

ʻŌlelo Honua automates the creation and synchronization of translation files. By using translation providers like Google Translate, it ensures that your translations are up-to-date and accurate. This saves you time and reduces the risk of errors in your translation files.

Here's a simple illustration:

1. **Without ʻŌlelo Honua**: You manually create and update translation files for each language.  Commence repetitive copy/paste from Google, ChatGPT, etc...
2. **With ʻŌlelo Honua**: The library automatically generates and syncs translation files using your preferred translation provider.

This automation makes it easier to manage internationalization in your application, allowing you to focus on other important tasks.

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
dakine.hanaHou(); // or use alias dakine.createLocaleFiles()
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
