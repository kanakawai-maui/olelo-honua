import * as fs from "fs";
import * as path from "path";

import defaultLanguagesData from "./default_languages.json";

import { Config } from "./interfaces/config";
import { Language } from "./types/shared";
import { FullProvider, PartialProvider } from "./interfaces/provider";
import { OpenRouterProvider } from "./providers/openRouter";

import { OpenAIModels, OpenRouterModels } from "./utils/constants";
import {AdvancedPromptingEngine} from "./engine/advancedPromptingEngine";
import {ConventionalEngine} from "./engine/conventionalEngine";

import { TitleMessage, AlohaMessage, HanaHouMessage } from "./utils/display";

/**
 * The main class for OleloHovnua.
 */
export class OleloHonua {
  private config: Config;
  private provider: FullProvider | PartialProvider;
  private useAdvancedEngine: boolean = false;
  private __dirname: string;

  public static Providers = {
    OpenRouter: "OpenRouter",
    OpenAI: "OpenAI",
    GoogleTranslate: "GoogleTranslate",
    LocalLLM: "LocalLLM",
    Custom: "Custom",
  };

  public static OpenRouterModels = OpenRouterModels;
  public static OpenAIModels = OpenAIModels;

  constructor(config: Config) {
    console.log(TitleMessage);
    switch(config.provider.platform) {
      case OleloHonua.Providers.OpenRouter:
        if(!config.provider.credentials.apiKey) {
          throw new Error("API key must be specified.");
        }
        this.provider = new OpenRouterProvider(
          config.provider.credentials.apiKey,
          config.provider.modelId || OpenRouterModels.DEEPSEEK.DEEPSEEK_V3_0324_FREE
        );
        this.useAdvancedEngine = true;
        break;
      case OleloHonua.Providers.OpenAI:
        if(!config.provider.credentials.apiKey) {
          throw new Error("API key must be specified.");
        }
        /*
        this.provider = new OpenAIProvider(
          config.provider.credentials.apiKey,
          config.provider.modelId || OpenAIModels.OPENAI.DAVINCI
        );
        */
        this.useAdvancedEngine = true;
        throw new Error("OpenAI provider is not implemented yet.");
      case OleloHonua.Providers.GoogleTranslate:
        if(!config.provider.credentials.projectId) {
          throw new Error("Project ID must be specified.");
        }
        this.useAdvancedEngine = false;
        throw new Error("Google Translate provider is not implemented yet.");
      case OleloHonua.Providers.LocalLLM:
        this.useAdvancedEngine = true;
          throw new Error("LocalLLM is not implemented yet.");
      case OleloHonua.Providers.Custom:
        throw new Error("Custom is not implemented yet.");
      default:
        throw new Error("Invalid provider type.");
    }
    this.config = config;
    this.__dirname = path.resolve(process.cwd());
    console.log(AlohaMessage);
  }

  /**
   * Hana Hou - Creates locale files for the specified languages.
   *
   * @throws An error if the configuration is invalid.
   */
  async hanaHou() {
    console.log(HanaHouMessage);
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
    const from = this.getLanguageInfo(primeLanguage);
    const content = await this.getPrimeLanguageContent(primeLanguage);

    const maxChunkRequests = this.config.maxChunkRequests || 1;

    const langChunks = languages
      .filter((lang) => lang !== primeLanguage)
      .reduce((resultArray, item, index) => { 
      const chunkIndex = Math.floor(index / maxChunkRequests);
      if (!resultArray[chunkIndex]) {
        resultArray[chunkIndex] = [];
      }
      resultArray[chunkIndex].push(item);
      return resultArray;
      }, [] as string[][]);

    for (const chunk of langChunks) {
      await Promise.all(
      chunk.map(async (lang) => {
        const to = this.getLanguageInfo(lang);
        const enq = this.useAdvancedEngine
        ? new AdvancedPromptingEngine(from, to, this.provider as FullProvider, this.config)
        : new ConventionalEngine(from, to, this.provider as PartialProvider, this.config);
        await enq.mainLoop(content);
      })
      );
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
  private validateConfig(config: Config) {
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
