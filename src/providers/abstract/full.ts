import { FullProvider } from "../../interfaces/provider";
import { Language } from "../../types/shared";

// This provider is fully capabable of utilizing all features of the engine.
export abstract class AbstractFullProvider implements FullProvider {
  abstract getCacheCode(): string;

  /**
   * Repairs a translation based on the provided critique and original text.
   *
   * @param original - The original text that was translated.
   * @param critique - Feedback or critique on the translation that needs to be addressed.
   * @param from - The source language of the original text.
   * @param to - The target language for the translation.
   * @returns A promise that resolves to the repaired translation as a string.
   */
  async repair(
    original: string,
    translated: string,
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
   * @param translated - The translated text to be critiqued.
   * @param from - The source language of the original text.
   * @param to - The target language of the translated text.
   * @returns A promise that resolves to a string containing the critique or a message indicating no action was taken.
   */
  async critique(
    original: string,
    translated: string,
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
  async translate(text: string, from: Language, to: Language): Promise<string> {
    throw new Error("Not implemented");
  }
}
