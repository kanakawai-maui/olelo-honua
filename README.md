# ʻŌlelo Honua

#### 🌺🌸🌼 Bloom Your Internationalization Workflow! 🌷🌻🌹

#### 🎉 Now in Beta and Release Candidate (RC)!! 🎉

(ʻŌlelo Honua can be translated to mean "World Language" or "Language Bridge" in Hawaiian.)

## 🌍 Simplify Your Internationalization Workflow with ʻŌlelo Honua

Struggling to keep up with the demands of managing translation files for your multilingual app? Tools like i18next or react-i18next often leave you stuck in manual workflows, relying on services like Google Translate or ChatGPT to fill the gaps. It’s tedious, time-consuming, and easy to make mistakes.

That’s where **ʻŌlelo Honua** comes in. This tool takes the hassle out of internationalization (i18n) by automating translation file creation and updates. Beyond just saving time, it ensures your translations are accurate, culturally appropriate, and free from common errors.

Why waste time on repetitive tasks when you can streamline your i18n process with a tool built to simplify localization? Let ʻŌlelo Honua handle the hard parts so you can focus on delivering great experiences for your global users.

## Challenges in Multilingual App Development and How ʻŌlelo Honua Solves Them

### Problem
Imagine building an app that speaks to the world. You start with one language, but as your app grows, so does the demand for multilingual support. Manually crafting and updating translation files for every new language? It’s a grind—tedious, error-prone, and a major time sink. Sound familiar?

### Solution

Say goodbye to the headaches of managing translation files! ʻŌlelo Honua takes the grunt work out of internationalization by automating the creation and synchronization of translation files. With support for trusted providers like Google Translate, it ensures your translations are not only accurate but also always up-to-date. Save time, eliminate errors, and focus on what truly matters—building a world-class multilingual app.

Here's a simple illustration:

1. **Without ʻŌlelo Honua**: You manually create and update translation files for each language. Commence repetitive copy/paste from Google, ChatGPT, etc... 😩
2. **With ʻŌlelo Honua**: The library automatically generates and syncs translation files using your preferred translation provider. 🎩✨

This automation makes it easier to manage internationalization in your application, allowing you to focus on other stuff!

### State Diagram

### Enquirer Loop: A Paradigm Shift in Translation Accuracy

The enquirer loop represents a groundbreaking advancement in the field of internationalization. By integrating cutting-edge AI technologies, including Large Language Models (LLMs) and state-of-the-art translation tools, this iterative process redefines how translations are refined and validated. At its core, the enquirer loop operates as a self-correcting system, continuously analyzing its outputs to identify inaccuracies, ambiguities, or cultural mismatches. Through intelligent feedback mechanisms, it applies context-aware adjustments, ensuring that translations are not only linguistically precise but also culturally resonant. This innovative approach embodies a dynamic, feedback-driven methodology, setting a new standard for achieving unparalleled accuracy and relevance in multilingual applications.

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
const config: LocaleConfig = {
  primeLanguage: "en",
  includeLanguage: ["haw", "ar", "es", "fr"], // Specify languages to include
  // Alternatively, you can use excludeLanguage: ["ja"] to exclude specific languages
  bulkTranslate: true, // Use bulk translation for better performance (replaces useBulkProvider, which is being deprecated)
  critique: true, // Enable AI critique for translations
  saveCritique: false, // Optionally save critiques for further analysis
  repair: false, // Enable or disable automatic repair of translations
  debug: false, // Enable debug mode for detailed logs
  multiLanguageAgreementThreshold: 0.8, // Set threshold for multi-language agreement
  loopRetryOptions: {
    mainLoopRetries: 3, // Number of retries for the main loop
    critiqueLoopRetries: 2, // Number of retries for critique loop
    repairLoopRetries: 1, // Number of retries for repair loop
  },
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

Select the provider that aligns with your application's specific needs (and performance requirements) 🌟.

## Caching

Translations are cached to keep things running smoothly and to cut down on API calls to translation providers. This is super handy if you're using free or limited-tier services with strict quotas. By saving translations locally, you avoid hitting those limits and keep performance steady. If you ever need to clear the cache, just run this command:

```bash
rm -rf .translations_cache.json
```

### Supported Languages

### Supported Languages

In addition to **Hawaiian** 🌺, ʻŌlelo Honua supports a wide range of languages:

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


## Code of Conduct

We’re committed to fostering a welcoming and inclusive community. You can read our Code of Conduct [here](CODE_OF_CONDUCT.md).

## License

This project is licensed under the MIT License.
