import * as fs from "fs";
import * as path from "path";

import { LocaleConfig } from "./interfaces/locale";
import { LanguageProvider } from "./interfaces/language";
import defaultLanguagesData from "./default_languages.json";
import { BulkLanguageProvider } from "./interfaces/language";

export { ToyProvider } from "./providers/toy";
export { GoogleTranslateProvider } from "./providers/googleTranslate";
export { OpenAIChatGPTProvider } from "./providers/openAiChatGpt";

/**
 * The main class for OleloHonua.
 */
export class OleloHonua {
  private config: LocaleConfig;
  private provider: LanguageProvider;
  private __dirname: string;

  constructor(config: LocaleConfig, provider: LanguageProvider) {
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

    const cacheFilePath = path.join(this.__dirname, ".translation_cache.json");
    let cache: { [key: string]: any } = {};

    if (fs.existsSync(cacheFilePath)) {
      const cacheRaw = fs.readFileSync(cacheFilePath, "utf-8");
      cache = JSON.parse(cacheRaw);
    }

    const languages =
      this.config.includeLanguage && this.config.includeLanguage.length > 0
        ? this.config.includeLanguage
        : this.getAllLanguages().filter(
            (lang) => !this.config.excludeLanguage?.includes(lang),
          );
    const primeLanguage = this.config.primeLanguage;
    const primeContent = await this.getPrimeLanguageContent(primeLanguage);
    // convert primeContent to JSON
    const primeContentJSON = JSON.parse(primeContent);

    for (const lang of languages) {
      if (lang !== primeLanguage) {
        if ("translateTextBulk" in this.provider && this.config.useBulkProvider) {
          const primeContentKeys = Object.keys(primeContentJSON);
          const primeContentValues = Object.values(primeContentJSON);
          const cacheKey = `${primeLanguage}-${lang}-${this.provider.constructor.name}`;
          let translatedValues;

          if (cache[cacheKey]) {
            translatedValues = cache[cacheKey];
          } else {
            translatedValues = await (
              this.provider as BulkLanguageProvider
            ).translateTextBulk(
              primeContentValues as string[],
              primeLanguage,
              lang,
            );
            cache[cacheKey] = translatedValues;
          }

          const translatedContentJSON = primeContentKeys.reduce(
            (acc, key, index) => {
              (acc as Record<string, string>)[key] = translatedValues[index];
              return acc;
            },
            {},
          );
          this.saveToFile(lang, translatedContentJSON);
        } else {
          for (const key in primeContentJSON) {
            const originalValue = primeContentJSON[key];
            const cacheKey = `${primeLanguage}-${lang}-${key}`;
            let translatedValue;

            if (cache[cacheKey]) {
              translatedValue = cache[cacheKey];
            } else {
              translatedValue = await this.provider.translateText(
                originalValue,
                primeLanguage,
                lang,
              );
              cache[cacheKey] = translatedValue;
            }

            primeContentJSON[key] = translatedValue;
          }
          this.saveToFile(lang, primeContentJSON);
        }
      }
    }

    fs.writeFileSync(cacheFilePath, JSON.stringify(cache, null, 2));
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

    return allLanguagesData.map((lang: any) => lang.code);
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

  /**
   * Saves the provided content to a file named after the specified language.
   *
   * @param language - The language code to name the file.
   * @param content - The content to be saved in the file.
   */
  private saveToFile(language: string, content: {}) {
    const filePath = path.join(this.__dirname, `locales/${language}.json`);
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
  }
}
