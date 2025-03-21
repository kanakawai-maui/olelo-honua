import * as path from "path";
import * as fs from "fs";
import {
  BulkLanguageProvider,
  CachableProvider,
  CritiqueProvider,
  FileFormat,
  Language,
  LanguageProvider,
  RepairProvider,
} from "../interfaces/language";

export abstract class BaseProvider
  implements
    LanguageProvider,
    BulkLanguageProvider,
    CachableProvider,
    CritiqueProvider,
    RepairProvider
{
  public preferBulkTranslate: boolean = true;

  getCacheCode(): string {
    return new Date().getTime().toString(); // generic datetime-based caching
  }

  /**
   * Generates a cache key based on the original text, critique, and language pair.
   *
   * @param original The original text.
   * @param critique The critique text.
   * @param from The source language.
   * @param to The target language.
   * @returns A unique cache key string.
   */
  generateCacheKey(
    original: string,
    critique: string,
    from: Language,
    to: Language,
  ): string {
    const hash = `${original}-${critique}-${from}-${to}`;
    return Buffer.from(hash).toString("base64"); // Simple base64 encoding for uniqueness
  }

  /**
   * Repairs a translation based on the provided critique and original text.
   *
   * @param original - The original text that was translated.
   * @param critique - Feedback or critique on the translation that needs to be addressed.
   * @param from - The source language of the original text.
   * @param to - The target language for the translation.
   * @returns A promise that resolves to the repaired translation as a string.
   */
  async repairTranslation(
    original: string,
    critique: string,
    from: Language,
    to: Language,
  ): Promise<string> {
    return new Promise(
      () => "Repair:  No action taken, not implemented. Skipping...",
    );
  }

  /**
   * Provides a critique for a translated text by comparing the original text with the new text.
   *
   * @param originalText - The original text before translation.
   * @param newText - The translated text to be critiqued.
   * @param format - The file format of the text (e.g., JSON, XML, etc.).
   * @param save - A boolean indicating whether to save the critique result.
   * @param from - The source language of the original text.
   * @param to - The target language of the translated text.
   * @returns A promise that resolves to a string containing the critique or a message indicating no action was taken.
   */
  async critiqueTranslation(
    originalText: string,
    newText: string,
    format: FileFormat,
    save: boolean,
    from: Language,
    to: Language,
  ): Promise<string> {
    return new Promise(
      () => "Critique: No action taken, not implemented. Skipping...",
    );
  }

  /**
   * Translates a given text from one language to another.
   * This is a placeholder implementation and should be overridden by subclasses.
   *
   * @param text The text to be translated.
   * @param from The source language.
   * @param to The target language.
   * @returns A promise that resolves to the translated text.
   */
  async translateTextBulk(
    text: string[],
    from: Language,
    to: Language,
  ): Promise<string[]> {
    // Using Promise.all for concurrent execution
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all
    const results = await Promise.all(
      text.map(async (t) => this.translateText(t, from, to)),
    );
    return results;
  }

  /**
   * Translates a given text from one language to another.
   * This is a placeholder implementation and should be overridden by subclasses.
   *
   * @param text The text to be translated.
   * @param from The source language.
   * @param to The target language.
   * @returns A promise that resolves to the translated text.
   */
  async translateText(
    text: string,
    from: Language,
    to: Language,
  ): Promise<string> {
    throw new Error("Method not implemented.");
  }

  saveToFile(content: string, filePath: string): void {
    if (!fs.existsSync(path.dirname(filePath))) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
    }
    fs.writeFileSync(filePath, content);
  }
}
