# ʻŌlelo Honua

#### Automate Your Internationalization Workflow with Ease

#### 🚀 Now in Beta!! 🎉

(ʻŌlelo Honua can be translated to mean "World Language" or "Language Bridge" in Hawaiian.)

A common workflow when using tools like i18next or react-i18next is to create translation files for a primary language and then utilize a third-party service (e.g., Google Translate or ChatGPT) for the remaining translations. This process can be cumbersome and repetitive. ʻŌlelo Honua aims to automate this task, making internationalization (i18n) easier. One significant barrier to implementing i18n is maintaining and updating all these translation files. Additionally, there needs to be a way to verify that translations are accurate and not misleading. ʻŌlelo Honua addresses these challenges by providing a seamless and efficient solution for managing and verifying translations.

## Problem and Solution

### Problem

Imagine you have an application that supports multiple languages. You start by creating translation files for your primary language, but as your application grows, you need to add support for more languages. Manually creating and updating these translation files for each language can be time-consuming and error-prone.

### Solution

ʻŌlelo Honua automates the creation and synchronization of translation files. By using translation providers like Google Translate, it ensures that your translations are up-to-date and accurate. This saves you time and reduces the risk of errors in your translation files.

Here's a simple illustration:

1. **Without ʻŌlelo Honua**: You manually create and update translation files for each language. Commence repetitive copy/paste from Google, ChatGPT, etc...
2. **With ʻŌlelo Honua**: The library automatically generates and syncs translation files using your preferred translation provider.

This automation makes it easier to manage internationalization in your application, allowing you to focus on other important tasks.

## Introducing Critiques

Critiques are a way to evaluate and improve the quality of translations by identifying areas where they may lack clarity, cultural accuracy, or grammatical correctness. ʻŌlelo Honua provides an optional feature to generate AI-powered critiques for translations, helping you refine and enhance your localization efforts.

### Example Critique

An example of an AI-generated critique can be seen [here](examples/basic/critiques/critique.en.haw.json).

## Caching

Translations are cached for performance reasons. To clear the translations cache, `rm -rf .translations_cache.json`

## Usage

Here's how you use the library:

```javascript
const { OleloHonua, DeepSeekProvider } = require("olelo-honua");

// Create a new instance
const dakine = new OleloHonua(
  {
    primeLanguage: "haw",
    excludeLanguage: ["ja", "en", "de"],
  },
  new DeepSeekProvider({ apiKey: '<your_openrouter_api_key' }), // Highly recommend DeepSeekProvider since it's free & reliable
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
  bulkTranslate: true, // whether to use bulk translation for performance, replacement for useBulkProvider (deprecating soon)
  critique: false, // whether to have AI critique translations, if available
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

### Supported Languages

ʻŌlelo Honua supports a wide range of languages. Below is a compact grid of supported languages, their native names, English names, and corresponding flags:

| Language         | Flag Emoji |
|------------------|------------|
| English          | 🇺🇸        |
| Spanish          | 🇪🇸        |
| French           | 🇫🇷        |
| German           | 🇩🇪        |
| Japanese         | 🇯🇵        |
| Hawaiian         | 🇺🇸 (Hawaiian Islands) |
| Chinese (Simplified) | 🇨🇳    |
| Korean           | 🇰🇷        |
| Italian          | 🇮🇹        |
| Portuguese       | 🇵🇹        |
| Russian          | 🇷🇺        |
| Arabic           | 🇸🇦        |
| Hindi            | 🇮🇳        |
| Dutch            | 🇳🇱        |
| Swedish          | 🇸🇪        |

This list is customizable, and you can add or exclude languages based on your application's requirements.

### Supported Models

ʻŌlelo Honua supports various translation providers, each catering to different needs:

- **OpenRouterProvider**: A free and stable option for translation tasks.
- **DeepSeekProvider**: Recommended for its performance and cost-effectiveness.
- **MultiLanguageProvider**: Handles multiple languages efficiently.
- **GemmaProvider**: Focuses on high-quality translations with advanced features.
- **LlamaProvider**: Optimized for large-scale translation tasks.
- **MistralProvider**: Provides robust translation capabilities for diverse use cases.
- **QwenProvider**: Offers cutting-edge translation technology for modern applications.
- **GoogleTranslateProvider**: Leverages Google Translate for reliable translations.
- **OpenAIChatGPTProvider**: Uses OpenAI's ChatGPT for contextual and conversational translations.
- **ToyProvider**: A lightweight provider for testing and development.

Choose the provider that best suits your application's requirements.

## Configuration

You need to provide a configuration object and a translation provider. For instance, you can use the `DeepSeekProvider` as demonstrated in the usage example. I highly recommend DeepSeek & OpenRouter as these are free and extremely stable.  Happy coding!

## License

This project is licensed under the MIT License.
