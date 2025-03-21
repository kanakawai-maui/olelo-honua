import {jsonrepair} from "jsonrepair";
import { Language, OUTPUT_FILETYPE_JSON } from "../interfaces/language";
import { LocaleConfig } from "../interfaces/locale";
import { BaseProvider } from "../providers/base";
import { FileSystem, Cache } from "../system/system";

export class Enquirer {
  private content: any;
  private from: Language;
  private to: Language;
  private provider: BaseProvider;
  private config: LocaleConfig;
  private cache: Cache;
  private fileSystem: FileSystem;
  private mainLoopRetries: number;
  private critiqueLoopRetries: number;
  private repairLoopRetries: number;

  constructor(
    content: string,
    from: Language,
    to: Language,
    provider: BaseProvider,
    config: LocaleConfig,
  ) {
    this.content = content;
    this.from = from;
    this.to = to;
    this.provider = provider;
    this.config = config;
    this.cache = new Cache();
    this.fileSystem = new FileSystem(this.to);
    this.mainLoopRetries = this.config.loopRetryOptions?.mainLoopRetries || 1;
    this.critiqueLoopRetries =
      this.config.loopRetryOptions?.critiqueLoopRetries || 3;
    this.repairLoopRetries =
      this.config.loopRetryOptions?.repairLoopRetries || 3;
  }

  async mainLoop(retries: number = this.mainLoopRetries) {
    if (retries >= 0) {
      try {
        if (this.config.debug)
          console.log(
            `Translating ${this.from.code} -> ${this.to.code} (main loop retries left: ${retries})`,
          );
        if (this.provider.preferBulkTranslate && this.config.bulkTranslate) {
          this.cache.setAutoCacheKey(
            `${this.from.code}-${this.to.code}-${this.provider.constructor.name}`,
          );
          const primeContentKeys = Object.keys(this.content);
          const primeContentValues = Object.values(this.content).map((value) =>
            typeof value === "object" ? JSON.stringify(value) : value,
          );
          let translatedValues;

          if (this.cache.quickget()) {
            if (this.config.debug)
              console.log(
                `Using cached bulk translation for ${this.from.code} -> ${this.to.code}`,
              );
            translatedValues = this.cache.quickget();
          } else {
            if (this.config.debug)
              console.log(
                `Performing bulk translation for ${this.from.code} -> ${this.to.code}`,
              );
            translatedValues = await this.provider.translateTextBulk(
              primeContentValues as string[],
              this.from,
              this.to,
            );
            this.cache.quickset(translatedValues);
          }

          const translatedContentJSON = primeContentKeys.reduce(
            (acc, key, index) => {
              (acc as Record<string, string>)[key] = translatedValues[index];
              return acc;
            },
            {},
          );
          this.fileSystem.save(translatedContentJSON);
          await this.critiqueLoop(translatedContentJSON);
          this.cache.save();
        } else {
          this.cache.setAutoCacheKey(
            `${this.from.code}-${this.to.code}-${this.provider.constructor.name}`,
          );
          const translatedContentJSON = this.content;
          for (const key in this.content) {
            const originalValue = this.cache.quickget();
            let translatedValue;

            if (this.cache.quickget()) {
              if (this.config.debug)
                console.log(
                  `Using cached translation for key "${key}" in ${this.from.code} -> ${this.to.code}`,
                );
              translatedValue = this.cache.quickget();
            } else {
              if (this.config.debug)
                console.log(
                  `Translating key "${key}" in ${this.from.code} -> ${this.to.code}`,
                );
              translatedValue = await this.provider.translateText(
                originalValue,
                this.from,
                this.to,
              );
              this.cache.quickset(translatedValue);
            }

            translatedContentJSON[key] = translatedValue;
          }
          this.fileSystem.save(translatedContentJSON);
          this.cache.save();
        }
        this.cache.save();
      } catch (e) {
        console.error(`Error: An error occurred during main loop. Retrying...`);
        this.mainLoop(retries - 1);
      }
    } else {
      console.warn(
        `Error: Retry limit exceeded in main loop. Main loop cancelled.  Please review ${this.from.code} -> ${this.to.code} translation.`,
      );
    }
  }

  async critiqueLoop(
    translatedContent: any,
    retries: number = this.critiqueLoopRetries,
  ) {
    if (retries >= 0) {
      try {
        if (this.config.debug)
          console.log(
            `Critiquing translation ${this.from.code} -> ${this.to.code} (critique loop retries left: ${retries})`,
          );
        const critique = await this.provider.critiqueTranslation(
          JSON.stringify(this.content),
          JSON.stringify(translatedContent),
          OUTPUT_FILETYPE_JSON,
          this.config.saveCritique || false,
          this.from,
          this.to,
        );
        await this.repairLoop(critique);
      } catch (e) {
        console.error(
          `Error: An error occurred during critique loop. Retrying...`,
        );
        await this.critiqueLoop(translatedContent, retries - 1);
      }
    } else {
      console.warn(
        `Error: Retry limit exceeded in critique loop. Critique loop skipped. Please review ${this.from.code} -> ${this.to.code} critique.`,
      );
    }
  }

  async repairLoop(critique: string, retries: number = this.repairLoopRetries) {
    if (retries >= 0) {
      try {
        if (this.config.debug)
          console.log(
            `Repairing translation ${this.from.code} -> ${this.to.code} (repair loop retries left: ${retries})`,
          );
        if (this.config.debug) console.log(`Critique content: ${critique}`);
        const repairedContentJSON = await this.provider.repairTranslation(
          JSON.stringify(this.content),
          critique,
          this.from,
          this.to,
        );
        if (this.config.debug) console.log(`Repaired content: ${repairedContentJSON}`);
        const validJSON = JSON.parse(repairedContentJSON);
        this.fileSystem.save(validJSON);
      } catch (e) {
        console.error(
          `Error: An error occurred during repair loop. Retrying...`,
        );
        if (e instanceof Error) {
          console.error(
            `Error Message: ${e.message}`,
          );
        } else {
          console.error(`Error Message: Unknown error occurred.`);
        }
        if(retries == 0) {
            critique = jsonrepair(critique); // attempt rapid repair
        }
        await this.repairLoop(critique, retries - 1);
      }
    } else {
      console.warn(
        `Error: Retry limit exceeded in repair loop. Repair loop skipped.  Please review ${this.from.code} -> ${this.to.code} translation.`,
      );
    }
  }
}
