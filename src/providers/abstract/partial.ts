import { PartialProvider } from "../../interfaces/provider";
import { Language } from "../../types/shared";

// This provider is partially capabable of utilizing some features of the engine.
// It can translate text but cannot critique or repair translations.
export abstract class AbstractPartialProvider implements PartialProvider {
  abstract getCacheCode(): string;

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
