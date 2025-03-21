import * as fs from "fs";
import * as path from "path";

import { LocaleConfig } from "./interfaces/locale";
import { Language } from "./interfaces/language";
import defaultLanguagesData from "./default_languages.json";
import { Enquirer } from "./enquirer/enquirer";
import { BaseProvider } from "./providers/base";

export { ToyProvider } from "./providers/toy";
export { GoogleTranslateProvider } from "./providers/googleTranslate";
export { OpenAIChatGPTProvider } from "./providers/openAiChatGpt";
export { OpenRouterProvider } from "./providers/openRouter";
export { DeepSeekProvider } from "./providers/deepSeek";
export { MultiLanguageProvider } from "./providers/multiLanguage";
export { GemmaProvider } from "./providers/gemma";
export { LlamaProvider } from "./providers/llama";
export { MistralProvider } from "./providers/mistral";
export { QwenProvider } from "./providers/qwen";

/**
 * The main class for OleloHonua.
 */
export class OleloHonua {
  private config: LocaleConfig;
  private provider: BaseProvider;
  private __dirname: string;

  constructor(config: LocaleConfig, provider: BaseProvider) {
    this.config = config;
    this.provider = provider;
    this.__dirname = path.resolve(process.cwd());
  }

  /**
   * Hana Hou - Creates locale files for the specified languages.
   *
   * @throws An error if the configuration is invalid.
   */
  async hanaHou() {
    this.validateConfig(this.config);

    const languages =
      this.config.includeLanguage && this.config.includeLanguage.length > 0
        ? this.config.includeLanguage
        : this.getAllLanguages().filter(
            (lang) => !this.config.excludeLanguage?.includes(lang),
          );

    if (this.config.debug)
      console.log(`Languages to process: ${languages.join(", ")}`);

    const primeLanguage = this.config.primeLanguage;

    if (this.config.debug)
      console.log(`Fetching content for prime language: ${primeLanguage}`);
    const primeLanguageInfo = this.getLanguageInfo(primeLanguage);
    const primeContent = await this.getPrimeLanguageContent(primeLanguage);
    const primeContentJSON = JSON.parse(primeContent);

    for (const lang of languages.filter((lang) => lang !== primeLanguage)) {
      const toLanguageInfo = this.getLanguageInfo(lang);
      const enq = new Enquirer(
        primeContentJSON,
        primeLanguageInfo,
        toLanguageInfo,
        this.provider,
        this.config,
      );
      await enq.mainLoop();
    }
  }

  /**
   * Alias for hanaHou function.
   */
  async createLocaleFiles() {
    await this.hanaHou();
  }

  /**
   * Validates the provided configuration.
   *
   * @param config - The configuration to validate.
   * @throws An error if the configuration is invalid.
   */
  private validateConfig(config: LocaleConfig) {
    if (!config.primeLanguage) {
      throw new Error("Prime language must be specified.");
    }

    if (
      (config.includeLanguage?.length ?? 0) > 0 &&
      (config.excludeLanguage?.length ?? 0) > 0
    ) {
      throw new Error(
        "Only one of includeLanguage or excludeLanguage must be specified, not both.",
      );
    }

    if (
      (config.includeLanguage?.length ?? 0) === 0 &&
      (config.excludeLanguage?.length ?? 0) === 0
    ) {
      throw new Error(
        "One of includeLanguage or excludeLanguage must be specified.",
      );
    }

    // Ensure that languages specified in includeLanguage or excludeLanguage are valid
    const allLanguages = this.getAllLanguages();

    for (const lang of config.includeLanguage ?? []) {
      if (!allLanguages.includes(lang)) {
        throw new Error(
          `Invalid language specified in includeLanguage: ${lang}`,
        );
      }
    }
    for (const lang of config.excludeLanguage ?? []) {
      if (!allLanguages.includes(lang)) {
        throw new Error(
          `Invalid language specified in excludeLanguage: ${lang}`,
        );
      }
    }
  }

  /**
   * Returns all available languages.
   *
   * @returns An array of all available languages
   */
  private getAllLanguages(): string[] {
    // This function should return all available languages from ISO 639-1
    return this.getAllLanguageInfo().map((lang: any) => lang.code);
  }

  /**
   * Returns all available language info.
   *
   * @returns An array of all available languages
   */
  private getAllLanguageInfo(): Language[] {
    // This function should return all available languages from ISO 639-1
    const customLanguagesFilePath = path.join(
      this.__dirname,
      "custom_languages.json",
    );

    let customLanguagesData = [];

    if (fs.existsSync(customLanguagesFilePath)) {
      const customLanguagesRaw = fs.readFileSync(
        customLanguagesFilePath,
        "utf-8",
      );
      customLanguagesData = JSON.parse(customLanguagesRaw);
    }

    const allLanguagesData = [...defaultLanguagesData, ...customLanguagesData];

    return allLanguagesData;
  }

  /**
   * Returns the language info for the specified language code.
   *
   * @param languageCode - The language code.
   * @returns The language info for the specified language code.
   * @throws An error if the language is not found.
   */
  private getLanguageInfo(languageCode: string): Language {
    const allLanguages = this.getAllLanguageInfo();
    const languageInfo = allLanguages.find(
      (lang) => lang.code === languageCode,
    );

    if (!languageInfo) {
      throw new Error(`Language not found: ${languageCode}`);
    }

    return languageInfo;
  }

  /**
   * Returns the content for the specified prime language.
   *
   * @param primeLanguage - The prime language code.
   * @returns The content for the prime language.
   * @throws An error if the content for the prime language is not found.
   *
   */
  private async getPrimeLanguageContent(
    primeLanguage: string,
  ): Promise<string> {
    // This function should return the content for the prime language
    const filePath = path.join(this.__dirname, `locales/${primeLanguage}.json`);
    return fs.readFileSync(filePath, "utf-8");
  }
}
