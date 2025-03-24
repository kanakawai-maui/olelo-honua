# ʻŌlelo Honua

#### Automate Your Internationalization Workflow with Ease

#### 🚀 Now in Beta and Release Candidate (RC)!! 🎉

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

### State Diagram

![State Diagram](docs/clean_state_diagram.png)


## Introducing Critiques

Critiques are a way to evaluate and improve the quality of translations by identifying areas where they may lack clarity, cultural accuracy, or grammatical correctness. ʻŌlelo Honua provides an optional feature to generate AI-powered critiques for translations, helping you refine and enhance your localization efforts.

### Example Critique

An example of an AI-generated critique can be seen [here](examples/basic/critiques/critique.en.haw.md).

## Installation

To install the library, use npm or yarn:

```bash
npm install olelo-honua
```

or

```bash
yarn add olelo-honua
```

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

## Configuration

I highly recommend setting up an OpenRouter API Key for use with various models. 

[How to set up OpenRouter API Key](docs/API_KEY_SETUP.md)

For better security and ease of configuration, you can store your API key in a `.env` file. Simply create a `.env` file in your project root and add the following line:

```plaintext
OPENROUTER_API_KEY=<your_openrouter_api_key>
```

Then, use a library like `dotenv` to load the key into your application:

```javascript
require('dotenv').config();
const apiKey = process.env.OPENROUTER_API_KEY;
```

This approach keeps your sensitive information out of your codebase and makes it easier to manage across different environments.

You need to provide a configuration object and a translation provider. For instance, you can use the `DeepSeekProvider` as demonstrated in the usage example. I highly recommend DeepSeek & OpenRouter as these are free and extremely stable.  Happy coding!


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

### Supported Models

ʻŌlelo Honua supports a variety of translation providers, each tailored to specific use cases:

- **OpenRouterProvider**: A free and reliable option for general-purpose translation tasks, ideal for developers seeking stability without additional costs.  
- **DeepSeekProvider**: Highly recommended for its speed, accuracy, and cost-effectiveness, making it a great choice for production environments.
- **MultiLanguageProvider**: Specializes in handling translations for multiple languages simultaneously, ensuring consistency across diverse locales.
- **GemmaProvider**: Designed for high-quality translations, offering advanced features like context-aware adjustments and cultural sensitivity.
- **LlamaProvider**: Optimized for large-scale translation projects, suitable for applications with extensive multilingual content.
- **MistralProvider**: Provides robust and scalable translation capabilities, ideal for enterprise-level use cases and complex workflows.
- **QwenProvider**: Utilizes state-of-the-art translation technology, delivering precise and modern translations for cutting-edge applications.
- **GoogleTranslateProvider**: Leverages the well-known Google Translate API for dependable and widely supported translations.
- **OpenAIChatGPTProvider**: Uses OpenAI's ChatGPT to generate contextual and conversational translations, perfect for dynamic or interactive content.
- **ToyProvider**: A lightweight and simple provider intended for testing, prototyping, or development purposes.

> **Note**: Free models, such as OpenRouterProvider, come with a token limit. Ensure your usage stays within the allowed quota to avoid interruptions.

Select the provider that aligns with your application's specific needs (and performance requirements).

## Caching

Translations are cached for performance reasons. Caching helps reduce the number of API calls to translation providers, which is especially important when using free or limited-tier services that have strict quotas. By storing translations locally, you can avoid exceeding these quotas and ensure consistent performance. To clear the translations cache, use the following command:

```bash
rm -rf .translations_cache.json
```

### Supported Languages

### Supported Languages

ʻŌlelo Honua supports a wide range of languages. Here's a visually appealing and compact layout:

| **Afrikaans** 🇿🇦 | **Albanian** 🇦🇱 | **Amharic** 🇪🇹 | **Arabic** 🇸🇦 | **Armenian** 🇦🇲 | **Bengali** 🇧🇩 |
|-------------------|------------------|-----------------|----------------|------------------|----------------|
| **Basque** 🇪🇸 | **Bulgarian** 🇧🇬 | **Belarusian** 🇧🇾 | **Burmese** 🇲🇲 | **Catalan** 🇪🇸 | **Chinese (Simplified)** 🇨🇳 |
| **Chinese (Traditional)** 🇹🇼 | **Chinese (Hong Kong)** 🇭🇰 | **Croatian** 🇭🇷 | **Czech** 🇨🇿 | **Danish** 🇩🇰 | **Dutch** 🇳🇱 |
| **English (US)** 🇺🇸 | **English (UK)** 🇬🇧 | **English (Australia)** 🇦🇺 | **English (Canada)** 🇨🇦 | **Estonian** 🇪🇪 | **Filipino** 🇵🇭 |
| **Finnish** 🇫🇮 | **French (France)** 🇫🇷 | **French (Canada)** 🇨🇦 | **Galician** 🇪🇸 | **Georgian** 🇬🇪 | **German** 🇩🇪 |
| **Greek** 🇬🇷 | **Gujarati** 🇮🇳 | **Hebrew** 🇮🇱 | **Hindi** 🇮🇳 | **Hungarian** 🇭🇺 | **Icelandic** 🇮🇸 |
| **Indonesian** 🇮🇩 | **Italian** 🇮🇹 | **Japanese** 🇯🇵 | **Kannada** 🇮🇳 | **Kazakh** 🇰🇿 | **Khmer** 🇰🇭 |
| **Korean** 🇰🇷 | **Kyrgyz** 🇰🇬 | **Lao** 🇱🇦 | **Latvian** 🇱🇻 | **Lithuanian** 🇱🇹 | **Macedonian** 🇲🇰 |
| **Malay (Malaysia)** 🇲🇾 | **Malayalam** 🇮🇳 | **Marathi** 🇮🇳 | **Mongolian** 🇲🇳 | **Nepali** 🇳🇵 | **Norwegian** 🇳🇴 |
| **Persian** 🇮🇷 | **Polish** 🇵🇱 | **Portuguese (Brazil)** 🇧🇷 | **Portuguese (Portugal)** 🇵🇹 | **Punjabi** 🇮🇳 | **Romanian** 🇷🇴 |
| **Russian** 🇷🇺 | **Sinhala** 🇱🇰 | **Slovak** 🇸🇰 | **Slovenian** 🇸🇮 | **Spanish (Spain)** 🇪🇸 | **Spanish (Latin America)** 🌎 |
| **Spanish (United States)** 🇺🇸 | **Swahili** 🇹🇿 | **Swedish** 🇸🇪 | **Tagalog** 🇵🇭 | **Tamil** 🇮🇳 | **Telugu** 🇮🇳 |
| **Thai** 🇹🇭 | **Turkish** 🇹🇷 | **Ukrainian** 🇺🇦 | **Urdu** 🇵🇰 | **Vietnamese** 🇻🇳 | **Zulu** 🇿🇦 |

> **Note**: Hawaiian 🇺🇸 (Hawaiian Islands) is also supported, reflecting the cultural roots of ʻŌlelo Honua.

## License

This project is licensed under the MIT License.
