# ʻŌlelo Honua 

## 🌺🌸🌼 Bloom Your Internationalization Workflow! 🌷🌻🌹

Struggling to keep up with the demands of managing translation files for your multilingual app? Tools like i18next or react-i18next often leave you stuck in manual workflows, relying on services like Google Translate or ChatGPT to fill the gaps. It’s tedious, time-consuming, and easy to make mistakes.

That’s where **ʻŌlelo Honua** comes in. This tool takes the hassle out of internationalization (i18n) by automating translation file creation and updates. Beyond just saving time, it ensures your translations are accurate, culturally appropriate, and free from common errors.

Why waste time on repetitive tasks when you can streamline your i18n process with a tool built to simplify localization? Let ʻŌlelo Honua handle the hard parts so you can focus on delivering great experiences for your global users.

#### 🌟 Meet Our Smarter, Faster AI Language Engine! 🌟

Ready to supercharge your i18n workflow? Our newly revamped AI language engine is here to make translations smarter, faster, and more intuitive. It delivers spot-on, culturally aware translations in record time, with built-in support for async and parallel processing. Whether you're scaling up or just starting out, this engine grows with you—making multilingual app development effortless and efficient. Say hello to the future of i18n!

## Challenges in Multilingual App Development and How ʻŌlelo Honua Solves Them

### Problem

Imagine building an app that speaks to the world. You start with one language, but as your app grows, so does the demand for multilingual support. Manually crafting and updating translation files for every new language? It’s a grind—tedious, error-prone, and a major time sink. Sound familiar?

With these models, ʻŌlelo Honua ensures you have access to the best tools for your internationalization needs, whether you're working on a small project or scaling to global audiences.

### Solution

Say goodbye to the headaches of managing translation files! ʻŌlelo Honua takes the grunt work out of internationalization by automating the creation and synchronization of translation files. With support for trusted providers like Google Translate, it ensures your translations are not only accurate but also always up-to-date. Save time, eliminate errors, and focus on what truly matters—building a world-class multilingual app.

Here's a simple illustration:

1. **Without ʻŌlelo Honua**: You manually create and update translation files for each language. Commence repetitive copy/paste from Google, ChatGPT, etc... 😩
2. **With ʻŌlelo Honua**: The library automatically generates and syncs translation files using your preferred translation provider. 🎩✨

This automation makes it easier to manage internationalization in your application, allowing you to focus on other stuff!

### Technical Deep Dive

For more details about my approach, vision, and methodology, refer to [About ʻŌlelo Honua](docs/deep_dive.md).

## Installation

To install the library, use npm or yarn:

```bash
npm install olelo-honua
```

or

```bash
yarn add olelo-honua
```

## Getting Started with ʻŌlelo Honua in Your Application

To use this library in your project, import it into `app.js` or any other file where you need it. Here's an example:

```javascript
const { OleloHonua } = require("olelo-honua");
// Create a new instance of OleloHonua
const dakine = new OleloHonua(
  {
    provider: {
      platform: OleloHonua.Providers.OpenRouter,
      credentials: {
        apiKey: process.env.OPEN_ROUTER_API_KEY, // Open Router API Key from .env
      },
      modelId: OleloHonua.OpenRouterModels.DEEPSEEK.DEEPSEEK_V3_FREE, // Model ID
    },
    primeLanguage: "en", // Language to translate from, must be defined in locales/en.json
    includeLanguages: ["haw", "en", "es", "fr", "de", "zh", "ja", "ko", "ar", "ru"], // Languages to translate to
    debug: true, // Enable debug
  },
);
// Runs or re-runs i18n translations
dakine.hanaHou(); // or use alias createLocaleFiles()
```

#### Important Note on `primeLanguage` config option

The `primeLanguage` setting is crucial for the translation process. It must have a corresponding locale JSON file to serve as the base for translations. For example, if you set `primeLanguage` to `'en'`, you need to ensure there is a `locales/en.json` file in your project.  Likewise, if you were to base translations in Spanish (`'es'`), you would need a `locales/es.json`.  

Without this file, the translation process cannot proceed as it relies on the base language file to generate translations for other languages.

## Using the CLI (Experimental Feature)

Here's how you use the CLI:
```bash
# Initialize locale files using the CLI
npx olelo-honua init --config ./local.config.json --debug
```

### Example Breakdown:
- `npx olelo-honua init`: Runs the `init` command to create or update locale files.
- `--config ./local.config.json`: Specifies the path to the configuration file. If omitted, it defaults to `local.config.json` in the current working directory.
- `--debug`: Enables debug mode for detailed logging during the process.

This command will read the configuration file, generate the necessary translation files, and log the process to the console.

<img src="images/terminal.png" alt="terminal" width="400"/>

## Configuration Tips

I highly recommend setting up an OpenRouter API Key for use with various models.

[How to set up OpenRouter API Key](docs/openrouter_api_key_setup.md)

There are also several other providers including Google Translate (aka Cloud Translation) and OpenAI (aka ChatGPT).

[OpenAI API Quickstart](https://platform.openai.com/docs/quickstart?api-mode=chat)

[Google Cloud Translation Quickstart](https://cloud.google.com/translate/docs/basic/translate-text-basic)

For enhanced security and ease of configuration, you should store your API key in a `.gitignore`'d `.env` file. 

[How to set up `.gitignore` for your project](https://git-scm.com/docs/gitignore)

Simply create a `.env` file in your project root and add the following line:

```plaintext
OPENROUTER_API_KEY=<your_openrouter_api_key>
```

Then, use a library like `dotenv` to load the key into your application:

```javascript
require("dotenv").config();
const apiKey = process.env.OPENROUTER_API_KEY;
```

[How to set up `dotenv` for your project](https://www.npmjs.com/package/dotenv#-install)

While using `.gitignore`, `dotenv` & `.env` is not mandatory for local development, it’s best engineering practice for safeguarding sensitive information. This approach keeps your credentials out of your codebase, simplifies environment management, and enhances security across different deployment setups.

You need to provide a configuration object and a translation provider. For instance, you can use the `DeepSeekProvider` as demonstrated in the usage example. I highly recommend DeepSeek & OpenRouter as these are free and extremely stable. Happy coding!

## Full Configuration Example

Here is an example of full configuration options:

```json
{
  "primeLanguage": "en",
  "provider": {
    "platform": "OpenRouter",
    "credentials": {
      "apiKey": "<your_openrouter_api_key>"
    },
    "modelId": "deepseek/deepseek-chat-v3-0324:free"
  },
  "retries": {
    "mainLoop": 3,
    "critiqueLoop": 2,
    "repairLoop": 1
  },
  "debug": false,
  "includeLanguage": ["haw", "ar", "es", "fr"],
  "maxChunkRequests": 4,
  "additionalConfig": {
    "critique": true,
    "saveCritique": false,
    "repair": false,
    "multiLanguageAgreementThreshold": 0.8
  }
}
```

## Supported Providers

Olelo Honua integrates with OpenRouter, OpenAI/ChatGPT, Google Translate, and even local LLM providers.  

### Supported Models

ʻŌlelo Honua integrates with a variety of models to streamline your translation workflow. Below is a list of supported models categorized by provider:

#### OpenRouter Models

- **DeepSeek**
  - `deepseek/deepseek-chat-v3-0324:free`
  - `deepseek/deepseek-r1:free`
  - `deepseek/deepseek-chat:free`
- **Google**
  - `google/gemini-2.5-pro-exp-03-25:free`
  - `google/gemma-3-1b-it:free`
  - `google/gemma-3-4b-it:free`
  - `google/gemma-3-12b-it:free`
  - `google/gemma-3-27b-it:free`
  - `google/gemini-2.0-flash-lite-preview-02-05:free`
  - `google/gemini-2.0-pro-exp-02-05:free`
  - `google/gemini-2.0-flash-thinking-exp:free`
  - `google/gemini-2.0-flash-thinking-exp-1219:free`
  - `google/gemini-2.0-flash-exp:free`
  - `google/learnlm-1.5-pro-experimental:free`
  - `google/gemma-2-9b-it:free`
- **Llama2**
  - `sophosympatheia/rogue-rose-103b-v0.2:free`
  - `gryphe/mythomax-l2-13b:free`
- **Llama3**
  - `deepseek/deepseek-r1-distill-llama-70b:free`
  - `meta-llama/llama-3.3-70b-instruct:free`
  - `nvidia/llama-3.1-nemotron-70b-instruct:free`
  - `meta-llama/llama-3.2-3b-instruct:free`
  - `meta-llama/llama-3.2-1b-instruct:free`
  - `meta-llama/llama-3.1-8b-instruct:free`
  - `meta-llama/llama-3-8b-instruct:free`
- **Qwen**
  - `qwen/qwq-32b:free`
  - `deepseek/deepseek-r1-distill-qwen-32b:free`
  - `deepseek/deepseek-r1-distill-qwen-14b:free`
  - `qwen/qwq-32b-preview:free`
  - `qwen/qwen-2.5-coder-32b-instruct:free`
  - `qwen/qwen-2.5-72b-instruct:free`
  - `qwen/qwen-2-7b-instruct:free`
- **Mistral**
  - `mistralai/mistral-7b-instruct:free`

#### OpenAI Models

- **OpenAI**
  - `openai/davinci`
  - `openai/curie`
  - `openai/babbage`
  - `openai/ada`
  - `openai/gpt-3.5-turbo`
  - `openai/gpt-4o`

> **Note**: Free models, such as OpenRouterProvider, come with a token limit. Ensure your usage stays within the allowed quota to avoid interruptions.

Select the provider/model that aligns with your application's specific needs (and performance requirements) 🌟.

## Caching

Translations are cached to keep things running smoothly and to cut down on API calls to translation providers. This is super handy if you're using free or limited-tier services with strict quotas. By saving translations locally, you avoid hitting those limits and keep performance steady. If you ever need to clear the cache, just run this command:

```bash
rm -rf .translations_cache.json
```

### Supported Languages

In addition to **Hawaiian** 🌺, ʻŌlelo Honua supports a wide range of languages:

<details>
<summary>Supported Languages 🌍</summary>
Afrikaans 🇿🇦 | Albanian 🇦🇱 | Amharic 🇪🇹 | Arabic 🇸🇦 | Armenian 🇦🇲 | Bengali 🇧🇩 | Basque 🇪🇸 | Bulgarian 🇧🇬 | Belarusian 🇧🇾 | Burmese 🇲🇲 | Catalan 🇪🇸 | Chinese (Simplified) 🇨🇳 | Chinese (Traditional) 🇹🇼 | Chinese (Hong Kong) 🇭🇰 | Croatian 🇭🇷 | Czech 🇨🇿 | Danish 🇩🇰 | Dutch 🇳🇱 | English (US) 🇺🇸 | English (UK) 🇬🇧 | English (Australia) 🇦🇺 | English (Canada) 🇨🇦 | Estonian 🇪🇪 | Filipino 🇵🇭 | Finnish 🇫🇮 | French (France) 🇫🇷 | French (Canada) 🇨🇦 | Galician 🇪🇸 | Georgian 🇬🇪 | German 🇩🇪 | Greek 🇬🇷 | Gujarati 🇮🇳 | Hebrew 🇮🇱 | Hindi 🇮🇳 | Hungarian 🇭🇺 | Icelandic 🇮🇸 | Indonesian 🇮🇩 | Italian 🇮🇹 | Japanese 🇯🇵 | Kannada 🇮🇳 | Kazakh 🇰🇿 | Khmer 🇰🇭 | Korean 🇰🇷 | Kyrgyz 🇰🇬 | Lao 🇱🇦 | Latvian 🇱🇻 | Lithuanian 🇱🇹 | Macedonian 🇲🇰 | Malay (Malaysia) 🇲🇾 | Malayalam 🇮🇳 | Marathi 🇮🇳 | Mongolian 🇲🇳 | Nepali 🇳🇵 | Norwegian 🇳🇴 | Persian 🇮🇷 | Polish 🇵🇱 | Portuguese (Brazil) 🇧🇷 | Portuguese (Portugal) 🇵🇹 | Punjabi 🇮🇳 | Romanian 🇷🇴 | Russian 🇷🇺 | Sinhala 🇱🇰 | Slovak 🇸🇰 | Slovenian 🇸🇮 | Spanish (Spain) 🇪🇸 | Spanish (Latin America) 🌎 | Spanish (United States) 🇺🇸 | Swahili 🇹🇿 | Swedish 🇸🇪 | Tagalog 🇵🇭 | Tamil 🇮🇳 | Telugu 🇮🇳 | Thai 🇹🇭 | Turkish 🇹🇷 | Ukrainian 🇺🇦 | Urdu 🇵🇰 | Vietnamese 🇻🇳 | Zulu 🇿🇦
</details>


```markdown
{% raw %}
Discover more about our mission, features, and updates on our [official ʻŌlelo Honua website](https://www.olelohonua.com). 🌐✨
{% endraw %}
```

## Contributing

We welcome contributions from developers of all skill levels! Whether it's fixing a bug, adding a feature, or improving documentation, your help is greatly appreciated. To get started, check out our [Contributing Guide](docs/contributing.md) for detailed instructions on how to contribute to the project. Let's build something amazing together!

## Code of Conduct

We’re committed to fostering a welcoming and inclusive community. You can read our Code of Conduct [here](docs/code_of_conduct.md).

## License

This project is licensed under the MIT License.

<img src="images/logo_nobg.png" alt="logo" width="200"/>
