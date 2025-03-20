import * as fs from "fs";
import * as path from "path";

import { LocaleConfig } from "./interfaces/locale";
import { Language, LanguageProvider, OUTPUT_FILETYPE_JSON } from "./interfaces/language";
import defaultLanguagesData from "./default_languages.json";
import { BulkLanguageProvider } from "./interfaces/language";

export { ToyProvider } from "./providers/toy";
export { GoogleTranslateProvider } from "./providers/googleTranslate";
export { OpenAIChatGPTProvider } from "./providers/openAiChatGpt";
export { OpenRouterProvider } from "./providers/openRouter";
export { DeepSeekProvider } from "./providers/deepSeek";

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

    if (this.config.debug) console.log("Validating configuration...");

    if (fs.existsSync(cacheFilePath)) {
      if (this.config.debug) console.log("Loading existing cache...");
      const cacheRaw = fs.readFileSync(cacheFilePath, "utf-8");
      cache = JSON.parse(cacheRaw);
    }

    const languages =
      this.config.includeLanguage && this.config.includeLanguage.length > 0
        ? this.config.includeLanguage
        : this.getAllLanguages().filter(
            (lang) => !this.config.excludeLanguage?.includes(lang),
          );

    if (this.config.debug) console.log(`Languages to process: ${languages.join(", ")}`);

    const primeLanguage = this.config.primeLanguage;
    const primeLanguageInfo = this.getLanguageInfo(primeLanguage);

    if (this.config.debug) console.log(`Fetching content for prime language: ${primeLanguage}`);
    const primeContent = await this.getPrimeLanguageContent(primeLanguage);
    const primeContentJSON = JSON.parse(primeContent);

    for (const lang of languages) {
      if (lang !== primeLanguage) {
        const targetLanguageInfo = this.getLanguageInfo(lang);
        if (this.config.debug) console.log(`Translating ${primeLanguage} -> ${lang}...`);

        if ("translateTextBulk" in this.provider && this.config.bulkTranslate) {
          const primeContentKeys = Object.keys(primeContentJSON);
          const primeContentValues = Object.values(primeContentJSON).map(
            (value) =>
              typeof value === "object" ? JSON.stringify(value) : value,
          );
          const cacheKey = `${primeLanguage}-${lang}-${this.provider.constructor.name}-bulk`;
          let translatedValues;

          if (cache[cacheKey]) {
            if (this.config.debug) console.log(`Using cached bulk translation for ${primeLanguage} -> ${lang}`);
            translatedValues = cache[cacheKey];
          } else {
            if (this.config.debug) console.log(`Performing bulk translation for ${primeLanguage} -> ${lang}`);
            translatedValues = await (
              this.provider as BulkLanguageProvider
            ).translateTextBulk(
              primeContentValues as string[],
              primeLanguageInfo,
              targetLanguageInfo,
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

          if ("critiqueTranslation" in this.provider && this.config.critique) {
            if (typeof this.provider.critiqueTranslation === "function") {
              if (this.config.debug) console.log(`Critiquing translation ${primeLanguage} -> ${lang}`);
              const critique = await this.provider.critiqueTranslation(
                JSON.stringify(primeContentJSON),
                JSON.stringify(translatedContentJSON),
                OUTPUT_FILETYPE_JSON,
                this.config.saveCritique,
                primeLanguageInfo,
                targetLanguageInfo,
              );

              if ("repairTranslation" in this.provider && this.config.repair) {
                if (typeof this.provider.repairTranslation === "function") {
                  if (this.config.debug) console.log(`Repairing translation ${primeLanguage} -> ${lang}`);
                  const repairedContentJSON = await this.provider.repairTranslation(
                    JSON.stringify(primeContentJSON),
                    critique,
                    primeLanguageInfo,
                    targetLanguageInfo,
                  );
                  try {
                    const validJSON = JSON.parse(repairedContentJSON);
                    this.saveToFile(lang, validJSON);
                  } catch (e) {
                    console.error(
                      `Error: The repaired content for ${lang} is not a valid JSON. Skipping...`,
                    );
                  }
                }
              }
            }
          }
        } else {
          const translatedContentJSON = primeContentJSON;
          for (const key in primeContentJSON) {
            const originalValue = primeContentJSON[key];
            const cacheKey = `${primeLanguage}-${lang}-${key}`;
            let translatedValue;

            if (cache[cacheKey]) {
              if (this.config.debug) console.log(`Using cached translation for key "${key}" in ${primeLanguage} -> ${lang}`);
              translatedValue = cache[cacheKey];
            } else {
              if (this.config.debug) console.log(`Translating key "${key}" in ${primeLanguage} -> ${lang}`);
              translatedValue = await this.provider.translateText(
                originalValue,
                primeLanguageInfo,
                targetLanguageInfo,
              );
              cache[cacheKey] = translatedValue;
            }

            translatedContentJSON[key] = translatedValue;
          }
          this.saveToFile(lang, translatedContentJSON);
        }
      }
    }

    if (JSON.stringify(cache, null, 2) === "{}") {
      console.log(
        "An empty cache file was created, this means that the translations were not cached and something went wrong. Please check the logs for more information.",
      );
    }

    if (this.config.debug) console.log("Saving updated cache...");
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
