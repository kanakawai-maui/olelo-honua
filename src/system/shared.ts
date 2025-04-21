import path from "path";
import {promises as fs} from "fs";
import { Language } from "../types/shared";

export type FileType = "json" | "yaml" | "md" | "txt";

export class FileManager {
  private __dirname: string;

  constructor() {
    this.__dirname = path.resolve(process.cwd());
  }

  /**
   * Saves the provided content to a file named after the specified language.
   *
   * @param content - The content to be saved in the file.
   */
  public async save(
    pathName: string,
    fileName: string,
    format: FileType = "json",
    content: string,
  ): Promise<void> {
    const rootPath = path.join(this.__dirname, pathName);
    try {
      await fs.access(rootPath);
    } catch {
      await fs.mkdir(rootPath, { recursive: true });
    }
    const filePath = path.join(rootPath, `${fileName}.${format}`);
    const json = JSON.parse(content);
    await fs.writeFile(filePath, JSON.stringify(json, null, 2));
  }
}

export class LocaleFileManager extends FileManager {
  private language: Language;

  constructor(language: Language) {
    super();
    this.language = language;
  }

  /**
   * Saves the provided content to a file named after the specified language.
   *
   * @param content - The content to be saved in the file.
   */
  public async saveContent(content: string, format: FileType = "json") {
    await super.save("locales", `${this.language.code}`, "json", content);
  }
}

export class CritiqueFileManager extends FileManager {
  private from: Language;
  private to: Language;
  private namespace: string;
  private timestamp: string;

  constructor(from: Language, to: Language, namespace: string = "") {
    super();
    this.from = from;
    this.to = to;
    this.namespace = namespace.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
    this.timestamp = new Date().toLocaleString();
  }

  /**
   * Saves the provided content to a file named after the specified language.
   *
   * @param content - The content to be saved in the file.
   */
  public async saveContent(content: string, format: FileType = "json") {
    if (this.namespace) {
      await super.save(
        "critiques",
        `${this.from.code}.${this.to.code}.${this.namespace}`,
        format,
        content,
      );
    } else {
      await super.save(
        "critiques",
        `${this.from.code}.${this.to.code}`,
        format,
        content,
      );
    }
  }
}

export class CacheManager {
  private static readonly DEFAULT_CACHE_KEY = "auto_cache";
  private __dirname: string;
  private autoCacheKey: string = CacheManager.DEFAULT_CACHE_KEY;
  private cache: { [key: string]: any } = {};
  private cacheFilePath: string;

  constructor(name: string = "translation_cache", namespace: string = "") {
    this.__dirname = path.resolve(process.cwd());
    this.cacheFilePath = path.join(this.__dirname, `${namespace}.${name}.json`);
    // keep this synchronous for now because we need to read the cache file before any async operations
    // could get around that if startup time is a concern though
    const fsSync = require("fs");
    if (fsSync.existsSync(this.cacheFilePath)) {
      const cacheRaw = fsSync.readFileSync(this.cacheFilePath, "utf-8");
      this.cache = JSON.parse(cacheRaw);
    }
  }

  public setCacheKey(autoCacheKey: string): void {
    this.autoCacheKey = autoCacheKey;
  }

  public peek(): boolean {
    return this.cache[this.autoCacheKey] !== undefined;
  }

  public get(): any {
    if (this.autoCacheKey === CacheManager.DEFAULT_CACHE_KEY) {
      throw new Error("Cannot quickget with the default cache key.");
    }
    return this.cache[this.autoCacheKey];
  }

  public set(value: any): void {
    if (this.autoCacheKey === CacheManager.DEFAULT_CACHE_KEY) {
      throw new Error("Cannot quickset with the default cache key.");
    }
    this.cache[this.autoCacheKey] = value;
  }

  public save(clearCacheKey: boolean = true): void {
    if (JSON.stringify(this.cache, null, 2) === "{}") {
      console.log(
        "An empty cache file was created, this means that the translations were not cached and something went wrong. Please check the logs for more information.",
      );
    }

    fs.writeFile(this.cacheFilePath, JSON.stringify(this.cache, null, 2));
    if (clearCacheKey) {
      this.autoCacheKey = CacheManager.DEFAULT_CACHE_KEY;
    }
  }

  public async clear(): Promise<void> {
    this.cache = {};
    fs.writeFile(this.cacheFilePath, JSON.stringify(this.cache, null, 2));
    this.autoCacheKey = CacheManager.DEFAULT_CACHE_KEY;
  }
}
