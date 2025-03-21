import path from "path";
import fs from "fs";
import { Language } from "../interfaces/language";

export class FileSystem {
  private lang: Language;
  private __dirname: string;

  constructor(lang: Language) {
    this.__dirname = path.resolve(process.cwd());
    this.lang = lang;
  }

  /**
   * Saves the provided content to a file named after the specified language.
   *
   * @param content - The content to be saved in the file.
   */
  public save(content: {}) {
    const filePath = path.join(
      this.__dirname,
      `locales/${this.lang.code}.json`,
    );
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
  }
}

export class Cache {
  private static readonly DEFAULT_CACHE_KEY = "auto_cache";
  private __dirname: string;
  private autoCacheKey: string = Cache.DEFAULT_CACHE_KEY;
  private cache: { [key: string]: any } = {};
  private cacheFilePath: string;

  constructor(name: string = "translation_cache", namespace: string = "") {
    this.__dirname = path.resolve(process.cwd());
    this.cacheFilePath = path.join(this.__dirname, `${namespace}.${name}.json`);

    if (fs.existsSync(this.cacheFilePath)) {
      const cacheRaw = fs.readFileSync(this.cacheFilePath, "utf-8");
      this.cache = JSON.parse(cacheRaw);
    }
  }

  public setAutoCacheKey(autoCacheKey: string): void {
    this.autoCacheKey = autoCacheKey;
  }

  public get(key: string): any {
    return this.cache[key];
  }

  public set(key: string, value: any): void {
    this.cache[key] = value;
  }

  public quickget(): any {
    if (this.autoCacheKey === Cache.DEFAULT_CACHE_KEY) {
      throw new Error("Cannot quickget with the default cache key.");
    }
    return this.get(this.autoCacheKey);
  }

  public quickset(value: any): void {
    if (this.autoCacheKey === Cache.DEFAULT_CACHE_KEY) {
      throw new Error("Cannot quickset with the default cache key.");
    }
    this.set(this.autoCacheKey, value);
  }

  public save(clearCacheKey: boolean = true): void {
    if (JSON.stringify(this.cache, null, 2) === "{}") {
      console.log(
        "An empty cache file was created, this means that the translations were not cached and something went wrong. Please check the logs for more information.",
      );
    }

    fs.writeFileSync(this.cacheFilePath, JSON.stringify(this.cache, null, 2));
    if (clearCacheKey) {
      this.autoCacheKey = Cache.DEFAULT_CACHE_KEY;
    }
  }

  public clear(): void {
    this.autoCacheKey = Cache.DEFAULT_CACHE_KEY;
    this.cache = {};
    fs.writeFileSync(this.cacheFilePath, JSON.stringify(this.cache, null, 2));
  }
}
