import { Language, FileFormat } from "../types/shared";

export interface Translator {
  translate(original: string, from: Language, to: Language): Promise<string>;
}

export interface Cachable {
  getCacheCode(): string;
}

export interface Critiquer {
  critique(
    original: string,
    translated: string,
    from: Language,
    to: Language,
  ): Promise<string>;
}

export interface Repairer {
  repair(
    original: string,
    translated: string,
    critique: string,
    from: Language,
    to: Language,
  ): Promise<string>;
}

export interface FullProvider extends Translator, Cachable, Critiquer, Repairer {}
export interface PartialProvider extends Translator, Cachable {}