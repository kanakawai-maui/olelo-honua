import { jsonrepair } from "jsonrepair";
import { Language } from "../types/shared";
import { Config } from "../interfaces/config";
import {
  LocaleFileManager,
  CacheManager
} from "../system/shared";
import { PartialProvider } from "../interfaces/provider";
import { PartialEngine } from "../interfaces/engine";

export class ConventionalEngine implements PartialEngine {
  private from: Language;
  private to: Language;

  private provider: PartialProvider;
  private config: Config;

  private cacheManager: CacheManager;
  private localeFileManager: LocaleFileManager;

  private mainLoopRetries: number;

  constructor(
    from: Language,
    to: Language,
    provider: PartialProvider,
    config: Config,
  ) {
    this.from = from;
    this.to = to;
    this.provider = provider;
    this.config = config;
    this.cacheManager = new CacheManager();
    this.localeFileManager = new LocaleFileManager(this.to);
    this.mainLoopRetries = this.config.retries?.mainLoop || 3;
  }

  async mainLoop(
    root: string | object,
    retries: number = this.mainLoopRetries,
  ) {
    if (retries >= 0) {
      const content = this.anyToStr(root);
      try {
        if (this.config.debug) {
          console.log(
            `Translating ${this.from.code} -> ${this.to.code}  (main loop retries left: ${retries})`,
          );
        }
        await this.cacheManager.setCacheKey(
          `${this.from.code}-${this.to.code}-${this.provider.constructor.name}`,
        );
        let translated;

        if (await this.cacheManager.peek()) {
          if (this.config.debug) {
            console.log(
              `Using cached bulk translation for ${this.from.code} -> ${this.to.code}`,
            );
          }
          translated = await this.cacheManager.get();
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
          await this.cacheManager.set(translated);
        }
        await this.cacheManager.save();
        this.localeFileManager.saveContent(translated);
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

  anyToStr(input: string | object): string {
    try {
      let strJson = "";
      if (typeof input === "object") {
        strJson = JSON.stringify(input);
      } else if (typeof input === "string") {
        strJson = input;
      }
      const parsed = JSON.parse(strJson);
      if (parsed && typeof parsed === "object") {
        return JSON.stringify(parsed);
      }
    } catch {
      try {
        let strJson = "";
        if (typeof input === "object") {
          strJson = JSON.stringify(input);
        }
        return jsonrepair(strJson);
      } catch {
        return "{}";
      }
    }
    return "{}";
  }
}
