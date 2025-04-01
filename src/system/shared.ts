import path from "path";
import fs from "fs";
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
  public save(
    pathName: string,
    fileName: string,
    format: FileType = "json",
    content: string,
  ) {
    const rootPath = path.join(this.__dirname, pathName);
    if (!fs.existsSync(rootPath)) {
      fs.mkdirSync(rootPath);
    }
    const filePath = path.join(rootPath, `${fileName}.${format}`);
    const json = JSON.parse(content);
    fs.writeFileSync(filePath, JSON.stringify(json, null, 2));
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
  public saveContent(content: string, format: FileType = "json") {
    super.save("locales", `${this.language.code}`, "json", content);
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
  public saveContent(content: string, format: FileType = "json") {
    if (this.namespace) {
      super.save(
        "critiques",
        `${this.from.code}.${this.to.code}.${this.namespace}`,
        format,
        content,
      );
    } else {
      super.save(
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

    if (fs.existsSync(this.cacheFilePath)) {
      const cacheRaw = fs.readFileSync(this.cacheFilePath, "utf-8");
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

    fs.writeFileSync(this.cacheFilePath, JSON.stringify(this.cache, null, 2));
    if (clearCacheKey) {
      this.autoCacheKey = CacheManager.DEFAULT_CACHE_KEY;
    }
  }

  public clear(): void {
    this.cache = {};
    fs.writeFileSync(this.cacheFilePath, JSON.stringify(this.cache, null, 2));
  }
}
