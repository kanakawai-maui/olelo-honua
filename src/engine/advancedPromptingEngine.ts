import { Language } from "../types/shared";
import { Config } from "../interfaces/config";
import {
  LocaleFileManager,
  CacheManager,
  CritiqueFileManager,
} from "../system/shared";
import { FullProvider } from "../interfaces/provider";
import { FullEngine } from "../interfaces/engine";
import { anyToStr } from "../utils/shared";

export class AdvancedPromptingEngine implements FullEngine {
  private from: Language;
  private to: Language;

  private provider: FullProvider;
  private config: Config;

  private cacheManager: CacheManager;
  private localeFileManager: LocaleFileManager;
  private critiqueFileManager: CritiqueFileManager;

  private mainLoopRetries: number;
  private critiqueLoopRetries: number;
  private repairLoopRetries: number;

  constructor(
    from: Language,
    to: Language,
    provider: FullProvider,
    config: Config,
  ) {
    this.from = from;
    this.to = to;
    this.provider = provider;
    this.config = config;
    this.cacheManager = new CacheManager();
    this.localeFileManager = new LocaleFileManager(this.to);
    this.critiqueFileManager = new CritiqueFileManager(this.from, this.to);
    this.mainLoopRetries = this.config.retries?.mainLoop || 1;
    this.critiqueLoopRetries = this.config.retries?.critiqueLoop || 3;
    this.repairLoopRetries = this.config.retries?.repairLoop || 3;
  }

  async mainLoop(
    root: string | object,
    retries: number = this.mainLoopRetries,
  ) {
    if (retries >= 0) {
      const content = anyToStr(root);
      try {
        if (this.config.debug) {
          console.log(
            `Translating ${this.from.code} -> ${this.to.code}  (main loop retries left: ${retries})`,
          );
        }
        this.cacheManager.setCacheKey(
          `${this.from.code}-${this.to.code}-${this.provider.constructor.name}`,
        );
        let translated;

        if (this.cacheManager.peek()) {
          if (this.config.debug) {
            console.log(
              `Using cached bulk translation for ${this.from.code} -> ${this.to.code}`,
            );
          }
          translated = this.cacheManager.get();
        } else {
          if (this.config.debug) {
            console.log(
              `Performing bulk translation for ${this.from.code} -> ${this.to.code}`,
            );
          }
          translated = await this.provider.translate(
            content,
            this.from,
            this.to,
          );
          this.cacheManager.set(translated);
        }
        this.cacheManager.save();
        this.localeFileManager.saveContent(translated);
        const critique = await this.critiqueLoop(content, translated);
        this.critiqueFileManager.saveContent(critique);
        const repaired = await this.repairLoop(content, translated, critique);
        this.cacheManager.save();
        this.localeFileManager.saveContent(repaired);
      } catch (e) {
        console.error(`Error: An error occurred during main loop. Retrying...`);
        this.mainLoop(content, retries - 1);
      }
    } else {
      console.warn(
        `Error: Retry limit exceeded in main loop. Main loop cancelled.  Please review ${this.from.code} -> ${this.to.code} translation.`,
      );
    }
  }

  async critiqueLoop(
    original: string | object,
    translated: string | object,
    retries: number = this.critiqueLoopRetries,
  ) : Promise<string> {
    if (retries >= 0) {
      let critique = "{}";
      try {
        const contentFrom = anyToStr(original);
        const contentTo = anyToStr(translated);
        if (this.config.debug)
          console.log(
            `Critiquing translation ${this.from.code} -> ${this.to.code} (critique loop retries left: ${retries})`,
          );
        const critique = await this.provider.critique(
          contentFrom,
          contentTo,
          this.from,
          this.to,
        );
        return critique;
      } catch (e) {
        console.error(
          `Error: An error occurred during critique loop. Retrying...`,
        );
        return await this.critiqueLoop(original, translated, retries - 1);
      }
    } else {
      console.warn(
        `Error: Retry limit exceeded in critique loop. Critique loop skipped. Please review ${this.from.code} -> ${this.to.code} critique.`,
      );
      return new Promise(() => "{}");
    }
  }

  async repairLoop(
    original: string | object,
    translated: string | object,
    critique: string | object,
    retries: number = this.repairLoopRetries,
  ) : Promise<string> {
    if (retries >= 0) {
      try {
        if (this.config.debug)
          console.log(
            `Repairing translation ${this.from.code} -> ${this.to.code} (repair loop retries left: ${retries})`,
          );
        const contentFrom = anyToStr(original);
        const contentTo = anyToStr(translated);
        const contentCrit = anyToStr(critique);
        const repaired = await this.provider.repair(
          contentFrom,
          contentTo,
          contentCrit,
          this.from,
          this.to,
        );
        return repaired;
      } catch (e) {
        console.error(
          `Error: An error occurred during repair loop. Retrying...`,
        );
        if (e instanceof Error) {
          console.error(`Error Message: ${e.message}`);
        } else {
          console.error(`Error Message: Unknown error occurred.`);
        }
        if (retries == 0) {
          critique = anyToStr(critique); // attempt rapid repair
        }
        return await this.repairLoop(original, translated, critique, retries - 1);
      }
    } else {
      console.warn(
        `Error: Retry limit exceeded in repair loop. Repair loop skipped.  Please review ${this.from.code} -> ${this.to.code} translation.`,
      );
      return new Promise(() => original);
    }
  }
}
